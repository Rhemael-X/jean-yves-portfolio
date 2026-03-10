import { NextResponse } from "next/server";
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { writeClient } from "@/lib/sanityClient";
import { sendContactEmail } from "@/lib/email";

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
        // Parse body
        let body: unknown;
        try {
            body = await request.json();
        } catch {
            return NextResponse.json(
                { error: "Invalid JSON body" },
                { status: 400 }
            );
        }

        // 1. Validate
        const result = contactSchema.safeParse(body);
        if (!result.success) {
            return NextResponse.json(
                { error: "Validation failed", issues: result.error.flatten().fieldErrors },
                { status: 422 }
            );
        }

        const { name, email, message, _gotcha } = result.data;

        // 2. Honeypot — silent pass if filled
        if (_gotcha && _gotcha.length > 0) {
            return NextResponse.json({ success: true });
        }

        // 3. Rate limiting
        const rl = getRatelimit();
        if (rl) {
            const ip =
                request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
                request.headers.get("x-real-ip") ??
                "anonymous";

            const { success, limit, remaining, reset } = await rl.limit(ip);

            if (!success) {
                return NextResponse.json(
                    { error: "Too many requests. Please try again later." },
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

        // 4. Store in Sanity
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
            console.error("[contact] Sanity write error:", err);
            // Non-fatal: attempt email anyway
        }

        // 5. Send email
        const recipient =
            process.env.CONTACT_RECIPIENT_EMAIL ||
            process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
            "contact@example.com";

        await sendContactEmail({ name, email, message, to: recipient });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("[contact] Unhandled error:", err);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}

// Only allow POST
export async function GET() {
    return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
