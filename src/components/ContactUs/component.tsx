/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { CtaRequest, addCta } from "@/api/cta";
import toast from "react-hot-toast";
import { SITE_NAME } from "@/constants";
import {
  FaPhoneVolume,
  FaRegClock,
  FaShieldHalved,
  FaUsers,
  FaHeart,
  FaUser,
  FaEnvelope,
  FaPhone,
  FaArrowRight,
  FaLock,
  FaHeadset,
  FaBolt,
} from "react-icons/fa6";

// ---------------------------------------------------------------------------
// "Get Admission Help" — warm, modern lead-capture banner.
// Left: cream panel over a family photo, value props + trust row.
// Right: clean white form (name, optional email, +971 phone).
// Keeps the original react-hook-form + addCta submission logic.
// ---------------------------------------------------------------------------
const TRUST = [
  { icon: FaRegClock, text: "We call you back within 24 hours" },
  { icon: FaShieldHalved, text: "100% free & independent guidance" },
  { icon: FaUsers, text: "Expert help shortlisting schools" },
  { icon: FaHeart, text: "Personalised recommendations" },
];

const ContactUs = () => {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: { name: "", email: "", phoneNumber: "" },
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

  const inputBase =
    "h-12 w-full rounded-xl border border-[#e7ddc8] bg-white/70 pl-11 pr-4 text-sm text-blacky-light outline-none transition placeholder:text-[#a89e88] focus:border-gold focus:bg-white focus:ring-4 focus:ring-gold/15";
  const iconCls =
    "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#c2a86a]";

  return (
    <section id="get-admission-help" className="bg-[#eef4fb] py-16 scroll-mt-24">
      <div className="mx-auto w-[90%] max-w-[1280px]">
        <div className="grid grid-cols-1 overflow-hidden rounded-[28px] bg-white shadow-[0_25px_60px_-25px_rgba(15,35,70,0.3)] lg:grid-cols-[1.05fr_0.95fr]">
          {/* ===================== LEFT PANEL (warm) ===================== */}
          <div className="relative overflow-hidden p-8 sm:p-10">
            <img
              src="/about.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full object-cover object-right"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#fdf3e2] via-[#fdf3e2]/90 to-[#fdf3e2]/20" />
            <div className="pointer-events-none absolute -top-16 -left-10 h-48 w-48 rounded-full bg-gold/20 blur-3xl" />

            {/* script accent */}
            <span className="pointer-events-none absolute right-6 top-24 hidden max-w-[130px] -rotate-6 font-serif text-sm italic leading-tight text-[#e08a2b] sm:block">
              A Brighter Future for Your Child
            </span>

            <div className="relative z-10 flex h-full max-w-md flex-col">
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-[#173e82] px-3.5 py-1.5 text-xs font-semibold text-white">
                <FaPhoneVolume className="text-gold" /> Free Admission Support
              </span>

              <h2 className="mt-5 text-2xl font-extrabold leading-snug text-[#123a78] sm:text-[28px]">
                Not sure which school <br className="hidden sm:block" />
                <span className="text-[#e08a2b]">fits your child?</span>
              </h2>
              <p className="mt-3 max-w-sm text-sm text-blacky-light/70">
                Leave your number and our {SITE_NAME} counsellors will guide you
                — from shortlisting to admissions.
              </p>

              <div className="mt-7 grid grid-cols-2 gap-x-4 gap-y-4 sm:flex sm:flex-wrap">
                {TRUST.map((t) => (
                  <div key={t.text} className="flex w-full items-start gap-2 sm:w-[46%]">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#173e82]/10 text-[#173e82]">
                      <t.icon className="text-xs" />
                    </span>
                    <span className="pt-0.5 text-[11px] font-medium leading-tight text-blacky-light/75">
                      {t.text}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-auto flex items-center gap-3 pt-8">
                <div className="flex -space-x-2">
                  {["S", "A", "R", "M"].map((c) => (
                    <span
                      key={c}
                      className="flex h-8 w-8 items-center justify-center rounded-full bg-[#173e82] text-xs font-bold text-white ring-2 ring-[#fdf3e2]"
                    >
                      {c}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-blacky-light/70">
                  Trusted by{" "}
                  <span className="font-bold text-[#173e82]">50,000+</span>{" "}
                  parents in Dubai
                </p>
              </div>
            </div>
          </div>

          {/* ===================== RIGHT FORM ===================== */}
          <div className="relative flex flex-col justify-center bg-white p-8 sm:p-10">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600/10 text-green-600">
                  <FaHeadset />
                </span>
                <div>
                  <p className="text-xl font-extrabold text-blacky-light sm:text-2xl">
                    Get Admission Help
                  </p>
                </div>
              </div>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-gold/15 px-2.5 py-1 text-[11px] font-bold text-gold-dark">
                <FaBolt className="text-[10px]" /> Quick Response
              </span>
            </div>
            <p className="mt-2 text-sm text-blacky-light/55">
              For parents — leave your details and our counsellors will call you
              back. Takes 20 seconds.
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
                    placeholder="Full name"
                    disabled={isLoading}
                    className={inputBase}
                  />
                </div>
                <div className="relative">
                  <FaEnvelope className={iconCls} />
                  <input
                    {...register("email")}
                    placeholder="Email address (optional)"
                    type="email"
                    disabled={isLoading}
                    className={inputBase}
                  />
                </div>
              </div>

              <div className="flex items-stretch gap-2">
                <span className="inline-flex h-12 shrink-0 items-center gap-1.5 rounded-xl border border-[#e7ddc8] bg-white/70 px-3 text-sm font-semibold text-blacky-light">
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
              {(errors.name || errors.phoneNumber) && (
                <span className="text-xs text-red-500">
                  Please enter your name and phone number.
                </span>
              )}

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

            {/* script accent */}
            <span className="pointer-events-none absolute bottom-6 right-6 hidden max-w-[120px] rotate-6 text-right font-serif text-sm italic leading-tight text-[#e08a2b] lg:block">
              Education Today, A Brighter Tomorrow
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactUs;
