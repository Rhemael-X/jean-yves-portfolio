"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import type { ProfileStats } from "@/types/profile";

interface StatsSectionProps {
    stats: ProfileStats;
    locale: string;
}

export default function StatsSection({ stats, locale }: StatsSectionProps) {
    const t = useTranslations("profile");

    const items = [
        { label: t("projects_count"), value: stats.totalProjects, suffix: "+" },
        { label: t("technologies_count"), value: stats.totalTechnologies, suffix: "+" },
        { label: t("skills_count"), value: stats.totalSkills, suffix: "" },
        { label: t("years_exp"), value: stats.yearsOfExperience, suffix: locale === "fr" ? " an(s)" : " yr(s)" },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {items.map((item, idx) => (
                <motion.div
                    key={item.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="card p-5 text-center"
                >
                    <div className="text-3xl md:text-4xl font-bold gradient-text mb-1">
                        {item.value}{item.suffix}
                    </div>
                    <div className="text-xs uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                        {item.label}
                    </div>
                </motion.div>
            ))}
        </div>
    );
}
