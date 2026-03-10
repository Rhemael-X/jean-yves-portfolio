"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useCallback } from "react";

interface ProjectFiltersProps {
    tags: string[];
    technologies: Array<{ _id: string; name: string; slug: { current: string } }>;
    selectedTags: string[];
    selectedTechnologies: string[];
    selectedDifficulty: string;
    selectedContext: string;
}

export default function ProjectFilters({
    tags,
    technologies,
    selectedTags,
    selectedTechnologies,
    selectedDifficulty,
    selectedContext,
}: ProjectFiltersProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const t = useTranslations("projects");

    const updateParams = useCallback(
        (updates: Record<string, string | string[] | null>) => {
            const params = new URLSearchParams(searchParams.toString());
            params.delete("page"); // Reset to page 1 on filter change
            for (const [key, value] of Object.entries(updates)) {
                params.delete(key);
                if (value !== null) {
                    if (Array.isArray(value)) {
                        value.forEach((v) => params.append(key, v));
                    } else if (value) {
                        params.set(key, value);
                    }
                }
            }
            router.push(`${pathname}?${params.toString()}`);
        },
        [router, pathname, searchParams]
    );

    const toggleTag = (tag: string) => {
        const next = selectedTags.includes(tag)
            ? selectedTags.filter((t) => t !== tag)
            : [...selectedTags, tag];
        updateParams({ tags: next.length ? next : null });
    };

    const toggleTechnology = (slug: string) => {
        const next = selectedTechnologies.includes(slug)
            ? selectedTechnologies.filter((t) => t !== slug)
            : [...selectedTechnologies, slug];
        updateParams({ technologies: next.length ? next : null });
    };

    const clearAll = () => {
        const params = new URLSearchParams(searchParams.toString());
        ["tags", "technologies", "difficulty", "context", "q", "page"].forEach((k) => params.delete(k));
        router.push(`${pathname}?${params.toString()}`);
    };

    const hasFilters =
        selectedTags.length > 0 ||
        selectedTechnologies.length > 0 ||
        selectedDifficulty ||
        selectedContext;

    const difficulties = ["beginner", "intermediate", "advanced", "research"];
    const contexts = ["formation", "université", "personnel"];

    return (
        <aside className="space-y-6">
            {/* Clear all */}
            {hasFilters && (
                <button
                    onClick={clearAll}
                    className="w-full py-2 px-3 rounded-lg text-sm font-medium transition-all hover:opacity-80"
                    style={{ background: "rgba(248,113,113,0.1)", color: "#f87171", border: "1px solid rgba(248,113,113,0.3)" }}
                >
                    ✕ {t("filter_clear")}
                </button>
            )}

            {/* Difficulty */}
            <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
                    {t("filter_difficulty")}
                </h3>
                <div className="space-y-1.5">
                    {difficulties.map((d) => (
                        <button
                            key={d}
                            onClick={() => updateParams({ difficulty: selectedDifficulty === d ? null : d })}
                            className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all"
                            style={{
                                background: selectedDifficulty === d ? "color-mix(in srgb, var(--accent-cyan) 15%, transparent)" : "var(--bg-card)",
                                color: selectedDifficulty === d ? "var(--accent-cyan)" : "var(--text-secondary)",
                                border: `1px solid ${selectedDifficulty === d ? "color-mix(in srgb, var(--accent-cyan) 40%, transparent)" : "var(--border)"}`,
                            }}
                        >
                            {t(`difficulty_${d}` as any)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Context */}
            <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
                    {t("filter_context")}
                </h3>
                <div className="space-y-1.5">
                    {contexts.map((c) => (
                        <button
                            key={c}
                            onClick={() => updateParams({ context: selectedContext === c ? null : c })}
                            className="w-full text-left px-3 py-2 rounded-lg text-sm transition-all"
                            style={{
                                background: selectedContext === c ? "color-mix(in srgb, var(--accent-cyan) 15%, transparent)" : "var(--bg-card)",
                                color: selectedContext === c ? "var(--accent-cyan)" : "var(--text-secondary)",
                                border: `1px solid ${selectedContext === c ? "color-mix(in srgb, var(--accent-cyan) 40%, transparent)" : "var(--border)"}`,
                            }}
                        >
                            {c.charAt(0).toUpperCase() + c.slice(1)}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tags */}
            {tags.length > 0 && (
                <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
                        {t("filter_tags")}
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                        {tags.slice(0, 30).map((tag) => (
                            <button
                                key={tag}
                                onClick={() => toggleTag(tag)}
                                className="px-2 py-1 rounded text-xs font-mono transition-all"
                                style={{
                                    background: selectedTags.includes(tag) ? "color-mix(in srgb, var(--accent-cyan) 15%, transparent)" : "var(--bg-card)",
                                    color: selectedTags.includes(tag) ? "var(--accent-cyan)" : "var(--text-muted)",
                                    border: `1px solid ${selectedTags.includes(tag) ? "color-mix(in srgb, var(--accent-cyan) 40%, transparent)" : "var(--border)"}`,
                                }}
                            >
                                #{tag}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Technologies */}
            {technologies.length > 0 && (
                <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: "var(--text-muted)" }}>
                        {t("filter_technology")}
                    </h3>
                    <div className="space-y-1">
                        {technologies.slice(0, 20).map((tech) => (
                            <button
                                key={tech._id}
                                onClick={() => toggleTechnology(tech.slug.current)}
                                className="w-full text-left px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-all"
                                style={{
                                    background: selectedTechnologies.includes(tech.slug.current) ? "color-mix(in srgb, var(--accent-cyan) 10%, transparent)" : "transparent",
                                    color: selectedTechnologies.includes(tech.slug.current) ? "var(--accent-cyan)" : "var(--text-secondary)",
                                }}
                            >
                                <span
                                    className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                                    style={{ background: selectedTechnologies.includes(tech.slug.current) ? "var(--accent-cyan)" : "var(--border)" }}
                                />
                                {tech.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </aside>
    );
}
