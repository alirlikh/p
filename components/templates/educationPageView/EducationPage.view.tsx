import EducationCardSkeleton from "@/components/materials/skeleton/EducationCardSkeleton";
import { lazy, Suspense } from "react";

const EducationList = lazy(
  () => import("@/components/materials/list/educationList/Education.list"),
);

const EducationPageView = () => {
  return (
    <section className="px-10">
      <Suspense fallback={
        <div className="w-full space-y-6">
          {Array(3).fill(0).map((_, i) => (
            <EducationCardSkeleton key={i} />
          ))}
        </div>
      }>
        <EducationList />
      </Suspense>
    </section>
  );
};
export default EducationPageView;
