import { BilingualString } from "./index";

export interface Category {
    _id: string;
    title: BilingualString;
    slug: { current: string };
    description?: BilingualString;
    color?: string;
}
