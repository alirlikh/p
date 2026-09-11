import prisma from '@/lib/prisma';
import { notFound } from 'next/navigation';
import EditPostForm from './EditPostForm';

interface EditPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { slug } = await params;

  const post = await prisma.post.findUnique({
    where: { slug },
    include: {
      categories: { select: { id: true, name: true } },
      tags: { select: { id: true, name: true } },
    },
  });

  if (!post) {
    notFound();
  }

  return <EditPostForm post={post} />;
}
