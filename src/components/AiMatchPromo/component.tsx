"use client";

// ---------------------------------------------------------------------------
// AiMatchPromo — a bold, eye-catching home-page banner that pulls parents into
// the AI School Match quiz. Drop <AiMatchPromo /> anywhere on the home page
// (a good spot is right after the hero / search card, or before Testimonials).
// Brand-consistent (royal blue + gold), animated sparkle, single strong CTA.
// ---------------------------------------------------------------------------

import React from "react";
import Link from "next/link";
import {
  FaWandMagicSparkles,
  FaArrowRight,
  FaBookOpen,
  FaMoneyBillWave,
  FaLocationDot,
  FaStar,
} from "react-icons/fa6";

const CONTAINER = "mx-auto w-[90%] max-w-[1280px]";

const CHIPS = [
  { icon: FaBookOpen, text: "Curriculum" },
  { icon: FaMoneyBillWave, text: "Your budget" },
  { icon: FaLocationDot, text: "Near you" },
  { icon: FaStar, text: "Top rated" },
];

const AiMatchPromo: React.FC = () => {
  return (
    <section className={`${CONTAINER} py-12`}>
      <div className="relative overflow-hidden rounded-[28px] bg-[#0b1f45] px-6 py-10 sm:px-10 md:py-12">
        {/* glows */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-12 bottom-0 h-56 w-56 rounded-full bg-green-600/30 blur-3xl" />

        <div className="relative grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          {/* left copy */}
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gold ring-1 ring-white/15">
              <FaWandMagicSparkles /> New · AI-Powered
            </span>
            <h2 className="mt-4 text-2xl font-extrabold leading-tight text-white sm:text-3xl md:text-[34px]">
              Not sure which school fits?{" "}
              <span className="text-gold">Let our AI find it.</span>
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm text-white/75 lg:mx-0 md:text-base">
              Answer 5 quick questions and get a personalised shortlist of the
              best-matched Dubai schools — with a match score and the reasons
              why. Takes under a minute, completely free.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-2 lg:justify-start">
              {CHIPS.map((c) => (
                <span
                  key={c.text}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-white/85 ring-1 ring-white/10"
                >
                  <c.icon className="text-gold" /> {c.text}
                </span>
              ))}
            </div>

            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row lg:items-center lg:justify-start">
              <Link
                href="/school-match"
                className="group inline-flex items-center gap-2 rounded-xl bg-gold px-7 py-3.5 text-sm font-bold text-[#0b1f45] shadow-[0_15px_35px_-12px_rgba(212,175,55,0.7)] transition hover:opacity-95"
              >
                <FaWandMagicSparkles />
                Start AI School Match
                <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" />
              </Link>
              <span className="text-xs text-white/55">
                No sign-up needed · 60 seconds
              </span>
            </div>
          </div>

          {/* right visual — floating match card */}
          <div className="hidden justify-center lg:flex">
            <div className="relative w-full max-w-xs">
              <div className="rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold/20 text-gold">
                      <FaStar />
                    </span>
                    <div>
                      <p className="text-xs font-bold text-white">
                        Best Match Found
                      </p>
                      <p className="text-[10px] text-white/60">
                        Based on your answers
                      </p>
                    </div>
                  </div>
                  <span className="rounded-full bg-green-600 px-2.5 py-1 text-xs font-extrabold text-white">
                    96%
                  </span>
                </div>
                <div className="mt-4 space-y-2">
                  {["British curriculum", "Within budget", "3.2 km away"].map(
                    (r) => (
                      <div
                        key={r}
                        className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-xs text-white/85"
                      >
                        <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                        {r}
                      </div>
                    )
                  )}
                </div>
              </div>
              {/* second peeking card */}
              <div className="absolute -bottom-4 -right-3 -z-0 h-20 w-40 rotate-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AiMatchPromo;
