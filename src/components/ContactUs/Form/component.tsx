"use client";
import { verifyCaptcha } from "@/actions/recaptcha";
import { EnquiryRequest, addEnquiry } from "@/api/Enquiry";
import { ICity } from "@/api/HomePage";
import { getSchoolTypes } from "@/api/schools";
import { Input } from "@/components/Input";
import { CitySelect } from "@/components/LocationSelect";
import useSchoolType from "@/hooks/useSchoolType";
import React, { useCallback, useEffect, useState } from "react";
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { SingleValue } from "react-select";
import Select from "react-select";
import { SCHOOL_CLASS_OPTIONS } from "@/helpers/classFormat";

const genderList = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Others", value: "other" },
];

// Includes Nursery, LKG, UKG and Class 1 – Class 12 so parents enquiring
// about pre-primary admissions can select the correct target class.
const classList = SCHOOL_CLASS_OPTIONS;

type IEnquiryFormProps = {
  border?: boolean;
  paddingLarge?: boolean;
  cardStyles?: boolean;
  title?: string;
  column?: number;
  name?: string;
  showTitle?: boolean;
};

const ContactForm = (props: IEnquiryFormProps) => {
  return (
    <GoogleReCaptchaProvider
      reCaptchaKey={"6Lck1WspAAAAANg2e-0R9EgBzxdgeLc1GyZcLTX0"}
      scriptProps={{
        async: true,
        defer: true,
        appendTo: "head",
        nonce: undefined,
      }}
    >
      <Form {...props} />
    </GoogleReCaptchaProvider>
  );
};

