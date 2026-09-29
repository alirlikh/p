import prisma from "@/lib/prisma";

const getEducation = async () => {
  try {
    return await prisma.education.findMany({
      orderBy: { startTime: "desc" },
    });
  } catch (error) {
    console.error('Error fetching education:', error);
    throw new Error('Failed to fetch education');
  }
};

export default getEducation;
