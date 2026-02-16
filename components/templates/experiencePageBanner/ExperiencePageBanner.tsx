"use client";

import DownloadButton from "@/components/materials/button/downloadButton/Download.button";
import { motion } from "framer-motion";

const ExperiencePageBanner = () => {
  return (
    <motion.div
      className="flex flex-col items-center *:m-4 mb-16 text-center max-w-screen-md"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        delay: 0.1,
        duration: 0.7,
      }}
    >
      <p className="text-gray-300 text-center p-3 text-[24px] font-light leading-12 ">
        {"< "}Explore my frontend development journey, Each project represents a
        milestone in my growth, highlighting the technologies and challenges
        I&apos;ve encountered and the lessons I&apos;ve learned as a{" "}
        <span className="text-white text-[24px] font-bold  leading-12">
          Front-End Software Engineer {" />"}
        </span>
      </p>
      <DownloadButton />
    </motion.div>
  );
};
export default ExperiencePageBanner;
