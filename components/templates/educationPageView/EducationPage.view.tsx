import { lazy, Suspense } from "react";

const EducationList = lazy(
  () => import("@/components/materials/list/educationList/Education.list"),
);

const EducationPageView = () => {
  return (
    <section className="px-10">
      <Suspense>
        <EducationList />
      </Suspense>
    </section>
  );
};
export default EducationPageView;
