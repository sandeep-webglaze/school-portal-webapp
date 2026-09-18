import React from "react";
import { Container } from "../Container";
import Link from "next/link";

const Welcome_Page = () => {
  return (
    <section className="bg-grayish-light ">
      <Container bgColor="bg-grayish-light">
        <div className="text-center space-y-3 sm:space-y-6  ">
          {/* H2 made unique — the old "Welcome To Edhippo" duplicated the H2 on
              /about, which the audit flagged as a duplicate-H2 issue. */}
          <h2 className=" text-blacky-light font-bold  text-xl md:text-3xl lg:text-4xl ">
            Find the Right School with{" "}
            <span className="text-greenish-light">EdHippo</span>
          </h2>
          <p className="text-sm sm:text-base  md:text-lg ">
            EdHippo Academy Private Limited is your trusted partner in finding
            the{" "}
            <Link href={"search/boarding-schools-in-india"}>
              <span className="font-semibold text-green-500">
                best boarding schools in India.{" "}
              </span>{" "}
            </Link>
            Whether you&apos;re looking for top-ranked{" "}
            <Link href={"search/boarding-schools-in-mumbai"}>
              <span className="text-green-500 font-medium">
                boarding schools in Mumbai,{" "}
              </span>
            </Link>
            academically excellent{" "}
            <Link href={"search/boarding-schools-in-delhi"}>
              <span className="text-green-500 font-medium">
                boarding schools in Delhi,
              </span>
            </Link>
            or holistic development-focused{" "}
            <Link href={"search/boarding-schools-in-hyderabad"}>
              <span className="text-green-500 font-medium">
                boarding schools in Hyderabad,{" "}
              </span>{" "}
            </Link>
            we’re here to guide you.
          </p>

          {/* Day-school links added to balance the messaging — the homepage
              markets both day and boarding schools, but this section only
              linked to boarding schools before. */}
          <p className="text-sm sm:text-base  md:text-lg ">
            Prefer a day school? Explore{" "}
            <Link href={"search/day-schools"}>
              <span className="font-semibold text-green-500">
                the best day schools in India,{" "}
              </span>
            </Link>
            including{" "}
            <Link href={"search/day-schools-in-delhi"}>
              <span className="text-green-500 font-medium">
                day schools in Delhi,{" "}
              </span>
            </Link>
            <Link href={"search/day-schools-in-mumbai"}>
              <span className="text-green-500 font-medium">
                day schools in Mumbai,{" "}
              </span>
            </Link>
            and{" "}
            <Link href={"search/day-schools-in-hyderabad"}>
              <span className="text-green-500 font-medium">
                day schools in Hyderabad.
              </span>
            </Link>
          </p>

          <p className="text-sm sm:text-base  md:text-lg  leading-relaxed">
            Our platform offers curated listings, expert admission advice, and
            personalized support to help parents and students choose the right
            day or boarding school that fits their goals. Start your journey
            with EdHippo today and explore India&apos;s most reputable
            educational institutions.
          </p>
        </div>
      </Container>
    </section>
  );
};

export default Welcome_Page;
