/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { IRegisterSchoolReq, registerSchoolEnquiry } from "@/api/Enquiry";
import toast from "react-hot-toast";
import { SITE_NAME } from "@/constants";
import ContactUs from "@/components/ContactUs/component";
import {
  FaBullhorn,
  FaChartLine,
  FaShieldHalved,
  FaStar,
  FaBuildingColumns,
  FaUserGraduate,
  FaArrowRight,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaCircleCheck,
  FaLocationCrosshairs,
} from "react-icons/fa6";

const BENEFITS = [
  { icon: FaBullhorn, title: "Get discovered", text: "by thousands of parents" },
  { icon: FaChartLine, title: "Genuine leads", text: "real admission enquiries" },
  { icon: FaShieldHalved, title: "Verified profile", text: "you fully control" },
  { icon: FaStar, title: "100% free listing", text: "no hidden charges" },
];

const CONTAINER = "mx-auto w-[90%] max-w-[1280px]";

const RegisterSchool = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"school" | "parent">("school");

  const {
    register,
    reset,
    setValue,
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
          toast.success("Enquiry Submitted Successfully");
          window.location.href = `/thank-you?name=register-form`;
        }
      })
      .catch((err) => {
        toast.error(err?.error?.message, { id: "registerSchoolEnqError1" });
      })
      .finally(() => setIsLoading(false));
  };

  const useMyLocation = () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      toast.error("Location not supported on this device");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setValue(
          "schoolAddress",
          `Near me (${latitude.toFixed(4)}, ${longitude.toFixed(4)}), Dubai`
        );
        toast.success("Location added");
      },
      () => toast.error("Couldn't get your location")
    );
  };

  const inputBase =
    "h-12 w-full rounded-xl border border-[#dbe4f2] bg-[#f4f8fd] pl-11 pr-4 text-sm text-blacky-light outline-none transition placeholder:text-[#9aa6ba] focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10";
  const iconCls =
    "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#8aa0c4]";

  return (
    <section className="bg-[#eef4fb] py-14">
      <div className={CONTAINER}>
        {/* Intro + toggle tiles */}
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-extrabold text-blacky-light md:text-3xl">
            How can we help you?
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-blacky-light/60">
            {SITE_NAME} is for both schools and parents. Pick what fits you.
          </p>

          <div className="mx-auto mt-6 grid max-w-3xl grid-cols-1 gap-4 text-left sm:grid-cols-2">
            <button
              type="button"
              onClick={() => setMode("school")}
              className={`flex items-start gap-3 rounded-2xl bg-white p-5 text-left transition-all border-2 ${
                mode === "school"
                  ? "border-green-600 shadow-spread"
                  : "border-transparent shadow-light hover:border-green-200"
              }`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-600/10 text-xl text-green-600">
                <FaBuildingColumns />
              </span>
              <div>
                <p className="font-bold text-blacky-light">
                  For Schools — Register your school
                </p>
                <p className="mt-1 text-xs text-blacky-light/60">
                  Have a school? List it on {SITE_NAME} to get discovered.
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setMode("parent")}
              className={`flex items-start gap-3 rounded-2xl bg-white p-5 text-left transition-all border-2 ${
                mode === "parent"
                  ? "border-gold shadow-spread"
                  : "border-transparent shadow-light hover:border-gold/40"
              }`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fbf3dd] text-xl text-gold-dark">
                <FaUserGraduate />
              </span>
              <div>
                <p className="flex items-center gap-1 font-bold text-blacky-light">
                  For Parents — Get admission help{" "}
                  <FaArrowRight className="text-xs" />
                </p>
                <p className="mt-1 text-xs text-blacky-light/60">
                  Looking for a school for your child? Open the free help form.
                </p>
              </div>
            </button>
          </div>
        </div>

        {/* Only ONE form shows at a time */}
        {mode === "parent" ? (
          <ContactUs />
        ) : (
          <div className="grid grid-cols-1 overflow-hidden rounded-[28px] bg-white shadow-[0_25px_60px_-25px_rgba(15,35,70,0.3)] lg:grid-cols-[1.05fr_0.95fr]">
            {/* ===================== LEFT PANEL (light blue) ===================== */}
            <div className="relative overflow-hidden p-8 sm:p-10">
              <img
                src="/search-bg.png"
                alt=""
                aria-hidden="true"
                className="absolute inset-0 h-full w-full object-cover object-right"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#e7f0fc] via-[#e7f0fc]/92 to-[#e7f0fc]/20" />
              <div className="pointer-events-none absolute -top-16 -left-10 h-48 w-48 rounded-full bg-[#1e4fa3]/15 blur-3xl" />

              <span className="pointer-events-none absolute right-6 top-16 hidden max-w-[120px] -rotate-6 text-right font-serif text-sm italic leading-tight text-[#1e4fa3] sm:block">
                Empowering Education in Dubai
              </span>

              <div className="relative z-10 flex h-full max-w-md flex-col">
                <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#173e82] px-3.5 py-1.5 text-xs font-semibold text-white">
                  <FaCircleCheck className="text-gold" /> Free School Listing
                </span>

                <h1 className="mt-5 text-2xl font-extrabold leading-snug text-blacky-light sm:text-[30px]">
                  List Your School on <br className="hidden sm:block" />
                  <span className="text-[#1e4fa3]">Education Portal</span>
                </h1>
                <p className="mt-3 max-w-sm text-sm text-blacky-light/70">
                  Reach thousands of parents in Dubai searching for the right
                  school. Fill in your details and our team will set up your
                  listing for free.
                </p>

                <div className="mt-7 grid grid-cols-2 gap-4">
                  {BENEFITS.map((b) => (
                    <div key={b.title} className="flex items-start gap-2.5">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1e4fa3]/10 text-[#1e4fa3]">
                        <b.icon className="text-sm" />
                      </span>
                      <div className="leading-tight">
                        <p className="text-[12px] font-bold text-blacky-light">
                          {b.title}
                        </p>
                        <p className="text-[11px] text-blacky-light/60">
                          {b.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-auto flex items-center gap-3 pt-8">
                  <div className="flex -space-x-2">
                    {["G", "D", "J", "A"].map((c) => (
                      <span
                        key={c}
                        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#1e4fa3] text-xs font-bold text-white ring-2 ring-[#e7f0fc]"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-blacky-light/70">
                    Join <span className="font-bold text-[#1e4fa3]">500+</span>{" "}
                    schools already listed in Dubai
                  </p>
                </div>
              </div>
            </div>

            {/* ===================== RIGHT FORM ===================== */}
            <div className="bg-white p-8 sm:p-10">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#1e4fa3]/10 text-[#1e4fa3]">
                    <FaBuildingColumns />
                  </span>
                  <p className="text-xl font-extrabold text-blacky-light sm:text-2xl">
                    Register Your School
                  </p>
                </div>
                <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-green-600/10 px-2.5 py-1 text-[11px] font-bold text-green-600">
                  <FaCircleCheck className="text-[10px]" /> 100% Free Listing
                </span>
              </div>
              <p className="mt-2 text-sm text-blacky-light/55">
                For school owners — list your school and start receiving parent
                enquiries.
              </p>

              <form
                onSubmit={handleSubmit(onSubmit)}
                className="mt-6 flex flex-col gap-4"
              >
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="relative">
                    <FaUser className={iconCls} />
                    <input
                      {...register("name", { required: true })}
                      placeholder="Your name"
                      disabled={isLoading}
                      className={inputBase}
                    />
                  </div>
                  <div className="relative">
                    <FaEnvelope className={iconCls} />
                    <input
                      {...register("email", { required: true })}
                      placeholder="Email address"
                      type="email"
                      disabled={isLoading}
                      className={inputBase}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="flex items-stretch gap-2">
                    <span className="inline-flex h-12 shrink-0 items-center gap-1.5 rounded-xl border border-[#dbe4f2] bg-[#f4f8fd] px-3 text-sm font-semibold text-blacky-light">
                      <span aria-hidden="true">🇦🇪</span> +971
                    </span>
                    <div className="relative flex-1">
                      <FaPhone className={iconCls} />
                      <input
                        {...register("phoneNumber", { required: true })}
                        placeholder="50 123 4567"
                        type="tel"
                        disabled={isLoading}
                        className={inputBase}
                      />
                    </div>
                  </div>
                  <div className="relative">
                    <FaBuildingColumns className={iconCls} />
                    <input
                      {...register("school", { required: true })}
                      placeholder="School name"
                      disabled={isLoading}
                      className={inputBase}
                    />
                  </div>
                </div>

                <div>
                  <div className="mb-1 flex items-center justify-between">
                    <span className="text-[12px] font-semibold text-[#5d6b82]">
                      School address
                    </span>
                    <button
                      type="button"
                      onClick={useMyLocation}
                      className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#1e4fa3] hover:underline"
                    >
                      <FaLocationCrosshairs className="text-[11px]" /> Use my
                      location
                    </button>
                  </div>
                  <textarea
                    rows={2}
                    {...register("schoolAddress", { required: true })}
                    placeholder="School address (Area, Dubai)"
                    disabled={isLoading}
                    className="w-full rounded-xl border border-[#dbe4f2] bg-[#f4f8fd] px-4 py-3 text-sm text-blacky-light outline-none transition placeholder:text-[#9aa6ba] focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                  />
                </div>

                {(errors.name ||
                  errors.email ||
                  errors.phoneNumber ||
                  errors.school ||
                  errors.schoolAddress) && (
                  <span className="text-xs text-red-500">
                    Please fill all required fields.
                  </span>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="group mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#173e82] to-green-600 text-sm font-bold text-white shadow-[0_10px_25px_-8px_rgba(30,79,163,0.6)] transition hover:opacity-95 disabled:opacity-60"
                >
                  {isLoading ? "Submitting..." : "Submit Request"}
                  {!isLoading && (
                    <FaArrowRight className="text-[11px] transition-transform group-hover:translate-x-1" />
                  )}
                </button>

                <p className="text-center text-[11px] text-blacky-light/45">
                  🔒 Your information is safe with us. We never share your
                  details.
                </p>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default RegisterSchool;
