import { SanityImage, BilingualString } from "./index";

export interface Category {
    _id: string;
    title: BilingualString;
    slug: { current: string };
    description?: BilingualString;
    color?: string;
}

export interface Technology {
    _id: string;
    name: string;
    slug: { current: string };
    category?: Category;
    logo?: SanityImage & { imageUrl?: string };
}
