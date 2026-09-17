"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import AsyncCreatableSelect from "react-select/async-creatable";
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";
import {
  FaUser,
  FaPhone,
  FaStar,
  FaLock,
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaTimes,
  FaUsers,
  FaHeadset,
  FaShieldAlt,
  FaSchool,
  FaGraduationCap,
  FaMapMarkerAlt,
  FaRegCommentDots,
  FaEnvelope,
  FaVenusMars,
} from "react-icons/fa";
import { getCities } from "@/api/city";
import useSchoolType from "@/hooks/useSchoolType";
import { verifyCaptcha } from "@/actions/recaptcha";
import { addEnquiry, EnquiryRequest } from "@/api/Enquiry";
import toast from "react-hot-toast";
import { getSchoolTypes } from "@/api/schools";
import useContactModal from "@/hooks/useContactFoemModal";
import { SCHOOL_CLASS_OPTIONS } from "@/helpers/classFormat";

// Includes Nursery, LKG, UKG and Class 1 – Class 12 so parents enquiring
// about pre-primary admissions can select the correct target class.
const classList = SCHOOL_CLASS_OPTIONS;

// Backend requires gender to be exactly one of these enum values.
const genderList = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
  { label: "Others", value: "other" },
];

type ContactModalProps = {
  showRegister?: boolean;
  isOpen?: boolean;
  willClose?: boolean;
  border?: boolean;
  paddingLarge?: boolean;
  title?: string;
  column?: number;
  name?: string;
};

// Shared react-select theme so both dropdowns match the brand green and the
// height of the text inputs on the right column.
const selectTheme = (theme: any) => ({
  ...theme,
  borderRadius: 10,
  colors: {
    ...theme.colors,
    primary: "#16a34a",
    primary25: "#dcfce7",
    primary50: "#bbf7d0",
  },
});

const selectStyles = {
  control: (base: any, state: any) => ({
    ...base,
    minHeight: "52px",
    paddingLeft: "34px",
    borderRadius: "10px",
    borderColor: state.isFocused ? "#16a34a" : "#e5e7eb",
    boxShadow: state.isFocused ? "0 0 0 1px #16a34a" : "none",
    backgroundColor: "#f9fafb",
    "&:hover": { borderColor: "#16a34a" },
  }),
  placeholder: (base: any) => ({ ...base, color: "#6b7280" }),
  valueContainer: (base: any) => ({ ...base, paddingLeft: 4 }),
  // Render the menu above everything and (via menuPortal below) outside the
  // field wrapper so the left field icon never bleeds through the open list.
  menu: (base: any) => ({ ...base, zIndex: 9999 }),
  menuPortal: (base: any) => ({ ...base, zIndex: 9999 }),
};

// Portaling the dropdown menus to <body> keeps them out of the field's
// relative wrapper (so the left icon can't show through) and above the modal.
const menuPortalTarget =
  typeof document !== "undefined" ? document.body : undefined;

