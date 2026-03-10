"use client";

import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { buildSanityImageUrl, getAvailabilityLabel } from "@/lib/utils";
import type { Profile } from "@/types/profile";

interface HeroSectionProps {
    profile: Profile | null;
    locale: string;
}

const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
};

export default function HeroSection({ profile, locale }: HeroSectionProps) {
    const t = useTranslations("hero");
    const ts = useTranslations("sections");

    const title = profile?.title?.[locale as "fr" | "en"] ?? "Expert Cybersécurité";
    const shortBio = profile?.shortBio?.[locale as "fr" | "en"] ?? "";
    const availability = profile?.availability
        ? getAvailabilityLabel(profile.availability, locale)
        : null;
    const photoUrl = profile?.photo ? buildSanityImageUrl(profile.photo, 400, 400) : null;

    return (
        <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
            {/* Background grid */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `linear-gradient(var(--accent-cyan) 1px, transparent 1px), linear-gradient(to right, var(--accent-cyan) 1px, transparent 1px)`,
                    backgroundSize: "60px 60px",
                }}
            />
            {/* Gradient orb */}
            <div
                className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-10"
                style={{ background: "radial-gradient(circle, var(--accent-cyan), transparent)" }}
            />

            <div className="container-main relative z-10 py-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Text content */}
                    <motion.div
                        initial="hidden"
                        animate="visible"
                        transition={{ staggerChildren: 0.12 }}
                    >
                        {/* Availability badge */}
                        {availability && (
                            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="mb-6">
                                <span className={`badge text-xs ${availability.color}`}>
                                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                                    {availability.label}
                                </span>
                            </motion.div>
                        )}

                        {/* Greeting */}
                        <motion.p
                            variants={fadeUp}
                            transition={{ duration: 0.5 }}
                            className="text-sm font-mono mb-2"
                            style={{ color: "var(--accent-cyan)" }}
                        >
                            {t("greeting")}
                        </motion.p>

                        {/* Name */}
                        <motion.h1
                            variants={fadeUp}
                            transition={{ duration: 0.5 }}
                            className="text-4xl md:text-6xl font-bold tracking-tight mb-3"
                            style={{ color: "var(--text-primary)" }}
                        >
                            {profile?.name ?? "Jean-Yves"}
                        </motion.h1>

                        {/* Title */}
                        <motion.div
                            variants={fadeUp}
                            transition={{ duration: 0.5 }}
                            className="text-xl md:text-2xl font-medium mb-6"
                        >
                            <span className="gradient-text">{title}</span>
                        </motion.div>

                        {/* Bio */}
                        {shortBio && (
                            <motion.p
                                variants={fadeUp}
                                transition={{ duration: 0.5 }}
                                className="text-base leading-relaxed max-w-lg mb-8"
                                style={{ color: "var(--text-muted)" }}
                            >
                                {shortBio}
                            </motion.p>
                        )}

                        {/* CTAs */}
                        <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="flex flex-wrap gap-3">
                            <Link href={`/${locale}/projects`} className="btn-primary">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                                    <line x1="8" y1="21" x2="16" y2="21" />
                                    <line x1="12" y1="17" x2="12" y2="21" />
                                </svg>
                                {ts("all_projects")}
                            </Link>

                            {profile?.resumeUrl && (
                                <a
                                    href={profile.resumeUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-outline"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                        <polyline points="7 10 12 15 17 10" />
                                        <line x1="12" y1="15" x2="12" y2="3" />
                                    </svg>
                                    {t("cta_cv")}
                                </a>
                            )}

                            <Link href={`/${locale}/contact`} className="btn-outline">
                                {t("cta_contact")}
                            </Link>
                        </motion.div>

                        {/* Social icons */}
                        {(profile?.github || profile?.linkedin) && (
                            <motion.div variants={fadeUp} transition={{ duration: 0.5 }} className="flex gap-3 mt-8">
                                {profile.github && (
                                    <a href={profile.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" /></svg>
                                    </a>
                                )}
                                {profile.linkedin && (
                                    <a href={profile.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="w-10 h-10 rounded-lg flex items-center justify-center transition-all hover:scale-110" style={{ background: "var(--bg-card)", border: "1px solid var(--border)", color: "var(--text-muted)" }}>
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
                                    </a>
                                )}
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Photo */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="hidden lg:flex justify-center"
                    >
                        <div className="relative">
                            {/* Decorative ring */}
                            <div
                                className="absolute -inset-4 rounded-full opacity-20 animate-spin"
                                style={{
                                    background: `conic-gradient(var(--accent-cyan), transparent, var(--accent-cyan))`,
                                    animationDuration: "8s",
                                }}
                            />
                            <div className="relative w-72 h-72 rounded-full overflow-hidden" style={{ border: "3px solid var(--accent-cyan)", boxShadow: "0 0 40px var(--glow)" }}>
                                {photoUrl ? (
                                    <Image
                                        src={photoUrl}
                                        alt={profile?.name ?? "Jean-Yves"}
                                        fill
                                        className="object-cover"
                                        priority
                                        sizes="288px"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center" style={{ background: "var(--bg-card)" }}>
                                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="var(--accent-cyan)" strokeWidth="1">
                                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                            <circle cx="12" cy="7" r="4" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
