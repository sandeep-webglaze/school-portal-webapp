"use client";
import React, { FC, Fragment, useState } from "react";
import { ISchoolReview, deleteReview } from "@/api/schools";
import MyReviewCard from "./MyReviewCard";
import { MyReviewsResponse } from "@/api/CurrentUser";
import Deletephoto from "../Profile/DeletePhoto";
import useRatingModal from "@/hooks/useRatingModal";
import toast from "react-hot-toast";
import revalidateReviews from "@/actions/revalidate-reviews";
import { AddRatingForm } from "../Rating";

type MyReviewsListProps = {
  reviews: MyReviewsResponse[];
};
const MyReviewsList: FC<MyReviewsListProps> = ({ reviews }) => {
  const [selectedReview, setSelectedReview] = useState<MyReviewsResponse>();
  const ratingModal = useRatingModal();
  const [open, setOpen] = useState(false);

  const onEdit = (review: MyReviewsResponse) => {
    setSelectedReview(review);
    ratingModal.onOpen();
  };

  const onDelete = (review: MyReviewsResponse) => {
    setSelectedReview(review);
    setOpen(true);
  };
  return (
    <Fragment>
      {selectedReview && (
        <AddRatingForm
          schoolId={(selectedReview?.schoolId as any)?._id}
          review={selectedReview as unknown as ISchoolReview}
        />
      )}
      {open && (
        <Deletephoto
          open={() => setOpen(!open)}
          handleProfileImageChange={removeReview as any}
        />
      )}
      <div className={`grid grid-cols-1 xl:grid-cols-2  gap-6 mt-6 `}>
        {reviews?.map((review) => (
          <MyReviewCard
            review={review}
            onEdit={onEdit}
            key={review._id}
            onDelete={onDelete}
          />
        ))}
      </div>
    </Fragment>
  );

  function removeReview() {
    if (!selectedReview?._id) return;
    deleteReview(selectedReview._id)
      .then((res) => {
        if (res.data) {
          toast.success("Review Deleted Successfully");
          revalidateReviews();
        }
      })
      .catch((err) => {
        console.error("Error in Deleteing Review=>", err);
        toast.error(err.error.message, { id: "ReviewError1" });
      });
  }
};

export default MyReviewsList;
