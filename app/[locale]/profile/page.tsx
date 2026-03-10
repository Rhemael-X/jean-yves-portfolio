import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import Link from "next/link";
import { getProfile, getProfileStats } from "@/lib/groqQueries";
import { buildSanityImageUrl, getAvailabilityLabel } from "@/lib/utils";
import StatsSection from "@/components/StatsSection";
import PortableTextRenderer from "@/components/PortableTextRenderer";

export const revalidate = 60;

interface ProfilePageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ProfilePageProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "seo" });
    return { title: t("profile_title") };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "profile" });

    const [profile, stats] = await Promise.allSettled([
        getProfile(),
        getProfileStats(),
    ]).then((results) => results.map((r) => (r.status === "fulfilled" ? r.value : null)));

    const fullBio = profile?.fullBio?.[locale] ?? profile?.fullBio?.fr;
    const title = profile?.title?.[locale] ?? profile?.title?.fr ?? "";
    const photoUrl = profile?.photo ? buildSanityImageUrl(profile.photo, 500, 500) : null;
    const availability = profile?.availability ? getAvailabilityLabel(profile.availability, locale) : null;

    return (
        <div className="pt-24 pb-20">
            <div className="container-main">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Sidebar */}
                    <aside className="lg:col-span-1">
                        <div className="card p-6 sticky top-24">
                            {/* Photo */}
                            <div className="flex flex-col items-center text-center mb-6">
                                <div
                                    className="relative w-36 h-36 rounded-full overflow-hidden mb-4"
                                    style={{ border: "3px solid var(--accent-cyan)", boxShadow: "0 0 24px var(--glow)" }}
                                >
                                    {photoUrl ? (
                                        <Image src={photoUrl} alt={profile?.name ?? "Profile"} fill className="object-cover" sizes="144px" priority />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center" style={{ background: "var(--bg-secondary)" }}>
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="1">
                                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                <h1 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>{profile?.name ?? "Jean-Yves"}</h1>
                                <p className="text-sm mt-1 gradient-text font-medium">{title}</p>
                                {availability && (
                                    <span className={`badge mt-3 ${availability.color}`}>
                                        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                        {availability.label}
                                    </span>
                                )}
                            </div>

                            {/* Contact info */}
                            <div className="space-y-2 text-sm" style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem" }}>
                                {profile?.location && (
                                    <div className="flex items-center gap-2" style={{ color: "var(--text-muted)" }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                                        {profile.location}
                                    </div>
                                )}
                                {profile?.email && (
                                    <a href={`mailto:${profile.email}`} className="flex items-center gap-2 hover:opacity-80 transition-opacity" style={{ color: "var(--text-muted)" }}>
                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" /></svg>
                                        {profile.email}
                                    </a>
                                )}
                            </div>

                            {/* Social links */}
                            <div className="flex justify-center gap-3 mt-4">
                                {profile?.github && (
                                    <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="w-9 h-9 rounded-lg flex items-center justify-center hover:scale-110 transition-all" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                                    </a>
                                )}
                                {profile?.linkedin && (
                                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-9 h-9 rounded-lg flex items-center justify-center hover:scale-110 transition-all" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                    </a>
                                )}
                                {profile?.twitter && (
                                    <a href={profile.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter/X" className="w-9 h-9 rounded-lg flex items-center justify-center hover:scale-110 transition-all" style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                                    </a>
                                )}
                            </div>

                            {/* CV download */}
                            {profile?.resumeUrl && (
                                <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="btn-primary w-full justify-center mt-5 text-sm">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                                    {t("download_cv")}
                                </a>
                            )}
                        </div>
                    </aside>

                    {/* Main content */}
                    <main className="lg:col-span-2 space-y-10">
                        {/* Full bio */}
                        {fullBio && fullBio.length > 0 && (
                            <div className="card p-6 md:p-8">
                                <h2 className="text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                                    {locale === "fr" ? "À propos" : "About"}
                                </h2>
                                <PortableTextRenderer value={fullBio} />
                            </div>
                        )}

                        {/* Stats */}
                        {stats && (
                            <div>
                                <h2 className="text-lg font-bold mb-4" style={{ color: "var(--text-primary)" }}>
                                    {t("stats")}
                                </h2>
                                <StatsSection stats={stats} locale={locale} />
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
