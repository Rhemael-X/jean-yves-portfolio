import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { getProfile } from "@/lib/groqQueries";
import ContactFormWrapper from "@/components/ContactFormWrapper";


interface ContactPageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "seo" });
    return { title: t("contact_title") };
}

export default async function ContactPage({ params }: ContactPageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "contact" });

    const profile = await getProfile().catch(() => null);

    return (
        <div className="pt-24 pb-20">
            <div className="container-main">
                <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">
                    {/* Left — info */}
                    <div className="lg:col-span-2">
                        <h1 className="section-title mb-4">{t("title")}</h1>
                        <p className="text-base leading-relaxed mb-8" style={{ color: "var(--text-muted)" }}>
                            {t("subtitle")}
                        </p>

                        {/* Contact cards */}
                        <div className="space-y-4">
                            {profile?.email && (
                                <a
                                    href={`mailto:${profile.email}`}
                                    className="card p-4 flex items-center gap-4 group hover:border-[var(--accent-cyan)] transition-all"
                                >
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ background: "rgba(100,255,218,0.1)", color: "var(--accent-cyan)" }}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                            <polyline points="22,6 12,13 2,6" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: "var(--text-muted)" }}>Email</p>
                                        <p className="text-sm font-medium group-hover:text-[var(--accent-cyan)] transition-colors" style={{ color: "var(--text-primary)" }}>
                                            {profile.email}
                                        </p>
                                    </div>
                                </a>
                            )}

                            {profile?.linkedin && (
                                <a
                                    href={profile.linkedin}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="card p-4 flex items-center gap-4 group hover:border-[var(--accent-cyan)] transition-all"
                                >
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ background: "rgba(100,255,218,0.1)", color: "var(--accent-cyan)" }}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: "var(--text-muted)" }}>LinkedIn</p>
                                        <p className="text-sm font-medium group-hover:text-[var(--accent-cyan)] transition-colors" style={{ color: "var(--text-primary)" }}>
                                            {locale === "fr" ? "Voir le profil" : "View profile"}
                                        </p>
                                    </div>
                                </a>
                            )}

                            {profile?.github && (
                                <a
                                    href={profile.github}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="card p-4 flex items-center gap-4 group hover:border-[var(--accent-cyan)] transition-all"
                                >
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                                        style={{ background: "rgba(100,255,218,0.1)", color: "var(--accent-cyan)" }}
                                    >
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                                            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-xs uppercase tracking-wider mb-0.5" style={{ color: "var(--text-muted)" }}>GitHub</p>
                                        <p className="text-sm font-medium group-hover:text-[var(--accent-cyan)] transition-colors" style={{ color: "var(--text-primary)" }}>
                                            {locale === "fr" ? "Voir les projets" : "View projects"}
                                        </p>
                                    </div>
                                </a>
                            )}
                        </div>
                    </div>

                    {/* Right — form */}
                    <div className="lg:col-span-3">
                        <div className="card p-6 md:p-8">
                            <ContactFormWrapper />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
