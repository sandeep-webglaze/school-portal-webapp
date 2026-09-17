"use client";
import React, { FC } from "react";
import { ISchoolReview } from "@/api/schools";
import { AddRatingForm, Rating } from "../Rating";
import Avatar from "../Avatar";
import { formatDate } from "@/helpers";

type ReviewsProps = {
  reviews: ISchoolReview[];
  ratings: {
    avgRating: number;
    avgAcademicsRating: number;
    avgAddmissionRating: number;
    avgExtracurriclarRating: number;
    avgInfrastructureRating: number;
  };
  schoolId: string;
};
const Reviews: FC<ReviewsProps> = ({ reviews, ratings, schoolId }) => {
  return (
    <>
      {ratings.avgRating > 0 && (
        <div className="flex flex-col gap-4 bg-grayish-light rounded-2xl p-6 my-4 border shadow-lg">
          <p className="font-semibold text-2xl "> Rating Summary </p>
          <div className="flex gap-4 items-center">
            <p className="text-3xl font-extrabold text-[#ffc107]">
              {ratings.avgRating}
            </p>
            <Rating value={ratings.avgRating} size={30} />
          </div>
          <p className="text-base">
            How would you rate your overall experience with this school ?
          </p>
          <div className=" grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            <div className="flex items-center justify-between border-b">
              <p className="text-base">Infrastructure</p>
              <Rating value={ratings.avgInfrastructureRating} />
            </div>
            <div className="flex items-center justify-between border-b">
              <p className="text-base">Academics</p>
              <Rating value={ratings.avgAcademicsRating} />
            </div>
            <div className="flex items-center justify-between border-b">
              <p className="text-base">Administration</p>
              <Rating value={ratings.avgAddmissionRating} />
            </div>
            <div className="flex items-center justify-between border-b">
              <p className="text-base">Extracurricular</p>
              <Rating value={ratings.avgExtracurriclarRating} />
            </div>
          </div>
        </div>
      )}

      <div className="my-4">
        <p className="font-bold text-xl py-2">Write a review</p>
        <AddRatingForm schoolId={schoolId} />
      </div>

      <ul className="">
        {reviews.map((review) => (
          <li key={review._id} className="py-4 text-left border-b ">
            <div className="flex items-start">
              <Avatar border src={review.user?.imageUrl} />
              <div className="ml-3">
                <Rating value={review.overallRating} />
                <p className="mt-2 text-sm font-bold text-gray-900">
                  {review?.user?.name ?? "Unknown"}
                </p>
                <p className="mt-2 text-base text-gray-900">{review.review}</p>
                <p className="mt-2 text-sm text-gray-600">
                  {formatDate(review.createdAt)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  );
};

export default Reviews;