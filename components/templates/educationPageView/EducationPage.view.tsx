import Loader from "@/components/materials/loader/Loader";
import { lazy, Suspense } from "react";

const EducationList = lazy(
  () => import("@/components/materials/list/educationList/Education.list"),
);

const EducationPageView = () => {
  return (
    <section className="px-10">
      <Suspense fallback={<Loader />}>
        <EducationList />
      </Suspense>
    </section>
  );
};
export default EducationPageView;
