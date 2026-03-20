"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

const EVENT_NAME = "alternate-links-updated";

interface LanguageSwitcherProps {
    locale: string;
}

export default function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
    const pathname = usePathname();
    const t = useTranslations("common");
    const [alternateLinks, setAlternateLinks] = useState<Record<string, string> | null>(null);

    useEffect(() => {
        // 1. Try reading from sessionStorage immediately (covers fast loads)
        try {
            const raw = sessionStorage.getItem("alternateLinks");
            setAlternateLinks(raw ? JSON.parse(raw) : null);
        } catch {
            setAlternateLinks(null);
        }

        // 2. Listen for the custom event fired by RegisterAlternateLinks
        //    This handles the race condition where the page writes AFTER we first read
        function onLinksUpdated(e: Event) {
            const detail = (e as CustomEvent).detail as Record<string, string> | null;
            setAlternateLinks(detail);
        }

        window.addEventListener(EVENT_NAME, onLinksUpdated);
        return () => window.removeEventListener(EVENT_NAME, onLinksUpdated);
    }, [pathname]);

    function switchLocale(newLocale: string) {
        if (alternateLinks?.[newLocale]) {
            return alternateLinks[newLocale];
        }
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
