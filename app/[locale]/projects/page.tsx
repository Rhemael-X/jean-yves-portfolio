import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Suspense } from "react";
import { getProjects, countProjects, getAllTags, getAllTechnologies } from "@/lib/groqQueries";
import ProjectGrid from "@/components/ProjectGrid";
import ProjectFilters from "@/components/ProjectFilters";
import Pagination from "@/components/Pagination";
import SearchBar from "@/components/SearchBar";

export const revalidate = 60;

interface ProjectsPageProps {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{
        page?: string;
        limit?: string;
        q?: string;
        tags?: string | string[];
        technologies?: string | string[];
        difficulty?: string;
        context?: string;
    }>;
}

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "seo" });
    return { title: t("projects_title"), description: t("projects_description") };
}

export default async function ProjectsPage({ params, searchParams }: ProjectsPageProps) {
    const { locale } = await params;
    const sp = await searchParams;
    const t = await getTranslations({ locale, namespace: "projects" });

    const page = Math.max(1, parseInt(sp.page ?? "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(sp.limit ?? "12", 10)));
    const skip = (page - 1) * limit;

    const tags = sp.tags ? (Array.isArray(sp.tags) ? sp.tags : [sp.tags]) : [];
    const technologies = sp.technologies ? (Array.isArray(sp.technologies) ? sp.technologies : [sp.technologies]) : [];

    const filters = {
        search: sp.q ?? "",
        tags,
        technologies,
        difficulty: sp.difficulty ?? "",
        context: sp.context ?? "",
    };

    const [projects, totalCount, allTags, allTechnologies] = await Promise.allSettled([
        getProjects(locale, filters, skip, limit),
        countProjects(locale, filters),
        getAllTags(),
        getAllTechnologies(),
    ]).then((results) => results.map((r) => (r.status === "fulfilled" ? r.value : null)));

    const totalPages = totalCount ? Math.ceil(totalCount / limit) : 0;

    return (
        <div className="pt-24 pb-20">
            <div className="container-main">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="section-title">{t("title")}</h1>
                    <p className="section-subtitle">{t("subtitle")}</p>
                    {totalCount !== null && (
                        <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
                            {totalCount} {locale === "fr" ? "projet(s)" : "project(s)"}
                        </p>
                    )}
                </div>

                {/* Search */}
                <div className="mb-8 max-w-2xl">
                    <Suspense>
                        <SearchBar defaultValue={sp.q ?? ""} />
                    </Suspense>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Filters sidebar */}
                    <div className="lg:col-span-1">
                        <Suspense>
                            <ProjectFilters
                                tags={allTags ?? []}
                                technologies={allTechnologies ?? []}
                                selectedTags={tags}
                                selectedTechnologies={technologies}
                                selectedDifficulty={sp.difficulty ?? ""}
                                selectedContext={sp.context ?? ""}
                            />
                        </Suspense>
                    </div>

                    {/* Projects */}
                    <div className="lg:col-span-3">
                        {projects && projects.length > 0 ? (
                            <>
                                <ProjectGrid projects={projects} locale={locale} />
                                <Suspense>
                                    <Pagination currentPage={page} totalPages={totalPages} />
                                </Suspense>
                            </>
                        ) : (
                            <div
                                className="rounded-xl p-16 text-center"
                                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                            >
                                <div className="text-4xl mb-4">🔍</div>
                                <h3 className="font-semibold text-lg mb-2" style={{ color: "var(--text-primary)" }}>
                                    {t("no_results")}
                                </h3>
                                <p style={{ color: "var(--text-muted)" }}>{t("no_results_subtitle")}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
