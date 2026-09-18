"use client";
import React, { FC, useState } from "react";
import { Container } from "@/components/Container";
import { Swiper, SwiperSlide } from "swiper/react";
import { SchoolList } from "@/api/schools";
import Link from "next/link";
import "swiper/swiper-bundle.css";
import Image from "next/image";
import { SITE_NAME } from "@/constants";
import { toTitleCase } from "@/helpers/functions";
import { formatClassRange } from "@/helpers/classFormat";

type FeaturedSchoolsProps = {
  schools?: SchoolList[];
};
const FeaturedSchools: FC<FeaturedSchoolsProps> = ({ schools }) => {
  const [my_swiper, set_my_swiper] = useState<any>({});

  const handlePrevButtonClick = () => {
    my_swiper.slidePrev();
  };

  const handleNextButtonClick = () => {
    my_swiper.slideNext();
  };
  return (
    <Container>
      <div className="flex flex-row items-center justify-between  py-4 pb-0  md:py-14">
        <div className="py-6 font-rubik md:py-0">
          <h3 className=" text-blacky-light font-bold  text-xl md:text-3xl lg:text-4xl ">
            Featured <span className="text-greenish-light">Schools</span>
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
          <div className="swiper-pagination"></div>

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
        pagination={{ el: ".swiper-pagination", type: "bullets" }}
        spaceBetween={40}
        slidesPerView={1}
        breakpoints={{
          420: { slidesPerView: 1.5, spaceBetween: 40 },
          620: { slidesPerView: 2, spaceBetween: 40 },
          920: { slidesPerView: 2.5, spaceBetween: 40 },
          1010: { slidesPerView: 3.5, spaceBetween: 20 },
        }}
      >
        {schools?.map((school) => (
          <SwiperSlide className="pb-8" key={school._id}>
            <Link href={`/school/${school.slug}`}>
              <div
                className={`bg-white border overflow-hidden w-full shadow-xl rounded-md `}
              >
                <div
                  className="  aspect-[16/9] w-full relative
                hover:scale-105 transition duration-500
               "
                >
                  <Image
                    src={
                      school.images[0] ??
                      "https://cdn.Education Portal.com/public/school-images/Welham_Boys_School_1705126856967.jpg"
                    }
                    className=" object-cover "
                    alt={`${toTitleCase(school.name)} | ${SITE_NAME}`}
                    fill
                    // Cap the requested CDN image to the card's real width
                    // instead of the default 100vw (which pulled 1200/1920px
                    // files — the "Images Over 150 Kb" audit finding).
                    sizes="(max-width: 420px) 90vw, (max-width: 920px) 45vw, 320px"
                  />
                </div>
                <div className="p-3 md:p-4 w-full">
                  <h4 className=" text-lg font-bold truncate text-black ">
                    {toTitleCase(school.name)}
                  </h4>
                  <p className="text-sm  text-gray-700 my-2 capitalize">
                    {school.type?.map((type) => type.name).toString()}
                  </p>
                  <p className="text-sm  text-gray-700 flex gap-2 items-center  capitalize">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      width={15}
                      height={15}
                    >
                      <path
                        d="M12 20.8995L16.9497 15.9497C19.6834 13.2161 19.6834 8.78392 16.9497 6.05025C14.2161 3.31658 9.78392 3.31658 7.05025 6.05025C4.31658 8.78392 4.31658 13.2161 7.05025 15.9497L12 20.8995ZM12 23.7279L5.63604 17.364C2.12132 13.8492 2.12132 8.15076 5.63604 4.63604C9.15076 1.12132 14.8492 1.12132 18.364 4.63604C21.8787 8.15076 21.8787 13.8492 18.364 17.364L12 23.7279ZM12 13C13.1046 13 14 12.1046 14 11C14 9.89543 13.1046 9 12 9C10.8954 9 10 9.89543 10 11C10 12.1046 10.8954 13 12 13ZM12 15C9.79086 15 8 13.2091 8 11C8 8.79086 9.79086 7 12 7C14.2091 7 16 8.79086 16 11C16 13.2091 14.2091 15 12 15Z"
                        fill="currentColor"
                      ></path>
                    </svg>
                    {school.city?.city}
                  </p>
                  <div className="flex items-center gap-2 md:gap-6  justify-between ">
                    <div className="md:w-full ">
                      <p className="text-xs  text-gray-700 my-1 ">
                        Classes Offered
                      </p>
                      <p className="text-xs md:text-md  text-black w-full whitespace-nowrap ">
                        {formatClassRange(school.classFrom, school.classTo)}
                      </p>
                    </div>
                    <div className="md:w-full">
                      <p className="text-xs w-full text-gray-700 my-1">
                        Min Fees
                      </p>
                      <p className="text-xs md:text-md  text-black ">
                        {/* Add a period label so parents can compare fees
                            meaningfully — a bare "₹1,833" vs "₹8,50,000" with no
                            unit was flagged as confusing/misleading. */}
                        {school.minFees
                          ? `₹ ${school.minFees}/yr`
                          : "On request"}
                      </p>
                    </div>
                    <div className="md:w-full">
                      <p className="text-xs w-full text-gray-700 my-1">Board</p>
                      <p className="text-xs md:text-md  text-black whitespace-nowrap ">
                        {/* Normalize board formatting: trim each name and join
                            with a single ", " so records read consistently
                            (e.g. "ICSE, State Board" not " ICSE/STATE BOARD"). */}
                        {school?.schoolBoards
                          ?.map((board) => board.name?.trim())
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </Container>
  );
};

export default FeaturedSchools;
