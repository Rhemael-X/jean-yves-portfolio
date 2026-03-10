export interface BilingualString {
    fr: string;
    en: string;
}

export interface BilingualText {
    fr: string;
    en: string;
}

export interface BilingualSlug {
    fr: { current: string };
    en: { current: string };
}

export interface SanityImage {
    _type: "image";
    asset: {
        _ref: string;
        _type: "reference";
    };
    hotspot?: {
        x: number;
        y: number;
        height: number;
        width: number;
    };
    alt?: string;
}

export type { Project } from "./project";
export type { Profile } from "./profile";
export type { Skill } from "./skill";
export type { Experience } from "./experience";
export type { Education } from "./education";
export type { Certification } from "./certification";
export type { Technology } from "./technology";
export type { Category } from "./category";
