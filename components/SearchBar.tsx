"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

interface SearchBarProps {
    defaultValue?: string;
}

export default function SearchBar({ defaultValue = "" }: SearchBarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const t = useTranslations("projects");
    const [value, setValue] = useState(defaultValue);

    useEffect(() => {
        setValue(defaultValue);
    }, [defaultValue]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams.toString());
        params.delete("page");
        if (value.trim()) {
            params.set("q", value.trim());
        } else {
            params.delete("q");
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    const handleClear = () => {
        setValue("");
        const params = new URLSearchParams(searchParams.toString());
        params.delete("q");
        params.delete("page");
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSubmit} role="search">
            <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8" />
                        <path d="m21 21-4.35-4.35" />
                    </svg>
                </div>
                <input
                    type="search"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    placeholder={t("search_placeholder")}
                    aria-label={t("search_placeholder")}
                    className="w-full pl-10 pr-24 py-3 rounded-xl text-sm transition-all"
                    style={{
                        background: "var(--bg-card)",
                        color: "var(--text-primary)",
                        border: "1px solid var(--border)",
                        outline: "none",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "var(--accent-cyan)")}
                    onBlur={(e) => (e.target.style.borderColor = "var(--border)")}
                />
                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                    {value && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="px-2 py-1 rounded text-xs transition-opacity hover:opacity-70"
                            style={{ color: "var(--text-muted)" }}
                            aria-label="Clear search"
                        >
                            ✕
                        </button>
                    )}
                    <button
                        type="submit"
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={{ background: "var(--accent-cyan)", color: "var(--bg-primary)" }}
                    >
                        {value ? "→" : "⌕"}
                    </button>
                </div>
            </div>
        </form>
    );
}
