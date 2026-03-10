import { client } from "./sanityClient";
import { ProjectFilters } from "@/types/project";

// =========================================
// PROFILE
// =========================================

export const PROFILE_QUERY = `*[_type == "profile"][0] {
  _id,
  name,
  title,
  shortBio,
  fullBio,
  photo { ..., "imageUrl": asset->url, alt },
  email,
  location,
  github,
  linkedin,
  twitter,
  resumeUrl,
  availability
}`;

export async function getProfile() {
    return client.fetch(PROFILE_QUERY);
}

export async function getProfileStats() {
    const [projects, technologies, skills, experiences] = await Promise.all([
        client.fetch(`count(*[_type == "project"])`),
        client.fetch(`count(*[_type == "technology"])`),
        client.fetch(`count(*[_type == "skill"])`),
        client.fetch(`*[_type == "experience"] { startDate, endDate }`),
    ]);

    const yearsOfExperience = calcYearsFromExperiences(experiences);

    return { totalProjects: projects, totalTechnologies: technologies, totalSkills: skills, yearsOfExperience };
}

function calcYearsFromExperiences(experiences: Array<{ startDate: string; endDate?: string }>) {
    if (!experiences || experiences.length === 0) return 0;
    const oldest = experiences.reduce((min, e) => {
        const start = new Date(e.startDate).getFullYear();
        return start < min ? start : min;
    }, new Date().getFullYear());
    return new Date().getFullYear() - oldest;
}

// =========================================
// PROJECTS
// =========================================

const PROJECT_CARD_FIELDS = `
  _id,
  title,
  slug,
  excerpt,
  "mainImage": mainImage { ..., "imageUrl": asset->url, alt },
  tags,
  context,
  difficulty,
  featured,
  order,
  "technologies": technologies[]-> { _id, name, slug, "logo": logo { ..., "imageUrl": asset->url } }
`;

export async function getFeaturedProjects(locale: string = "fr") {
    const featured = await client.fetch(
        `*[_type == "project" && featured == true] | order(order asc) [0...4] { ${PROJECT_CARD_FIELDS} }`
    );

    if (featured.length < 4) {
        const needed = 4 - featured.length;
        const featuredIds = featured.map((p: any) => p._id);
        const recent = await client.fetch(
            `*[_type == "project" && featured != true && !(_id in $ids)] | order(_createdAt desc) [0...$needed] { ${PROJECT_CARD_FIELDS} }`,
            { ids: featuredIds, needed }
        );
        return [...featured, ...recent];
    }

    return featured;
}

function buildProjectFilter(filters: ProjectFilters, locale: string) {
    const conditions: string[] = [`_type == "project"`];

    if (filters.search) {
        conditions.push(
            `(title[$locale] match $search || excerpt[$locale] match $search || count(tags[@ match $search]) > 0)`
        );
    }
    if (filters.tags && filters.tags.length > 0) {
        conditions.push(`count(tags[@ in $tags]) > 0`);
    }
    if (filters.technologies && filters.technologies.length > 0) {
        conditions.push(`count(technologies[@->slug.current in $technologies]) > 0`);
    }
    if (filters.difficulty) {
        conditions.push(`difficulty == $difficulty`);
    }
    if (filters.context) {
        conditions.push(`context == $context`);
    }

    return conditions.join(" && ");
}

export async function getProjects(
    locale: string = "fr",
    filters: ProjectFilters = {},
    skip: number = 0,
    limit: number = 12
) {
    const filter = buildProjectFilter(filters, locale);
    const params = {
        locale,
        search: filters.search || "",
        tags: filters.tags || [],
        technologies: filters.technologies || [],
        difficulty: filters.difficulty || "",
        context: filters.context || "",
        skip,
        limit,
    };

    return client.fetch(
        `*[${filter}] | order(order asc) [$skip...$limit] { ${PROJECT_CARD_FIELDS} }`,
        params
    );
}

export async function countProjects(locale: string = "fr", filters: ProjectFilters = {}) {
    const filter = buildProjectFilter(filters, locale);
    const params = {
        locale,
        search: filters.search || "",
        tags: filters.tags || [],
        technologies: filters.technologies || [],
        difficulty: filters.difficulty || "",
        context: filters.context || "",
    };

    return client.fetch(`count(*[${filter}])`, params);
}

export async function getProjectBySlug(locale: string, slug: string) {
    return client.fetch(
        `*[_type == "project" && slug[$locale].current == $slug][0] {
      _id,
      title,
      slug,
      excerpt,
      description,
      content,
      "mainImage": mainImage { ..., "imageUrl": asset->url, alt },
      "galleryImages": galleryImages[] { ..., "imageUrl": asset->url, alt },
      tags,
      "technologies": technologies[]-> { _id, name, slug, "logo": logo { ..., "imageUrl": asset->url } },
      context,
      githubUrl,
      demoUrl,
      documentationUrl,
      status,
      difficulty,
      featured,
      order,
      startDate,
      endDate,
      _createdAt,
      _updatedAt
    }`,
        { locale, slug }
    );
}

export async function getAdjacentProjects(currentOrder: number, locale: string) {
    const [prev, next] = await Promise.all([
        client.fetch(
            `*[_type == "project" && order < $currentOrder] | order(order desc) [0] { _id, title, slug, "mainImage": mainImage { "imageUrl": asset->url } }`,
            { currentOrder }
        ),
        client.fetch(
            `*[_type == "project" && order > $currentOrder] | order(order asc) [0] { _id, title, slug, "mainImage": mainImage { "imageUrl": asset->url } }`,
            { currentOrder }
        ),
    ]);
    return { prev, next };
}

export async function getAllProjectSlugs() {
    return client.fetch(`*[_type == "project"] { slug }`);
}

export async function getAllTags() {
    const projects = await client.fetch(`*[_type == "project"] { tags }`);
    const tags = new Set<string>();
    projects.forEach((p: any) => p.tags?.forEach((t: string) => tags.add(t)));
    return Array.from(tags).sort();
}

export async function getAllTechnologies() {
    return client.fetch(`*[_type == "technology"] | order(name asc) { _id, name, slug }`);
}

// =========================================
// SKILLS
// =========================================

export async function getSkills() {
    return client.fetch(`*[_type == "skill"] | order(order asc) {
    _id, name, category, level, description, yearsOfExperience, highlight, order,
    "icon": icon { "imageUrl": asset->url }
  }`);
}

export async function getFeaturedSkills() {
    return client.fetch(`*[_type == "skill" && highlight == true] | order(order asc) {
    _id, name, category, level, description, yearsOfExperience, highlight, order,
    "icon": icon { "imageUrl": asset->url }
  }`);
}

// =========================================
// EXPERIENCE
// =========================================

export async function getExperiences() {
    return client.fetch(`*[_type == "experience"] | order(startDate desc) {
    _id, company, position, description, startDate, endDate,
    "technologies": technologies[]-> { _id, name, slug }
  }`);
}

// =========================================
// EDUCATION
// =========================================

export async function getEducation() {
    return client.fetch(`*[_type == "education"] | order(startDate desc) {
    _id, institution, degree, field, startDate, endDate, description
  }`);
}

// =========================================
// CERTIFICATIONS
// =========================================

export async function getCertifications() {
    return client.fetch(`*[_type == "certification"] | order(date desc) {
    _id, title, issuer, date, credentialUrl,
    "badgeImage": badgeImage { "imageUrl": asset->url, alt }
  }`);
}
