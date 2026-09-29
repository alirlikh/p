import prisma from '@/lib/prisma';
import EducationEditForm from './EducationEditForm';
import { notFound } from 'next/navigation';

export default async function EditEducationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const education = await prisma.education.findUnique({
    where: { id },
  });

  if (!education) {
    notFound();
  }

  return <EducationEditForm education={education} />;
}
