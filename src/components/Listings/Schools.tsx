"use client";
import { SITE_NAME, VIEW_TYPE } from "@/constants";
import Link from "next/link";
import React, { FC, Fragment, useState } from "react";
import { MdOutlinePhone } from "react-icons/md";
import { GoLinkExternal } from "react-icons/go";
import { useRouter } from "next/navigation";
import useConfigStore from "@/hooks/useConfigStore";
import Image from "next/image";
import HeartButton from "../HeartButton";
import { Button } from "../Button";
import { sendShortListDetailsOnMail } from "@/api/shortlist";
import toast from "react-hot-toast";
import { ErrorResponseSchema } from "@/api/types";
import { SchoolList } from "@/api/schools/types";
import { formatClassRange } from "@/helpers/classFormat";
import { toTitleCase } from "@/helpers/functions";

type SchoolsProps = {
  view: VIEW_TYPE;
  schools: SchoolList[];
};

const Schools: FC<SchoolsProps> = ({ view, schools }) => {
  return (
    <Fragment>
      {schools.map((school, idx) => (
        <SchoolCard school={school} view={view} key={school._id} />
      ))}
    </Fragment>
  );
};

type SchoolCardProps = {
  school: SchoolList;
  view: VIEW_TYPE;
  sendMailBtn?: boolean;
  afterToggle?: (schoolId: string) => void;
};

export const SchoolCard: FC<SchoolCardProps> = ({
  school,
  view,
  afterToggle = () => {},
  sendMailBtn = false,
}) => {
  const { config } = useConfigStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(school.isFavorite);

  const handleToggle = () => {
    setIsFavorite((prev) => !prev);
    afterToggle(school._id);
  };
  return (
    <div
      key={school._id}
      className={`bg-white border overflow-hidden w-full ${
        view === VIEW_TYPE.LISTVIEW ? "md:flex" : ""
      } shadow-xl rounded-md `}
    >
      <div
        onClick={() => router.push(`/school/${school.slug}`)}
        className={`
                aspect-[16/9]  relative flex overflow-hidden
                 w-full
                ${view === VIEW_TYPE.LISTVIEW && "md:max-w-[33%]"}
                `}
      >
        <Image
          src={
            school.images[0] ??
            "https://images.uniapply.com/uploads/college/image/500/2190/webp/Mira_Model_School_1325_Building_2.webp"
          }
          width={600}
          height={600}
          // Cap the requested image to the card's real display width instead of
          // pulling the 1200px (2x) variant for a ~400px card — part of the
          // "Images Over 150 Kb" fix for the search listing.
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
          className="object-cover hover:scale-105 transition duration-500 cursor-pointer"
          alt={`${toTitleCase(school.name)} school photo | ${SITE_NAME}`}
        />
        <div
          className="
            absolute
            top-3
            right-3
          "
        >
          <HeartButton
            listingId={school._id}
            isFavorite={isFavorite}
            onToggle={handleToggle}
          />
        </div>
      </div>
      <div
        className={`p-3 md:p-4 w-full flex flex-col gap-y-2    
        ${view === VIEW_TYPE.LISTVIEW && "md:max-w-[67%]"} `}
      >
        <Link href={`/school/${school.slug}`}>
          <p className=" text-lg  font-bold text-neutral-700 truncate hover:underline ">
              {toTitleCase(school.name)}
          </p>
        </Link>

        <p className="text-sm  text-gray-500 flex gap-2 items-center  capitalize">
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
        <div className="flex items-center gap-2 md:gap-6 justify-between ">
          <div className="md:w-full">
            <p className="text-xs  text-gray-500 my-1 whitespace-nowrap">
              Classes Offered
            </p>
            <p className="text-xs md:text-md  text-black whitespace-nowrap">
              {formatClassRange(school.classFrom, school.classTo)}
            </p>
          </div>
          <div className="md:w-full">
            <p className="text-xs w-full text-gray-500 my-1 whitespace-nowrap">
              Min Fees
            </p>
            <p className="text-xs md:text-md  text-black whitespace-nowrap">
              ₹ {school.minFees}
            </p>
          </div>
          <div className="md:w-full">
            <p className="text-xs w-full text-gray-500 my-1 whitespace-nowrap">
              Board
            </p>
            <p className="text-xs md:text-md  text-black whitespace-nowrap capitalize">
              {school?.schoolBoards
                ?.map((board) => ` ${board.name}`)
                ?.toString()}
            </p>
          </div>
        </div>
        <hr className="border-[#ddd] mt-1" />
        <p className="text-sm  text-gray-500  capitalize truncate">
          {school.type?.map((type) => type.name).toString()}
        </p>
        <div className=" flex flex-col sm:flex-row sm:items-center justify-between ">
          {sendMailBtn ? (
            <Button
              small
              label={"Send Details "}
              onClick={sendMail}
              disabled={loading}
            />
          ) : (
            <div className="flex items-center  gap-x-2">
              <Link href={`/school/${school.slug}`}>
                <div className="p-1 rounded hover:bg-[#f7f7f7]">
                  {/* <GoLinkExternal size={16} className="text-gray-500 " /> */}

                  <button className="text-sm p-2 bg-black rounded hover:opacity-80 text-white font-[400] border-[1px] w-full">
                    <span className="flex items-center gap-1">
                      {" "}
                      <GoLinkExternal size={18} />
                      View school
                    </span>
                  </button>
                </div>
              </Link>
              <a
                href={`tel:${config?.contactUs.phoneNumber}`}
                target="_blank"
                className="p-1 rounded hover:bg-[#f7f7f7]"
              >
                {/* <MdOutlinePhone size={18} className="text-gray-500" /> */}

                <button className="text-sm p-2 bg-green-600 rounded hover:opacity-80 text-white font-[400] border-[1px] w-full">
                  <span className="flex items-center gap-1">
                    {" "}
                    <MdOutlinePhone size={18} />
                    Call now
                  </span>
                </button>
              </a>
              {/* <a
                href={`mailto:${config?.contactUs.mail}`}
                target="_blank"
                className="p-1 rounded hover:bg-[#f7f7f7]"
              >
                <MdOutlineMailOutline size={18} className="text-gray-500" />
              </a> */}
              {/* <a
                href={`mailto:${config?.contactUs.mail}`}
                target="_blank"
                className="p-1 rounded hover:bg-[#f7f7f7] hidden sm:flex"
              >
                <button className="text-sm p-2 bg-white rounded hover:opacity-80 text-black font-[400] border-[1px] border-black w-full">
                  <span className="flex items-center gap-1">
                    {" "}
                    <MdOutlineMailOutline size={18} />
                    Mail now
                  </span>
                </button>
              </a> */}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  function sendMail() {
    setLoading(true);
    sendShortListDetailsOnMail(school._id)
      .then((res) => {
        if (res.data) toast.success("Details Successfully Sent On Mail");
      })
      .catch((err: ErrorResponseSchema) => {
        console.error("err in sending mail==>", err);
        toast.error(err.error?.displayMessage ?? "Something Went Wrong!");
      })
      .finally(() => setLoading(false));
  }
};

export default Schools;