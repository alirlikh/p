import Loader from "@/components/materials/loader/Loader";
import ExperiencePageBanner from "../experiencePageBanner/ExperiencePageBanner";
import { lazy, Suspense } from "react";

const ExperineceList = lazy(
  () => import("@/components/materials/list/experienceList/Experience.list"),
);

const ExperiencePageView = () => {
  return (
    <section className="p-4 px-8 md:px-12">
      <div className="flex flex-col items-center ">
        <ExperiencePageBanner />
        <Suspense fallback={<Loader />}>
          <ExperineceList />
        </Suspense>
      </div>
    </section>
  );
};
export default ExperiencePageView;
