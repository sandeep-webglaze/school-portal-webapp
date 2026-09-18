/* eslint-disable @next/next/no-img-element */
import React from "react";
import Link from "next/link";
import { SITE_NAME } from "@/constants";
import {
  FaBullseye,
  FaEye,
  FaCircleCheck,
  FaShieldHalved,
  FaHandshake,
  FaUsers,
  FaArrowRight,
  FaBuildingColumns,
  FaStar,
  FaLocationDot,
  FaHeadset,
} from "react-icons/fa6";

const CONTAINER = "mx-auto w-[90%] max-w-[1280px]";

const STATS = [
  { icon: FaBuildingColumns, value: "320+", label: "Verified Schools" },
  { icon: FaUsers, value: "50,000+", label: "Happy Parents" },
  { icon: FaStar, value: "4.7", label: "Average Rating" },
  { icon: FaLocationDot, value: "20+", label: "Areas in Dubai" },
];

const VALUES = [
  {
    icon: FaShieldHalved,
    title: "Verified & Trusted",
    text: "Every school profile is checked for accurate curriculum, fees and contact details before it goes live.",
    bg: "#e7eefc",
    fg: "#1e4fa3",
  },
  {
    icon: FaHandshake,
    title: "Independent Guidance",
    text: "We are not owned by any school group — our recommendations are unbiased and always free for parents.",
    bg: "#fbf1d9",
    fg: "#c79a2e",
  },
  {
    icon: FaUsers,
    title: "Parents First",
    text: "Real parent reviews and honest comparisons so you can decide with confidence, not guesswork.",
    bg: "#dff3ec",
    fg: "#1a9c78",
  },
];

const POINTS = [
  "Verified & regularly updated school information",
  "Compare facilities, fees & curriculum side by side",
  "Genuine, moderated parent reviews",
  "Free expert admission guidance",
];

