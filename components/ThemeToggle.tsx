"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

export default function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const t = useTranslations("common");

    useEffect(() => setMounted(true), []);

    if (!mounted) {
        return (
            <button
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: "var(--bg-card)", border: "1px solid var(--border)" }}
                aria-label="Toggle theme"
            >
                <span className="w-4 h-4" />
            </button>
        );
    }

    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            aria-label={t("toggle_theme")}
            title={t("toggle_theme")}
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-110"
            style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
            }}
        >
            {isDark ? (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
            ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
            )}
        </button>
    );
}
