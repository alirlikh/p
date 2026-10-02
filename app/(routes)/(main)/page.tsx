import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import LandingBannerSection from '@/components/templates/landingBannerSection/LandingBannerSection';
import RoutinBanner from '@/components/templates/routinBanner/RoutinBanner';
import Loader from '@/components/materials/feedback/LoadingSpinner';
import { SITE_NAME, SITE_URL } from '@/lib/site';

// Lazy load below-the-fold sections with heavy dependencies
const ExperienceSliderSection = dynamic(
  () => import('@/components/templates/experienceSliderSection/ExperienceSliderSection'),
  { loading: () => <Loader /> }
);

const TechnologiesSection = dynamic(
  () => import('@/components/templates/technologiesSection/TechnologiesSection'),
  { loading: () => <Loader /> }
);

export const metadata: Metadata = {
  title: 'Alireza Jalili | Frontend Developer | React & Next.js Expert',
  description: 'Build performant, user-centric web applications with modern frontend technologies.',
  alternates: { canonical: '/' },
  openGraph: {
    title: 'Alireza Jalili | Frontend Developer | React & Next.js Expert',
    description: 'Build performant, user-centric web applications with modern frontend technologies.',
    url: SITE_URL,
  },
};

const homeStructuredData = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: 'en',
      publisher: { '@id': `${SITE_URL}/#person` },
    },
    {
      '@type': 'Person',
      '@id': `${SITE_URL}/#person`,
      name: SITE_NAME,
      url: SITE_URL,
      image: `${SITE_URL}/images/avatar.jpg`,
      jobTitle: 'Frontend Developer',
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(homeStructuredData).replace(/</g, '\\u003c'),
        }}
      />
      <LandingBannerSection />
      <ExperienceSliderSection />
      <RoutinBanner />
      <TechnologiesSection />
    </>
  );
}
