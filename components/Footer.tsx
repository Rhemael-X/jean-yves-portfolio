import Link from "next/link";
import { useTranslations } from "next-intl";

interface FooterProps {
    locale: string;
}

export default function Footer({ locale }: FooterProps) {
    const t = useTranslations("nav");
    const year = new Date().getFullYear();

    const links = [
        { key: "projects", href: `/${locale}/projects` },
        { key: "skills", href: `/${locale}/skills` },
        { key: "experience", href: `/${locale}/experience` },
        { key: "certifications", href: `/${locale}/certifications` },
        { key: "contact", href: `/${locale}/contact` },
    ];

    return (
        <footer
            className="border-t mt-20"
            style={{ borderColor: "var(--border)", background: "var(--bg-secondary)" }}
        >
            <div className="container-main py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand */}
                    <div>
                        <Link
                            href={`/${locale}`}
                            className="text-lg font-bold"
                            style={{ color: "var(--accent-cyan)" }}
                        >
                            Jean<span style={{ color: "var(--text-primary)" }}>-Yves</span>
                        </Link>
                        <p className="mt-3 text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
                            {locale === "fr"
                                ? "Expert en cybersécurité passionné par la sécurité offensive et défensive."
                                : "Cybersecurity expert passionate about offensive and defensive security."}
                        </p>
                    </div>

                    {/* Nav links */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
                            Navigation
                        </h3>
                        <ul className="space-y-2">
                            {links.map((link) => (
                                <li key={link.key}>
                                    <Link
                                        href={link.href}
                                        className="text-sm transition-colors hover:opacity-80 animated-link"
                                        style={{ color: "var(--text-secondary)" }}
                                    >
                                        {t(link.key)}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Locale switcher */}
                    <div>
                        <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: "var(--text-muted)" }}>
                            {locale === "fr" ? "Langue" : "Language"}
                        </h3>
                        <div className="flex gap-2">
                            {["fr", "en"].map((lang) => (
                                <Link
                                    key={lang}
                                    href={`/${lang}`}
                                    className="px-3 py-1 rounded text-sm font-medium uppercase transition-all"
                                    style={{
                                        background: locale === lang ? "var(--accent-cyan)" : "var(--bg-card)",
                                        color: locale === lang ? "var(--bg-primary)" : "var(--text-muted)",
                                        border: "1px solid var(--border)",
                                    }}
                                >
                                    {lang}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>

                <div
                    className="mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm"
                    style={{ borderTop: "1px solid var(--border)", color: "var(--text-muted)" }}
                >
                    <p>© {year} Jean-Yves. {locale === "fr" ? "Tous droits réservés." : "All rights reserved."}</p>
                    <p className="font-mono text-xs" style={{ color: "var(--accent-cyan)" }}>
                        {"#"} Cybersecurity life {"#"}
                    </p>
                </div>
            </div>
        </footer>
    );
}
