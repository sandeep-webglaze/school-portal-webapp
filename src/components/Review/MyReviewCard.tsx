import Link from "next/link";
import React, { FC } from "react";
import { Rating } from "../Rating";
import { MdDeleteOutline, MdOutlineEdit } from "react-icons/md";
import { MyReviewsResponse } from "@/api/CurrentUser";
import { toTitleCase } from "@/helpers/functions";
import Image from "next/image";

type ReviewCardProps = {
  review: MyReviewsResponse;
  onEdit: (review: MyReviewsResponse) => void;
  onDelete: (review: MyReviewsResponse) => void;
  key?: string;
};
const MyReviewCard: FC<ReviewCardProps> = ({
  review,
  onEdit,
  onDelete,
  key,
}) => {
  return (
    <div
      className="w-full  border space-y-4 rounded-xl px-5 py-7 shadow-xl md:w-[456px] h-[224px]  bg-white"
      key={key}
    >
      <div className="flex flex-row  items-center justify-between ">
        <div className="flex  items-center gap-2">
          <Link
            href={`/school/${review.schoolId.slug}`}
            className="h-14 w-14 translate-y-1 rounded-full overflow-hidden border "
          >
            <Image
              id="preview"
              src={review.schoolId.images[0] ?? "https://ui-avatars.com/..."}
              width={56}
              height={56}
              className="object-cover w-full h-full"
              loading="lazy"
              alt="profile-pic"
            />
          </Link>
          <div className="flex flex-col justify-center md:items-start items-center gap-2 mb-2">
            <Link
              href={`/school/${review.schoolId.slug}`}
              className="text-sm font-bold false hover:underline"
            >
              {toTitleCase(review.schoolId.name)}
            </Link>
            <Rating value={review.overallRating} />
          </div>
        </div>
        <div className="flex gap-2">
          <MdOutlineEdit
            className="text-green-500 hover:bg-gray-200 p-1 rounded cursor-pointer"
            size={30}
            onClick={() => onEdit(review)}
          />
          <MdDeleteOutline
            className="text-red-500 hover:bg-gray-200 p-1 rounded cursor-pointer"
            size={30}
            onClick={() => onDelete(review)}
          />
        </div>
      </div>
      <p className="  text-justify text-truncate  md:text-start">
        {review.review}
      </p>
    </div>
  );
};

export default MyReviewCard;
