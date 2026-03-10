const bilingualStringField = (name: string, title: string) => ({
    name,
    title,
    type: "object",
    fields: [
        { name: "fr", title: "Français", type: "string" },
        { name: "en", title: "English", type: "string" },
    ],
});

const bilingualTextField = (name: string, title: string) => ({
    name,
    title,
    type: "object",
    fields: [
        { name: "fr", title: "Français", type: "text" },
        { name: "en", title: "English", type: "text" },
    ],
});

const bilingualRichTextField = (name: string, title: string) => ({
    name,
    title,
    type: "object",
    fields: [
        { name: "fr", title: "Français", type: "array", of: [{ type: "block" }] },
        { name: "en", title: "English", type: "array", of: [{ type: "block" }] },
    ],
});

export const profileSchema = {
    name: "profile",
    title: "Profile",
    type: "document",
    __experimental_actions: ["update", "publish"],
    fields: [
        { name: "name", title: "Full Name", type: "string", validation: (R: any) => R.required() },
        bilingualStringField("title", "Professional Title"),
        bilingualTextField("shortBio", "Short Bio"),
        bilingualRichTextField("fullBio", "Full Bio"),
        {
            name: "photo",
            title: "Profile Photo",
            type: "image",
            options: { hotspot: true },
            fields: [{ name: "alt", title: "Alt Text", type: "string" }],
        },
        { name: "email", title: "Email", type: "string", validation: (R: any) => R.required().email() },
        { name: "location", title: "Location", type: "string" },
        { name: "github", title: "GitHub URL", type: "url" },
        { name: "linkedin", title: "LinkedIn URL", type: "url" },
        { name: "twitter", title: "Twitter/X URL", type: "url" },
        { name: "resumeUrl", title: "Resume URL", type: "url" },
        {
            name: "availability",
            title: "Availability Status",
            type: "string",
            options: {
                list: [
                    { title: "Open to Work", value: "open-to-work" },
                    { title: "Freelance", value: "freelance" },
                    { title: "Research", value: "research" },
                    { title: "Not Available", value: "not-available" },
                ],
                layout: "radio",
            },
            initialValue: "open-to-work",
        },
    ],
};
