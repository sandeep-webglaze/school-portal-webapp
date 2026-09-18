"use client";
import { ICity } from "@/api/HomePage";
import { School, SchoolList, getSchoolDetailById } from "@/api/schools";
import { Container } from "@/components/Container";
import { CitySelect } from "@/components/LocationSelect";
import { SchoolSearch } from "@/components/SchoolSearch";
import { Fragment, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/Button";
import { SITE_NAME } from "@/constants";
import dynamic from "next/dynamic";

const CompareTable = dynamic(
  () => import("@/components/Compare Schools/component"),
  { ssr: false }
);

const MAX_SCOOL_TO_COMPARE = 2;

const CompareSchools = () => {
  const [city, setCity] = useState<ICity | null>(null);
  const [selectedSchool, setSlectedSchool] = useState<SchoolList | null>(null);
  const [schools, setSchools] = useState<School[]>([]);

  const isSchoolLimitReached = MAX_SCOOL_TO_COMPARE - 1 < schools.length;
  const isSelectedSchoolAlreadyInComparision =
    (selectedSchool ?? false) &&
    schools.some((school) => school._id == selectedSchool?._id);

  const getSchoolDetails = (schoolId?: string) => {
    if (!schoolId || isSchoolLimitReached) return;

    // dont add school which already present in the list
    if (schools.some((school) => school._id === schoolId)) return;

    getSchoolDetailById(schoolId).then((res) => {
      setCity(null);
      setSlectedSchool(null);
      setSchools([...schools, res.data] as School[]);
    });
  };

  const handleSchoolRemove = (schoolId?: string) => {
    if (schoolId && schools.length > 0) {
      // remove the school
      setSchools([...schools.filter((school) => school._id != schoolId)]);
    }
  };

  return (
    <Fragment>
      <div className="w-screen absolute top-30 md:h-[450px]  h-[250px]  bg-black opacity-30 z-10 "></div>
      <div className='bg-[url("/about.png")] bg-no-repeat bg-cover bg-right md:bg-center '>
        <Container bgColor="px-4  flex  items-center sm:px-8 lg:px-10 pt-10 md:pt-20 max-w-screen lg:w-screen md:h-[450px]  h-[250px]   ">
          <div className=" p-2 lg:p-6 max-w-sm lg:max-w-lg xl:max-w-2xl  ">
            {/* H1 was "Compare Schools" (15 chars). Lengthened with the
                primary keyword phrase so it ranks for "compare schools
                side by side" / "school comparison India" queries. */}
            <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl mt-10 z-20 absolute top-[20%] md:top-[25%] text-white">
              Compare <span className="text-greenish-light">Schools</span>{" "}
              Side by Side in India
            </h1>
          </div>
        </Container>
      </div>
      <Container>
        <div className=" items-center m-auto ">
          <div className=" max-w-md m-auto flex flex-col gap-2 md:gap-4 flex-grow item-center text-black border bg-white p-8 text-center shadow-lg rounded-lg">
            <div className=" m-auto p-8 text-green-500 text-6xl rounded-full  border-spacing-2 w-36">
              <Image
                src="/about.png"
                alt={"Add School | " + SITE_NAME}
                width={256}
                height={256}
              />
              <h2 className="text-sm w-full">Add School</h2>
            </div>
            <CitySelect
              isDisabled={isSchoolLimitReached}
              placeHolder="Select City"
              value={city == null ? undefined : city}
              onChange={function (value: ICity): void {
                setCity(value);
              }}
            />
            <SchoolSearch
              isDisabled={isSchoolLimitReached}
              city={city ?? undefined}
              value={selectedSchool == null ? undefined : selectedSchool}
              onChange={function (value: SchoolList): void {
                setSlectedSchool(value);
              }}
            />
            <Button
              label="Add"
              onClick={() => getSchoolDetails(selectedSchool?._id)}
              disabled={
                isSchoolLimitReached || isSelectedSchoolAlreadyInComparision
              }
            />
          </div>
        </div>
        {schools.length > 0 && (
          <CompareTable
            schools={schools}
            handleRemove={(school, index) => handleSchoolRemove(school._id)}
          />
        )}

        {/* Long-form explainer — Screaming Frog flagged /compare-schools as
            "Low Content" with 199 words. The page is mostly an interactive
            tool, so we add a short, useful primer below the tool that helps
            parents understand WHAT to compare and lifts the page over the
            200-word threshold without feeling spammy. */}
        <section
          className="max-w-4xl mx-auto mt-10 mb-6 prose prose-slate"
          aria-label="How to compare schools"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-4">
            How to compare schools the right way
          </h2>
          <p className="text-slate-600 leading-relaxed mb-4">
            Choosing a school is one of the biggest decisions a parent makes,
            and comparing two or three options side-by-side is the fastest way
            to see what really matters. EdHippo&apos;s comparison tool lines
            up two schools at a time across the criteria most Indian parents
            care about — board affiliation (CBSE, ICSE, IB or State), annual
            fee structure, classes offered, infrastructure, hostel facilities,
            location, and verified parent reviews — so you can decide on
            evidence instead of brochures.
          </p>
          <p className="text-slate-600 leading-relaxed mb-4">
            Start by shortlisting schools that share at least two of your
            non-negotiables (board, city, day vs boarding). Add them above,
            then look at the side-by-side row for fees first: a wider fee
            gap usually means one school is investing more in extracurriculars
            or smaller class sizes. Next, scan the facilities row to confirm
            the school offers what your child actually needs — sports
            programs, language labs, transport routes — rather than what looks
            impressive on a website. Finally, read the latest parent reviews
            on each school&apos;s detail page; reviews from the last 12 months
            are the most reliable signal of what daily life at the school is
            really like.
          </p>
          <p className="text-slate-600 leading-relaxed">
            If you&apos;re still unsure after the comparison, EdHippo&apos;s
            admission counsellors offer free guidance — they&apos;ll walk you
            through admission dates, eligibility, documents, and the
            application process for both schools so you can finalise with
            confidence.
          </p>
        </section>
      </Container>
    </Fragment>
  );
};

export default CompareSchools;
