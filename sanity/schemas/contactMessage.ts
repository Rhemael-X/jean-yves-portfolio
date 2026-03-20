export const contactMessageSchema = {
    name: "contactMessage",
    title: "Contact Messages",
    type: "document",
    // __experimental_actions removed: it crashed Sanity Studio v3.
    // To prevent manual creation from Studio, we rely on the API-only write flow.
    fields: [
        {
            name: "name",
            title: "Name",
            type: "string",
            readOnly: true,
        },
        {
            name: "email",
            title: "Email",
            type: "string",
            readOnly: true,
        },
        {
            name: "message",
            title: "Message",
            type: "text",
            readOnly: true,
        },
        {
            name: "createdAt",
            title: "Received At",
            type: "datetime",
            readOnly: true,
        },
        {
            name: "read",
            title: "Read",
            type: "boolean",
            initialValue: false,
            // Only "read" is editable — lets you mark messages as read in Studio
        },
    ],
    orderings: [
        {
            title: "Date (newest first)",
            name: "createdAtDesc",
            by: [{ field: "createdAt", direction: "desc" }],
        },
    ],
    preview: {
        select: {
            title: "name",
            subtitle: "email",
            date: "createdAt",
            read: "read",
        },
        prepare({ title, subtitle, read }: any) {
            return {
                title: `${read ? "✅" : "🆕"} ${title || "Unknown"}`,
                subtitle,
            };
        },
    },
};
