"use client"

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import TechnologiesSliderCard from "../../card/technologiesSliderCard/TechnologiesSlider.card";
import { ITechnology } from "@/data";
import { FC } from "react";

export interface TechnologiesSliderProps {
  technologies: ITechnology[];
}

const TechnologiesSlider: FC<TechnologiesSliderProps> = ({ technologies }) => {
  return (
    <Swiper
      breakpoints={{
        480: {
          slidesPerView: 1.2,
        },
        768: {
          slidesPerView: 3.2,
        },
      }}
      spaceBetween={100}
      freeMode={true}
      loop={true}
      className="mySwiper"
    >
      <ul>
        {technologies?.map((slide: ITechnology) => (
          <SwiperSlide key={slide.id}>
            <TechnologiesSliderCard slide={slide} />
          </SwiperSlide>
        ))}
      </ul>
    </Swiper>
  );
};
export default TechnologiesSlider;
