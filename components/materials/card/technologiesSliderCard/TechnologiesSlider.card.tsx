import { ITechnology } from "@/data";
import Image from "next/image";
import { FC } from "react";

export interface TechnologiesSliderCardProps {
  slide: ITechnology;
}

const TechnologiesSliderCard: FC<TechnologiesSliderCardProps> = ({ slide }) => {
  return (
    <li
      className="flex flex-col items-start border-2 border-gray-700 rounded-xl px-7 pb-9 pt-6"
      key={slide.id}
    >
      <h3 className="p-3 mx-3 text-nowrap">{slide.name}</h3>
      <ul className="flex flex-col p-0 ml-3 *:my-1 *:p-1">
        {slide.items?.map((item, index: number) => (
          <li className="flex flex-row justify-start items-center " key={index}>
            <span className="bg-gray-700 rounded-full p-3 mr-5">
              <Image src={item.url} width={20} height={20} alt={item.name} />
            </span>
            {item.name}
          </li>
        ))}
      </ul>
    </li>
  );
};
export default TechnologiesSliderCard;
