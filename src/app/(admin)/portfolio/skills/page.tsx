import { getSkills } from "@/lib/actions/skills";
import { SkillsList } from "@/components/admin/portfolio/skills-list";

export default async function SkillsPage() {
  const skills = await getSkills();

  return <SkillsList initialSkills={skills} />;
}
