import createMiddleware from "next-intl/middleware";

export default createMiddleware({
    locales: ["fr", "en"],
    defaultLocale: "fr",
    localePrefix: "always",
});

export const config = {
    matcher: [
        // Match all pathnames except for
        // - /studio (Sanity Studio)
        // - /api (API routes)
        // - /_next (Next.js internals)
        // - /_vercel (Vercel internals)
        // - /static (inside /public)
        // - all files with extensions (e.g. favicon.ico)
        "/((?!studio|api|_next|_vercel|.*\\..*).*)",
    ],
};