function Form({
  border = true,
  paddingLarge = true,
  cardStyles = true,
  column = 2,
  name,
  title,
  showTitle = true,
}: IEnquiryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const schoolTypeStore = useSchoolType();
  const { executeRecaptcha } = useGoogleReCaptcha();

  useEffect(() => {
    if (schoolTypeStore.schoolTypes !== null) return;
    getSchoolTypes()
      .then((res) => {
        if (res.data)
          schoolTypeStore.setSchoolType(
            res.data.map((type) => ({ label: type.name, value: type._id })),
          );
      })
      .catch((err) => console.error("Error in getting School Type=>", err));
  }, [schoolTypeStore]);

  const {
    register,
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      message: "",
      schoolType: "",
      city: "",
      class: "",
      gender: "",
      name: "",
      phoneNumber: "",
    },
  });
  const city = watch("city");
  const schoolType = watch("schoolType");
  const selectedClass = watch("class");
  const gender = watch("gender");

  const handleSumitForm = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }
    const gReCaptchaToken = await executeRecaptcha("enquiryFormSubmit").catch(
      (err) =>
        toast.error(err ?? "Something Went Wrong while Validating Captcha"),
    );
    console.log(gReCaptchaToken, "response Google reCaptcha server");
    return await verifyCaptcha(gReCaptchaToken).catch((err) =>
      toast.error(err ?? "Something Went Wrong while Validating Captcha"),
    );
    // `register` was previously listed but is never used inside this callback —
    // dropped to silence react-hooks/exhaustive-deps without changing behaviour.
  }, [executeRecaptcha]);

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    setIsLoading(true);
    const recaptchRes = await handleSumitForm();
    if (!recaptchRes) return;

    addEnquiry({
      ...values,
      city: values.city._id,
      pageUrl: window.location.href,
    } as EnquiryRequest)
      .then((response) => {
        if (response?.data) {
          reset();
          toast.success("Message Successfuly Sent", { id: "enquiry1" });
          window.location.href = `/thank-you?name=${name}`;
        }
        if (response?.error) {
          toast.error(response.error?.message, { id: "enquiryError1" });
        }
      })
      .catch((err) => {
        console.error("Error in Login", err);
        toast.error(err?.error?.message);
      })
      .finally(() => setIsLoading(false));
  };
  return (
    <div
      className={
        cardStyles
          ? ` bg-white  rounded-md shadow-md w-full 
      ${border && "border"} 
      ${paddingLarge ? "px-8 py-8" : "p-4"}
      `
          : ""
      }
    >
      <form
        name={name}
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        {showTitle && (
          <div className="mb-6">
            <p
              className={`text-xl font-bold text-neutral-700 capitalize ${
                title && "text-center"
              }`}
            >
              {title ?? "Find the Best School for Your Child"}
            </p>
          </div>
        )}
        <div className={` gap-3 grid grid-cols-1 md:grid-cols-${column}  `}>
          <Input
            id="name"
            label="Full Name"
            type="text"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <Input
            id="email"
            label="Email"
            type="text"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
          />
          <Input
            id="phoneNumber"
            label="Phone No."
            type="tel"
            disabled={isLoading}
            register={register}
            errors={errors}
            required
            style={column === 2 ? { gridColumn: "1/-1" } : {}}
          />
        </div>
        <div className=" gap-3 flex flex-col sm:flex-row   ">
          <CitySelect
            placeHolder="Select City"
            required
            value={city}
            onChange={function (value: ICity): void {
              setValue("city", value);
            }}
          />
          <Select
            options={schoolTypeStore.schoolTypes ?? []}
            required
            placeholder="School Type"
            className="w-full"
            styles={{
              control: (styles) => ({ ...styles, height: "40px" }),
            }}
            theme={(theme) => ({
              ...theme,
              borderRadius: 6,
              height: "48px",
              colors: {
                ...theme.colors,
                primary: "#16a34a",
                primary25: "#16a34a",
              },
            })}
            value={schoolTypeStore.schoolTypes?.find(
              (type) => type.value === schoolType,
            )}
            onChange={function (
              newValue: SingleValue<{ label: string; value: string }>,
            ) {
              setValue("schoolType", newValue?.value);
            }}
          />
        </div>
        <Select
          options={classList}
          placeholder="Select Class"
          className={`w-full ${column === 2 && "col-span-2"}`}
          styles={{
            control: (styles) => ({ ...styles, height: "40px" }),
          }}
          theme={(theme) => ({
            ...theme,
            borderRadius: 6,
            height: "48px",
            colors: {
              ...theme.colors,
              primary: "#16a34a",
              primary25: "#16a34a",
            },
          })}
          required
          value={classList.find((item) => item.value === selectedClass)}
          onChange={function (
            newValue: SingleValue<{ label: string; value: string }>,
          ) {
            setValue("class", newValue?.value);
          }}
        />

        <div className="flex flex-col md:flex-row gap-3">
          <Select
            options={genderList}
            required
            placeholder="Select Gender"
            className="react-dropdown w-full focus:!border-black"
            isClearable // enable isClearable to demonstrate extra error handling
            isSearchable={false}
            classNamePrefix="dropdown"
            styles={{
              control: (styles) => ({ ...styles, height: "40px" }),
            }}
            theme={(theme) => ({
              ...theme,
              borderRadius: 6,
              height: "48px",
              colors: {
                ...theme.colors,
                primary: "#16a34a",
                primary25: "#16a34a",
              },
            })}
            value={genderList.find((item) => item.value === gender)}
            onChange={function (
              newValue: SingleValue<{ label: string; value: string }>,
            ) {
              setValue("gender", newValue?.value);
            }}
          />
        </div>
        <textarea
          rows={2}
          id={"message"}
          {...register("message", { required: false })}
          placeholder="Write a message..."
          className="w-full
          px-2
          leading-10
          font-light 
          bg-white 
          border
          border-[#cccccc]
          rounded-md
          outline-none
          transition
          disabled:opacity-70
          disabled:cursor-not-allowed
          placeholder:text-[#808080] focus:border-2 focus:border-black py-2  "
          defaultValue={""}
        />
        <button
          disabled={isLoading}
          // onClick={handleSubmit(onSubmit)}
          type="submit"
          className="w-full py-4 text-sm font-bold leading-normal text-white transition-all duration-300 bg-green-600 rounded-md  hover:bg-green-700"
        >
          Send Message
        </button>
      </form>
    </div>
  );
}

export { ContactForm };
