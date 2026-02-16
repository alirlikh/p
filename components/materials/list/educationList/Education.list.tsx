import { IEducation } from "@/data";
import EducationCard from "../../card/educationCard/education.card";
import { getEducation } from "@/data/server/getEducation";

const EducationList = async () => {
  const educations = await getEducation();

  return (
    <>
      {educations?.map((education: IEducation, index: number) => (
        <EducationCard key={education.id} education={education} index={index} />
      ))}
    </>
  );
};
export default EducationList;
