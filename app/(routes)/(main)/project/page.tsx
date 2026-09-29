import Loader from "@/components/materials/loader/Loader";
import { lazy, Suspense } from "react";

const ProjectPageView = lazy(
  () => import("@/components/templates/projectPageView/ProjectPage.view"),
);

const page = () => {
  return (
    <Suspense fallback={<Loader />}>
      <ProjectPageView />
    </Suspense>
  );
};
export default page;
