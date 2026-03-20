import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug, getAdjacentProjects, getAllProjectSlugs } from "@/lib/groqQueries";
import { buildSanityImageUrl, formatDate, getDifficultyLabel, getContextLabel } from "@/lib/utils";
import PortableTextRenderer from "@/components/PortableTextRenderer";
import RegisterAlternateLinks from "@/components/RegisterAlternateLinks";

export const revalidate = 60;

interface ProjectDetailProps {
    params: Promise<{ locale: string; slug: string }>;
}

export async function generateStaticParams() {
    try {
        const projects = await getAllProjectSlugs();
        return ["fr", "en"].flatMap((locale) =>
            projects
                .filter((p: any) => p.slug?.[locale]?.current)
                .map((p: any) => ({ locale, slug: p.slug[locale].current }))
        );
    } catch {
        return [];
    }
}

export async function generateMetadata({ params }: ProjectDetailProps): Promise<Metadata> {
    const { locale, slug } = await params;
    const project = await getProjectBySlug(locale, slug);
    if (!project) return { title: "Project not found" };

    const title = project.title?.[locale] ?? project.title?.fr;
    const excerpt = project.excerpt?.[locale] ?? project.excerpt?.fr;
    const imageUrl = project.mainImage?.imageUrl;

    return {
        title,
        description: excerpt,
        openGraph: {
            title,
            description: excerpt,
            images: imageUrl ? [{ url: imageUrl }] : [],
        },
    };
}

