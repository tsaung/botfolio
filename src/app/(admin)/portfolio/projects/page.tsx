import { getProjects } from "@/lib/actions/projects";
import { ProjectsList } from "@/components/admin/portfolio/projects-list";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return <ProjectsList initialProjects={projects} />;
}
