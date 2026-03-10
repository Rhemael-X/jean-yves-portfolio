import { BilingualString } from "./index";
import { Technology } from "./technology";

export interface Experience {
    _id: string;
    company: string;
    position: BilingualString;
    description: {
        fr: any[];
        en: any[];
    };
    startDate: string;
    endDate?: string;
    technologies?: Technology[];
}
