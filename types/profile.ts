import { SanityImage, BilingualString, BilingualText } from "./index";

export interface Profile {
    _id: string;
    name: string;
    title: BilingualString;
    shortBio: BilingualText;
    fullBio: {
        fr: any[];
        en: any[];
    };
    photo?: SanityImage & { imageUrl?: string };
    email: string;
    location?: string;
    github?: string;
    linkedin?: string;
    twitter?: string;
    resumeUrl?: string;
    availability: "open-to-work" | "freelance" | "research" | "not-available";
}

export interface ProfileStats {
    totalProjects: number;
    totalTechnologies: number;
    totalSkills: number;
    yearsOfExperience: number;
}
