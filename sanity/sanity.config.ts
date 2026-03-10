import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

import { profileSchema } from "./schemas/profile";
import { projectSchema } from "./schemas/project";
import { categorySchema } from "./schemas/category";
import { technologySchema } from "./schemas/technology";
import { skillSchema } from "./schemas/skill";
import { experienceSchema } from "./schemas/experience";
import { educationSchema } from "./schemas/education";
import { certificationSchema } from "./schemas/certification";
import { contactMessageSchema } from "./schemas/contactMessage";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

export default defineConfig({
    name: "jean-yves-portfolio",
    title: "Jean-Yves Portfolio",
    projectId,
    dataset,
    basePath: "/studio",
    plugins: [
        structureTool({
            structure: (S) =>
                S.list()
                    .title("Content")
                    .items([
                        S.listItem()
                            .title("👤 Profile")
                            .id("profile") // Unique ID for the list item
                            .child(
                                S.document()
                                    .schemaType("profile") // The name of your schema type
                                    .documentId("profile") // The fixed ID for this single document
                            ),
                        S.divider(),
                        S.documentTypeListItem("project").title("🔒 Projects"),
                        S.divider(),
                        S.documentTypeListItem("category").title("📁 Categories"),
                        S.documentTypeListItem("technology").title("🔧 Technologies"),
                        S.documentTypeListItem("skill").title("🧠 Skills"),
                        S.divider(),
                        S.documentTypeListItem("experience").title("💼 Experience"),
                        S.documentTypeListItem("education").title("🎓 Education"),
                        S.documentTypeListItem("certification").title("🏆 Certifications"),
                        S.divider(),
                        S.documentTypeListItem("contactMessage").title("📬 Contact Messages"),
                    ]),
        }),
        visionTool(),
    ],
    schema: {
        types: [
            profileSchema,
            projectSchema,
            categorySchema,
            technologySchema,
            skillSchema,
            experienceSchema,
            educationSchema,
            certificationSchema,
            contactMessageSchema,
        ],
    },
});
