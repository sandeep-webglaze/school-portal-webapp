/* eslint-disable @next/next/no-img-element */
"use client";

// ---------------------------------------------------------------------------
// SchoolBenefits — the "why every Dubai school should list with us" persuasion
// block. This is the piece that MAKES schools want to register:
//   • Demand proof + FOMO  (parents are searching RIGHT NOW)
//   • How they get admissions in 3 simple steps (the lead mechanic)
//   • Unlisted vs Listed  (loss aversion — you're losing enquiries)
//   • Clear benefits grid + what-happens-after-you-submit steps
//   • Social proof
// Drop <SchoolBenefits /> above the school register form (school mode only).
// The CTAs scroll to the form (give the form an id="school-register-form").
// ---------------------------------------------------------------------------

import React, { useEffect, useRef, useState } from "react";
import { SITE_NAME } from "@/constants";
import {
  FaMagnifyingGlassChart,
  FaEnvelopeOpenText,
  FaUsers,
  FaBullhorn,
  FaChartLine,
  FaShieldHalved,
  FaStar,
  FaCircleCheck,
  FaCircleXmark,
  FaArrowRight,
  FaWhatsapp,
  FaGaugeHigh,
  FaAward,
  FaRegClock,
  FaHeadset,
  FaClipboardCheck,
} from "react-icons/fa6";

const CONTAINER = "mx-auto w-[90%] max-w-[1280px]";

// Count-up animation for the demand numbers.
function useCountUp(target: number, run: boolean, ms = 1400) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!run) return;
    let raf = 0;
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / ms);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, run, ms]);
  return n;
}

const DEMAND = [
  { icon: FaMagnifyingGlassChart, value: 2400, suffix: "+", label: "parent searches this week" },
  { icon: FaEnvelopeOpenText, value: 180, suffix: "+", label: "admission enquiries waiting" },
  { icon: FaUsers, value: 50000, suffix: "+", label: "parents on the platform" },
];

const STEPS = [
  {
    icon: FaBullhorn,
    title: "Submit your school details",
    text: "Fill the quick request form below with your school name, contact and address. Takes under a minute.",
  },
  {
    icon: FaHeadset,
    title: "Our support team contacts you",
    text: "The Education Portal team gets in touch to verify your details and set up your listing with you.",
  },
  {
    icon: FaEnvelopeOpenText,
    title: "We list your school",
    text: "Once verified, our team publishes your school on the portal — and parents start finding and enquiring.",
  },
];

const BENEFITS = [
  { icon: FaChartLine, title: "Real admission leads", text: "Genuine parent enquiries, not just page views." },
  { icon: FaShieldHalved, title: "Verified badge", text: "Stand out with a trusted, verified school profile." },
  { icon: FaGaugeHigh, title: "Full dashboard control", text: "Update fees, photos, facilities and details anytime." },
  { icon: FaWhatsapp, title: "Instant notifications", text: "Get new enquiries by email so you never miss a parent." },
  { icon: FaAward, title: "Featured placement", text: "Boost visibility in your area with featured spots." },
  { icon: FaStar, title: "Reviews & ratings", text: "Build reputation with real verified parent reviews." },
];

const UNLISTED = [
  "Parents can't find your school online",
  "Enquiries go to listed competitors",
  "No verified reviews or ratings",
  "Invisible in area & curriculum search",
];
const LISTED = [
  "Discovered by 50,000+ Dubai parents",
  "Direct admission leads every week",
  "Verified badge builds instant trust",
  "Top placement in search & compare",
];

