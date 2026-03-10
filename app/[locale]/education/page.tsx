import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getEducation } from "@/lib/groqQueries";
import Timeline from "@/components/Timeline";

export const revalidate = 60;

interface EducationPageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: EducationPageProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "seo" });
    return { title: t("education_title") };
}

export default async function EducationPage({ params }: EducationPageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "education" });

    const education = await getEducation().catch(() => []);

    return (
        <div className="pt-24 pb-20">
            <div className="container-main max-w-3xl">
                <div className="mb-12">
                    <h1 className="section-title">{t("title")}</h1>
                    <p className="section-subtitle">{t("subtitle")}</p>
                </div>

                {education?.length > 0 ? (
                    <Timeline education={education} locale={locale} />
                ) : (
                    <div
                        className="rounded-xl p-16 text-center"
                        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                    >
                        <p style={{ color: "var(--text-muted)" }}>
                            {locale === "fr" ? "Aucune formation à afficher." : "No education to display."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
