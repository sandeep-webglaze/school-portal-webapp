import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import { Rating } from "../component";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { IReview, ISchoolReview, addReview, editReview } from "@/api/schools";
import useRatingModal from "@/hooks/useRatingModal";
import useLoginModal from "@/hooks/useLoginModal";
import revalidateReviews from "@/actions/revalidate-reviews";
import toast from "react-hot-toast";
import action from "@/app/actions";
import { Button } from "@/components/Button";
import useAuthStore from "@/hooks/useUserState";
import { Modal } from "@/components/Modals";

interface AddRatingFormProps {
  schoolId: string;
  review?: ISchoolReview;
}
const AddRatingForm: FC<AddRatingFormProps> = ({ schoolId, review }) => {
  const ratingModal = useRatingModal();
  const loginModal = useLoginModal();
  const userStore = useAuthStore();
  const [selectedReview, setSelectedReview] = useState(review);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      academics: selectedReview?.academics ?? "",
      infrastructure: selectedReview?.infrastructure ?? "",
      addmission: selectedReview?.addmission ?? "",
      extracurriclar: selectedReview?.extracurriclar ?? "",
      overallRating: selectedReview?.overallRating ?? "",
      review: selectedReview?.review ?? "",
    },
  });

  useEffect(() => {
    if (review) {
      setSelectedReview(review);
      // Reset the form with new default values when selectedReview changes
      reset({
        academics: review.academics ?? "",
        infrastructure: review.infrastructure ?? "",
        addmission: review.addmission ?? "",
        extracurriclar: review.extracurriclar ?? "",
        overallRating: review.overallRating ?? "",
        review: review.review ?? "",
      });
    }
  }, [review, reset]);

  const academics = watch("academics");
  const infrastructure = watch("infrastructure");
  const addmission = watch("addmission");
  const extracurriclar = watch("extracurriclar");
  const overallRating = watch("overallRating");

  const setCustomValue = (id: string, value: any) => {
    setValue(id, value, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: true,
    });
  };

  const addRating: SubmitHandler<FieldValues> = (values) => {
    if (selectedReview) editRating(values);
    else {
      if (!userStore.isAuthenticated && !userStore.user)
        return loginModal.onOpen();
      addReview({ ...values, schoolId } as IReview)
        .then((response) => {
          if (response?.data) {
            ratingModal.onClose();
            toast.success("Review Added Successfully");
            action();
            revalidateReviews();
          }
          if (response?.error) {
            toast.error(response.error.message);
          }
          reset();
        })
        .catch((err) => {
          console.error("Error in Login", err);
          toast.error(err?.error?.message);
        });
    }
  };

  const BodyContent: FC<{ showSubmitBtn?: boolean }> = ({
    showSubmitBtn = true,
  }) => (
    <Fragment>
      <div className="flex flex-col md:flex-row  items-center  gap-4  my-2 ">
        <textarea
          rows={6}
          id={"review"}
          {...register("review", { required: true })}
          placeholder="Write a message..."
          required={true}
          className={`block w-full px-4 leading-tight text-gray-700 border-2 border-neutral-300 rounded-lg bg-white  py-7   
          ${errors["review"] ? "border-rose-500" : "border-neutral-300"}
          ${
            errors["review"] ? "focus:border-rose-500" : "focus:border-black"
          } `}
          defaultValue={""}
        />
        <div className="w-full space-y-4">
          <div className="flex items-center justify-between border-b">
            <p className="text-base">Over All Rating</p>
            <Rating
              value={overallRating}
              onChange={(value) => setCustomValue("overallRating", value)}
              edit
            />
          </div>
          <div className="flex items-center justify-between border-b">
            <p className="text-base">Infrastructure</p>
            <Rating
              value={infrastructure}
              onChange={(value) => setCustomValue("infrastructure", value)}
              edit
            />
          </div>
          <div className="flex items-center justify-between border-b">
            <p className="text-base">Academics</p>
            <Rating
              value={academics}
              onChange={(value) => setCustomValue("academics", value)}
              edit
            />
          </div>
          <div className="flex items-center justify-between border-b">
            <p className="text-base">Administration</p>
            <Rating
              value={addmission}
              onChange={(value) => setCustomValue("addmission", value)}
              edit
            />
          </div>
          <div className="flex items-center justify-between ">
            <p className="text-base">Extracurricular</p>
            <Rating
              value={extracurriclar}
              onChange={(value) => setCustomValue("extracurriclar", value)}
              edit
            />
          </div>
        </div>
      </div>

      {showSubmitBtn && (
        <Button
          label="Submit"
          disabled={
            !academics ||
            !overallRating ||
            !extracurriclar ||
            !addmission ||
            !infrastructure
          }
          onClick={handleSubmit(addRating)}
        />
      )}
    </Fragment>
  );

  if (selectedReview)
    return (
      <Modal
        isOpen={ratingModal.isOpen}
        title={review ? "Edit Review" : "Add Review"}
        actionLabel="Continue"
        onClose={ratingModal.onClose}
        onSubmit={handleSubmit(addRating)}
        body={<BodyContent showSubmitBtn={false} />}
      />
    );
  else return <BodyContent />;

  function editRating(values: any) {
    if (!selectedReview) return;
    editReview(selectedReview._id, { ...values, schoolId } as IReview)
      .then((response) => {
        if (response?.data) {
          ratingModal.onClose();
          toast.success("Review Edited Successfully");
          return revalidateReviews();
        }
        if (response?.error) {
          toast.error(response.error.message);
        }
      })
      .catch((err) => {
        console.error("Error in Login", err);
        toast.error(err?.error?.message);
      });
  }
};

export { AddRatingForm };
