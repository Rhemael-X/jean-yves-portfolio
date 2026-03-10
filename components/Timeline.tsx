"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { formatDate } from "@/lib/utils";
import type { Experience } from "@/types/experience";
import type { Education } from "@/types/education";
import PortableTextRenderer from "./PortableTextRenderer";

interface TimelineItem {
    _id: string;
    type: "experience" | "education";
    title: string;
    subtitle: string;
    startDate: string;
    endDate?: string;
    description?: any[];
    technologies?: Array<{ _id: string; name: string }>;
}

interface TimelineProps {
    experiences?: Experience[];
    education?: Education[];
    locale: string;
    limit?: number;
}

function toTimelineItems(
    experiences: Experience[],
    education: Education[],
    locale: string
): TimelineItem[] {
    const expItems: TimelineItem[] = (experiences ?? []).map((e) => ({
        _id: e._id,
        type: "experience",
        title: e.position?.[locale as "fr" | "en"] ?? e.position?.fr ?? "",
        subtitle: e.company,
        startDate: e.startDate,
        endDate: e.endDate,
        description: e.description?.[locale as "fr" | "en"],
        technologies: e.technologies,
    }));

    const eduItems: TimelineItem[] = (education ?? []).map((ed) => ({
        _id: ed._id,
        type: "education",
        title: ed.degree?.[locale as "fr" | "en"] ?? ed.degree?.fr ?? "",
        subtitle: `${ed.institution}${ed.field?.[locale as "fr" | "en"] ? ` — ${ed.field[locale as "fr" | "en"]}` : ""}`,
        startDate: ed.startDate,
        endDate: ed.endDate,
        description: ed.description?.[locale as "fr" | "en"],
    }));

    return [...expItems, ...eduItems].sort(
        (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
    );
}

export default function Timeline({ experiences = [], education = [], locale, limit }: TimelineProps) {
    const t = useTranslations("experience");
    let items = toTimelineItems(experiences, education, locale);
    if (limit) items = items.slice(0, limit);

    if (items.length === 0) return null;

    return (
        <div className="relative">
            <div className="space-y-0">
                {items.map((item, idx) => (
                    <motion.div
                        key={item._id}
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: idx * 0.08 }}
                        className="relative flex gap-6 pb-10"
                    >
                        {/* Timeline line & dot */}
                        <div className="flex flex-col items-center flex-shrink-0 w-7">
                            <div className="timeline-dot mt-1">
                                {item.type === "experience" ? (
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2.5">
                                        <rect x="2" y="7" width="20" height="14" rx="2" />
                                        <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
                                    </svg>
                                ) : (
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="2.5">
                                        <path d="M22 10v6M2 10l10-7 10 7M6 12v8h4v-4h4v4h4v-8" />
                                    </svg>
                                )}
                            </div>
                            {idx < items.length - 1 && (
                                <div className="flex-1 w-0.5 mt-2" style={{ background: "linear-gradient(to bottom, var(--accent-cyan), var(--border))", opacity: 0.4 }} />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 pb-2">
                            {/* Date */}
                            <p className="text-xs font-mono mb-2" style={{ color: "var(--accent-cyan)" }}>
                                {formatDate(item.startDate, locale)} — {item.endDate ? formatDate(item.endDate, locale) : t("present")}
                            </p>

                            <div className="card p-4">
                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                                    <div>
                                        <h3 className="font-semibold text-base" style={{ color: "var(--text-primary)" }}>
                                            {item.title}
                                        </h3>
                                        <p className="text-sm mt-0.5" style={{ color: "var(--text-muted)" }}>
                                            {item.subtitle}
                                        </p>
                                    </div>
                                    <span
                                        className="badge self-start"
                                        style={{
                                            background: item.type === "experience" ? "rgba(100,255,218,0.1)" : "rgba(167,139,250,0.1)",
                                            color: item.type === "experience" ? "var(--accent-cyan)" : "#a78bfa",
                                            borderColor: item.type === "experience" ? "rgba(100,255,218,0.3)" : "rgba(167,139,250,0.3)",
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        {item.type === "experience" ? (locale === "fr" ? "Expérience" : "Experience") : (locale === "fr" ? "Formation" : "Education")}
                                    </span>
                                </div>

                                {item.description && item.description.length > 0 && (
                                    <div className="mt-3 text-sm">
                                        <PortableTextRenderer value={item.description} />
                                    </div>
                                )}

                                {item.technologies && item.technologies.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                        {item.technologies.map((tech) => (
                                            <span
                                                key={tech._id}
                                                className="px-2 py-0.5 rounded text-xs font-mono"
                                                style={{ background: "var(--bg-secondary)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
                                            >
                                                {tech.name}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}
