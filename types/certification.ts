import { SanityImage } from "./index";

export interface Certification {
    _id: string;
    title: string;
    issuer: string;
    date: string;
    credentialUrl?: string;
    badgeImage?: SanityImage & { imageUrl?: string };
}
