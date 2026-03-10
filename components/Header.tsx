"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import ThemeToggle from "./ThemeToggle";
import LanguageSwitcher from "./LanguageSwitcher";

interface HeaderProps {
    locale: string;
}

const navLinks = [
    { key: "projects", href: "/projects" },
    { key: "skills", href: "/skills" },
    { key: "experience", href: "/experience" },
    { key: "certifications", href: "/certifications" },
    { key: "contact", href: "/contact" },
];

export default function Header({ locale }: HeaderProps) {
    const t = useTranslations("nav");
    const tc = useTranslations("common");
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
            style={{
                background: isScrolled
                    ? "color-mix(in srgb, var(--bg-primary) 90%, transparent)"
                    : "transparent",
                backdropFilter: isScrolled ? "blur(12px)" : "none",
                borderBottom: isScrolled ? "1px solid var(--border)" : "1px solid transparent",
            }}
        >
            <div className="container-main">
                <nav className="flex h-16 items-center justify-between">
                    {/* Logo */}
                    <Link
                        href={`/${locale}`}
                        className="text-lg font-bold tracking-tight transition-opacity hover:opacity-80"
                        style={{ color: "var(--accent-cyan)" }}
                    >
                        Jean<span style={{ color: "var(--text-primary)" }}>-Yves</span>
                        <span
                            className="ml-1 text-xs font-mono px-1.5 py-0.5 rounded"
                            style={{ background: "var(--bg-card)", color: "var(--accent-cyan)", border: "1px solid var(--border)" }}
                        >
                            sec
                        </span>
                    </Link>

                    {/* Desktop nav */}
                    <div className="hidden md:flex items-center gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.key}
                                href={`/${locale}${link.href}`}
                                className="px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/5"
                                style={{ color: "var(--text-secondary)" }}
                            >
                                {t(link.key)}
                            </Link>
                        ))}
                    </div>

                    {/* Right actions */}
                    <div className="flex items-center gap-2">
                        <LanguageSwitcher locale={locale} />
                        <ThemeToggle />

                        {/* Mobile menu btn */}
                        <button
                            className="md:hidden w-9 h-9 rounded-lg flex flex-col items-center justify-center gap-1.5 transition-all"
                            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            aria-label={isMobileMenuOpen ? tc("close_menu") : tc("open_menu")}
                            aria-expanded={isMobileMenuOpen}
                        >
                            <span
                                className="w-4 h-0.5 transition-all duration-300"
                                style={{
                                    background: "var(--text-secondary)",
                                    transform: isMobileMenuOpen ? "rotate(45deg) translate(3px, 3px)" : "none",
                                }}
                            />
                            <span
                                className="w-4 h-0.5 transition-all duration-300"
                                style={{
                                    background: "var(--text-secondary)",
                                    opacity: isMobileMenuOpen ? 0 : 1,
                                }}
                            />
                            <span
                                className="w-4 h-0.5 transition-all duration-300"
                                style={{
                                    background: "var(--text-secondary)",
                                    transform: isMobileMenuOpen ? "rotate(-45deg) translate(3px, -3px)" : "none",
                                }}
                            />
                        </button>
                    </div>
                </nav>

                {/* Mobile menu */}
                {isMobileMenuOpen && (
                    <div
                        className="md:hidden pb-4 pt-2"
                        style={{ borderTop: "1px solid var(--border)" }}
                    >
                        {navLinks.map((link) => (
                            <Link
                                key={link.key}
                                href={`/${locale}${link.href}`}
                                className="flex items-center px-3 py-3 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-white/5"
                                style={{ color: "var(--text-secondary)" }}
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {t(link.key)}
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </header>
    );
}
