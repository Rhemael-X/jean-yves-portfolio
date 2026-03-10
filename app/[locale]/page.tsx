import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import HeroSection from "@/components/HeroSection";
import FeaturedProjects from "@/components/FeaturedProjects";
import SkillsGrid from "@/components/SkillsGrid";
import Timeline from "@/components/Timeline";
import Link from "next/link";
import { getProfile, getFeaturedProjects, getFeaturedSkills, getExperiences, getEducation } from "@/lib/groqQueries";

export const revalidate = 60;

interface HomePageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "seo" });
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

    return {
        title: t("home_title"),
        description: t("home_description"),
        alternates: {
            canonical: `${baseUrl}/${locale}`,
            languages: {
                fr: `${baseUrl}/fr`,
                en: `${baseUrl}/en`,
            },
        },
        openGraph: {
            type: "website",
            locale: locale === "fr" ? "fr_FR" : "en_US",
            url: `${baseUrl}/${locale}`,
            title: t("home_title"),
            description: t("home_description"),
        },
    };
}

export default async function HomePage({ params }: HomePageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "sections" });
    const tskills = await getTranslations({ locale, namespace: "skills" });
    const texperience = await getTranslations({ locale, namespace: "experience" });

    const [profile, featuredProjects, featuredSkills, experiences, education] =
        await Promise.allSettled([
            getProfile(),
            getFeaturedProjects(locale),
            getFeaturedSkills(),
            getExperiences(),
            getEducation(),
        ]).then((results) =>
            results.map((r) => (r.status === "fulfilled" ? r.value : null))
        );

    return (
        <>
            {/* Hero */}
            <HeroSection profile={profile} locale={locale} />

            {/* Featured Projects */}
            <FeaturedProjects projects={featuredProjects ?? []} locale={locale} />

            {/* Skills Overview */}
            {featuredSkills && featuredSkills.length > 0 && (
                <section className="section" style={{ background: "var(--bg-secondary)" }}>
                    <div className="container-main">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                            <div>
                                <h2 className="section-title">{t("skills_overview")}</h2>
                                <p className="section-subtitle">{t("skills_subtitle")}</p>
                            </div>
                            <Link href={`/${locale}/skills`} className="btn-outline text-sm whitespace-nowrap">
                                {t("all_skills")} →
                            </Link>
                        </div>
                        <SkillsGrid skills={featuredSkills} locale={locale} showAll={false} />
                    </div>
                </section>
            )}

            {/* Career Timeline */}
            {((experiences && experiences.length > 0) || (education && education.length > 0)) && (
                <section className="section">
                    <div className="container-main">
                        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
                            <div>
                                <h2 className="section-title">{t("career_timeline")}</h2>
                                <p className="section-subtitle">{t("timeline_subtitle")}</p>
                            </div>
                            <Link href={`/${locale}/experience`} className="btn-outline text-sm whitespace-nowrap">
                                {locale === "fr" ? "Voir tout" : "View all"} →
                            </Link>
                        </div>
                        <Timeline
                            experiences={experiences ?? []}
                            education={education ?? []}
                            locale={locale}
                            limit={4}
                        />
                    </div>
                </section>
            )}

            {/* Contact CTA */}
            <section className="section" style={{ background: "var(--bg-secondary)" }}>
                <div className="container-main">
                    <div
                        className="rounded-2xl p-10 md:p-16 text-center relative overflow-hidden"
                        style={{ background: "linear-gradient(135deg, rgba(100,255,218,0.05), rgba(167,139,250,0.05))", border: "1px solid var(--border)" }}
                    >
                        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: `radial-gradient(circle, var(--accent-cyan) 1px, transparent 1px)`, backgroundSize: "30px 30px" }} />
                        <div className="relative">
                            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                                {t("contact_cta")}
                            </h2>
                            <p className="text-lg mb-8" style={{ color: "var(--text-muted)" }}>
                                {t("contact_subtitle")}
                            </p>
                            <Link href={`/${locale}/contact`} className="btn-primary text-base px-8 py-4">
                                {t("contact_btn")}
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}
