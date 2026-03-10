import { SanityImage, BilingualString, BilingualText } from "./index";
import { Technology } from "./technology";

export interface Project {
    _id: string;
    title: BilingualString;
    slug: {
        fr: { current: string };
        en: { current: string };
    };
    excerpt: BilingualText;
    description: {
        fr: any[];
        en: any[];
    };
    content?: {
        fr: any[];
        en: any[];
    };
    mainImage?: SanityImage & { imageUrl?: string };
    galleryImages?: SanityImage[];
    tags?: string[];
    categories?: Array<{ _id: string; title: BilingualString }>;
    technologies?: Technology[];
    context: "formation" | "université" | "personnel";
    githubUrl?: string;
    demoUrl?: string;
    documentationUrl?: string;
    status: "completed" | "in-progress" | "archived";
    difficulty: "beginner" | "intermediate" | "advanced" | "research";
    featured: boolean;
    order: number;
    startDate?: string;
    endDate?: string;
    _createdAt: string;
    _updatedAt: string;
}

export interface ProjectListItem {
    _id: string;
    title: BilingualString;
    slug: {
        fr: { current: string };
        en: { current: string };
    };
    excerpt: BilingualText;
    mainImage?: SanityImage & { imageUrl?: string };
    tags?: string[];
    context: "formation" | "université" | "personnel";
    difficulty: "beginner" | "intermediate" | "advanced" | "research";
    featured: boolean;
    order: number;
    technologies?: Array<{ _id: string; name: string; logo?: SanityImage }>;
}

export interface ProjectFilters {
    search?: string;
    tags?: string[];
    technologies?: string[];
    difficulty?: string;
    context?: string;
}
