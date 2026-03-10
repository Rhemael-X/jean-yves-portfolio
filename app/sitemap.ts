import { MetadataRoute } from "next";
import { getAllProjectSlugs } from "@/lib/groqQueries";

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
const locales = ["fr", "en"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const staticPages = [
        "",
        "/profile",
        "/projects",
        "/skills",
        "/experience",
        "/certifications",
        "/education",
        "/contact",
    ];

    const staticEntries = locales.flatMap((locale) =>
        staticPages.map((page) => ({
            url: `${baseUrl}/${locale}${page}`,
            lastModified: new Date(),
            changeFrequency: "weekly" as const,
            priority: page === "" ? 1.0 : 0.8,
            alternates: {
                languages: Object.fromEntries(
                    locales.map((l) => [l, `${baseUrl}/${l}${page}`])
                ),
            },
        }))
    );

    let projectEntries: MetadataRoute.Sitemap = [];
    try {
        const projects = await getAllProjectSlugs();
        projectEntries = locales.flatMap((locale) =>
            projects
                .filter((p: any) => p.slug?.[locale]?.current)
                .map((project: any) => ({
                    url: `${baseUrl}/${locale}/projects/${project.slug[locale].current}`,
                    lastModified: new Date(),
                    changeFrequency: "monthly" as const,
                    priority: 0.7,
                }))
        );
    } catch {
        // Sanity not available during build
    }

    return [...staticEntries, ...projectEntries];
}
