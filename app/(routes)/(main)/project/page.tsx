import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import Loader from '@/components/materials/loader/Loader';
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
    <Suspense fallback={<Loader />}>
      <ProjectPageView />
    </Suspense>
  );
};
export default page;
