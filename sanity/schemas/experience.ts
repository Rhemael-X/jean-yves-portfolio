export const experienceSchema = {
    name: "experience",
    title: "Experience",
    type: "document",
    fields: [
        { name: "company", title: "Company", type: "string", validation: (R: any) => R.required() },
        {
            name: "position",
            title: "Position",
            type: "object",
            fields: [
                { name: "fr", title: "Français", type: "string", validation: (R: any) => R.required() },
                { name: "en", title: "English", type: "string", validation: (R: any) => R.required() },
            ],
        },
        {
            name: "description",
            title: "Description",
            type: "object",
            fields: [
                { name: "fr", title: "Français", type: "array", of: [{ type: "block" }] },
                { name: "en", title: "English", type: "array", of: [{ type: "block" }] },
            ],
        },
        {
            name: "startDate",
            title: "Start Date",
            type: "datetime",
            validation: (R: any) => R.required(),
        },
        { name: "endDate", title: "End Date (leave empty if current)", type: "datetime" },
        {
            name: "technologies",
            title: "Technologies Used",
            type: "array",
            of: [{ type: "reference", to: [{ type: "technology" }] }],
        },
    ],
    orderings: [
        { title: "Start Date (Desc)", name: "startDateDesc", by: [{ field: "startDate", direction: "desc" }] },
    ],
    preview: {
        select: { title: "position.fr", subtitle: "company" },
        prepare({ title, subtitle }: any) {
            return { title, subtitle };
        },
    },
};
