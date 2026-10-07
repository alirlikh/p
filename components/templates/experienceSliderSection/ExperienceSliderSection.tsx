import BaseSkillSlider from '@/components/materials/sliders/baseSkillSlider/BaseSkill.slider';

const ExperienceSliderSection = () => {
  const date = new Date();
  return (
    <section className="container flex flex-col items-center my-10 md:flex-row md:justify-between mx-auto md:mt-12 ">
      <div className="flex items-center justify-center p-2 my-6 lg:w-[10%] md:basis-[20%] bg-[url('/images/Shadow.svg')] bg-no-repeat bg-center bg-cover  w-full mask-[radial-gradient(ellipse_at_center,black_45%,transparent_85%)]">
        <p className="flex flex-col md:text-start text-gray-400 text-[16px] font-normal text-center">
          + {date.getFullYear() - 2023} years
          <span className="text-white font-bold text-[80px] text-center p-1 leading-25">XP</span>
          developping
        </p>
      </div>
      <div className=" w-full md:w-[80%] p-8">
        <BaseSkillSlider />
      </div>
    </section>
  );
};
export default ExperienceSliderSection;
