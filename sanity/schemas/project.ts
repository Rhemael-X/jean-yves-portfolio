export const projectSchema = {
    name: "project",
    title: "Project",
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
            type: "object",
            fields: [
                {
                    name: "fr",
                    title: "Slug FR",
                    type: "slug",
                    options: { source: "title.fr" },
                    validation: (R: any) => R.required(),
                },
                {
                    name: "en",
                    title: "Slug EN",
                    type: "slug",
                    options: { source: "title.en" },
                    validation: (R: any) => R.required(),
                },
            ],
        },
        {
            name: "excerpt",
            title: "Excerpt",
            type: "object",
            fields: [
                { name: "fr", title: "Français", type: "text", rows: 3 },
                { name: "en", title: "English", type: "text", rows: 3 },
            ],
        },
        {
            name: "description",
            title: "Description (Rich Text)",
            type: "object",
            fields: [
                { name: "fr", title: "Français", type: "array", of: [{ type: "block" }] },
                { name: "en", title: "English", type: "array", of: [{ type: "block" }] },
            ],
        },
        {
            name: "content",
            title: "Full Content (Rich Text)",
            type: "object",
            fields: [
                { name: "fr", title: "Français", type: "array", of: [{ type: "block" }, { type: "image" }] },
                { name: "en", title: "English", type: "array", of: [{ type: "block" }, { type: "image" }] },
            ],
        },
        {
            name: "mainImage",
            title: "Main Image",
            type: "image",
            options: { hotspot: true },
            fields: [{ name: "alt", title: "Alt Text", type: "string" }],
        },
        {
            name: "galleryImages",
            title: "Gallery Images",
            type: "array",
            of: [
                {
                    type: "image",
                    options: { hotspot: true },
                    fields: [{ name: "alt", title: "Alt Text", type: "string" }],
                },
            ],
        },
        {
            name: "tags",
            title: "Tags",
            type: "array",
            of: [{ type: "string" }],
            options: { layout: "tags" },
        },
        {
            name: "technologies",
            title: "Technologies",
            type: "array",
            of: [{ type: "reference", to: [{ type: "technology" }] }],
        },
        {
            name: "context",
            title: "Context",
            type: "string",
            options: {
                list: [
                    { title: "Formation", value: "formation" },
                    { title: "Université", value: "université" },
                    { title: "Personnel", value: "personnel" },
                ],
                layout: "radio",
            },
            validation: (R: any) => R.required(),
        },
        { name: "githubUrl", title: "GitHub URL", type: "url" },
        { name: "demoUrl", title: "Demo URL", type: "url" },
        { name: "documentationUrl", title: "Documentation URL", type: "url" },
        {
            name: "status",
            title: "Status",
            type: "string",
            options: {
                list: [
                    { title: "Completed", value: "completed" },
                    { title: "In Progress", value: "in-progress" },
                    { title: "Archived", value: "archived" },
                ],
            },
            initialValue: "completed",
        },
        {
            name: "difficulty",
            title: "Difficulty",
            type: "string",
            options: {
                list: [
                    { title: "Beginner", value: "beginner" },
                    { title: "Intermediate", value: "intermediate" },
                    { title: "Advanced", value: "advanced" },
                    { title: "Research", value: "research" },
                ],
            },
            validation: (R: any) => R.required(),
        },
        {
            name: "featured",
            title: "Featured on Homepage",
            type: "boolean",
            initialValue: false,
        },
        {
            name: "order",
            title: "Custom Order",
            type: "number",
            initialValue: 100,
        },
        { name: "startDate", title: "Start Date", type: "datetime" },
        { name: "endDate", title: "End Date", type: "datetime" },
    ],
    orderings: [
        { title: "Order (Asc)", name: "orderAsc", by: [{ field: "order", direction: "asc" }] },
        { title: "Created At (Desc)", name: "createdAtDesc", by: [{ field: "_createdAt", direction: "desc" }] },
    ],
    preview: {
        select: { title: "title.fr", subtitle: "context", media: "mainImage" },
        prepare({ title, subtitle, media }: any) {
            return { title: title || "Untitled", subtitle, media };
        },
    },
};
