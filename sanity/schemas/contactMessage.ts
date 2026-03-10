export const contactMessageSchema = {
    name: "contactMessage",
    title: "Contact Message",
    type: "document",
    __experimental_actions: ["create", "read", "update"],
    fields: [
        { name: "name", title: "Name", type: "string", readOnly: true },
        { name: "email", title: "Email", type: "string", readOnly: true },
        { name: "message", title: "Message", type: "text", readOnly: true },
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
        },
    ],
    orderings: [
        { title: "Date (Desc)", name: "createdAtDesc", by: [{ field: "createdAt", direction: "desc" }] },
    ],
    preview: {
        select: { title: "name", subtitle: "email" },
    },
};
