import ExperineceList from "@/components/materials/list/experinceList/Experience.list";
import ExperiencePageBanner from "../experiencePageBanner/ExperiencePageBanner";

const ExperiencePageView = () => {
  return (
    <section className="p-4 px-8 md:px-12">
      <ExperiencePageBanner />
      <ExperineceList />
    </section>
  );
};
export default ExperiencePageView;
