import { NextResponse } from "next/server";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { writeClient } from "@/lib/sanityClient";
import { sendContactEmail } from "@/lib/email";

// Check required environment variables at startup and log clearly
function checkEnvVars() {
    const missing: string[] = [];
    const warnings: string[] = [];

    if (!process.env.RESEND_API_KEY) missing.push("RESEND_API_KEY");
    if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) missing.push("NEXT_PUBLIC_SANITY_PROJECT_ID");
    if (!process.env.SANITY_API_TOKEN) warnings.push("SANITY_API_TOKEN (messages won't be saved to Sanity)");
    if (!process.env.CONTACT_RECIPIENT_EMAIL && !process.env.NEXT_PUBLIC_CONTACT_EMAIL) {
        warnings.push("CONTACT_RECIPIENT_EMAIL (emails will be sent to contact@example.com)");
    } else {
        // Remind about Resend free plan restriction
        const recipient = process.env.CONTACT_RECIPIENT_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL;
        console.info(
            `[contact] 📧 Emails will be sent to: ${recipient}. ` +
            `⚠️  Resend free plan: recipient must be your verified Resend email. ` +
            `To send to any address, verify a domain at resend.com/domains.`
        );
    }

    if (missing.length > 0) {
        console.error("[contact] ❌ Missing required environment variables:", missing.join(", "));
        console.error("[contact] 👉 Add them in Vercel → Settings → Environment Variables, then redeploy.");
    }
    if (warnings.length > 0) {
        console.warn("[contact] ⚠️ Optional env vars not set:", warnings.join(", "));
    }

    return missing;
}

const contactSchema = z.object({
    name: z.string().min(2).max(100),
    email: z.string().email().max(254),
    message: z.string().min(10).max(2000),
    _gotcha: z.string().optional(),
});

// Rate limiter: 5 requests per hour per IP
let ratelimit: Ratelimit | null = null;

function getRatelimit() {
    if (!ratelimit && process.env.UPSTASH_REDIS_REST_URL) {
        ratelimit = new Ratelimit({
            redis: Redis.fromEnv(),
            limiter: Ratelimit.slidingWindow(5, "1 h"),
            analytics: false,
        });
    }
    return ratelimit;
}

export async function POST(request: Request) {
    try {
        // 0. Check environment variables first
        const missingVars = checkEnvVars();
        if (missingVars.length > 0) {
            return NextResponse.json(
                {
                    error: "server_misconfigured",
                    detail: `Missing environment variables: ${missingVars.join(", ")}. Add them in Vercel → Settings → Environment Variables and redeploy.`,
                },
                { status: 503 }
            );
        }

        // 1. Parse body
        let body: unknown;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { error: "invalid_json", detail: "The request body is not valid JSON." },
                { status: 400 }
            );
        }

        // 2. Validate fields
        const result = contactSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: "validation_failed", issues: result.error.flatten().fieldErrors },
                { status: 422 }
            );
        }

        const { name, email, message, _gotcha } = result.data;

        // 3. Honeypot — silent pass if filled (bot trap)
        if (_gotcha && _gotcha.length > 0) {
            return NextResponse.json({ success: true });
        }

        // 4. Rate limiting
        const rl = getRatelimit();
        if (rl) {
            const ip =
                request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
                request.headers.get("x-real-ip") ??
                "anonymous";

            const { success, limit, remaining, reset } = await rl.limit(ip);

            if (!success) {
                return NextResponse.json(
                    { error: "rate_limited", detail: "Too many requests. Please try again later." },
                    {
                        status: 429,
                        headers: {
                            "X-RateLimit-Limit": String(limit),
                            "X-RateLimit-Remaining": String(remaining),
                            "X-RateLimit-Reset": String(reset),
                            "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
                        },
                    }
                );
            }
        }

        // 5. Store in Sanity (non-fatal if token missing)
        if (process.env.SANITY_API_TOKEN) {
            try {
                await writeClient.create({
                    _type: "contactMessage",
                    name,
                    email,
                    message,
                    createdAt: new Date().toISOString(),
                    read: false,
                });
            } catch (err) {
                // Log clearly but don't block the email send
                console.error("[contact] ⚠️ Sanity write failed (message not saved, but email will still be sent):", err);
            }
        } else {
            console.warn("[contact] ⚠️ SANITY_API_TOKEN not set — message not saved to Sanity.");
        }

        // 6. Send email via Resend
        const recipient =
            process.env.CONTACT_RECIPIENT_EMAIL ||
            process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
            "contact@example.com";

        try {
            await sendContactEmail({ name, email, message, to: recipient });
        } catch (err: any) {
            // Provide a specific error message for common Resend issues
            const msg: string = err?.message ?? "";
            if (msg.includes("API key")) {
                console.error("[contact] ❌ Resend error: invalid or missing RESEND_API_KEY.");
            } else if (msg.includes("domain")) {
                console.error("[contact] ❌ Resend error: sender domain not verified. Go to resend.com → Domains.");
            } else {
                console.error("[contact] ❌ Resend error:", err);
            }
            return NextResponse.json(
                { error: "email_failed", detail: "The email could not be sent. Check RESEND_API_KEY and your Resend domain." },
                { status: 502 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[contact] ❌ Unhandled error:", err);
        return NextResponse.json(
            { error: "internal_error", detail: "An unexpected error occurred. Check server logs." },
            { status: 500 }
        );
    }
}

// Only allow POST
export async function GET() {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
