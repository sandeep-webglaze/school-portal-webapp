"use client";
import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/swiper-bundle.css";
import "swiper/css";
import { Navigation, Pagination, Thumbs } from "swiper/modules";
import Image from "next/image";
import { Fancybox as NativeFancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";
import { userSlideType } from "@fancyapps/ui/types/Carousel/types";
import { CgMenuGridO } from "react-icons/cg";
import { Rating } from "../Rating";
import { Heading } from "../Heading";
import { FaAngleRight } from "react-icons/fa6";
import { toTitleCase } from "@/helpers/functions";

interface ListingHeadProps {
  title: string;
  locationValue: string;
  images: string[];
  id: string;
  rating: number;
}

const ListingHead: React.FC<ListingHeadProps> = ({
  title,
  locationValue,
  images,
  rating,
}) => {
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
  const [swiper, setSwiper] = useState<any>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  // Note: previously this used `useRef` + a `useEffect` keyed on `ref.current`
  // to wire up the swipers — but ref mutations don't trigger re-renders, so
  // the effect never fired reliably. Setting state directly in `onSwiper`
  // (below) is the idiomatic Swiper pattern and removes the bug.

  const handleImageClick = (img: string) => {
    const remainingImages: userSlideType[] = images
      .filter((item) => item !== img)
      .map((img) => ({ src: img, type: "image" }));
    return NativeFancybox.show(
      [{ src: img, type: "image" }, ...remainingImages],
      {}
    );
  };

  const handleSlideChange = (swiper: any) => {
    setActiveIndex(swiper.activeIndex);
  };

  return (
    <div className="swiper-container">
      <div className="flex flex-wrap justify-between pb-3">
        <Heading title={title} subtitle={locationValue} />
        <Rating value={rating} />
      </div>
      <div className="flex flex-col gap-5">
        <Swiper
          onSwiper={setSwiper}
          spaceBetween={10}
          slidesPerView={1}
          thumbs={{ swiper: thumbsSwiper }}
          pagination={{ clickable: true }}
          observer
          modules={[Navigation, Thumbs, Pagination]}
          className="h-[60vmin] w-full relative swiper-custom-pagination "
          onSlideChange={handleSlideChange}
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx + img} onClick={() => handleImageClick(img)}>
              <Image
                src={
                  img ??
                  "https://images.uniapply.com/uploads/college/image/500/2190/webp/Mira_Model_School_1325_Building_2.webp"
                }
                alt={`${toTitleCase(title)} - Image ${idx + 1}`}
                width={800}
                height={200}
                sizes="(max-width: 768px) 100vw, 800px"
                className="object-cover w-full h-full rounded cursor-pointer"
              />
            </SwiperSlide>
          ))}
          <button
            onClick={() => swiper?.slidePrev()}
            className="text-black  hover:text-white absolute bottom-[50%] top-[50%] z-10 left-6 w-[52px] h-[52px] rounded-full bg-white hover:bg-green-500 backdrop-blur items-center justify-center hidden md:flex stroke-white"
          >
            <FaAngleRight className="rotate-180 text-2xl" />
          </button>
          <button
            onClick={() => swiper?.slideNext()}
            className="text-black  hover:text-white absolute bottom-[50%] top-[50%] z-10 right-6 w-[52px] h-[52px] rounded-full bg-white hover:bg-green-500 backdrop-blur items-center justify-center hidden md:flex stroke-white"
          >
            <FaAngleRight className="text-2xl" />
          </button>
        </Swiper>
        <div className="items-start sm:max-w-[550px] max-w-[350px]">
          <Swiper
            onSwiper={setThumbsSwiper}
            slidesPerView={4}
            className="flex"
          >
            {images.map((img, idx) => (
              <SwiperSlide
                key={img + idx}
                className="w-full h-full justify-start"
              >
                <Image
                  src={
                    img ??
                    "https://images.uniapply.com/uploads/college/image/500/2190/webp/Mira_Model_School_1325_Building_2.webp"
                  }
                  alt={`${toTitleCase(title)} - thumbnail ${idx + 1}`}
                  width={150}
                  sizes="150px"
                  className={`object-cover  rounded sm:h-28 sm:w-28 h-16 w-20 cursor-pointer ${
                    idx === activeIndex ? "border-2 border-green-500" : ""
                  }`}
                  height={150}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export { ListingHead };