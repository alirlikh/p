import ExperienceCardSkeleton from "@/components/materials/skeleton/ExperienceCardSkeleton";
import ExperiencePageBanner from "../experiencePageBanner/ExperiencePageBanner";
import ExperineceList from "@/components/materials/list/experienceList/Experience.list";
import { Suspense } from "react";


const ExperiencePageView = () => {
  return (
    <section className="p-4 px-8 md:px-12">
      <div className="flex flex-col items-center ">
        <ExperiencePageBanner />
        <Suspense fallback={
          <div className="w-full space-y-6">
            {Array(3).fill(0).map((_, i) => (
              <ExperienceCardSkeleton key={i} />
            ))}
          </div>
        }>
          <ExperineceList />
        </Suspense>
      </div>
    </section>
  );
};
export default ExperiencePageView;
