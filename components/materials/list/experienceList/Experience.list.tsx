import getExperience from "@/data/server/getExperience";
import ExperienceCard from "../../card/experienceCard/Experience.card";
import { IExperience } from "@/data";

const ExperineceList = async () => {
  const experiences = await getExperience();
  return (
    <>
      {experiences?.map((item: IExperience) => (
        <ExperienceCard key={item.id} experience={item} />
      ))}
    </>
  );
};
export default ExperineceList;
