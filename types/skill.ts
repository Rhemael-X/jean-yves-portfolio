import { SanityImage, BilingualText } from "./index";

export interface Skill {
    _id: string;
    name: string;
    category: string;
    level: 1 | 2 | 3 | 4 | 5;
    description?: BilingualText;
    icon?: SanityImage;
    yearsOfExperience?: number;
    highlight?: boolean;
    order?: number;
}
