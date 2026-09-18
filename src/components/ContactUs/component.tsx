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
  FaUser,
  FaPhone,
  FaArrowRight,
  FaLock,
} from "react-icons/fa6";

// ---------------------------------------------------------------------------
// "Get Admission Help" — modern split-panel lead capture.
// Left: bold royal-blue panel (bg image) with value props + trust badges.
// Right: clean form with iconized, soft-filled inputs and a +971 phone prefix.
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

  return (
    <section id="get-admission-help" className="bg-[#eef4fb] py-16 scroll-mt-24">
      <div className="mx-auto w-[90%] max-w-[1100px]">
        <div className="grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] overflow-hidden rounded-[28px] bg-white shadow-[0_25px_60px_-20px_rgba(15,35,70,0.35)]">
          {/* ===================== LEFT PANEL ===================== */}
          <div className="relative overflow-hidden p-8 text-white sm:p-10">
            <img
              src="/banner-bg.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#123a78] via-green-600/95 to-green-500/90" />
            {/* soft decorative glows */}
            <div className="absolute -top-16 -right-16 h-52 w-52 rounded-full bg-gold/20 blur-3xl" />
            <div className="absolute -bottom-20 -left-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/15 px-3.5 py-1.5 text-xs font-semibold ring-1 ring-white/20 backdrop-blur">
                <FaPhoneVolume className="text-gold" /> Free Admission Support
              </span>

              <h2 className="mt-5 text-2xl font-extrabold leading-snug sm:text-[28px]">
                Not sure which school <br className="hidden sm:block" /> fits your
                child?
              </h2>
              <p className="mt-3 max-w-sm text-sm text-white/85">
                Leave your number and our {SITE_NAME} counsellors will guide you
                — from shortlisting to admissions.
              </p>

              <ul className="mt-7 space-y-3.5">
                {TRUST.map((t) => (
                  <li
                    key={t.text}
                    className="flex items-center gap-3 text-sm text-white/95"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15 text-gold ring-1 ring-white/20">
                      <t.icon />
                    </span>
                    {t.text}
                  </li>
                ))}
              </ul>

              {/* trust footer */}
              <div className="mt-auto flex items-center gap-3 pt-8">
                <div className="flex -space-x-2">
                  {["S", "A", "R", "M"].map((c) => (
                    <span
                      key={c}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-gold text-xs font-bold text-blacky-light ring-2 ring-[#1e4fa3]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-white/85">
                  Trusted by{" "}
                  <span className="font-bold text-white">50,000+</span> parents
                  in Dubai
                </p>
              </div>
            </div>
          </div>

          {/* ===================== RIGHT FORM ===================== */}
          <div className="flex flex-col justify-center bg-white p-8 sm:p-10">
            <p className="text-xl font-extrabold text-blacky-light sm:text-2xl">
              Get Admission <span className="text-green-600">Help</span>
            </p>
            <p className="mt-1.5 text-sm text-blacky-light/55">
              For parents — leave your details and our counsellors will call you
              back. Takes 20 seconds.
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="mt-6 flex flex-col gap-4"
            >
              {/* Full Name */}
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold text-[#5d6b82]">
                  Full Name
                </label>
                <div className="relative">
                  <FaUser className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#9aa6ba]" />
                  <input
                    {...register("name", { required: true })}
                    placeholder="Enter your name"
                    disabled={isLoading}
                    className="h-12 w-full rounded-xl border border-[#e1e6ee] bg-[#f6f8fc] pl-11 pr-4 text-sm text-blacky-light outline-none transition placeholder:text-[#9aa6ba] focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                  />
                </div>
                {errors.name && (
                  <span className="mt-1 block text-xs text-red-500">
                    Please enter your name
                  </span>
                )}
              </div>

              {/* Phone with +971 prefix */}
              <div>
                <label className="mb-1.5 block text-[12px] font-semibold text-[#5d6b82]">
                  Phone Number
                </label>
                <div className="flex items-stretch gap-2">
                  <span className="inline-flex h-12 shrink-0 items-center gap-1.5 rounded-xl border border-[#e1e6ee] bg-[#f6f8fc] px-3 text-sm font-semibold text-blacky-light">
                    <span aria-hidden="true">🇦🇪</span> +971
                  </span>
                  <div className="relative flex-1">
                    <FaPhone className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#9aa6ba]" />
                    <input
                      {...register("phoneNumber", { required: true })}
                      placeholder="50 123 4567"
                      type="tel"
                      disabled={isLoading}
                      className="h-12 w-full rounded-xl border border-[#e1e6ee] bg-[#f6f8fc] pl-11 pr-4 text-sm text-blacky-light outline-none transition placeholder:text-[#9aa6ba] focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10"
                    />
                  </div>
                </div>
                {errors.phoneNumber && (
                  <span className="mt-1 block text-xs text-red-500">
                    Please enter your phone number
                  </span>
                )}
              </div>

              <button
                disabled={isLoading}
                type="submit"
                className="group mt-1 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#173e82] to-green-600 text-sm font-bold text-white shadow-[0_10px_25px_-8px_rgba(30,79,163,0.6)] transition hover:opacity-95 disabled:opacity-60"
              >
                {isLoading ? "Please wait..." : "Request a Call"}
                {!isLoading && (
                  <FaArrowRight className="text-[11px] transition-transform group-hover:translate-x-1" />
                )}
              </button>

              <p className="flex items-center justify-center gap-1.5 text-[11px] text-blacky-light/45">
                <FaLock className="text-[10px]" /> Your details are safe with us.
                No spam, ever.
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
