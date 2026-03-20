"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useAlternateLinks } from "@/contexts/AlternateLinksContext";

interface LanguageSwitcherProps {
    locale: string;
}

export default function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
    const pathname = usePathname();
    const t = useTranslations("common");
    const alternateLinks = useAlternateLinks();

    function switchLocale(newLocale: string) {
        // If the page provided translated URLs (e.g. project detail with localised slugs),
        // use them directly instead of a naive locale prefix swap.
        if (alternateLinks?.[newLocale]) {
            return alternateLinks[newLocale];
        }
        // Default: replace the locale segment in the current pathname
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
