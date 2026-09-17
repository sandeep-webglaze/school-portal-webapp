"use client";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { IRegisterSchoolReq, registerSchoolEnquiry } from "@/api/Enquiry";
import toast from "react-hot-toast";
import { SITE_NAME } from "@/constants";
import ContactUs from "@/components/ContactUs/component";
import {
  FaCircleCheck,
  FaBullhorn,
  FaChartLine,
  FaShieldHalved,
  FaBuildingColumns,
  FaUserGraduate,
  FaArrowRight,
} from "react-icons/fa6";

const BENEFITS = [
  { icon: FaBullhorn, text: "Get discovered by thousands of parents in Dubai" },
  { icon: FaChartLine, text: "Receive genuine admission leads for free" },
  { icon: FaShieldHalved, text: "A verified profile you fully control" },
];

const RegisterSchool = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const openHelp = () => {
    setShowHelp(true);
    setTimeout(() => {
      document
        .getElementById("get-admission-help")
        ?.scrollIntoView({ behavior: "smooth" });
    }, 60);
  };

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
          toast.success("Enquiry Submitted Successfully");
          window.location.href = `/thank-you?name=register-form`;
        }
      })
      .catch((err) => {
        toast.error(err?.error?.message, { id: "registerSchoolEnqError1" });
      })
      .finally(() => setIsLoading(false));
  };

  const inputClass =
    "w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-blacky-light outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition";

  return (
    <>
    <section className="bg-[#eef4fb] py-14">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
        {/* Intro — clarifies the two paths */}
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-blacky-light">
            How can we help you?
          </h2>
          <p className="text-sm text-blacky-light/60 mt-2 max-w-xl mx-auto">
            {SITE_NAME} is for both schools and parents. Pick what fits you.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 text-left">
            <div className="rounded-2xl bg-white border-2 border-green-600 p-5 flex items-start gap-3">
              <span className="h-11 w-11 shrink-0 rounded-xl bg-green-600/10 text-green-600 flex items-center justify-center text-xl">
                <FaBuildingColumns />
              </span>
              <div>
                <p className="font-bold text-blacky-light">
                  For Schools — Register your school
                </p>
                <p className="text-xs text-blacky-light/60 mt-1">
                  Have a school? List it on {SITE_NAME} to get discovered and
                  receive admission enquiries. Fill the form below.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={openHelp}
              className={`text-left rounded-2xl bg-white border p-5 flex items-start gap-3 transition-colors ${
                showHelp ? "border-green-600" : "border-gray-200 hover:border-green-500"
              }`}
            >
              <span className="h-11 w-11 shrink-0 rounded-xl bg-[#fbf3dd] text-gold-dark flex items-center justify-center text-xl">
                <FaUserGraduate />
              </span>
              <div>
                <p className="font-bold text-blacky-light flex items-center gap-1">
                  For Parents — Get admission help <FaArrowRight className="text-xs" />
                </p>
                <p className="text-xs text-blacky-light/60 mt-1">
                  Looking for a school for your child? Click here to open the free
                  admission-help form.
                </p>
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden shadow-spread bg-white">
          {/* Left info panel with background image */}
          <div className="relative overflow-hidden p-8 sm:p-10 text-white">
            <img
              src="/images/banner-home4.jpeg"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/95 via-green-600/90 to-green-500/80" />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                Free School Listing
              </span>
              <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold leading-snug">
                List your school on {SITE_NAME}
              </h1>
              <p className="mt-3 text-sm text-white/85 max-w-sm">
                Reach families actively searching for schools in Dubai. Fill in
                your details and our team will set up your listing.
              </p>
              <ul className="mt-6 space-y-4">
                {BENEFITS.map((b) => (
                  <li key={b.text} className="flex items-start gap-3 text-sm text-white/90">
                    <span className="h-9 w-9 shrink-0 rounded-lg bg-white/15 flex items-center justify-center">
                      <b.icon />
                    </span>
                    <span className="pt-1.5">{b.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right form */}
          <div className="p-8 sm:p-10">
            <h2 className="text-xl font-extrabold text-blacky-light">
              Register your school
            </h2>
            <p className="text-sm text-blacky-light/55 mt-1">
              For school owners — list your school and start receiving parent
              enquiries. Fill all details to submit your request.
            </p>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-5 flex flex-col gap-4"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  {...register("name", { required: true })}
                  placeholder="Your Name"
                  disabled={isLoading}
                  className={inputClass}
                />
                <input
                  {...register("email", { required: true })}
                  placeholder="Email"
                  type="email"
                  disabled={isLoading}
                  className={inputClass}
                />
              </div>
              <input
                {...register("phoneNumber", { required: true })}
                placeholder="Phone Number"
                type="tel"
                disabled={isLoading}
                className={inputClass}
              />
              <input
                {...register("school", { required: true })}
                placeholder="School Name"
                disabled={isLoading}
                className={inputClass}
              />
              <textarea
                rows={3}
                {...register("schoolAddress", { required: true })}
                placeholder="School Address..."
                disabled={isLoading}
                className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-blacky-light outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition"
              />
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
                className="w-full h-12 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white text-sm font-bold hover:opacity-90 transition disabled:opacity-60"
              >
                {isLoading ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
    {showHelp && <ContactUs />}
    </>
  );
};

export default RegisterSchool;
