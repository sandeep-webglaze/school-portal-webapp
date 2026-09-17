"use client";
import { Button } from "@/components/Button";
import { Container } from "@/components/Container";
import { ColoredHeading } from "@/components/Heading";
import React, { Fragment } from "react";
import Image from "next/image";
import { CLAIM_SCHOOL_URL, SITE_NAME } from "@/constants/client";
import { TbArrowBadgeRightFilled } from "react-icons/tb";

const ClaimSchoolContent = () => {
  const handleRedirect = () => {
    window.open(CLAIM_SCHOOL_URL, "_blank");
  };

  return (
    <Fragment>
      <Container bgColor="flex flex-col !py-2">
        <div className="flex flex-col-reverse md:flex-row items-center  m-auto ">
          <div className="max-w-2xl leading-loose">
            {/* Page-level H1 — added because Screaming Frog flagged
                /claim-school under "H1: Missing". The page previously only
                had <h2> (ColoredHeading) and <h3> elements, so Google had
                no main-topic signal and fell back to the meta title. */}
            <h1 className="text-3xl md:text-4xl xl:text-5xl font-bold text-slate-800 mb-2">
              Claim Your School on EdHippo Academy
            </h1>
            <ColoredHeading
              greenText={"EDHIPPO ACADEMY PRIVATE LIMITED"}
              title={"Surpass Your Enrollment Goals with"}
            />
            <p className="text-neutral-500 my-4 text-base ">
              EDHIPPO ACADEMY PRIVATE LIMITED streamlines school admissions,
              fostering growth and diversity while preserving valuable resources
              for teaching and learning excellence.
            </p>
            <Button label="Claim Now" onClick={handleRedirect} />
          </div>
          <div>
            <Image
              src="https://img.freepik.com/premium-vector/girl-with-business-plan-book_18660-504.jpg?w=500"
              priority
              fetchPriority="high"
              width={500}
              height={500}
              quality={100}
              alt={`CLAIM SCHOOL | ${SITE_NAME}`}
            />
          </div>
        </div>
      </Container>

      <div className="bg-grayish-light">
        <Container bgColor=" !py-6">
          <div className="flex flex-col md:flex-row items-center  justify-evenly  ">
            <div>
              <Image
                src="/images/page-ownership.webp"
                width={380}
                height={380}
                quality={100}
                alt={`Claim your School ownership | ${SITE_NAME}`}
              />
            </div>
            <div>
              <ColoredHeading
                greenText={"ownership"}
                title={"Claim your School"}
              />
              <div className="flex flex-col gap-1 mt-4">
                <Pointer text="Take control of your school's page on EDHIPPO ACADEMY PRIVATE LIMITED by claiming ownership." />
                <Pointer text="Earn the prestigious badge on your school profile." />
                <Pointer text="Directly manage and update your school's page." />
                <Pointer text="Keep parents informed of the latest school details." />
                <Pointer text="Streamline communication with parents through your managed school page." />
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container bgColor="!py-6">
        <div className="flex flex-col-reverse md:flex-row items-center  justify-evenly  ">
          <div>
            <ColoredHeading greenText={"account"} title={"Sign in to your"} />
            <div className="flex flex-col gap-1 mt-4">
              <Pointer text="Keep info current by updating details through your account." />
              <Pointer text="Upload photos and videos effortlessly on your site." />
              <Pointer text="Take control of your wallet management." />
              <Pointer text="Update and view your profile with ease." />
            </div>
          </div>

          <div>
            <Image
              src="https://img.freepik.com/free-vector/login-concept-illustration_114360-4525.jpg?w=300&t=st=1707990672~exp=1707991272~hmac=8eaf77d7f265ede359587575ff80385a60cfffa84b588b0fcd7046c2d9f75780"
              width={300}
              height={300}
              alt={`Sign in to your account | ${SITE_NAME}`}
            />
          </div>
        </div>
      </Container>

      <div className="bg-grayish-light">
        <Container bgColor=" !py-6">
          <div className="flex flex-col md:flex-row items-center  justify-evenly  ">
            <div>
              <Image
                src="/images/leads.webp"
                width={350}
                height={350}
                alt={`Verified Leads | ${SITE_NAME}`}
                quality={100}
              />
            </div>
            <div>
              <ColoredHeading greenText={"Leads"} title={"Verified"} />
              <div className="flex flex-col gap-1 mt-4">
                <Pointer text="Access genuine leads verified by EDHIPPO ACADEMY PRIVATE LIMITED." />
                <Pointer text="Connect with parents actively seeking school information." />
                <Pointer text="Increase enrolment by reaching out to interested families." />
                <Pointer text="Target a specific audience to enhance your admissions process." />
                <Pointer text="Ensure the authenticity of potential students through verified leads." />
              </div>
            </div>
          </div>
        </Container>
      </div>
    </Fragment>
  );
};

export default ClaimSchoolContent;

function Pointer({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-x-2  ">
      <TbArrowBadgeRightFilled size={25} className="text-green-500" />
      <p className="text-base text-neutral-500">{text}</p>
    </div>
  );
}
