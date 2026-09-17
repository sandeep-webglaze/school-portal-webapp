"use client";
import React, { FC, useState } from "react";
import { Container } from "../Container";
import { ICity } from "@/api/HomePage";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import Image from "next/image";
import { SITE_NAME } from "@/constants";

type PopularCities = {
  cities?: ICity[];
};
const PopularCities: FC<PopularCities> = ({ cities }) => {
  const [my_swiper, set_my_swiper] = useState<any>({});

  const handlePrevButtonClick = () => {
    my_swiper.slidePrev();
  };

  const handleNextButtonClick = () => {
    my_swiper.slideNext();
  };
  return (
    <div className="bg-grayish-light">
      <Container bgColor="bg-grayish-light md:pt-1 pb-4 " maxWidth="max-w-6xl ">
        <div className="flex flex-row items-center justify-between  py-4 pb-0  md:py-14">
          <div className="py-6 font-rubik md:py-0">
            <h3 className=" text-blacky-light font-bold  text-xl md:text-3xl lg:text-4xl ">
              Explore Schools in{" "}
              <span className="text-greenish-light"> Top Cities</span>
            </h3>
          </div>
          <div className=" flex-row gap-4 flex ">
            <button
              className="grid md:h-10 md:w-20 w-10 h-7  bg-[#ededed] place-content-center rounded-full bg-grey50 text-black text-xl hover:bg-green-500 hover:text-white"
              aria-label="Previous"
              onClick={handlePrevButtonClick}
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth={0}
                viewBox="0 0 16 16"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"
                />
              </svg>
            </button>
            <button
              className="grid md:h-10 md:w-20 w-10 h-7  bg-[#ededed] place-content-center rounded-full bg-grey50 text-black text-xl hover:bg-green-500 hover:text-white"
              aria-label="Next"
              onClick={handleNextButtonClick}
            >
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth={0}
                viewBox="0 0 16 16"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                />
              </svg>
            </button>
          </div>
        </div>
        {/* <div className="mx-auto select-none mb-16 h-[2px] w-[90%] bg-white100 md:mb-24 false" /> */}
        <Swiper
          onInit={(ev: any) => {
            set_my_swiper(ev);
          }}
          pagination
          spaceBetween={40}
          slidesPerView={2}
          breakpoints={{
            420: { slidesPerView: 2.5, spaceBetween: 40 },
            620: { slidesPerView: 3.5, spaceBetween: 40 },
            920: { slidesPerView: 4.5, spaceBetween: 20 },
          }}
        >
          {cities?.map((city) => (
            <SwiperSlide className="pb-8" key={city._id}>
              <Link
                href={`/search/${city.slug}`}
                key={city._id}
                className="cursor-pointer border  rounded-xl shadow-xl hover:shadow-sm w-40 md:w-48 p-4 bg-white flex flex-col items-center justify-center"
              >
                <div className="w-16  h-16 md:w-24 md:h-[92px] relative filteredImage swiper-lazy">
                  <Image
                    src={city.icon}
                    alt={`Schools in ${city.city} | ${SITE_NAME}`}
                    fill
                    sizes="(max-width: 768px) 64px, 96px"
                  />
                </div>
                <h4 className=" font-semibold text-neutral-600 text-md p-2 capitalize">
                  {city.city}
                </h4>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </Container>
    </div>
  );
};

export { PopularCities };
