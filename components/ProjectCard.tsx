"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { buildSanityImageUrl, getDifficultyLabel, getContextLabel } from "@/lib/utils";
import type { ProjectListItem } from "@/types/project";

interface ProjectCardProps {
    project: ProjectListItem;
    locale: string;
}

const difficultyColors: Record<string, string> = {
    beginner: "badge-green",
    intermediate: "badge-cyan",
    advanced: "badge-purple",
    research: "badge-orange",
};

export default function ProjectCard({ project, locale }: ProjectCardProps) {
    const t = useTranslations("projects");
    const title = project.title?.[locale as "fr" | "en"] ?? project.title?.fr;
    const excerpt = project.excerpt?.[locale as "fr" | "en"] ?? project.excerpt?.fr;
    const slug = project.slug?.[locale as "fr" | "en"]?.current;
    const imageUrl = project.mainImage?.imageUrl
        ? buildSanityImageUrl(project.mainImage, 600, 340)
        : null;

    return (
        <motion.article
            whileHover={{ y: -4, scale: 1.01 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="card flex flex-col overflow-hidden h-full"
        >
            <Link href={`/${locale}/projects/${slug}`} className="flex flex-col h-full group">
                {/* Image */}
                <div className="relative overflow-hidden" style={{ aspectRatio: "16/9", background: "var(--bg-secondary)" }}>
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={project.mainImage?.alt || title}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--border)" strokeWidth="1">
                                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                                <circle cx="8.5" cy="8.5" r="1.5" />
                                <polyline points="21 15 16 10 5 21" />
                            </svg>
                        </div>
                    )}

                    {/* Overlay badges */}
                    <div className="absolute top-3 left-3 flex gap-1.5 flex-wrap">
                        <span className={`badge ${difficultyColors[project.difficulty] ?? "badge-cyan"}`}>
                            {getDifficultyLabel(project.difficulty, locale)}
                        </span>
                    </div>

                    {project.featured && (
                        <div className="absolute top-3 right-3">
                            <span className="badge" style={{ background: "rgba(100,255,218,0.15)", color: "var(--accent-cyan)", borderColor: "rgba(100,255,218,0.4)", fontSize: "0.65rem" }}>
                                ★ Featured
                            </span>
                        </div>
                    )}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-5">
                    <h3
                        className="font-semibold text-base leading-snug mb-2 transition-colors group-hover:text-[var(--accent-cyan)] line-clamp-2"
                        style={{ color: "var(--text-primary)" }}
                    >
                        {title}
                    </h3>

                    {excerpt && (
                        <p className="text-sm leading-relaxed line-clamp-3 flex-1" style={{ color: "var(--text-muted)" }}>
                            {excerpt}
                        </p>
                    )}

                    {/* Tags */}
                    {project.tags && project.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-4">
                            {project.tags.slice(0, 4).map((tag) => (
                                <span
                                    key={tag}
                                    className="px-2 py-0.5 rounded text-xs font-mono"
                                    style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
                                >
                                    #{tag}
                                </span>
                            ))}
                            {project.tags.length > 4 && (
                                <span className="px-2 py-0.5 rounded text-xs" style={{ color: "var(--text-muted)" }}>
                                    +{project.tags.length - 4}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Context */}
                    <div className="mt-4 pt-4 flex items-center justify-between" style={{ borderTop: "1px solid var(--border)" }}>
                        <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                            {getContextLabel(project.context, locale)}
                        </span>
                        <span
                            className="text-xs font-medium flex items-center gap-1 transition-all group-hover:gap-2"
                            style={{ color: "var(--accent-cyan)" }}
                        >
                            {locale === "fr" ? "Voir" : "View"} →
                        </span>
                    </div>
                </div>
            </Link>
        </motion.article>
    );
}
