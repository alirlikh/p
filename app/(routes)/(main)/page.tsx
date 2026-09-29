import ExperienceSliderSection from '@/components/templates/experienceSliderSection/ExperienceSliderSection';
import LandingBannerSection from '@/components/templates/landingBannerSection/LandingBannerSection';
import RoutinBanner from '@/components/templates/routinBanner/RoutinBanner';
import TechnologiesSection from '@/components/templates/technologiesSection/TechnologiesSection';

export default function Home() {
  return (
    <>
      <LandingBannerSection />
      <ExperienceSliderSection />
      <RoutinBanner />
      <TechnologiesSection />
    </>
  );
}
