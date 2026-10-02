import prisma from '@/lib/prisma';

const getExperience = async () => {
  try {
    return await prisma.experience.findMany({
      include: { duties: true },
      orderBy: { startTime: 'asc' },
    });
  } catch (error) {
    console.error('Error fetching experience:', error);
    throw new Error('Failed to fetch experience');
  }
};

export default getExperience;
