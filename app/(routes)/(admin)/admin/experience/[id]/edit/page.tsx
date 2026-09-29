import prisma from '@/lib/prisma';
import ExperienceEditForm from './ExperienceEditForm';
import { notFound } from 'next/navigation';

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const experience = await prisma.experience.findUnique({
    where: { id },
    include: {
      duties: true,
    },
  });

  if (!experience) {
    notFound();
  }

  return <ExperienceEditForm experience={experience} />;
}
