import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import ExperiencePageView from '@/components/templates/experiencePageView/ExperiencePage.view';

export const metadata: Metadata = {
  title: 'Professional Frontend Experience | Alireza Jalili',
  description: 'Explore Alireza Jalili\'s professional experience as a frontend developer, specializing in React, Next.js, and modern UI/UX design.',
  alternates: { canonical: '/experience' },
  openGraph: {
    title: 'Professional Frontend Experience | Alireza Jalili',
    description: 'Explore Alireza Jalili\'s professional experience as a frontend developer, specializing in React, Next.js, and modern UI/UX design.',
    url: `${SITE_URL}/experience`,
  },
};

const page = () => {
  return <ExperiencePageView />;
};
export default page;
