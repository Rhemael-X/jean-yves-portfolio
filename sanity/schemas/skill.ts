export const skillSchema = {
    name: "skill",
    title: "Skill",
    type: "document",
    fields: [
        { name: "name", title: "Name", type: "string", validation: (R: any) => R.required() },
        {
            name: "category",
            title: "Category",
            type: "string",
            options: {
                list: [
                    "Network",
                    "System",
                    "Cryptography",
                    "Web Security",
                    "Forensics",
                    "OSINT",
                    "Reverse Engineering",
                    "Programming",
                    "Tools",
                    "Other",
                ],
            },
            validation: (R: any) => R.required(),
        },
        {
            name: "level",
            title: "Level (1-5)",
            type: "number",
            validation: (R: any) => R.required().min(1).max(5),
        },
        {
            name: "description",
            title: "Description",
            type: "object",
            fields: [
                { name: "fr", title: "Français", type: "text" },
                { name: "en", title: "English", type: "text" },
            ],
        },
        {
            name: "icon",
            title: "Icon",
            type: "image",
            options: { hotspot: true },
        },
        { name: "yearsOfExperience", title: "Years of Experience", type: "number" },
        { name: "highlight", title: "Show on Homepage", type: "boolean", initialValue: false },
        { name: "order", title: "Custom Order", type: "number", initialValue: 100 },
    ],
};
