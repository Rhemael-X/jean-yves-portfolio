import { createClient } from "@sanity/client";

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "nc5oijv0",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2024-01-01",
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
});

const CYBER_TOPICS = [
    "Analyse forensique réseau",
    "CTF — Cryptographie",
    "Scanner de vulnérabilités",
    "Reverse Engineering",
    "Détection d'intrusion avec Suricata",
    "Pentest d'application web",
    "Analyse de malware",
    "Exploitation de buffer overflow",
    "OSINT & reconnaissance",
    "Sécurité des API REST",
    "Audit de configuration SSH",
    "Déchiffrement RSA faible",
    "Honeypot IoT",
    "Fuzzing de protocoles réseau",
    "Steganographie avancée",
    "Injection SQL — exploitation",
    "XSS persistant — bypass CSP",
    "Contournement d'authentification JWT",
    "Analyse de trafic TLS",
    "Rootkit detection",
];

const TAGS = [
    "ctf", "network", "forensics", "crypto", "web", "pwn",
    "reverse", "osint", "iot", "active-directory", "linux",
    "windows", "malware", "pentest", "blue-team", "red-team",
];

const DIFFICULTIES = ["beginner", "intermediate", "advanced", "research"];
const CONTEXTS = ["formation", "université", "personnel"];
const STATUSES = ["completed", "in-progress", "archived"];

function pick<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], n: number): T[] {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
}

function generateSlug(title: string, locale: string): string {
    const base = title
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    return `${locale}-${base}-${Math.floor(Math.random() * 9000) + 1000}`;
}

async function main() {
    console.log("🚀 Generating 100 demo projects in Sanity...");

    // Fetch existing technology IDs
    const technologies: { _id: string; name: string }[] = await client.fetch(
        `*[_type == "technology"] { _id, name }`
    );

    const techRefs = technologies.map((t) => ({
        _type: "reference",
        _ref: t._id,
        _key: t._id,
    }));

    const projects = Array.from({ length: 100 }, (_, i) => {
        const topicFr = pick(CYBER_TOPICS);
        const topicEn = topicFr
            .replace("Analyse", "Analysis")
            .replace("Scanner de", "Scanner for")
            .replace("Détection", "Detection")
            .replace("Exploitation de", "Exploiting")
            .replace("Audit de", "Audit of")
            .replace("Déchiffrement", "Decryption")
            .replace("Sécurité des", "Security of")
            .replace("Analyse de", "Analysis of")
            .replace("Contournement", "Bypass")
            .replace("Injection", "Injection")
            .replace("Déchiffrement", "Decryption");

        const titleFr = `${topicFr} #${i + 1}`;
        const titleEn = `${topicEn} #${i + 1}`;
        const difficulty = pick(DIFFICULTIES);
        const context = pick(CONTEXTS);
        const status = pick(STATUSES);
        const tags = pickN(TAGS, Math.floor(Math.random() * 4) + 2);
        const projectTechs = techRefs.length > 0 ? pickN(techRefs, Math.min(3, techRefs.length)) : [];

        const year = 2022 + Math.floor(Math.random() * 3);
        const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
        const startDate = `${year}-${month}-01T00:00:00Z`;

        return {
            _type: "project",
            title: { fr: titleFr, en: titleEn },
            slug: {
                fr: { _type: "slug", current: generateSlug(titleFr, "fr") },
                en: { _type: "slug", current: generateSlug(titleEn, "en") },
            },
            excerpt: {
                fr: `Projet de cybersécurité portant sur ${topicFr.toLowerCase()}. Réalisé dans le cadre de ${context === "formation" ? "ma formation" : context === "université" ? "mes études universitaires" : "projets personnels"}.`,
                en: `Cybersecurity project focused on ${topicEn.toLowerCase()}. Carried out as part of ${context === "formation" ? "my training" : context === "université" ? "my university studies" : "personal projects"}.`,
            },
            description: {
                fr: [{ _type: "block", _key: `b${i}fr`, style: "normal", markDefs: [], children: [{ _type: "span", _key: `s${i}fr`, text: `Ce projet explore ${topicFr.toLowerCase()} en utilisant des outils et techniques avancés de cybersécurité.`, marks: [] }] }],
                en: [{ _type: "block", _key: `b${i}en`, style: "normal", markDefs: [], children: [{ _type: "span", _key: `s${i}en`, text: `This project explores ${topicEn.toLowerCase()} using advanced cybersecurity tools and techniques.`, marks: [] }] }],
            },
            tags,
            technologies: projectTechs,
            context,
            status,
            difficulty,
            featured: i < 4,
            order: i + 1,
            startDate,
            githubUrl: `https://github.com/jean-yves/project-${i + 1}`,
        };
    });

    let created = 0;
    const BATCH = 10;

    for (let i = 0; i < projects.length; i += BATCH) {
        const batch = projects.slice(i, i + BATCH);
        const transaction = client.transaction();
        batch.forEach((p) => transaction.create(p));
        await transaction.commit();
        created += batch.length;
        console.log(`  ✓ Created ${created}/${projects.length} projects`);
    }

    console.log(`\n✅ Done! ${created} projects created in Sanity.`);
}

main().catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
});
