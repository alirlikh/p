import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import ProjectCardSkeleton from '@/components/materials/skeleton/ProjectCardSkeleton';
import { lazy, Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Web Development Projects | React & Next.js Portfolio | Alireza Jalili',
  description: 'View a selection of web projects built by Alireza Jalili. Browse source code, live demos, and technical details of modern frontend solutions.',
  alternates: { canonical: '/project' },
  openGraph: {
    title: 'Web Development Projects | React & Next.js Portfolio | Alireza Jalili',
    description: 'View a selection of web projects built by Alireza Jalili. Browse source code, live demos, and technical details of modern frontend solutions.',
    url: `${SITE_URL}/project`,
  },
};

const ProjectPageView = lazy(
  () => import('@/components/templates/projectPageView/ProjectPage.view')
);

const page = () => {
  return (
    <Suspense fallback={
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4 px-8 md:px-12">
        {Array(6).fill(0).map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    }>
      <ProjectPageView />
    </Suspense>
  );
};
export default page;
