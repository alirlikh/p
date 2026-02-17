import ProjectList from "@/components/materials/list/projectList/Project.list";
import getProject from "@/data/server/getProject";

const ProjectPageView = async () => {
  const projects = await getProject();

  return <ProjectList projects={projects} />;
};
export default ProjectPageView;
