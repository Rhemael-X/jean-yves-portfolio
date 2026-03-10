"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import ProjectGrid from "./ProjectGrid";
import type { ProjectListItem } from "@/types/project";

interface FeaturedProjectsProps {
    projects: ProjectListItem[];
    locale: string;
}

export default function FeaturedProjects({ projects, locale }: FeaturedProjectsProps) {
    const t = useTranslations("sections");

    return (
        <section className="section">
            <div className="container-main">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
                >
                    <div>
                        <h2 className="section-title">{t("featured_projects")}</h2>
                        <p className="section-subtitle">{t("featured_projects_subtitle")}</p>
                    </div>
                    <Link
                        href={`/${locale}/projects`}
                        className="btn-outline text-sm whitespace-nowrap"
                    >
                        {t("all_projects")} →
                    </Link>
                </motion.div>

                {projects && projects.length > 0 ? (
                    <ProjectGrid projects={projects} locale={locale} />
                ) : (
                    <div
                        className="rounded-xl p-12 text-center"
                        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                    >
                        <p style={{ color: "var(--text-muted)" }}>
                            {locale === "fr" ? "Aucun projet à afficher pour l'instant." : "No projects to display yet."}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
