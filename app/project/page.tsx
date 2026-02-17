import { lazy, Suspense } from "react";

const ProjectPageView = lazy(
  () => import("@/components/templates/projectPageView/ProjectPage.view"),
);

const page = () => {
  return (
    <Suspense>
      <ProjectPageView />
    </Suspense>
  );
};
export default page;
