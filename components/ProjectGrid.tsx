import ProjectCard from "./ProjectCard";
import type { ProjectListItem } from "@/types/project";

interface ProjectGridProps {
    projects: ProjectListItem[];
    locale: string;
}

export default function ProjectGrid({ projects, locale }: ProjectGridProps) {
    if (!projects || projects.length === 0) return null;

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
                <ProjectCard key={project._id} project={project} locale={locale} />
            ))}
        </div>
    );
}
