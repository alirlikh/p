import type { Metadata } from 'next';
import { SITE_URL } from '@/lib/site';
import EducationPageView from '@/components/templates/educationPageView/EducationPage.view';

export const metadata: Metadata = {
  title: 'Academic Background & Certifications | Alireza Jalili',
  description: 'Discover Alireza Jalili\'s academic journey, professional certifications, and technical education in frontend development.',
  alternates: { canonical: '/education' },
  openGraph: {
    title: 'Academic Background & Certifications | Alireza Jalili',
    description: 'Discover Alireza Jalili\'s academic journey, professional certifications, and technical education in frontend development.',
    url: `${SITE_URL}/education`,
  },
};

const page = () => {
  return <EducationPageView />;
};
export default page;
