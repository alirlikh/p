'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import TechnologiesSliderCard from '../../card/technologiesSliderCard/TechnologiesSlider.card';
import type { ITechnology } from '@/data';
import { FC } from 'react';
import { Autoplay } from 'swiper/modules';

export interface TechnologiesSliderProps {
  technologies: ITechnology[];
}

const TechnologiesSlider: FC<TechnologiesSliderProps> = ({ technologies }) => {
  return (
    <Swiper
      modules={[Autoplay]}
      autoplay={{
        delay: 2500,
        disableOnInteraction: false,
      }}
      slidesPerView="auto"
      spaceBetween={16}
      freeMode={true}
      loop={true}
      speed={1200}

      className="w-full! pt-2! [&_.swiper-slide]:transition-all
        [&_.swiper-slide]:duration-700
        [&_.swiper-slide]:ease-out
        [&_.swiper-slide]:opacity-60
        [&_.swiper-slide]:scale-90
        [&_.swiper-slide-active]:opacity-100
        [&_.swiper-slide-active]:scale-100"
    >
      <ul>
        {technologies?.map((slide: ITechnology) => (
          <SwiperSlide
            key={slide.id}
            className="w-full! md:w-auto! px-5! shadow-sm
              transition-all!
              duration-200!
              hover:-translate-y-2
              hover:shadow-xl"
          >
            <TechnologiesSliderCard slide={slide} />
          </SwiperSlide>
        ))}
      </ul>
    </Swiper>
  );
};
export default TechnologiesSlider;
