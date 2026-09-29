import prisma from "@/lib/prisma";

const getProject = async () => {
  try {
    return await prisma.project.findMany({
      orderBy: { name: "asc" },
    });
  } catch (error) {
    console.error('Error fetching projects:', error);
    throw new Error('Failed to fetch projects');
  }
};

export default getProject;
