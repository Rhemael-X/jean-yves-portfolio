import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getSkills } from "@/lib/groqQueries";
import SkillsGrid from "@/components/SkillsGrid";

export const revalidate = 60;

interface SkillsPageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: SkillsPageProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "seo" });
    return { title: t("skills_title") };
}

export default async function SkillsPage({ params }: SkillsPageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "skills" });

    const skills = await getSkills().catch(() => []);

    return (
        <div className="pt-24 pb-20">
            <div className="container-main">
                <div className="mb-12">
                    <h1 className="section-title">{t("title")}</h1>
                    <p className="section-subtitle">{t("subtitle")}</p>
                    {skills.length > 0 && (
                        <p className="mt-2 text-sm" style={{ color: "var(--text-muted)" }}>
                            {skills.length} {locale === "fr" ? "compétence(s)" : "skill(s)"}
                        </p>
                    )}
                </div>

                {skills.length > 0 ? (
                    <SkillsGrid skills={skills} locale={locale} showAll />
                ) : (
                    <div
                        className="rounded-xl p-16 text-center"
                        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                    >
                        <p style={{ color: "var(--text-muted)" }}>
                            {locale === "fr" ? "Aucune compétence à afficher." : "No skills to display."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
