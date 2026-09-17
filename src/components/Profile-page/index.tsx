"use client";
import React, { Fragment, useState } from "react";
import Image from "next/image";
import { HiPencilAlt } from "react-icons/hi";
import useAuthStore from "@/hooks/useUserState";
import Deletephoto from "@/components/Profile/DeletePhoto";
import { updateUser } from "@/api/CurrentUser";
import toast from "react-hot-toast";
import { requestVerificationEmail, requestVerificationPhone } from "@/api/verifiction";
import { FieldValues, useForm } from "react-hook-form";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";

import { OtpModal, UploadModal } from "../Modals";
export default function Myprofile() {
  const store = useAuthStore();
  const user = store.user;

  const [email, setEmail] = useState(user?.mail ?? "");
  const [phoneNumber, setPhoneNumber] = useState(user?.phoneNumber ?? "");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      phoneNumber: user?.phoneNumber || "",
      email: user?.mail || "",
      name: user?.name || "",
    },
  });

  const [deletephoto, setDeletephoto] = React.useState(false);
  const [verificationType, setVerificationType] = React.useState<
    "email" | "number" | null
  >(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [otpModalOpen, setOtpModalOpen] = useState(false);
  const toggleUploadModal = () => {
    setUploadModalOpen(!uploadModalOpen);
  };

  const handleResendVerificationCode = () => {
    if (verificationType === "email") {
      sentOtp("email");
    } else if (verificationType === "number") {
      sentOtp("number");
    }
  };
  const changeStoreUserImage = (image?: string | null) => {
    if (user == null || image === undefined) return;
    const newUser = { ...user, imageUrl: image };
    store.setAuthStore({
      isAuthenticated: true,
      user: newUser,
    });
  };
  const onSubmit = async (data: FieldValues) => {
    try {
      await updateUser(data);
      toast.success("Profile updated successfully!");
    } catch (err: any) {
      console.error("Error updating profile:", err);
      toast.error(
        err.error?.displayMessage ??
          "Something went wrong while updating profile."
      );
    }
  };
  const handleVerifySuccess = () => {
    if (!store.user) return;
    store.setAuthStore({
      isAuthenticated: true,
      user: {
        ...store.user,
        phoneNumber:
          (verificationType === "number"
            ? phoneNumber
            : store.user?.phoneNumber) ?? "",
        mail: (verificationType === "email" ? email : store.user?.mail) ?? "",
      },
    });
    setVerificationType(null);
    setOtpModalOpen(false);
  };

  const isEmailValid = (email: string) => {
    const validation = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return validation.test(email);
  };
  return (
    <Fragment>
      <UploadModal
        handleProfileImageChange={changeProfileImage}
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
      {deletephoto && (
        <Deletephoto
          open={() => setDeletephoto((prev) => !prev)}
          handleProfileImageChange={changeProfileImage}
        />
      )}
      {otpModalOpen && verificationType && (
        <OtpModal
          mail={email}
          isOpen={otpModalOpen}
          phoneNumber={phoneNumber}
          type={verificationType}
          onClose={() => setOtpModalOpen(false)}
          onVerifySuccess={handleVerifySuccess}
          onResendOtp={handleResendVerificationCode}
        />
      )}

      <form
        className="w-full mt-8 md:mt-0 shadow-md lg:mx-20 border rounded-lg"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="p-4 bg-gray-100 border-t-2 border-green-500 rounded-lg bg-opacity-5">
          <div className="border-b">
            <div className="inline-flex items-center space-x-4">
              <div className="block relative rounded-full border">
                <Image
                  alt="profile"
                  src={user?.imageUrl ?? "/images/placeholder.webp"}
                  width={60}
                  height={60}
                  className="mx-auto object-cover rounded-full w-12 h-12"
                />
                <div className="top-[-15px] right-[-15px] absolute rounded-full bg-white p-1">
                  <HiPencilAlt
                    size="25"
                    color="green"
                    onClick={toggleUploadModal}
                    className="cursor-pointer"
                  />
                </div>
              </div>
              <h1 className="text-gray-600">{user?.name}</h1>
            </div>
          </div>
        </div>
        <div className="space-y-6 bg-white">
          <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
            <h2 className="max-w-sm mx-auto md:w-1/3">Name</h2>
            <div className="max-w-sm mx-auto md:w-2/3">
              <Input
                id="name"
                type="text"
                required
                register={register}
                errors={errors}
                label=""
              />
            </div>
          </div>
          <hr />
          <div className="items-center w-full p-4 space-y-4 text-gray-500">
            <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
              <h2 className="max-w-sm mx-auto md:w-1/3">Email</h2>
              <div className="max-w-sm mx-auto md:w-2/3">
                <Input
                  id="email"
                  type="email"
                  required
                  register={register}
                  errors={errors}
                  label=""
                  onChange={({ target }) => setEmail(target.value)}
                />
              </div>
            </div>
            {email !== user?.mail && isEmailValid(email) && (
              <div className="w-full flex justify-end mt-2">
                <Button
                  onClick={() => sentOtp("email")}
                  type="button"
                  label="Verify Email"
                />
              </div>
            )}
            <div className="items-center w-full p-4 space-y-4 text-gray-500 md:inline-flex md:space-y-0">
              <h2 className="max-w-sm mx-auto md:w-1/3">Phone No.</h2>
              <div className="max-w-sm mx-auto md:w-2/3">
                <Input
                  maxLength={10}
                  minLength={10}
                  id="phoneNumber"
                  type="number"
                  required
                  register={register}
                  errors={errors}
                  label=""
                  onChange={({ target }) => setPhoneNumber(target.value)}
                />
              </div>
            </div>

            {phoneNumber !== user?.phoneNumber && phoneNumber.length === 10 && (
              <div className="w-full flex justify-end mt-2">
                <Button
                  onClick={() => sentOtp("number")}
                  label="Verify Phone Number"
                />
              </div>
            )}
          </div>
          <hr />
          <div className="w-full px-4 pb-4 ml-auto text-gray-500 md:w-1/3">
            <Button label={"Save"} fullWidth type="submit" />{" "}
          </div>
        </div>
      </form>

    </Fragment>
  );

  async function sentOtp(type: "email" | "number") {
    try {
      if (type === "email") {
        await requestVerificationEmail({ mail: email });
        toast.success("Verification code sent to your E-mail", {
          id: "emailVerificationSuccess",
        });
      } else if (type === "number") {
        await requestVerificationPhone({ phoneNumber }); // Backend OTP

        toast.success("Verification code sent to your phone", {
          id: "phoneVerificationSuccess",
        });
      }

      setVerificationType(type);
      setOtpModalOpen(true);
    } catch (err: any) {
      console.error(`Error in requesting ${type} verification =>`, err);
      toast.error(
        err.error?.displayMessage ??
          `Something went wrong while requesting ${type} verification`,
        { id: `${type}VerificationError` }
      );
    }
  }

  async function changeProfileImage(image?: string | null) {
    try {
      const res = await updateUser({ imageUrl: image });
      if (!res.data) {
        toast.error("Something Went Wrong!", { id: "userImgError" });
      } else {
        toast.success("Profile image updated Successfully", {
          id: "userImgSuccess",
        });

        changeStoreUserImage(image);
      }
    } catch (err: any) {
      console.log("Err in Updating User=>", err);
      toast.error(err.error?.displayMessage ?? "Something Went Wrong!", {
        id: "userImgError",
      });
    }
  }
}