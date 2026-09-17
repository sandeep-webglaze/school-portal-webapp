import React, { FC } from "react";
import { Container } from "../Container";
import { ColoredHeading } from "../Heading";
import { HomePageSlug } from "@/api/HomePage";
import Link from "next/link";
import Image from "next/image";
import { SITE_NAME } from "@/constants";

type CategoryProps = {
  categories?: HomePageSlug[];
};
const Category: FC<CategoryProps> = ({ categories }) => {
  return (
    <section className=" bg-grayish-light">
      <Container bgColor="bg-grayish-light pt-0 pb-4 md:pt-0">
        <div className="p-4  md:px-8 py-6  bg-white rounded-xl max-w-max m-auto">
          <ColoredHeading
            title="Browse by"
            center
            subtitle="Choose the type of school that best fits your child's needs"
            greenText="Category"
          />
          <div className="grid grid-cols-2 lg:grid-cols-4 m-auto	 my-6 max-w-max ">
            <Link
              href={`/search/${
                categories?.find((cat) => cat.slug.includes("day-school"))
                  ?.slug ?? "all-schools"
              }`}
            >
              <div className="md:px-10 py-4 flex flex-col justify-center items-center  hover:shadow-lg rounded-lg">
                <Image
                  src={"/images/day-school.avif"}
                  loading="lazy"
                  width={160}
                  height={130}
                  quality={100}
                  alt={"Day School | " + SITE_NAME}
                  className=""
                />
                <h4 className={`my-1 text-sm md:text-xl font-bold p-2 mx-0  `}>
                  Day School
                </h4>
              </div>
            </Link>
            <Link
              href={`/search/${
                categories?.find((cat) => cat.slug.includes("boarding-school"))
                  ?.slug ?? "all-schools"
              }`}
            >
              <div className="md:px-10 py-4 flex flex-col justify-center items-center  hover:shadow-lg rounded-lg">
                <Image
                  src={"/images/boarding-school.avif"}
                  loading="lazy"
                  width={160}
                  height={130}
                  quality={100}
                  alt={"Boarding School | " + SITE_NAME}
                />
                <h4 className={`my-1  text-sm md:text-xl font-bold p-2 mx-0  `}>
                  Boarding School
                </h4>
              </div>
            </Link>

            <Link
              href={`/search/${
                categories?.find((cat) =>
                  cat.slug.includes("day-boarding-school")
                )?.slug ?? "all-schools"
              }`}
            >
              <div className="md:px-10 py-4 flex flex-col justify-center items-center  hover:shadow-lg rounded-lg">
                <Image
                  src={"/images/day-boarding.avif"}
                  loading="lazy"
                  width={160}
                  height={130}
                  quality={100}
                  alt={"Day Boarding | " + SITE_NAME}
                />
                <h4 className={`my-1  text-sm md:text-xl font-bold p-2 mx-0  `}>
                  Day Boarding
                </h4>
              </div>
            </Link>
            <Link
              href={`/search/${
                categories?.find((cat) => cat.slug.includes("play-school"))
                  ?.slug ?? "all-schools"
              }`}
            >
              <div className="md:px-10 py-4 flex flex-col justify-center items-center  hover:shadow-lg rounded-lg">
                <Image
                  src={"/images/play-school.avif"}
                  loading="lazy"
                  width={160}
                  height={130}
                  quality={100}
                  alt={"Play School | " + SITE_NAME}
                />
                {/* Label now matches the play-school image and the play-school
                    category slug. Previously this card showed the Play School
                    image but was labelled "Day Cum Boarding" and routed to the
                    unfiltered /search/all-schools fallback. */}
                <h4 className={`my-1  text-sm md:text-xl font-bold p-2 mx-0  `}>
                  Play School
                </h4>
              </div>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
};

export default Category;
