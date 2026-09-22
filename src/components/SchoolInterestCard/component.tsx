"use client";

// ---------------------------------------------------------------------------
// SchoolInterestCard — the parent-side "value exchange" lead capture.
//
// Instead of forcing parents to hand over data, we give them a REASON to:
// exact fees, a brochure, seat availability and a free school visit — the
// things parents actually want before applying. They give a name + phone to
// unlock it, which shows genuine interest AND becomes a lead for the school.
//
// Drop this on the school detail page (usually a sticky right-column card):
//   <SchoolInterestCard schoolName={school.name} slug={school.slug} />
// Submissions go through the existing CTA/lead API (addCta) so no new backend
// wiring is needed; the school is identifiable from the page URL.
// ---------------------------------------------------------------------------

import React, { useState } from "react";
import { useForm, SubmitHandler, FieldValues } from "react-hook-form";
import toast from "react-hot-toast";
import { CtaRequest, addCta } from "@/api/cta";
import {
  FaMoneyBillWave,
  FaFilePdf,
  FaCalendarCheck,
  FaChair,
  FaUser,
  FaPhone,
  FaArrowRight,
  FaLock,
  FaCircleCheck,
  FaWhatsapp,
  FaHeart,
  FaRegClock,
  FaShieldHalved,
} from "react-icons/fa6";

type Props = {
  schoolName?: string;
  slug?: string;
  className?: string;
};

const UNLOCKS = [
  { icon: FaMoneyBillWave, text: "Exact annual fees & payment plans" },
  { icon: FaFilePdf, text: "Official school brochure (PDF)" },
  { icon: FaChair, text: "Live seat availability for your class" },
  { icon: FaCalendarCheck, text: "Book a free campus visit" },
];

const SchoolInterestCard: React.FC<Props> = ({
  schoolName,
  slug,
  className = "",
}) => {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [saved, setSaved] = useState(false); // "interested" heart

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: { name: "", phoneNumber: "" },
  });

  const onSubmit: SubmitHandler<FieldValues> = (values) => {
    setLoading(true);
    const pageUrl =
      typeof window !== "undefined" ? window.location.href : slug || "";
    // Build the payload with the exact fields CtaRequest needs (name +
    // phoneNumber are required). We tag the page URL with the school name so
    // the team knows which school this parent is interested in.
    const payload: CtaRequest = {
      name: String(values.name || ""),
      phoneNumber: String(values.phoneNumber || ""),
      pageUrl: schoolName ? `${pageUrl} · School: ${schoolName}` : pageUrl,
    };
    addCta(payload)
      .then((res) => {
        if (res?.error) {
          toast.error(res.error?.message || "Something went wrong");
          return;
        }
        setDone(true);
      })
      .catch(() => toast.error("Something went wrong. Please try again."))
      .finally(() => setLoading(false));
  };

  const inputBase =
    "h-12 w-full rounded-xl border border-[#dbe4f2] bg-[#f4f8fd] pl-11 pr-4 text-sm text-blacky-light outline-none transition placeholder:text-[#9aa6ba] focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10";
  const iconCls =
    "pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-[#8aa0c4]";

  // ----------------------------- success state -----------------------------
  if (done) {
    return (
      <div
        className={`rounded-2xl border border-green-600/30 bg-white p-6 text-center shadow-light ${className}`}
      >
        <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600/10 text-2xl text-green-600">
          <FaCircleCheck />
        </span>
        <p className="text-lg font-extrabold text-blacky-light">
          You&apos;re all set! 🎉
        </p>
        <p className="mx-auto mt-1 max-w-xs text-sm text-blacky-light/60">
          Our counsellor will call you within 24 hours with{" "}
          {schoolName ? schoolName : "the school"}&apos;s fees, brochure and
          visit slots.
        </p>
        <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-[#25D366]/10 px-4 py-3 text-sm font-semibold text-[#128C7E]">
          <FaWhatsapp className="text-lg" /> We&apos;ll also message you on
          WhatsApp
        </div>
      </div>
    );
  }

  // ----------------------------- capture form -----------------------------
  return (
    <div
      className={`overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_15px_40px_-20px_rgba(15,35,70,0.3)] ${className}`}
    >
      {/* header */}
      <div className="relative bg-gradient-to-r from-[#173e82] to-green-600 p-5 text-white">
        <div className="flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide">
            <FaLock className="text-[9px]" /> Free · Unlock now
          </span>
          <button
            type="button"
            onClick={() => setSaved((s) => !s)}
            aria-label="Save your interest"
            className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
              saved ? "bg-white text-red-500" : "bg-white/15 text-white"
            }`}
          >
            <FaHeart className="text-sm" />
          </button>
        </div>
        <p className="mt-3 text-lg font-extrabold leading-snug">
          Get {schoolName ? `${schoolName}'s` : "this school's"} full details
        </p>
        <p className="mt-1 text-xs text-white/80">
          Fees, brochure & a free visit — in one call.
        </p>
      </div>

      {/* body */}
      <div className="p-5">
        <ul className="space-y-2.5">
          {UNLOCKS.map((u) => (
            <li
              key={u.text}
              className="flex items-center gap-2.5 text-sm text-blacky-light/75"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-green-600/10 text-green-600">
                <u.icon className="text-[11px]" />
              </span>
              {u.text}
            </li>
          ))}
        </ul>

        <form onSubmit={handleSubmit(onSubmit)} className="mt-5 flex flex-col gap-3">
          <div className="relative">
            <FaUser className={iconCls} />
            <input
              {...register("name", { required: true })}
              placeholder="Parent's name"
              disabled={loading}
              className={inputBase}
            />
          </div>
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
                disabled={loading}
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
            type="submit"
            disabled={loading}
            className="group inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#173e82] to-green-600 text-sm font-bold text-white shadow-[0_10px_25px_-8px_rgba(30,79,163,0.6)] transition hover:opacity-95 disabled:opacity-60"
          >
            {loading ? "Please wait…" : "Get Free Details"}
            {!loading && (
              <FaArrowRight className="text-[11px] transition-transform group-hover:translate-x-1" />
            )}
          </button>
        </form>

        <div className="mt-4 flex items-center justify-between text-[11px] text-blacky-light/50">
          <span className="inline-flex items-center gap-1">
            <FaRegClock className="text-green-600" /> Call within 24h
          </span>
          <span className="inline-flex items-center gap-1">
            <FaShieldHalved className="text-green-600" /> No spam, ever
          </span>
        </div>
      </div>
    </div>
  );
};

export default SchoolInterestCard;
