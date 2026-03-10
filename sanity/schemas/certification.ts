export const certificationSchema = {
    name: "certification",
    title: "Certification",
    type: "document",
    fields: [
        { name: "title", title: "Title", type: "string", validation: (R: any) => R.required() },
        { name: "issuer", title: "Issuing Organization", type: "string", validation: (R: any) => R.required() },
        { name: "date", title: "Date Obtained", type: "datetime", validation: (R: any) => R.required() },
        { name: "credentialUrl", title: "Credential URL", type: "url" },
        {
            name: "badgeImage",
            title: "Badge Image",
            type: "image",
            options: { hotspot: true },
            fields: [{ name: "alt", title: "Alt Text", type: "string" }],
        },
    ],
    orderings: [
        { title: "Date (Desc)", name: "dateDesc", by: [{ field: "date", direction: "desc" }] },
    ],
    preview: {
        select: { title: "title", subtitle: "issuer", media: "badgeImage" },
    },
};