const SchoolBenefits: React.FC = () => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => e.isIntersecting && setInView(true),
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div className="mb-10">
      {/* ===================== DEMAND / FOMO STRIP ===================== */}
      <div
        ref={ref}
        className="relative overflow-hidden rounded-[28px] bg-[#0b1f45] px-6 py-9 sm:px-10"
      >
        <div className="pointer-events-none absolute -right-16 -top-16 h-60 w-60 rounded-full bg-gold/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-52 w-52 rounded-full bg-green-600/25 blur-3xl" />

        <div className="relative text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-gold ring-1 ring-white/15">
            <FaRegClock /> Parents are searching right now
          </span>
          <h2 className="mx-auto mt-4 max-w-2xl text-2xl font-extrabold leading-tight text-white sm:text-[32px]">
            Every day you&apos;re not listed,{" "}
            <span className="text-gold">enquiries go to other schools.</span>
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/70">
            Thousands of Dubai parents use {SITE_NAME} to shortlist schools.
            Submit your details and our support team will get your school listed.
          </p>
        </div>

        <div className="relative mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
          {DEMAND.map((d) => (
            <DemandStat key={d.label} {...d} run={inView} />
          ))}
        </div>

        <div className="relative mt-8 text-center">
          <a
            href="#school-register-form"
            className="group inline-flex items-center gap-2 rounded-xl bg-gold px-7 py-3.5 text-sm font-bold text-[#0b1f45] shadow-[0_15px_35px_-12px_rgba(212,175,55,0.7)] transition hover:opacity-95"
          >
            Register Your School
            <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
          </a>
          <p className="mt-2 text-xs text-white/50">
            Submit the form · Our support team contacts you within 24 hours
          </p>
        </div>
      </div>

      {/* ===================== HOW IT WORKS ===================== */}
      <div className={`${CONTAINER} !w-full mt-10`}>
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#0b1f45] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-gold">
            How registration works
          </span>
          <h3 className="mt-3 text-xl font-extrabold text-blacky-light sm:text-2xl">
            List your school in 3 simple steps
          </h3>
          <p className="mx-auto mt-2 max-w-lg text-sm text-blacky-light/55">
            No instant self-listing — our team personally verifies every school
            before it goes live, so parents only see genuine, trusted schools.
          </p>
        </div>

        <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-3">
          {STEPS.map((s, i) => (
            <div
              key={s.title}
              className="relative rounded-2xl border border-gray-100 bg-white p-6 shadow-light"
            >
              <span className="absolute right-5 top-4 text-4xl font-black text-[#eef2f8]">
                {i + 1}
              </span>
              <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600/10 text-green-600">
                <s.icon className="text-lg" />
              </span>
              <p className="mt-4 text-base font-bold text-blacky-light">
                {s.title}
              </p>
              <p className="mt-1.5 text-sm text-blacky-light/60">{s.text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ===================== UNLISTED vs LISTED ===================== */}
      <div className="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-2xl border-2 border-red-100 bg-red-50/50 p-6">
          <p className="flex items-center gap-2 text-sm font-extrabold text-red-500">
            <FaCircleXmark /> Not listed
          </p>
          <ul className="mt-4 space-y-3">
            {UNLISTED.map((t) => (
              <li
                key={t}
                className="flex items-start gap-2.5 text-sm text-blacky-light/70"
              >
                <FaCircleXmark className="mt-0.5 shrink-0 text-red-300" />
                {t}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative overflow-hidden rounded-2xl border-2 border-green-600/30 bg-green-600/5 p-6">
          <span className="absolute right-4 top-4 rounded-full bg-green-600 px-2.5 py-1 text-[10px] font-bold text-white">
            RECOMMENDED
          </span>
          <p className="flex items-center gap-2 text-sm font-extrabold text-green-600">
            <FaCircleCheck /> Listed on {SITE_NAME}
          </p>
          <ul className="mt-4 space-y-3">
            {LISTED.map((t) => (
              <li
                key={t}
                className="flex items-start gap-2.5 text-sm font-medium text-blacky-light/80"
              >
                <FaCircleCheck className="mt-0.5 shrink-0 text-green-600" />
                {t}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ===================== BENEFITS GRID ===================== */}
      <div className="mt-10">
        <div className="text-center">
          <h3 className="text-xl font-extrabold text-blacky-light sm:text-2xl">
            Why 500+ Dubai schools list with us
          </h3>
        </div>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((b) => (
            <div
              key={b.title}
              className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-5 shadow-light transition hover:shadow-spread"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold/15 text-gold-dark">
                <b.icon />
              </span>
              <div>
                <p className="text-sm font-bold text-blacky-light">{b.title}</p>
                <p className="mt-1 text-xs text-blacky-light/60">{b.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= TESTIMONIAL + PROCESS CARD ================= */}
      <div className="mt-10 grid grid-cols-1 gap-4 lg:grid-cols-[1.3fr_0.7fr]">
        <div className="flex flex-col justify-center rounded-2xl bg-[#eef4fb] p-7">
          <div className="flex gap-1 text-gold">
            {Array.from({ length: 5 }).map((_, i) => (
              <FaStar key={i} className="text-sm" />
            ))}
          </div>
          <p className="mt-3 text-lg font-semibold leading-relaxed text-blacky-light">
            &ldquo;We started getting genuine parent enquiries within the first
            week of listing. The verified badge really helps parents trust
            us.&rdquo;
          </p>
          <div className="mt-4 flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e4fa3] text-sm font-bold text-white">
              R
            </span>
            <div className="leading-tight">
              <p className="text-sm font-bold text-blacky-light">
                Admissions Head
              </p>
              <p className="text-xs text-blacky-light/55">
                International School, Dubai
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col rounded-2xl border-2 border-green-600/30 bg-white p-7 shadow-light">
          <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-green-600">
            <FaClipboardCheck /> What happens after you submit
          </p>
          <ul className="mt-4 space-y-3 text-left">
            {[
              "Our support team calls to verify your school",
              "We help you complete your listing details",
              "Your school goes live on Education Portal",
            ].map((t, i) => (
              <li key={t} className="flex items-start gap-2.5">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-600 text-[11px] font-bold text-white">
                  {i + 1}
                </span>
                <span className="text-xs font-medium text-blacky-light/75">
                  {t}
                </span>
              </li>
            ))}
          </ul>
          <a
            href="#school-register-form"
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#173e82] to-green-600 px-5 py-3 text-sm font-bold text-white transition hover:opacity-95"
          >
            Register My School <FaArrowRight className="text-[11px]" />
          </a>
        </div>
      </div>

      {/* divider into the form */}
      <div className="mt-12 text-center">
        <p className="text-sm font-semibold text-blacky-light/50">
          Ready? Fill the quick form below — it takes under a minute.
        </p>
        <FaArrowRight className="mx-auto mt-2 rotate-90 text-green-600" />
      </div>
    </div>
  );
};

const DemandStat: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  value: number;
  suffix: string;
  label: string;
  run: boolean;
}> = ({ icon: Icon, value, suffix, label, run }) => {
  const n = useCountUp(value, run);
  const display =
    value >= 1000 ? `${(n / 1000).toFixed(n >= 1000 ? 0 : 1)}K` : `${n}`;
  return (
    <div className="rounded-2xl border border-white/10 bg-white/10 p-5 text-center backdrop-blur-sm">
      <span className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-xl bg-gold/20 text-gold">
        <Icon />
      </span>
      <p className="text-2xl font-extrabold text-white sm:text-3xl">
        {display}
        {suffix}
      </p>
      <p className="mt-1 text-xs text-white/65">{label}</p>
    </div>
  );
};

export default SchoolBenefits;
