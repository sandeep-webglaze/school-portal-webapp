"use client";
import React, { FC, useState } from "react";
import { Modal } from "../BaseModal";
import { OTPInput } from "@/components/OtpFiels";
import { FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import {
  confirmVerificationEmail,
  confirmVerificationPhone,
} from "@/api/verifiction";
import { ErrorResponseSchema } from "@/api/types";
import { useRouter } from "next/router";
type VerificationProps = {
  type: "email" | "number";
  isOpen?: boolean;
  willClose?: boolean;
  onResendOtp: () => void;
  onVerifySuccess: (data: { email?: string; phoneNumber?: string }) => void;
  onClose: () => void;
  phoneNumber?: string;
  mail?: string;
};

const OtpModal: FC<VerificationProps> = ({
  type,
  isOpen,
  willClose = true,
  onResendOtp,
  onVerifySuccess,
  onClose,
  phoneNumber,
  mail,
}) => {
  const { watch, setValue, handleSubmit } = useForm<FieldValues>({
    defaultValues: {
      otp: "",
    },
  });
  const otp = watch("otp");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const handleChangeClick = () => {
    onClose();
  };
  const bodyContent = (
    <div className="py-2 md:px-4 ">
      <h2 className="text-lg font-semibold mb-2 ">
        {type === "email" ? "Email Verification" : "Phone Verification"}
      </h2>
      <div className="  ">
        <div className="pb-4">
          <p className=" text-sm  sm:text-base">
            {type === "number"
              ? `We have sent you an  otp on ${phoneNumber}`
              : `We have sent  you an otp on ${mail}`}
            &nbsp;
            <span
              onClick={handleChangeClick}
              className=" text-greenish-light text-left  hover:text-green-800 w-fit rounded  cursor-pointer"
            >
              Change
            </span>
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-2 pt-6 ">
        <p className="font-bold capitalize text-lg">One time Password</p>
        <OTPInput
          otp={otp}
          onChange={(otp: string) => setValue("otp", otp)}
          isDisabled={isLoading}
        />
        <div className="flex gap-2 flex-col sm:flex-row it">
          <button
            onClick={onResendOtp}
            className=" text-greenish-light text-left  hover:text-green-800  w-fit rounded  "
          >
            Resend OTP
          </button>
        </div>
      </div>
    </div>
  );

  const onSubmit = async (data: FieldValues) => {
    setIsLoading(true);
    try {
      const { otp } = data;
      if (type === "number" && phoneNumber) {
        await confirmVerificationPhone({ otp, phoneNumber: phoneNumber! }); // Backend
        toast.success("Phone number verified successfully");
      } else if (type === "email" && mail) {
        await confirmVerificationEmail({ otp, mail });
        toast.success("Email verified successfully");
      } else {
        throw new Error("Invalid verification type or missing data.");
      }
      onVerifySuccess({
        email: type === "email" ? mail : undefined,
        phoneNumber: type === "number" ? phoneNumber : undefined,
      });
      onClose();
    } catch (err: any) {
      toast.error(
        (err as ErrorResponseSchema).error?.displayMessage ??
          "Verification failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };
  const Title = "Verification";

  return (
    <Modal
      isOpen={isOpen}
      title={Title}
      actionLabel="Verify"
      willClose={willClose}
      large={false}
      onSubmit={handleSubmit(onSubmit)}
      onClose={onClose}
      body={bodyContent}
    />
  );
};

export { OtpModal };