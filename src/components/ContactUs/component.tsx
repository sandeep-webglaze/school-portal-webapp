"use client";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { CtaRequest, addCta } from "@/api/cta";
import toast from "react-hot-toast";
import { SITE_NAME } from "@/constants";
import {
  FaPhoneVolume,
  FaCircleCheck,
  FaRegClock,
  FaShieldHalved,
} from "react-icons/fa6";

// ---------------------------------------------------------------------------
// "Get Admission Help" — modern split-panel lead capture.
// Left: bold gradient panel with value props. Right: clean form.
// Keeps the original react-hook-form + addCta submission logic.
// ---------------------------------------------------------------------------
const TRUST = [
  { icon: FaRegClock, text: "We call you back within 24 hours" },
  { icon: FaShieldHalved, text: "100% free & independent guidance" },
  { icon: FaCircleCheck, text: "Expert help shortlisting schools" },
];

const ContactUs = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: { name: "", phoneNumber: "" },
  });

  const onSubmit: SubmitHandler<FieldValues> = (values) => {
    setIsLoading(true);
    addCta({ ...values, pageUrl: window.location.href } as CtaRequest)
      .then((response) => {
        if (response?.data) {
          reset();
          toast.success("Message Successfully Sent", { id: "cta1" });
        }
        if (response?.error) {
          toast.error(response.error?.message, { id: "ctaError1" });
        }
      })
      .catch((err) => {
        console.error("Error in cta", err);
        toast.error(err?.error?.message);
      })
      .finally(() => setIsLoading(false));
  };

  const inputClass =
    "w-full h-12 rounded-xl border border-gray-200 bg-white px-4 text-sm text-blacky-light outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition";

  return (
    <section id="get-admission-help" className="bg-white py-14 scroll-mt-24">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 rounded-3xl overflow-hidden shadow-spread">
          {/* Left panel with background image */}
          <div className="relative overflow-hidden p-8 sm:p-10 text-white">
            <img
              src="/banner-bg.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-green-600/95 via-green-600/90 to-green-500/80" />
            <div className="relative z-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold">
                <FaPhoneVolume /> Free Admission Support
              </span>
              <h2 className="mt-4 text-2xl sm:text-3xl font-extrabold leading-snug">
                Not sure which school <br /> fits your child?
              </h2>
              <p className="mt-3 text-sm text-white/85 max-w-sm">
                Leave your number and our {SITE_NAME} counsellors will guide you
                — from shortlisting to admissions.
              </p>
              <ul className="mt-6 space-y-3">
                {TRUST.map((t) => (
                  <li key={t.text} className="flex items-center gap-3 text-sm text-white/90">
                    <span className="h-8 w-8 rounded-lg bg-white/15 flex items-center justify-center">
                      <t.icon />
                    </span>
                    {t.text}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right form */}
          <div className="bg-white p-8 sm:p-10 flex flex-col justify-center">
            <p className="text-xl sm:text-2xl font-extrabold text-blacky-light">
              Get Admission <span className="text-green-600">Help</span>
            </p>
            <p className="text-sm text-blacky-light/55 mt-1">
              For parents — leave your details and our counsellors will call you
              back. Takes 20 seconds.
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className="mt-5 flex flex-col gap-4">
              <div>
                <input
                  {...register("name", { required: true })}
                  placeholder="Full Name"
                  disabled={isLoading}
                  className={inputClass}
                />
                {errors.name && (
                  <span className="text-xs text-red-500 mt-1 block">
                    Please enter your name
                  </span>
                )}
              </div>
              <div>
                <input
                  {...register("phoneNumber", { required: true })}
                  placeholder="Phone No."
                  type="tel"
                  disabled={isLoading}
                  className={inputClass}
                />
                {errors.phoneNumber && (
                  <span className="text-xs text-red-500 mt-1 block">
                    Please enter your phone number
                  </span>
                )}
              </div>
              <button
                disabled={isLoading}
                type="submit"
                className="w-full h-12 rounded-xl bg-gradient-to-r from-green-600 to-green-500 text-white text-sm font-bold hover:opacity-90 transition disabled:opacity-60"
              >
                {isLoading ? "Please wait..." : "Request a Call"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