export default async function ProjectDetailPage({ params }: ProjectDetailProps) {
    const { locale, slug } = await params;
    const t = await getTranslations({ locale, namespace: "projects" });

    let project;
    try {
        project = await getProjectBySlug(locale, slug);
    } catch (err) {
        console.error(`[project/${slug}] ❌ Failed to fetch project from Sanity:`, err);
        console.error(`[project/${slug}] 👉 Check NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET env vars.`);
        // Show a user-friendly error instead of a raw 500
        return (
            <div className="pt-32 pb-20 text-center container-main max-w-xl">
                <p className="text-5xl mb-6">⚠️</p>
                <h1 className="text-2xl font-bold mb-3" style={{ color: "var(--text-primary)" }}>
                    {t("fetch_error_title")}
                </h1>
                <p className="mb-8" style={{ color: "var(--text-muted)" }}>
                    {t("fetch_error_msg")}
                </p>
                <Link href={`/${locale}/projects`} className="btn-outline">
                    ← {t("back_to_projects")}
                </Link>
            </div>
        );
    }

    if (!project) {
        console.warn(
            `[project/${slug}] ⚠️ No project found for slug "${slug}" (locale: ${locale}).`,
            `\n👉 Make sure the slug in Sanity is structured as { fr: { current: "..." }, en: { current: "..." } }.`
        );
        notFound();
    }

    const adjacent = await getAdjacentProjects(project.order, locale).catch(() => ({ prev: null, next: null }));

    const title = project.title?.[locale] ?? project.title?.fr;
    const description = project.description?.[locale] ?? project.description?.fr;
    const content = project.content?.[locale] ?? project.content?.fr;
    const heroImageUrl = project.mainImage?.imageUrl ? buildSanityImageUrl(project.mainImage, 1200, 630) : null;

    // Build translated URLs so the language switcher navigates to the correct slug
    const alternateLinks: Record<string, string> = {};
    for (const lang of ["fr", "en"]) {
        const localizedSlug = project.slug?.[lang]?.current;
        if (localizedSlug) {
            alternateLinks[lang] = `/${lang}/projects/${localizedSlug}`;
        }
    }

    return (
        <>
        <RegisterAlternateLinks links={alternateLinks} />
        <article className="pt-24 pb-20">
            <div className="container-main max-w-4xl">
                {/* Back link */}
                <Link
                    href={`/${locale}/projects`}
                    className="inline-flex items-center gap-2 text-sm mb-8 hover:opacity-80 transition-opacity"
                    style={{ color: "var(--text-muted)" }}
                >
                    ← {t("back_to_projects")}
                </Link>

                {/* Hero image */}
                {heroImageUrl && (
                    <div className="relative w-full rounded-xl overflow-hidden mb-8" style={{ aspectRatio: "16/9" }}>
                        <Image src={heroImageUrl} alt={project.mainImage?.alt ?? title} fill className="object-cover" priority sizes="(max-width: 1024px) 100vw, 896px" />
                    </div>
                )}

                {/* Meta badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                    <span className="badge badge-cyan">{getDifficultyLabel(project.difficulty, locale)}</span>
                    <span className="badge" style={{ background: "var(--bg-card)", color: "var(--text-muted)", borderColor: "var(--border)" }}>
                        {getContextLabel(project.context, locale)}
                    </span>
                    {project.startDate && (
                        <span className="badge" style={{ background: "var(--bg-card)", color: "var(--text-muted)", borderColor: "var(--border)" }}>
                            {formatDate(project.startDate, locale)}
                            {project.endDate ? ` — ${formatDate(project.endDate, locale)}` : ""}
                        </span>
                    )}
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                    {title}
                </h1>

                {/* Action links */}
                <div className="flex flex-wrap gap-3 mb-8">
                    {project.githubUrl && (
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                            {t("github")}
                        </a>
                    )}
                    {project.demoUrl && (
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                            {t("demo")}
                        </a>
                    )}
                    {project.documentationUrl && (
                        <a href={project.documentationUrl} target="_blank" rel="noopener noreferrer" className="btn-outline text-sm">
                            {t("documentation")}
                        </a>
                    )}
                </div>

                {/* Technologies */}
                {project.technologies && project.technologies.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
                            {t("technologies")}
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {project.technologies.map((tech: any) => (
                                <span key={tech._id} className="badge badge-cyan">{tech.name}</span>
                            ))}
                        </div>
                    </div>
                )}

                {/* Tags */}
                {project.tags && project.tags.length > 0 && (
                    <div className="mb-8">
                        <h2 className="text-sm font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
                            {t("tags")}
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {project.tags.map((tag: string) => (
                                <Link key={tag} href={`/${locale}/projects?tags=${tag}`} className="px-2 py-1 rounded text-xs font-mono transition-all hover:opacity-80" style={{ background: "var(--bg-card)", color: "var(--text-muted)", border: "1px solid var(--border)" }}>
                                    #{tag}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}

                {/* Description */}
                {description && description.length > 0 && (
                    <div className="card p-6 md:p-8 mb-8">
                        <PortableTextRenderer value={description} />
                    </div>
                )}

                {/* Full content */}
                {content && content.length > 0 && (
                    <div className="card p-6 md:p-8 mb-8">
                        <PortableTextRenderer value={content} />
                    </div>
                )}

                {/* Adjacent navigation */}
                {(adjacent.prev || adjacent.next) && (
                    <nav className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-12 pt-8" style={{ borderTop: "1px solid var(--border)" }}>
                        {adjacent.prev ? (
                            <Link
                                href={`/${locale}/projects/${adjacent.prev.slug?.[locale]?.current}`}
                                className="card p-4 flex items-center gap-3 group hover:border-[var(--accent-cyan)] transition-all"
                            >
                                <span className="text-xl">←</span>
                                <div className="min-w-0">
                                    <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{t("prev_project")}</p>
                                    <p className="text-sm font-medium truncate group-hover:text-[var(--accent-cyan)] transition-colors" style={{ color: "var(--text-primary)" }}>
                                        {adjacent.prev.title?.[locale] ?? adjacent.prev.title?.fr}
                                    </p>
                                </div>
                            </Link>
                        ) : <div />}

                        {adjacent.next && (
                            <Link
                                href={`/${locale}/projects/${adjacent.next.slug?.[locale]?.current}`}
                                className="card p-4 flex items-center justify-end gap-3 text-right group hover:border-[var(--accent-cyan)] transition-all"
                            >
                                <div className="min-w-0">
                                    <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>{t("next_project")}</p>
                                    <p className="text-sm font-medium truncate group-hover:text-[var(--accent-cyan)] transition-colors" style={{ color: "var(--text-primary)" }}>
                                        {adjacent.next.title?.[locale] ?? adjacent.next.title?.fr}
                                    </p>
                                </div>
                                <span className="text-xl">→</span>
                            </Link>
                        )}
                    </nav>
                )}
            </div>
        </article>
        </>
    );
}
