import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import EducationPageView from '@/components/templates/educationPageView/EducationPage.view';

export const metadata: Metadata = {
  title: 'Education',
  description: "View Alireza Jalili's education, academic background, and certificates.",
  alternates: { canonical: '/education' },
  openGraph: {
    title: 'Education',
    description: "View Alireza Jalili's education, academic background, and certificates.",
    url: `${SITE_URL}/education`,
  },
};

const page = () => {
  return <EducationPageView />;
};
export default page;
