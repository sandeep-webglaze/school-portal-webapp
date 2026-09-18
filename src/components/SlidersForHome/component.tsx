import React from "react";
import { Container } from "../Container";
import Image from "next/image";
import { SITE_NAME } from "@/constants";

const Slider = () => {
  const items = [
    {
      src: "/searchforhome.png",
      label: "Search School",
      width: 80,
      height: 80,
    },
    {
      src: "/visitschoolforhome.png",
      label: "Visit School",
      width: 80,
      height: 80,
    },
    {
      src: "/id-card.png",
      label: "Process Admission",
      width: 80,
      height: 80,
    },
    {
      src: "/students.png",
      label: "Start Your Journey",
      width: 80,
      height: 80,
    },
  ];

  return (
    <section className="">
      <Container bgColor=" pt-0 pb-4 md:pt-0">
        <div className="p-4  rounded-xl md:border border-0  ">
          {/* <ColoredHeading
            center
            subtitle="Secure Your Spot at Your Dream School in Just 4 Simple Steps!"
            greenText={""}
            title={""}
          /> */}
          <h3 className=" text-xl font-bold text-center">
            Secure Your Spot at Your Dream School in Just 4 Simple Steps!
          </h3>
          <div className="grid grid-cols-1 w-full  sm:grid-cols-2 lg:grid-cols-4 my-6 gap-4">
            {items.map(({ src, label, width, height }) => (
              <div
                key={label}
                className=" px-0  w-full md:px-10 py-4 flex flex-col items-center shadow-xl rounded-lg  hover:scale-105    transition duration-500 cursor-pointer"
              >
                <Image
                  src={src}
                  loading="lazy"
                  width={width}
                  height={height}
                  quality={75}
                  sizes="80px"
                  alt={`${label} | ${SITE_NAME}`}
                />
                <h4 className="my-1 text-xl  p-2">{label}</h4>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Slider;
