import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { urlFor } from "./sanityClient";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatDate(dateString: string, locale: string = "fr"): string {
    if (!dateString) return "";
    return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
        year: "numeric",
        month: "long",
    }).format(new Date(dateString));
}

export function formatDateShort(dateString: string, locale: string = "fr"): string {
    if (!dateString) return "";
    return new Intl.DateTimeFormat(locale === "fr" ? "fr-FR" : "en-US", {
        year: "numeric",
        month: "short",
    }).format(new Date(dateString));
}

export function buildSanityImageUrl(
    source: any,
    width?: number,
    height?: number
): string {
    if (!source) return "";
    let builder = urlFor(source);
    if (width) builder = builder.width(width);
    if (height) builder = builder.height(height);
    return builder.format("webp").url();
}

export function calcYearsOfExperience(
    experiences: Array<{ startDate: string; endDate?: string }>
): number {
    if (!experiences || experiences.length === 0) return 0;
    const oldest = experiences.reduce((min, e) => {
        const start = new Date(e.startDate).getFullYear();
        return start < min ? start : min;
    }, new Date().getFullYear());
    return new Date().getFullYear() - oldest;
}

export function getDifficultyLabel(difficulty: string, locale: string): string {
    const labels: Record<string, Record<string, string>> = {
        beginner: { fr: "Débutant", en: "Beginner" },
        intermediate: { fr: "Intermédiaire", en: "Intermediate" },
        advanced: { fr: "Avancé", en: "Advanced" },
        research: { fr: "Recherche", en: "Research" },
    };
    return labels[difficulty]?.[locale] ?? difficulty;
}

export function getContextLabel(context: string, locale: string): string {
    const labels: Record<string, Record<string, string>> = {
        formation: { fr: "Formation", en: "Training" },
        université: { fr: "Université", en: "University" },
        personnel: { fr: "Personnel", en: "Personal" },
    };
    return labels[context]?.[locale] ?? context;
}

export function getAvailabilityLabel(
    status: string,
    locale: string
): { label: string; color: string } {
    const map: Record<string, { fr: string; en: string; color: string }> = {
        "open-to-work": {
            fr: "Disponible",
            en: "Open to Work",
            color: "text-green-400 bg-green-400/10 border-green-400/30",
        },
        freelance: {
            fr: "Freelance",
            en: "Freelance",
            color: "text-blue-400 bg-blue-400/10 border-blue-400/30",
        },
        research: {
            fr: "Recherche",
            en: "Research",
            color: "text-purple-400 bg-purple-400/10 border-purple-400/30",
        },
        "not-available": {
            fr: "Non disponible",
            en: "Not Available",
            color: "text-gray-400 bg-gray-400/10 border-gray-400/30",
        },
    };
    return {
        label: map[status]?.[(locale as "fr" | "en")] ?? status,
        color: map[status]?.color ?? "",
    };
}

export function slugify(text: string): string {
    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}
