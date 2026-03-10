import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getExperiences, getEducation } from "@/lib/groqQueries";
import Timeline from "@/components/Timeline";

export const revalidate = 60;

interface ExperiencePageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ExperiencePageProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "seo" });
    return { title: t("experience_title") };
}

export default async function ExperiencePage({ params }: ExperiencePageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "experience" });

    const [experiences, education] = await Promise.allSettled([
        getExperiences(),
        getEducation(),
    ]).then((r) => r.map((res) => (res.status === "fulfilled" ? res.value : [])));

    return (
        <div className="pt-24 pb-20">
            <div className="container-main max-w-3xl">
                <div className="mb-12">
                    <h1 className="section-title">{t("title")}</h1>
                    <p className="section-subtitle">{t("subtitle")}</p>
                </div>

                {(experiences?.length > 0 || education?.length > 0) ? (
                    <Timeline experiences={experiences} education={education} locale={locale} />
                ) : (
                    <div
                        className="rounded-xl p-16 text-center"
                        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                    >
                        <p style={{ color: "var(--text-muted)" }}>
                            {locale === "fr" ? "Aucune expérience à afficher." : "No experiences to display."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
