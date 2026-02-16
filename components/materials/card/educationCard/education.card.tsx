"use client";

import { IEducation } from "@/data";
import { motion } from "framer-motion";
import Link from "next/link";
import { FC } from "react";

export interface EducationCardProps {
  index: number;
  education: IEducation;
}

const EducationCard: FC<EducationCardProps> = ({ education, index }) => {
  const fadeInAnimationVariants = {
    initial: {
      opacity: 0,
      x: 100,
    },
    animate: (index: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.35 * index,
        duration: 0.7,
      },
    }),
  };
  return (
    <>
      <motion.div
        className="flex flex-col items-start py-4 my-8 md:py-6 px-6 border-2 border-gray-700 rounded-[40px] md:flex-row md:justify-between md:items-center md:mb-0 md:mt-12  max-w-screen-2xl mx-auto"
        variants={fadeInAnimationVariants}
        initial="initial"
        whileInView="animate"
        custom={index}
      >
        <div className="flex flex-col p-1 mx-4 *:p-1 *:pl-0">
          <h3 className="text-[20px] md:text-[28px] md:leading-10 font-semibold mt-2 mb-2 md:mb-3 leading-7">
            {education.degree + " of " + education.degreeTitle}
          </h3>
          <p className="text-purple-300  leading-6 text-[14px] md:text-[16px]">
            {education.college}
          </p>
          <span className="text-gray-400 text-[14px] md:text-[16px]">
            <time>
              {education.startTime} - {education.GraduateTime}
            </time>
          </span>
        </div>
        {education.certifcate && (
          <div className="text-green-300 p-3 text-[20px] leading-5 m-4 ">
            <Link href={"#"} passHref>
              View Certifcate
            </Link>
          </div>
        )}
      </motion.div>
    </>
  );
};
export default EducationCard;
