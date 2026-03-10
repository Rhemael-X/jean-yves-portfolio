import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { getCertifications } from "@/lib/groqQueries";
import { formatDateShort } from "@/lib/utils";

export const revalidate = 60;

interface CertificationsPageProps {
    params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: CertificationsPageProps): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "seo" });
    return { title: t("certifications_title") };
}

export default async function CertificationsPage({ params }: CertificationsPageProps) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: "certifications" });

    const certifications = await getCertifications().catch(() => []);

    return (
        <div className="pt-24 pb-20">
            <div className="container-main">
                <div className="mb-12">
                    <h1 className="section-title">{t("title")}</h1>
                    <p className="section-subtitle">{t("subtitle")}</p>
                </div>

                {certifications?.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {certifications.map((cert: any) => (
                            <div key={cert._id} className="card p-5 flex flex-col">
                                {/* Badge image */}
                                {cert.badgeImage?.imageUrl ? (
                                    <div className="flex justify-center mb-4">
                                        <div className="relative w-24 h-24">
                                            <Image
                                                src={cert.badgeImage.imageUrl}
                                                alt={cert.badgeImage.alt ?? cert.title}
                                                fill
                                                className="object-contain"
                                                sizes="96px"
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="flex justify-center mb-4 w-24 h-24 mx-auto rounded-full items-center"
                                        style={{ background: "var(--bg-secondary)", border: "1px solid var(--border)" }}
                                    >
                                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="1.5">
                                            <circle cx="12" cy="8" r="6" />
                                            <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                                        </svg>
                                    </div>
                                )}

                                {/* Info */}
                                <div className="flex-1">
                                    <h2 className="font-semibold text-base leading-snug mb-1" style={{ color: "var(--text-primary)" }}>
                                        {cert.title}
                                    </h2>
                                    <p className="text-sm mb-1" style={{ color: "var(--accent-cyan)" }}>
                                        {cert.issuer}
                                    </p>
                                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                                        {formatDateShort(cert.date, locale)}
                                    </p>
                                </div>

                                {/* Verify link */}
                                {cert.credentialUrl && (
                                    <a
                                        href={cert.credentialUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-4 btn-outline text-xs justify-center"
                                        style={{ padding: "0.5rem 1rem" }}
                                    >
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                                            <polyline points="15 3 21 3 21 9" />
                                            <line x1="10" y1="14" x2="21" y2="3" />
                                        </svg>
                                        {t("verify")}
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div
                        className="rounded-xl p-16 text-center"
                        style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                    >
                        <p style={{ color: "var(--text-muted)" }}>
                            {locale === "fr"
                                ? "Aucune certification à afficher."
                                : "No certifications to display."}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
