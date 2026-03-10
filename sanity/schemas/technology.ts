export const technologySchema = {
    name: "technology",
    title: "Technology",
    type: "document",
    fields: [
        {
            name: "name",
            title: "Name",
            type: "string",
            validation: (R: any) => R.required(),
        },
        {
            name: "slug",
            title: "Slug",
            type: "slug",
            options: { source: "name" },
            validation: (R: any) => R.required(),
        },
        {
            name: "category",
            title: "Category",
            type: "reference",
            to: [{ type: "category" }],
        },
        {
            name: "logo",
            title: "Logo",
            type: "image",
            options: { hotspot: true },
            fields: [{ name: "alt", title: "Alt Text", type: "string" }],
        },
    ],
};
