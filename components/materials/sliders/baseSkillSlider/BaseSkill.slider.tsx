"use client"

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper/modules";
import { JsSliderIcon } from "../../icons/JsSlider.icon";
import { NextSliderIcon } from "../../icons/NextSlider.icon";
import { ReactSliderIcon } from "../../icons/ReactSlider.icon";

const BaseSkillSlider = () => {
  const imageSrc = [
    { src: JsSliderIcon, color: "#C3C99E" },
    { src: NextSliderIcon, color: "#C2C2C2" },
    { src: ReactSliderIcon, color: "#7D9CA5" },
  ];

  return (
    <Swiper
      breakpoints={{
        480: {
          slidesPerView: 1.2,
        },
        768: {
          slidesPerView: 2.2,
        },
      }}
      spaceBetween={20}
      pagination={{
        clickable: true,
      }}
      modules={[Pagination]}
      className="mySwiper"
      style={
        {
          //    "--swiper-pagination-color": "#FFBA08",
          //    "--swiper-pagination-bullet-inactive-color": "#999999",
          //    "--swiper-pagination-bullet-inactive-opacity": "1",
          //    "--swiper-pagination-bullet-size": "16px",
          //    "--swiper-pagination-bullet-horizontal-gap": "6px"
        }
      }
    >
      {imageSrc.map((item, index: number) => (
        <SwiperSlide key={index}>
          <div
            className="flex h-70 rounded-[60px] justify-start items-center p-10 *:m-3"
            style={{ backgroundColor: item.color }}
          >
            <item.src />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default BaseSkillSlider;
