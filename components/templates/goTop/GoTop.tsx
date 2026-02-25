"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpIcon } from "@/components/materials/icons/ArrowUp.icon";

function GoTop() {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const jumpAnimation = useMemo(() => {
    return {
      y: [0, -10, 0, -10, 0],
      transition: {
        y: {
          duration: 0.7,
          ease: "easeOut",
          repeat: 1,
        },
      },
    };
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
      transition={{ duration: 0.4 }}
      className="fixed bottom-5 md:bottom-16 md:left-auto right-16 z-50 "
    >
      <motion.button
        //@ts-expect-error to ignore motion typecheck
        whileHover={jumpAnimation}
        onClick={scrollToTop}
        aria-label="Back to top"
        className="w-16 h-16 rounded-full bg-gray-scale/80 backdrop-blur-xl"
      >
        <span className="text-purple-300">
          <ArrowUpIcon color={"#bf84fc"} />
        </span>
      </motion.button>
    </motion.div>
  );
}
export default GoTop;
