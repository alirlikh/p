'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpIcon } from '@/components/materials/icons/ArrowUp.icon';

function GoTop() {
  const [isVisible, setIsVisible] = useState<boolean>(false);

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  const jumpAnimation = useMemo(() => {
    return {
      y: [0, -10, 0, -10, 0],
      transition: {
        y: {
          duration: 0.7,
          ease: 'easeOut',
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
      className="fixed  bottom-22.75 right-8 md:left-auto md:right-16 z-50 "
    >
      <motion.button
        //@ts-expect-error to ignore motion typecheck
        whileHover={jumpAnimation}
        onClick={scrollToTop}
        aria-label="Back to top"
        className="w-12 h-12 md:h-14 md:w-14 rounded-full bg-gray-scale/80 backdrop-blur-xl"
      >
        <span className="text-purple-300 ">
          <ArrowUpIcon className="w-8 h-8 md:h-12 md:w-12 mx-auto" color={'#bf84fc'} />
        </span>
      </motion.button>
    </motion.div>
  );
}
export default GoTop;