const AboutContent = () => {
  return (
    <main className="bg-white">
      {/* ============================= HERO (left aligned) ============================= */}
      <section className="relative overflow-hidden bg-[#0b1f45]">
        <img
          src="/images/banner-home.jpeg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1f45] via-[#0b1f45]/95 to-[#0b1f45]/60" />
        <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />

        <div
          className={`relative ${CONTAINER} grid grid-cols-1 items-center gap-10 py-16 md:py-20 lg:grid-cols-[1.1fr_0.9fr]`}
        >
          <div className="text-left text-white">
            <span className="inline-flex items-center rounded-lg bg-gold/15 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gold ring-1 ring-gold/30">
              About Us
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-[1.1] md:text-5xl">
              Helping Dubai&apos;s parents find the{" "}
              <span className="text-gold">right school</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm text-white/80 md:text-base">
              {SITE_NAME} is a school discovery and admission-guidance platform
              built for families in Dubai. We bring every school&apos;s details,
              fees and reviews into one place so choosing the right school is
              simple, transparent and stress-free.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/schools"
                className="group inline-flex items-center gap-2 rounded-xl bg-gold px-7 py-3.5 text-sm font-bold text-blacky-light shadow-[0_12px_30px_-10px_rgba(212,175,55,0.7)] transition hover:opacity-90"
              >
                Explore Schools
                <FaArrowRight className="text-[12px] transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/register-school"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15"
              >
                <FaHeadset className="text-gold" /> Get Admission Help
              </Link>
            </div>
          </div>

          <div className="relative lg:justify-self-end">
            <img
              src="/about.png"
              alt={`${SITE_NAME} — school discovery in Dubai`}
              className="h-[300px] w-full rounded-3xl object-cover shadow-[0_25px_60px_-20px_rgba(0,0,0,0.5)] ring-1 ring-white/15 lg:h-[380px]"
            />
            <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-spread backdrop-blur">
              <FaStar className="text-xl text-gold" />
              <div className="leading-none">
                <p className="text-lg font-extrabold text-blacky-light">4.8/5</p>
                <p className="text-[11px] text-blacky-light/60">
                  Parent Satisfaction
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================= STATS ============================= */}
      <section className={`${CONTAINER} relative z-10 -mt-8`}>
        <div className="grid grid-cols-2 gap-4 rounded-2xl bg-white p-6 shadow-[0_15px_40px_-20px_rgba(15,35,70,0.3)] lg:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.label} className="flex items-center justify-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-600/10 text-green-600">
                <s.icon />
              </span>
              <div className="leading-tight">
                <p className="text-xl font-extrabold text-blacky-light">
                  {s.value}
                </p>
                <p className="text-[11px] text-blacky-light/55">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============================= WHO WE ARE ============================= */}
      <section className={`${CONTAINER} grid grid-cols-1 items-center gap-10 py-16 lg:grid-cols-2`}>
        <div className="relative order-2 lg:order-1">
          <img
            src="/search-bg.png"
            alt={`${SITE_NAME} — Dubai schools`}
            className="h-[340px] w-full rounded-3xl object-cover shadow-spread"
          />
        </div>
        <div className="order-1 lg:order-2">
          <span className="inline-flex items-center rounded-lg bg-[#0b1f45] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
            Who We Are
          </span>
          <h2 className="mt-3 text-2xl font-extrabold text-blacky-light md:text-3xl">
            One place for every school in Dubai
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-blacky-light/70">
            Finding the right school is one of the most important decisions a
            family makes. {SITE_NAME} was created to make that decision easier —
            with verified information, side-by-side comparisons and honest
            reviews across British, American, IB, Indian and other curricula in
            Dubai.
          </p>
          <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {POINTS.map((p) => (
              <li
                key={p}
                className="flex items-start gap-3 text-sm text-blacky-light/80"
              >
                <FaCircleCheck className="mt-0.5 shrink-0 text-green-500" />
                {p}
              </li>
            ))}
          </ul>
          <Link
            href="/schools"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-green-500"
          >
            Explore Schools <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* ============================= MISSION & VISION ============================= */}
      <section className="bg-[#eef4fb]">
        <div className={`${CONTAINER} grid grid-cols-1 gap-6 py-16 md:grid-cols-2`}>
          <div className="rounded-2xl bg-white p-8 shadow-light">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eaf1fb] text-xl text-green-600">
              <FaBullseye />
            </span>
            <h3 className="mt-4 text-xl font-bold text-blacky-light">
              Our Mission
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-blacky-light/70">
              To simplify the school search for every parent in Dubai — giving
              them accurate information and free, unbiased guidance so every
              child finds a school where they can thrive.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-8 shadow-light">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fbf3dd] text-xl text-gold-dark">
              <FaEye />
            </span>
            <h3 className="mt-4 text-xl font-bold text-blacky-light">
              Our Vision
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-blacky-light/70">
              A future where choosing a school is transparent and stress-free —
              where families make confident decisions backed by verified data
              and real experiences.
            </p>
          </div>
        </div>
      </section>

      {/* ============================= VALUES ============================= */}
      <section className={`${CONTAINER} py-16`}>
        <div className="mb-10 text-left">
          <span className="inline-flex items-center rounded-lg bg-[#0b1f45] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
            What We Stand For
          </span>
          <h2 className="mt-3 text-2xl font-extrabold text-blacky-light md:text-3xl">
            The principles behind everything we build
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {VALUES.map((v) => (
            <div
              key={v.title}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-light transition-all duration-300 hover:-translate-y-1 hover:shadow-spread"
            >
              <span
                className="flex h-12 w-12 items-center justify-center rounded-xl text-xl"
                style={{ backgroundColor: v.bg, color: v.fg }}
              >
                <v.icon />
              </span>
              <h3 className="mt-4 text-lg font-bold text-blacky-light">
                {v.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-blacky-light/70">
                {v.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================= CTA ============================= */}
      <section className="relative overflow-hidden bg-[#0b1f45]">
        <div className="pointer-events-none absolute -top-24 right-1/4 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
        <div
          className={`relative ${CONTAINER} grid grid-cols-1 items-center gap-6 py-14 text-white md:grid-cols-[1.4fr_0.6fr]`}
        >
          <div>
            <h2 className="text-2xl font-extrabold md:text-3xl">
              Ready to find the perfect school?
            </h2>
            <p className="mt-3 max-w-xl text-sm text-white/80">
              Start exploring verified schools across Dubai with {SITE_NAME} —
              it&apos;s free.
            </p>
          </div>
          <div className="md:justify-self-end">
            <Link
              href="/schools"
              className="inline-flex items-center gap-2 rounded-xl bg-gold px-7 py-3.5 text-sm font-bold text-blacky-light transition hover:opacity-90"
            >
              Search Schools <FaArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default AboutContent;
