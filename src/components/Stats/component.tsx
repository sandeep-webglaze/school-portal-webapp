import { SITE_NAME } from "@/constants";
import Image from "next/image";
import React from "react";

const StatsCounter = () => {
  return (
    <div
      className="mx-auto text-white py-2 bg-green-500"
      style={{ backgroundImage: "url(/about.png)" }}
    >
      <div
        role="list"
        aria-label="Our stats."
        className="grid grid-cols-2  xl:grid-cols-4 max-w-[1450px] mx-auto"
      >
        <div className="flex   justify-center items-center w-full lg:border-r border-gray-300 py-2">
          <div className="w-12 md:w-20 h-12 md:h-20 relative ">
            <Image
              src="/about.png"
              alt={`SCHOOLS LISTED | ${SITE_NAME}`}
              fill
              // Without `sizes`, a `fill` image defaults to 100vw and Next pulls
              // the 3840px variant for a ~48-80px icon. Cap it to the real
              // rendered size.
              sizes="(max-width: 768px) 48px, 80px"
            />
          </div>

          <div className="w-1/2 pl-4 md:pl-8 ">
            <p className="font-bold  sm:text-lg md:text-3xl tracking-1px">
              1000+
            </p>
            <p className="text-[10px] whitespace-nowrap md:text-sm font-bold mt-1 md:mt-4 md:leading-8 tracking-wide">
              SCHOOLS LISTED
            </p>
          </div>
        </div>
        <div className="flex justify-center items-center w-full lg:border-r border-gray-300 py-2">
          <div className="w-12 md:w-20 h-12 md:h-20 relative ">
            <Image
              src="/about.png"
              alt={`SCHOOLS VISITS | ${SITE_NAME}`}
              fill
              sizes="(max-width: 768px) 48px, 80px"
            />
          </div>
          <div className="  w-1/2 pl-4 md:pl-8">
            <p className="font-bold sm:text-lg md:text-2xl lg:text-4xl tracking-1px">
              2000+
            </p>
            <p className="text-[10px] whitespace-nowrap md:text-sm font-bold mt-1 md:mt-4 md:leading-8 tracking-wide">
              SCHOOLS VISITS
            </p>
          </div>
        </div>

        <div className="flex justify-center items-center w-full lg:border-r border-gray-300 py-2">
          <div className="w-12 md:w-20 h-12 md:h-20 relative ">
            <Image
              src="/about.png"
              alt={`PARENTS SERVED | ${SITE_NAME}`}
              fill
              sizes="(max-width: 768px) 48px, 80px"
            />
          </div>

          <div className="  w-1/2 pl-4 md:pl-8">
            <p className="font-bold  sm:text-lg md:text-2xl lg:text-3xl">
              500+
            </p>
            <p className="text-[10px] whitespace-nowrap md:text-sm font-bold mt-1 md:mt-4 md:leading-8 tracking-wide">
              PARENTS SERVED
            </p>
          </div>
        </div>

        <div className="flex justify-center items-center w-full py-2">
          <div className="w-12 md:w-20 h-12 md:h-20 relative ">
            <Image
              src="/about.png"
              alt={`CITIES | ${SITE_NAME}`}
              fill
              sizes="(max-width: 768px) 48px, 80px"
            />{" "}
          </div>
          <div className=" w-1/2 pl-4 md:pl-8">
            <p className="font-bold sm:text-lg md:text-2xl lg:text-4xl tracking-1px">
              10+
            </p>
            <p className="text-[10px] whitespace-nowrap md:text-sm font-bold mt-1 md:mt-4 md:leading-8 tracking-wide">
              CITIES
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCounter;
