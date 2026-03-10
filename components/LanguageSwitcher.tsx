"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

interface LanguageSwitcherProps {
    locale: string;
}

export default function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
    const pathname = usePathname();
    const t = useTranslations("common");

    function switchLocale(newLocale: string) {
        // Replace the current locale prefix in the pathname
        const segments = pathname.split("/");
        segments[1] = newLocale;
        return segments.join("/");
    }

    return (
        <div
            className="flex items-center gap-1 rounded-lg p-1"
            style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
            aria-label={t("switch_language")}
        >
            {["fr", "en"].map((lang) => (
                <Link
                    key={lang}
                    href={switchLocale(lang)}
                    aria-label={`Switch to ${lang.toUpperCase()}`}
                    className="rounded px-2 py-1 text-xs font-semibold uppercase transition-all duration-200"
                    style={{
                        background: locale === lang ? "var(--accent-cyan)" : "transparent",
                        color: locale === lang ? "var(--bg-primary)" : "var(--text-muted)",
                    }}
                >
                    {lang}
                </Link>
            ))}
        </div>
    );
}
