import { createClient } from "@sanity/client";

const client = createClient({
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "nc5oijv0",
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
    apiVersion: "2024-01-01",
    token: process.env.SANITY_API_TOKEN,
    useCdn: false,
});

async function seedCategories() {
    console.log("📁 Seeding categories...");
    const categories = [
        { name: { fr: "Réseau", en: "Network" }, slug: "network", color: "#06b6d4" },
        { name: { fr: "Système", en: "System" }, slug: "system", color: "#8b5cf6" },
        { name: { fr: "Web", en: "Web" }, slug: "web", color: "#10b981" },
        { name: { fr: "Cryptographie", en: "Cryptography" }, slug: "crypto", color: "#f59e0b" },
        { name: { fr: "Forensics", en: "Forensics" }, slug: "forensics", color: "#ef4444" },
        { name: { fr: "OSINT", en: "OSINT" }, slug: "osint", color: "#64748b" },
        { name: { fr: "Programmation", en: "Programming" }, slug: "programming", color: "#3b82f6" },
    ];

    const results: { _id: string; slug: string }[] = [];
    for (const cat of categories) {
        const existing = await client.fetch(
            `*[_type == "category" && slug.current == $slug][0]._id`,
            { slug: cat.slug }
        );
        if (existing) {
            results.push({ _id: existing, slug: cat.slug });
            console.log(`  ↷ Category "${cat.slug}" already exists`);
        } else {
            const created = await client.create({
                _type: "category",
                title: { fr: cat.name.fr, en: cat.name.en },
                slug: { _type: "slug", current: cat.slug },
                color: cat.color,
            });
            results.push({ _id: created._id, slug: cat.slug });
            console.log(`  ✓ Created category "${cat.slug}"`);
        }
    }
    return results;
}

async function seedTechnologies(categories: { _id: string; slug: string }[]) {
    console.log("\n🔧 Seeding technologies...");

    const getCatId = (slug: string) =>
        categories.find((c) => c.slug === slug)?._id;

    const technologies = [
        { name: "Python", slug: "python", categorySlug: "programming" },
        { name: "Wireshark", slug: "wireshark", categorySlug: "network" },
        { name: "Metasploit", slug: "metasploit", categorySlug: "system" },
        { name: "Burp Suite", slug: "burp-suite", categorySlug: "web" },
        { name: "Nmap", slug: "nmap", categorySlug: "network" },
        { name: "Suricata", slug: "suricata", categorySlug: "network" },
        { name: "GDB", slug: "gdb", categorySlug: "system" },
        { name: "Ghidra", slug: "ghidra", categorySlug: "system" },
        { name: "Volatility", slug: "volatility", categorySlug: "forensics" },
        { name: "Aircrack-ng", slug: "aircrack-ng", categorySlug: "network" },
        { name: "Hashcat", slug: "hashcat", categorySlug: "crypto" },
        { name: "OpenSSL", slug: "openssl", categorySlug: "crypto" },
        { name: "Docker", slug: "docker", categorySlug: "system" },
        { name: "Bash", slug: "bash", categorySlug: "programming" },
        { name: "Go", slug: "go", categorySlug: "programming" },
        { name: "Next.js", slug: "nextjs", categorySlug: "web" },
        { name: "Splunk", slug: "splunk", categorySlug: "forensics" },
        { name: "MISP", slug: "misp", categorySlug: "osint" },
        { name: "Maltego", slug: "maltego", categorySlug: "osint" },
        { name: "Scapy", slug: "scapy", categorySlug: "network" },
    ];

    for (const tech of technologies) {
        const existing = await client.fetch(
            `*[_type == "technology" && slug.current == $slug][0]._id`,
            { slug: tech.slug }
        );
        if (existing) {
            console.log(`  ↷ Technology "${tech.name}" already exists`);
        } else {
            const catId = getCatId(tech.categorySlug);
            await client.create({
                _type: "technology",
                name: tech.name,
                slug: { _type: "slug", current: tech.slug },
                ...(catId ? { category: { _type: "reference", _ref: catId } } : {}),
            });
            console.log(`  ✓ Created technology "${tech.name}"`);
        }
    }
}

async function seedSkills() {
    console.log("\n🧠 Seeding skills...");
    const skills = [
        { name: "Pentest réseau", category: "Network", level: 4 },
        { name: "Analyse forensique", category: "Forensics", level: 4 },
        { name: "Cryptographie appliquée", category: "Cryptography", level: 3 },
        { name: "Développement web sécurisé", category: "Web Security", level: 4 },
        { name: "Reverse Engineering", category: "Reverse Engineering", level: 3 },
        { name: "OSINT", category: "OSINT", level: 4 },
        { name: "Python", category: "Programming", level: 5 },
        { name: "Bash scripting", category: "Programming", level: 4 },
        { name: "Active Directory", category: "System", level: 3 },
        { name: "Détection d'intrusion", category: "Network", level: 4 },
    ];

    for (let i = 0; i < skills.length; i++) {
        const s = skills[i];
        const existing = await client.fetch(
            `*[_type == "skill" && name == $name][0]._id`,
            { name: s.name }
        );
        if (existing) {
            console.log(`  ↷ Skill "${s.name}" already exists`);
        } else {
            await client.create({
                _type: "skill",
                name: s.name,
                category: s.category,
                level: s.level,
                highlight: i < 6,
                order: i + 1,
                description: {
                    fr: `Maîtrise de ${s.name.toLowerCase()} appliquée à la cybersécurité.`,
                    en: `Mastery of ${s.name.toLowerCase()} applied to cybersecurity.`,
                },
            });
            console.log(`  ✓ Created skill "${s.name}"`);
        }
    }
}

async function seedProfile() {
    console.log("\n👤 Seeding profile...");
    const existing = await client.fetch(`*[_type == "profile"][0]._id`);
    if (existing) {
        console.log("  ↷ Profile already exists — skipping.");
        return;
    }
    await client.create({
        _type: "profile",
        name: "Jean-Yves",
        title: {
            fr: "Expert en Cybersécurité",
            en: "Cybersecurity Expert",
        },
        shortBio: {
            fr: "Passionné de cybersécurité offensive et défensive, spécialisé en analyse forensique, pentest et développement sécurisé.",
            en: "Passionate about offensive and defensive cybersecurity, specializing in forensic analysis, pentest, and secure development.",
        },
        fullBio: {
            fr: [
                {
                    _type: "block",
                    _key: "bio-fr-1",
                    style: "normal",
                    markDefs: [],
                    children: [{ _type: "span", _key: "s1", text: "Professionnel de la cybersécurité avec plusieurs années d'expérience dans les domaines offensif et défensif.", marks: [] }],
                },
            ],
            en: [
                {
                    _type: "block",
                    _key: "bio-en-1",
                    style: "normal",
                    markDefs: [],
                    children: [{ _type: "span", _key: "s1", text: "Cybersecurity professional with several years of experience in both offensive and defensive domains.", marks: [] }],
                },
            ],
        },
        email: "jean-yves@example.com",
        location: "France",
        github: "https://github.com/jean-yves",
        linkedin: "https://linkedin.com/in/jean-yves",
        availability: "open-to-work",
    });
    console.log("  ✓ Created profile");
}

async function main() {
    console.log("🌱 Starting seed...\n");
    const categories = await seedCategories();
    await seedTechnologies(categories);
    await seedSkills();
    await seedProfile();
    console.log("\n✅ Seed complete!");
}

main().catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
});
