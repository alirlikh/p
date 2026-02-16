import { motion } from "framer-motion";
import ProjectCard from "../../card/projectCard/Project.card";
import getProject from "@/data/server/getProject";
import { IProject } from "@/data";

const ProjectList = async () => {
  const projects = await getProject();

  const animationVariants = {
    initial: {
      y: -100,
      opacity: 0,
    },
    animate: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        staggerChildren: 0.5,
        delayChildren: 0.3,
      },
    },
  };
  return (
    <motion.div
      variants={animationVariants}
      initial={"initial"}
      animate={"animate"}
      className="py-40 mx-auto flex flex-row items-center justify-center flex-wrap"
    >
      {projects.map((project: IProject, index: number) => {
        return <ProjectCard key={index} project={project} />;
      })}
    </motion.div>
  );
};
export default ProjectList;
