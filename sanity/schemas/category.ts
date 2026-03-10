export const categorySchema = {
    name: "category",
    title: "Category",
    type: "document",
    fields: [
        {
            name: "title",
            title: "Title",
            type: "object",
            fields: [
                { name: "fr", title: "Français", type: "string", validation: (R: any) => R.required() },
                { name: "en", title: "English", type: "string", validation: (R: any) => R.required() },
            ],
        },
        {
            name: "slug",
            title: "Slug",
            type: "slug",
            options: { source: "title.en" },
            validation: (R: any) => R.required(),
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
        { name: "color", title: "Color (hex)", type: "string" },
    ],
};
