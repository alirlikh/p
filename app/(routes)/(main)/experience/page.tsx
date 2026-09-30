import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import ExperiencePageView from '@/components/templates/experiencePageView/ExperiencePage.view';

export const metadata: Metadata = {
  title: 'Experience',
  description:
    'Explore the frontend development roles and professional experience of Alireza Jalili.',
  alternates: { canonical: '/experience' },
  openGraph: {
    title: 'Experience',
    description:
      'Explore the frontend development roles and professional experience of Alireza Jalili.',
    url: `${SITE_URL}/experience`,
  },
};

const page = () => {
  return <ExperiencePageView />;
};
export default page;
