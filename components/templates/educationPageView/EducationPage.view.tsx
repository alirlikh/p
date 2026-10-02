import EducationCardSkeleton from "@/components/materials/skeleton/EducationCardSkeleton";
import EducationList from "@/components/materials/list/educationList/Education.list";
import { Suspense } from "react";


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
