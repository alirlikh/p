"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function GoTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => {
      window.removeEventListener("scroll", toggleVisibility);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const jumpAnimation = {
    y: [0, -10, 0, -10, 0],
    transition: {
      y: {
        duration: 0.7,
        ease: "easeOut",
        repeat: 1,
      },
    },
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: isVisible ? 1 : 0, scale: isVisible ? 1 : 0.8 }}
        transition={{ duration: 0.4 }}
        className="fixed bottom-5 md:bottom-16 md:left-auto right-16 z-50 "
      >
        {isVisible && (
          <motion.button
            //@ts-ignore
            whileHover={jumpAnimation}
            onClick={scrollToTop}
            aria-label="Back to top"
            className="w-16 h-16 rounded-full bg-gray-scale/80 backdrop-blur-xl"
          >
            <span className="text-purple-300">
              {/* <ArrowUp color={"#bf84fc"} /> */}
            </span>
          </motion.button>
        )}
      </motion.div>
    </>
  );
}
export default GoTop;
