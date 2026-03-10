import { NextResponse } from "next/server";

// We mock all external dependencies before importing the route
jest.mock("@upstash/ratelimit", () => {
    return {
        Ratelimit: jest.fn().mockImplementation(() => ({
            limit: jest.fn().mockResolvedValue({ success: true, limit: 5, remaining: 4, reset: Date.now() + 3600000 }),
        })),
    };
});

jest.mock("@upstash/redis", () => ({
    Redis: { fromEnv: jest.fn() },
}));

jest.mock("@/lib/sanityClient", () => ({
    writeClient: {
        create: jest.fn().mockResolvedValue({ _id: "test-id" }),
    },
}));

jest.mock("@/lib/email", () => ({
    sendContactEmail: jest.fn().mockResolvedValue({ id: "email-id" }),
}));

// Mock env
process.env.UPSTASH_REDIS_REST_URL = "https://mock.upstash.io";
process.env.UPSTASH_REDIS_REST_TOKEN = "mock-token";
process.env.CONTACT_RECIPIENT_EMAIL = "recipient@test.com";

// Helper to build a Request
function buildRequest(body: object): Request {
    return new Request("http://localhost:3000/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-forwarded-for": "127.0.0.1" },
        body: JSON.stringify(body),
    });
}

describe("POST /api/contact", () => {
    beforeEach(() => jest.clearAllMocks());

    it("returns 200 with valid payload", async () => {
        const { POST } = await import("@/app/api/contact/route");
        const req = buildRequest({ name: "Alice", email: "alice@example.com", message: "Hello, this is a test message." });
        const res = await POST(req);
        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json.success).toBe(true);
    });

    it("returns 422 when name is too short", async () => {
        const { POST } = await import("@/app/api/contact/route");
        const req = buildRequest({ name: "A", email: "alice@example.com", message: "Hello, this is a test message." });
        const res = await POST(req);
        expect(res.status).toBe(422);
    });

    it("returns 422 with invalid email", async () => {
        const { POST } = await import("@/app/api/contact/route");
        const req = buildRequest({ name: "Alice", email: "not-an-email", message: "Hello, this is a test message." });
        const res = await POST(req);
        expect(res.status).toBe(422);
    });

    it("returns 422 when message is too short", async () => {
        const { POST } = await import("@/app/api/contact/route");
        const req = buildRequest({ name: "Alice", email: "alice@example.com", message: "Short" });
        const res = await POST(req);
        expect(res.status).toBe(422);
    });

    it("returns 200 silently when honeypot is filled", async () => {
        const { POST } = await import("@/app/api/contact/route");
        const req = buildRequest({
            name: "Bot",
            email: "bot@spam.com",
            message: "This is a spam message that is long enough.",
            _gotcha: "I am a bot",
        });
        const res = await POST(req);
        expect(res.status).toBe(200);
        const json = await res.json();
        expect(json.success).toBe(true);

        // Ensure email was NOT sent
        const { sendContactEmail } = await import("@/lib/email");
        expect(sendContactEmail).not.toHaveBeenCalled();
    });

    it("returns 405 for GET requests", async () => {
        const { GET } = await import("@/app/api/contact/route");
        const req = new Request("http://localhost:3000/api/contact", { method: "GET" });
        const res = await GET();
        expect(res.status).toBe(405);
    });
});
