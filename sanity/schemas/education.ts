export const educationSchema = {
    name: "education",
    title: "Education",
    type: "document",
    fields: [
        { name: "institution", title: "Institution", type: "string", validation: (R: any) => R.required() },
        {
            name: "degree",
            title: "Degree",
            type: "object",
            fields: [
                { name: "fr", title: "Français", type: "string" },
                { name: "en", title: "English", type: "string" },
            ],
        },
        {
            name: "field",
            title: "Field of Study",
            type: "object",
            fields: [
                { name: "fr", title: "Français", type: "string" },
                { name: "en", title: "English", type: "string" },
            ],
        },
        {
            name: "startDate",
            title: "Start Date",
            type: "datetime",
            validation: (R: any) => R.required(),
        },
        { name: "endDate", title: "End Date", type: "datetime" },
        {
            name: "description",
            title: "Description",
            type: "object",
            fields: [
                { name: "fr", title: "Français", type: "array", of: [{ type: "block" }] },
                { name: "en", title: "English", type: "array", of: [{ type: "block" }] },
            ],
        },
    ],
    orderings: [
        { title: "Start Date (Desc)", name: "startDateDesc", by: [{ field: "startDate", direction: "desc" }] },
    ],
    preview: {
        select: { title: "degree.fr", subtitle: "institution" },
        prepare({ title, subtitle }: any) {
            return { title, subtitle };
        },
    },
};
