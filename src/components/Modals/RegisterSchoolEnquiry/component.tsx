"use client";
import React, { useState } from "react";
import { Modal } from "..";
import useRegisterSchoolEnq from "@/hooks/useRegisterSchoolEnq";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Heading } from "@/components/Heading";
import { Input } from "@/components/Input";
import { IRegisterSchoolReq, registerSchoolEnquiry } from "@/api/Enquiry";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const RegisterSchoolEnquiry = () => {
  const registerEnquiry = useRegisterSchoolEnq();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      school: "",
      phoneNumber: "",
      schoolAddress: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = (body) => {
    setIsLoading(true);
    registerSchoolEnquiry(body as IRegisterSchoolReq)
      .then((response) => {
        if (response?.data) {
          reset();
          registerEnquiry.onClose();
          toast.success("Enquiry Submitted Succcessfully");
          window.location.href = `/thank-you?name=register-form`;
        }
      })
      .catch((err) => {
        toast.error(err.error.message, { id: "registerSchoolEnqError1" });
      })
      .finally(() => setIsLoading(false));
  };

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Heading
        title="Register School"
        subtitle="Fill all details to submit your School Request!"
      />
      <div className="flex flex-col md:flex-row gap-2 ">
        <Input
          id="name"
          label="Name"
          type="text"
          disabled={false}
          register={register}
          errors={errors}
          required
        />
        <Input
          id="email"
          label="Email"
          type="email"
          disabled={false}
          register={register}
          errors={errors}
          required
        />
      </div>

      <Input
        id="phoneNumber"
        label="Phone Number"
        type="number"
        disabled={isLoading}
        register={register}
        errors={errors}
        required
      />
      <Input
        id="school"
        label="School Name"
        type="text"
        disabled={false}
        register={register}
        errors={errors}
        required
      />
      <textarea
        rows={2}
        id={"schoolAddress"}
        {...register("schoolAddress", { required: true })}
        placeholder="Enter School Address..."
        required={true}
        className={`block w-full px-4 leading-tight placeholder:text-[#808080] border border-neutral-300 rounded-lg bg-white  py-7   
          ${errors["schoolAddress"] ? "border-rose-500" : "border-neutral-300"}
          ${
            errors["schoolAddress"]
              ? "focus:border-rose-500"
              : "focus:border-black"
          } `}
        defaultValue={""}
      />
    </div>
  );

  return (
    <Modal
      disabled={isLoading}
      isOpen={registerEnquiry.isOpen}
      title="Register School"
      actionLabel="Submit"
      onClose={registerEnquiry.onClose}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      //   footer={footerContent}
    />
  );
};

export { RegisterSchoolEnquiry };