// Inner form — MUST be rendered as a child of <GoogleReCaptchaProvider> so
// useGoogleReCaptcha() can actually read the provider context. (When the hook
// and the provider live in the same component, executeRecaptcha stays
// undefined and the submit hangs on "Submitting...".)
const ContactModalForm = (props: ContactModalProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const schoolTypeStore = useSchoolType();
  const { executeRecaptcha } = useGoogleReCaptcha();
  const contactModal = useContactModal();

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
    trigger,
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

  // Reset the wizard back to step 1 whenever the modal is closed so it always
  // reopens on "Your Details".
  const closeModal = () => {
    setStep(1);
    contactModal.onClose();
  };

  // Validate only the step-1 fields before advancing so the parent can't skip
  // ahead with an empty name / phone.
  const goToStep2 = async () => {
    const valid = await trigger(["name", "phoneNumber", "email"]);
    if (valid) setStep(2);
  };

  // Fetches city options as the user types (and once on open via
  // `defaultOptions`). Returns them as react-select options; if the parent's
  // city isn't in the list they can still create/type their own.
  const loadCityOptions = async (input: string) => {
    try {
      const res = await getCities(input ? { city: input } : undefined);
      return (res.data ?? []).map((c: any) => ({
        label: c.city,
        value: c._id,
        state: c.state,
      }));
    } catch (err) {
      console.error("City fetch failed", err);
      return [];
    }
  };

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    setIsLoading(true);

    // Best-effort reCAPTCHA: fire it in the background for scoring, but DON'T
    // block the enquiry on it. In some environments executeRecaptcha never
    // resolves, which previously left the button stuck on "Submitting...".
    // The enquiry is now sent regardless.
    if (executeRecaptcha) {
      executeRecaptcha("enquiryFormSubmit")
        .then((token) => verifyCaptcha(token))
        .catch(() => {
          /* ignore captcha issues — submission proceeds anyway */
        });
    }

    // `city` is stored as the selected react-select option. For a fetched
    // city we send its _id (option.value); for a custom, user-typed city
    // (__isNew__) we fall back to the typed text so nothing is lost.
    const cityVal = values.city as any;
    try {
      const response = await addEnquiry({
        ...values,
        city: cityVal?.__isNew__ ? cityVal?.label : (cityVal?.value ?? ""),
        pageUrl: window.location.href,
      } as EnquiryRequest);

      if (response?.data) {
        reset();
        setStep(1);
        toast.success("Message Successfully Sent", { id: "enquiry1" });
        window.location.href = `/thank-you?name=${props.name ?? ""}`;
        return;
      }
      if (response?.error) {
        toast.error(response.error?.message, { id: "enquiryError1" });
      }
    } catch (err: any) {
      console.error("Error in Enquiry", err);
      toast.error(
        err?.error?.message ?? "Something went wrong, please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { icon: <FaSchool />, value: "1000+", label: "Schools" },
    { icon: <FaUsers />, value: "25,000+", label: "Happy Parents" },
    { icon: <FaShieldAlt />, value: "Free", label: "Expert Guidance" },
    { icon: <FaHeadset />, value: "Admission", label: "Assistance" },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-3 sm:p-4"
      onClick={closeModal}
    >
        <div
          className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-2xl bg-white shadow-2xl md:overflow-visible"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Fixed min height on desktop so Step 1 and Step 2 are the same
              size — this keeps the left image column fully covered and stops
              the modal from resizing when switching steps. */}
          <div className="flex flex-col md:min-h-[720px] md:flex-row">
            {/* ---- Left illustrated / trust panel ---- */}
            <div className="relative hidden md:block md:w-2/5 overflow-hidden rounded-l-2xl bg-green-50">
              {/* full-bleed background image — fills the whole left column top
                  to bottom. Swap the src for any other photo/illustration. */}
              <Image
                src="/images/inquiry-form-bg.webp"
                alt="Find the perfect school for your child"
                fill
                sizes="(max-width: 768px) 0px, 40vw"
                className="object-cover object-center"
                priority
              />

              {/* trust overlays pinned to the bottom, on top of the image */}
              <div className="absolute inset-0 z-10 flex flex-col justify-end gap-4 p-5">
                {/* rating badge */}
                <div className="inline-flex max-w-max items-center gap-3 rounded-xl bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
                  <div>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-sm" />
                      ))}
                    </div>
                    <p className="mt-1 text-xs font-medium text-neutral-600">
                      Trusted by thousands of parents.
                    </p>
                  </div>
                </div>

                {/* stats card */}
                <div className="grid grid-cols-2 gap-4 rounded-xl bg-white/90 p-4 shadow-sm backdrop-blur">
                  {stats.map((s) => (
                    <div key={s.label} className="flex flex-col items-start">
                      <span className="mb-1 flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600">
                        {s.icon}
                      </span>
                      <span className="text-sm font-bold text-green-700">
                        {s.value}
                      </span>
                      <span className="text-xs text-neutral-500">
                        {s.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ---- Right form panel ---- */}
            <div className="relative flex w-full flex-col p-6 sm:p-8 md:w-3/5">
              {/* header row: back (step 2) + close */}
              <div className="mb-4 flex items-center justify-between">
                {step === 2 ? (
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-green-700"
                  >
                    <FaArrowLeft className="text-xs" /> Back
                  </button>
                ) : (
                  <span />
                )}
                <button
                  type="button"
                  onClick={closeModal}
                  aria-label="Close"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-neutral-200 text-neutral-500 transition hover:bg-neutral-100"
                >
                  <FaTimes />
                </button>
              </div>

              {/* content is vertically centered within the shared min-height
                  so Step 1 (fewer fields) and Step 2 both look balanced */}
              <div className="flex flex-1 flex-col justify-center">
                <h2 className="text-2xl font-extrabold leading-tight text-neutral-800 sm:text-3xl">
                  {step === 1
                    ? props.title ?? "Find the Perfect School for Your Child"
                    : "Almost There!"}
                </h2>
              <p className="mt-2 text-sm text-neutral-500">
                {step === 1
                  ? "Get FREE expert admission counselling and personalized school recommendations."
                  : "Help us find the best schools for your child."}
              </p>

              {/* step indicator */}
              <div className="mt-5 flex items-stretch overflow-hidden rounded-xl border border-neutral-200">
                <div
                  className={`flex flex-1 items-center gap-2 px-4 py-3 ${
                    step === 1 ? "bg-green-50" : "bg-white"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold text-white ${
                      step === 2 ? "bg-green-600" : "bg-green-600"
                    }`}
                  >
                    {step === 2 ? <FaCheck className="text-[10px]" /> : "1"}
                  </span>
                  <div className="leading-tight">
                    <p className="text-xs font-semibold text-green-700">
                      Step 1
                    </p>
                    <p className="text-xs text-neutral-500">Your Details</p>
                  </div>
                </div>
                <div
                  className={`flex flex-1 items-center gap-2 px-4 py-3 ${
                    step === 2 ? "bg-green-50" : "bg-white"
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                      step === 2
                        ? "bg-green-600 text-white"
                        : "bg-neutral-200 text-neutral-500"
                    }`}
                  >
                    2
                  </span>
                  <div className="leading-tight">
                    <p
                      className={`text-xs font-semibold ${
                        step === 2 ? "text-green-700" : "text-neutral-500"
                      }`}
                    >
                      Step 2
                    </p>
                    <p className="text-xs text-neutral-500">
                      Child &amp; Preferences
                    </p>
                  </div>
                </div>
              </div>

              <form
                name={props.name}
                onSubmit={handleSubmit(onSubmit)}
                className="mt-5 flex flex-col gap-4"
              >
                {/* -------- STEP 1 -------- */}
                {step === 1 && (
                  <>
                    <div className="relative">
                      <FaUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        {...register("name", { required: true })}
                        disabled={isLoading}
                        placeholder="Parent Name"
                        className={`w-full rounded-lg border bg-gray-50 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600 ${
                          errors.name ? "border-red-400" : "border-gray-200"
                        }`}
                      />
                    </div>
                    <div className="relative">
                      <FaPhone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        {...register("phoneNumber", {
                          required: true,
                          pattern: {
                            value: /^[0-9]{10}$/,
                            message: "Enter a valid 10-digit number",
                          },
                        })}
                        type="tel"
                        maxLength={10}
                        inputMode="numeric"
                        disabled={isLoading}
                        placeholder="Mobile Number"
                        className={`w-full rounded-lg border bg-gray-50 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600 ${
                          errors.phoneNumber
                            ? "border-red-400"
                            : "border-gray-200"
                        }`}
                      />
                    </div>
                    <div className="relative">
                      <FaEnvelope className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
                      <input
                        {...register("email", {
                          required: true,
                          pattern: {
                            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                            message: "Enter a valid email address",
                          },
                        })}
                        type="email"
                        disabled={isLoading}
                        placeholder="Email Address"
                        className={`w-full rounded-lg border bg-gray-50 py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-green-600 focus:ring-1 focus:ring-green-600 ${
                          errors.email ? "border-red-400" : "border-gray-200"
                        }`}
                      />
                    </div>

                    <button
                      type="button"
                      onClick={goToStep2}
                      className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-4 text-sm font-bold text-white transition hover:bg-green-700"
                    >
                      Continue <FaArrowRight />
                    </button>
                  </>
                )}

                {/* -------- STEP 2 -------- */}
                {step === 2 && (
                  <>
                    <div className="relative">
                      <FaMapMarkerAlt className="pointer-events-none absolute left-4 top-[26px] z-10 -translate-y-1/2 text-neutral-400" />
                      <AsyncCreatableSelect
                        cacheOptions
                        defaultOptions
                        isClearable
                        loadOptions={loadCityOptions}
                        placeholder="Select City"
                        className="w-full"
                        styles={selectStyles}
                        theme={selectTheme}
                        menuPortalTarget={menuPortalTarget}
                        value={city || null}
                        onChange={(newValue: any) =>
                          setValue("city", newValue)
                        }
                        formatCreateLabel={(input: string) =>
                          `Use "${input}"`
                        }
                        loadingMessage={() => "Searching cities..."}
                        noOptionsMessage={() => "Type your city name..."}
                      />
                    </div>

                    <div className="relative">
                      <FaGraduationCap className="pointer-events-none absolute left-4 top-[26px] z-10 -translate-y-1/2 text-neutral-400" />
                      <CreatableSelect
                        isClearable
                        options={classList}
                        placeholder="Child Class"
                        className="w-full"
                        styles={selectStyles}
                        theme={selectTheme}
                        menuPortalTarget={menuPortalTarget}
                        value={
                          classList.find(
                            (item) => item.value === selectedClass,
                          ) ??
                          (selectedClass
                            ? { label: selectedClass, value: selectedClass }
                            : null)
                        }
                        onChange={(newValue: any) =>
                          setValue("class", newValue?.value ?? "")
                        }
                        formatCreateLabel={(input: string) => `Use "${input}"`}
                      />
                    </div>

                    <div className="relative">
                      <FaSchool className="pointer-events-none absolute left-4 top-[26px] z-10 -translate-y-1/2 text-neutral-400" />
                      <CreatableSelect
                        isClearable
                        options={schoolTypeStore.schoolTypes ?? []}
                        placeholder="Preferred School Type"
                        className="w-full"
                        styles={selectStyles}
                        theme={selectTheme}
                        menuPortalTarget={menuPortalTarget}
                        value={
                          schoolTypeStore.schoolTypes?.find(
                            (type) => type.value === schoolType,
                          ) ??
                          (schoolType
                            ? { label: schoolType, value: schoolType }
                            : null)
                        }
                        onChange={(newValue: any) =>
                          setValue("schoolType", newValue?.value ?? "")
                        }
                        formatCreateLabel={(input: string) => `Use "${input}"`}
                      />
                    </div>

                    <div className="relative">
                      <FaVenusMars className="pointer-events-none absolute left-4 top-[26px] z-10 -translate-y-1/2 text-neutral-400" />
                      <Select
                        options={genderList}
                        placeholder="Child Gender"
                        className="w-full"
                        styles={selectStyles}
                        theme={selectTheme}
                        menuPortalTarget={menuPortalTarget}
                        isSearchable={false}
                        value={
                          genderList.find((g) => g.value === gender) ?? null
                        }
                        onChange={(newValue: any) =>
                          setValue("gender", newValue?.value ?? "")
                        }
                      />
                    </div>

                    <div className="relative rounded-lg border border-gray-200 bg-gray-50 p-3">
                      <div className="mb-1 flex items-center gap-2 text-sm font-medium text-neutral-700">
                        <FaRegCommentDots className="text-neutral-400" />
                        Message (Optional)
                      </div>
                      <textarea
                        rows={2}
                        id="message"
                        {...register("message", { required: false })}
                        placeholder="Tell us about your preferences or any specific requirements."
                        className="w-full resize-none bg-transparent text-sm text-neutral-700 outline-none placeholder:text-neutral-400"
                      />
                    </div>

                    <button
                      disabled={isLoading}
                      type="submit"
                      className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg bg-green-600 py-4 text-sm font-bold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      {isLoading
                        ? "Submitting..."
                        : "Get FREE School Recommendations"}
                      {!isLoading && <FaArrowRight />}
                    </button>
                  </>
                )}

                <p className="mt-1 flex items-center justify-center gap-2 text-xs text-neutral-400">
                  <FaLock className="text-[11px]" /> Your information is secure
                  and never shared.
                </p>
              </form>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

// Public component: mounts the reCAPTCHA provider ONLY while the modal is open
// (so the script isn't loaded on every page), and renders the form as a child
// of the provider so useGoogleReCaptcha() resolves correctly.
const ContactModal = (props: ContactModalProps) => {
  const contactModal = useContactModal();
  if (!contactModal.isOpen) return null;
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
      <ContactModalForm {...props} />
    </GoogleReCaptchaProvider>
  );
};

export { ContactModal };
