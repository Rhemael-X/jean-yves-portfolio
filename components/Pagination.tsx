"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
}

export default function Pagination({ currentPage, totalPages }: PaginationProps) {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const t = useTranslations("common");

    if (totalPages <= 1) return null;

    function buildHref(page: number) {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(page));
        return `${pathname}?${params.toString()}`;
    }

    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
        pages.push(1);
        if (currentPage > 3) pages.push("...");
        for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
            pages.push(i);
        }
        if (currentPage < totalPages - 2) pages.push("...");
        pages.push(totalPages);
    }

    return (
        <nav aria-label="Pagination" className="flex items-center justify-center gap-1 mt-10 flex-wrap">
            {/* Previous */}
            {currentPage > 1 ? (
                <Link
                    href={buildHref(currentPage - 1)}
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{ background: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
                    aria-label={t("previous")}
                >
                    ← {t("previous")}
                </Link>
            ) : (
                <span
                    className="px-3 py-2 rounded-lg text-sm font-medium opacity-30 cursor-not-allowed"
                    style={{ background: "var(--bg-card)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
                >
                    ← {t("previous")}
                </span>
            )}

            {/* Page numbers */}
            {pages.map((page, idx) =>
                page === "..." ? (
                    <span key={`dots-${idx}`} className="px-2 py-2 text-sm" style={{ color: "var(--text-muted)" }}>
                        …
                    </span>
                ) : (
                    <Link
                        key={page}
                        href={buildHref(page as number)}
                        aria-current={page === currentPage ? "page" : undefined}
                        className="w-9 h-9 flex items-center justify-center rounded-lg text-sm font-medium transition-all"
                        style={{
                            background: page === currentPage ? "var(--accent-cyan)" : "var(--bg-card)",
                            color: page === currentPage ? "var(--bg-primary)" : "var(--text-secondary)",
                            border: `1px solid ${page === currentPage ? "var(--accent-cyan)" : "var(--border)"}`,
                        }}
                    >
                        {page}
                    </Link>
                )
            )}

            {/* Next */}
            {currentPage < totalPages ? (
                <Link
                    href={buildHref(currentPage + 1)}
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{ background: "var(--bg-card)", color: "var(--text-secondary)", border: "1px solid var(--border)" }}
                    aria-label={t("next")}
                >
                    {t("next")} →
                </Link>
            ) : (
                <span
                    className="px-3 py-2 rounded-lg text-sm font-medium opacity-30 cursor-not-allowed"
                    style={{ background: "var(--bg-card)", color: "var(--text-muted)", border: "1px solid var(--border)" }}
                >
                    {t("next")} →
                </span>
            )}
        </nav>
    );
}
