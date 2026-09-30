import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import Loader from '@/components/materials/loader/Loader';
import { lazy, Suspense } from 'react';

export const metadata: Metadata = {
  title: 'Projects',
  description:
    'Browse selected web projects built by frontend developer Alireza Jalili, with links to source code and live demos.',
  alternates: { canonical: '/project' },
  openGraph: {
    title: 'Projects',
    description:
      'Browse selected web projects built by frontend developer Alireza Jalili, with links to source code and live demos.',
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
