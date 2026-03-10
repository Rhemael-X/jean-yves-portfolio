import { BilingualString } from "./index";

export interface Education {
    _id: string;
    institution: string;
    degree: BilingualString;
    field: BilingualString;
    startDate: string;
    endDate?: string;
    description?: {
        fr: any[];
        en: any[];
    };
}
