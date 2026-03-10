"use client";

import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import type { Skill } from "@/types/skill";

interface SkillsGridProps {
    skills: Skill[];
    locale: string;
    showAll?: boolean;
}

const levelLabels = ["level_1", "level_2", "level_3", "level_4", "level_5"];

function groupByCategory(skills: Skill[]): Record<string, Skill[]> {
    return skills.reduce<Record<string, Skill[]>>((acc, skill) => {
        const cat = skill.category || "Other";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(skill);
        return acc;
    }, {});
}

export default function SkillsGrid({ skills, locale, showAll = false }: SkillsGridProps) {
    const t = useTranslations("skills");

    if (!skills || skills.length === 0) return null;

    const displaySkills = showAll ? skills : skills.filter((s) => s.highlight);
    const grouped = groupByCategory(displaySkills);

    return (
        <div className="space-y-10">
            {Object.entries(grouped).map(([category, catSkills], catIdx) => (
                <div key={category}>
                    <h3
                        className="text-xs font-semibold uppercase tracking-widest mb-4 flex items-center gap-2"
                        style={{ color: "var(--accent-cyan)" }}
                    >
                        <span
                            className="w-6 h-px"
                            style={{ background: "var(--accent-cyan)" }}
                        />
                        {category}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {catSkills.map((skill, idx) => (
                            <motion.div
                                key={skill._id}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: idx * 0.05 + catIdx * 0.1 }}
                                className="card p-4"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div>
                                        <h4 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                                            {skill.name}
                                        </h4>
                                        {skill.yearsOfExperience && (
                                            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                                                {skill.yearsOfExperience} {locale === "fr" ? "an(s)" : "yr(s)"}
                                            </p>
                                        )}
                                    </div>
                                    <span className="text-xs font-mono" style={{ color: "var(--accent-cyan)" }}>
                                        {t(levelLabels[skill.level - 1] as any)}
                                    </span>
                                </div>

                                {/* Level bar */}
                                <div className="skill-bar-track">
                                    <motion.div
                                        className="skill-bar-fill"
                                        initial={{ width: 0 }}
                                        whileInView={{ width: `${(skill.level / 5) * 100}%` }}
                                        viewport={{ once: true }}
                                        transition={{ duration: 0.8, delay: idx * 0.05 + catIdx * 0.1 }}
                                    />
                                </div>

                                {/* Dots indicator */}
                                <div className="flex gap-1 mt-2" aria-label={`Niveau ${skill.level} sur 5`}>
                                    {[1, 2, 3, 4, 5].map((dot) => (
                                        <span
                                            key={dot}
                                            className="w-1.5 h-1.5 rounded-full"
                                            style={{
                                                background: dot <= skill.level ? "var(--accent-cyan)" : "var(--border)",
                                            }}
                                        />
                                    ))}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
