import { FC } from "react";
import { SearchBar } from "../SearchBar";
import { HomePageSlug, ICity } from "@/api/HomePage";
import Image from "next/image";
import { SITE_NAME } from "@/constants";

const IMAGES = [
  {
    src: "/banner-bg.png",
    alt: `Best Schools in Dubai\n2026-27 Find, Compare & Get Free Guidance | ${SITE_NAME} `,
    tag: "Best Schools in Dubai\n2026-27 Find, Compare & Get Free Guidance",
    des: "Explore verified schools across Dubai. Search by area, curriculum, fees and type. Get free expert guidance to find the perfect school for your child — CBSE, ICSE, IB, IGCSE and British curriculum.",
  },
];

type BannerProps = {
  citiesList?: ICity[];
  schoolTypeList?: HomePageSlug[];
};

const Banner: FC<BannerProps> = (props) => {
  const carouselImage = 0;
  return (
    <div className="w-full h-[80vmin] md:h-[65vmin] relative">
      <div
        className="flex flex-col justify-center items-center"
        key={IMAGES[carouselImage].src}
      >
        <div className="w-screen absolute top-0 h-[80vmin] md:h-[65vmin] z-10"></div>
        <div className="w-screen drop-shadow  absolute top-0 h-[80vmin] md:h-[65vmin] z-10 "></div>
        <div className=" w-screen  -z-50 h-[80vmin] md:h-[65vmin] ">
          <Image
            priority
            fetchPriority="high"
            className="object-cover object-bottom"
            alt={IMAGES[carouselImage].alt}
            src={IMAGES[carouselImage].src}
            placeholder="blur"
            blurDataURL="/banner-bg.png"
            width={1920}
            height={1080}
            sizes="100vw"
            quality={70}
          />
        </div>
        <div className="z-20 absolute  text-white text-center w-[90%] md:w-[80%] xl:w-[53%]  ">
          <h1 className="whitespace-pre-line capitalize md:text-3xl xl:text-4xl max-sm:text-xl p-3 font-bold drop-shadow-2xl">
            {IMAGES[carouselImage].tag}
          </h1>
          <p className="text-[12px] md:text-sm xl:text-base md:mt-2 max-w-2xl m-auto   font-semibold ">
            {IMAGES[carouselImage].des}
          </p>
          <div className="mt-4 md:mt-6 md:px-6 ">
            <SearchBar {...props} />
          </div>
        </div>
      </div>
    </div>
  );
};


export { Banner };
