"use client";

import ListingDescription from "./ListingDescription";
import { RiSchoolFill } from "react-icons/ri";
import { MdSchool } from "react-icons/md";
import { FaFlag } from "react-icons/fa";
import { PiStudentFill } from "react-icons/pi";
import { FaBuilding } from "react-icons/fa";
import { FaMoneyBill } from "react-icons/fa";
import { School } from "@/api/schools";
import Image from "next/image";
import { getImageUrl } from "@/helpers/image-url";
import { formatClassRange } from "@/helpers/classFormat";

interface ListingInfoProps {
  school: School;
}

const ListingInfo: React.FC<ListingInfoProps> = ({ school }) => {
  return (
    <div className="col-span-4 flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <div
          className="
            text-xl 
            font-bold
            flex 
            flex-row 
            items-center
            gap-2
          "
        >
          <p>School Details</p>
        </div>
        <div
          className="
        py-2
            items-center 
            text-black
            grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6
          "
        >
          <div className="flex gap-4 items-center text-black">
            <RiSchoolFill /> {school?.type.map((type) => type.name).toString()}
          </div>
          <div className="flex gap-4 items-center">
            <MdSchool />{" "}
            {school?.schoolBoards.map((board) => board.name).toString()}
          </div>
          <div className="flex gap-4 items-center">
            <FaFlag /> {school?.classification.name}
          </div>
          <div className="flex gap-4 items-center">
            <PiStudentFill /> {formatClassRange(school.classFrom, school.classTo)}
          </div>
          <div className="flex gap-4 items-center">
            <FaBuilding /> {school.establishmentYear}
          </div>
          <div className="flex gap-4 items-center">
            <FaMoneyBill /> {school?.minFees} to {school?.maxFees} /year
          </div>
        </div>
      </div>
      <hr />
      {school.about && school.about.trim() !== "" && (
        <div
          className="
        text-lg font-light text-neutral-500"
        >
          <p className="text-black font-bold  text-xl pb-4">About School</p>
          <ListingDescription about={school.about} />
        </div>
      )}
      <div id="school-facilities" className="">
        <p className="font-bold text-xl">Facilities</p>
        <div className="mt-1 mb-4 h-[1px] bg-slate-600 divider bg-opacity-[0.16] rounded "></div>
        <div className="flex flex-wrap gap-3">
          {school.facilities.map((facility, idx) => (
            <div
              key={idx}
              className=" flex items-center gap-2 shadow-md rounded-lg p-3 border"
            >
              <Image
                className="w-10 h-10"
                width={40}
                height={40}
                src={getImageUrl(facility.icon)}
                alt={`${facility.name} facility`}
              />
              <p className="text-xs font-bold">{facility.name}</p>
            </div>
          ))}
        </div>
      </div>
      <hr />
    </div>
  );
};

export { ListingInfo };