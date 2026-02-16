import TechnologiesSlider from "@/components/materials/sliders/technologiesSlider/Technologies.slider";
import getTechnology from "@/data/server/getTechnologies";

const TechnologiesSection = async () => {
  const technologies = await getTechnology();

  return (
    <section className="mt-60 mb-20">
      <div className="md:my-16 my-9 sm:my-10 flex justify-center items-center  sm:text-[30px] md:text-[50px] text-[20px] text-center ">
        <h2 className="sm:max-w-[350px] md:max-w-[500px]  max-w-[300px] md:leading-[80px]">
          The technologies I’ve been using...
        </h2>
      </div>
      <TechnologiesSlider technologies={technologies} />
    </section>
  );
};
export default TechnologiesSection;
