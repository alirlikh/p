import prisma from '@/lib/prisma';
import ProjectEditForm from './ProjectEditForm';
import { notFound } from 'next/navigation';

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const { id } = params;

  const project = await prisma.project.findUnique({
    where: { id },
  });

  if (!project) {
    notFound();
  }

  return <ProjectEditForm project={project} />;
}
