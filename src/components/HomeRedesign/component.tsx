/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SITE_NAME } from "@/constants";
import {
  FaMagnifyingGlass,
  FaGraduationCap,
  FaUsers,
  FaCircleCheck,
  FaLocationDot,
  FaHeart,
  FaStar,
  FaHeadset,
  FaShieldHalved,
  FaArrowRight,
  FaQuoteLeft,
  FaBuildingColumns,
  FaMapLocationDot,
  FaBuilding,
  FaChildren,
  FaGlobe,
  FaFlag,
  FaEarthAmericas,
  FaScaleBalanced,
} from "react-icons/fa6";

// ---------------------------------------------------------------------------
// Home page (Dubai schools portal) — matches the approved mockup.
// 90% width container. Header is transparent over this hero and turns white on
// scroll (see Header component). Static placeholder data; wire to API later.
// ---------------------------------------------------------------------------

const CONTAINER = "mx-auto w-[90%] max-w-[1400px]";

const SCHOOL_TYPES = [
  "Day School",
  "Boarding School",
  "Day Boarding",
  "Play School",
  "Residential School",
];
const CURRICULA = [
  "CBSE",
  "ICSE",
  "IB",
  "IGCSE",
  "British",
  "American",
  "Other",
];
const AREAS = [
  "Downtown Dubai",
  "Al Barsha",
  "Jumeirah",
  "Emirates Hills",
  "Al Sufouh",
  "Dubai Marina",
];
const FEES = ["0 - 25K AED", "25 - 50K AED", "50 - 80K AED", "80K+ AED"];
const POPULAR = [
  "British Schools",
  "American Schools",
  "IB Schools",
  "Indian Schools",
  "Near Me",
];

const HERO_STATS = [
  { icon: FaBuildingColumns, value: "500+", label: "Schools Listed" },
  { icon: FaUsers, value: "50K+", label: "Happy Parents" },
  { icon: FaShieldHalved, value: "Verified", label: "Information" },
  { icon: FaMapLocationDot, value: "All Dubai Areas", label: "Covered" },
];

const TABS = [
  { key: "find", label: "Find Schools", icon: FaMagnifyingGlass },
  { key: "compare", label: "Compare Schools", icon: FaScaleBalanced },
  { key: "explore", label: "Explore Areas", icon: FaLocationDot },
];

const CATEGORIES = [
  {
    title: "Day Schools",
    desc: "Full-time learning",
    icon: FaBuildingColumns,
    bg: "#eaf1fb",
    fg: "#1e4fa3",
  },
  {
    title: "Boarding Schools",
    desc: "A home away from home",
    icon: FaBuilding,
    bg: "#fbf3dd",
    fg: "#b8952e",
  },
  {
    title: "British Curriculum",
    desc: "IGCSE, A-Levels",
    icon: FaGlobe,
    bg: "#eaf1fb",
    fg: "#1e4fa3",
  },
  {
    title: "American Curriculum",
    desc: "US High School Diploma",
    icon: FaFlag,
    bg: "#fbf3dd",
    fg: "#b8952e",
  },
  {
    title: "IB Schools",
    desc: "International Baccalaureate",
    icon: FaEarthAmericas,
    bg: "#eaf1fb",
    fg: "#1e4fa3",
  },
  {
    title: "Indian Curriculum",
    desc: "CBSE & ICSE",
    icon: FaGraduationCap,
    bg: "#fbf3dd",
    fg: "#b8952e",
  },
];

const WHY_POINTS = [
  {
    title: "Verified Information",
    text: "Accurate and up-to-date details",
    icon: FaCircleCheck,
  },
  {
    title: "Compare Schools",
    text: "Side by side comparison",
    icon: FaScaleBalanced,
  },
  { title: "Real Parent Reviews", text: "Honest experiences", icon: FaUsers },
  {
    title: "Expert Guidance",
    text: "Get help from our education experts",
    icon: FaHeadset,
  },
];

const FEATURED = [
  {
    name: "GEMS Wellington International School",
    area: "Al Sufouh, Dubai",
    curriculum: "British Curriculum",
    grades: "FS – Year 13",
    rating: "4.8",
    reviews: "320",
    img: "/day-school.avif",
    featured: true,
  },
  {
    name: "Dubai International Academy",
    area: "Emirates Hills, Dubai",
    curriculum: "IB Curriculum",
    grades: "FS – Year 13",
    rating: "4.7",
    reviews: "280",
    img: "/boarding-school.avif",
  },
  {
    name: "Jumeirah English Speaking School",
    area: "Jumeirah, Dubai",
    curriculum: "British Curriculum",
    grades: "FS – Year 13",
    rating: "4.6",
    reviews: "210",
    img: "/day-boarding.avif",
  },
  {
    name: "American School of Dubai",
    area: "Al Barsha, Dubai",
    curriculum: "American Curriculum",
    grades: "KG – Grade 12",
    rating: "4.5",
    reviews: "190",
    img: "/about.png",
  },
];

const AREAS_STRIP = [
  { name: "Downtown Dubai", icon: FaBuildingColumns, count: "48 Schools" },
  { name: "Dubai Marina", icon: FaBuilding, count: "36 Schools" },
  { name: "Jumeirah", icon: FaLocationDot, count: "52 Schools" },
  { name: "Al Barsha", icon: FaMapLocationDot, count: "41 Schools" },
  { name: "Emirates Hills", icon: FaGlobe, count: "29 Schools" },
  { name: "Al Sufouh", icon: FaEarthAmericas, count: "24 Schools" },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Parent, Dubai",
    text: "Education Portal made it so easy to find the right school for our daughter. The information is accurate and really helpful.",
  },
  {
    name: "Ahmed Khan",
    role: "Parent, Dubai",
    text: "The comparison feature saved us so much time. Highly recommended for all parents in Dubai.",
  },
  {
    name: "Sarah Ali",
    role: "Parent, Dubai",
    text: "Great platform with genuine reviews and detailed information. Helped us make the right decision!",
  },
];

const HomeRedesign: React.FC = () => {
  const router = useRouter();
  const [tab, setTab] = useState("find");
  const [type, setType] = useState("");
  const [curriculum, setCurriculum] = useState("");
  const [area, setArea] = useState("");
  const [fees, setFees] = useState("");

  const onSearch = () => {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (curriculum) params.set("curriculum", curriculum);
    if (area) params.set("area", area);
    if (fees) params.set("fees", fees);
    const qs = params.toString();
    router.push(qs ? `/schools?${qs}` : "/schools");
  };

  return (
    <main className="bg-[#eef4fb]">
      {/* ============================= HERO ============================= */}
      <section className="relative">
        <img
          src="/banner-home.jpeg"
          alt="Best schools in Dubai"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* dark navy gradient so white text is readable, skyline visible on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1f45]/95 via-[#0b1f45]/80 to-[#0b1f45]/30" />

        <div className={`relative ${CONTAINER} pt-14 pb-28 md:pt-20 md:pb-32`}>
          <div className="max-w-2xl text-white">
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-gold mb-3">
              Dubai&apos;s Leading School Search Platform
            </p>
            <h1 className="text-4xl md:text-5xl xl:text-6xl font-extrabold leading-[1.1]">
              Find the Right <br />
              School in <span className="text-gold">Dubai</span>
            </h1>
            <p className="mt-4 text-sm md:text-base text-white/85 max-w-xl">
              Explore, compare and choose from the top international, British,
              American, IB and more schools across Dubai. Give your child a
              brighter tomorrow.
            </p>

            {/* inline hero stats — bigger icons */}
            {/* Hero Stats */}
            <div className="mt-8 w-full max-w-4xl">
              <div className="grid grid-cols-4 gap-3 md:gap-6">
                {HERO_STATS.map((s) => (
                  <div
                    key={s.label}
                    className="flex items-center gap-2 md:gap-3"
                  >
                    <span className="h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-full bg-white/10 flex items-center justify-center text-gold text-lg md:text-xl">
                      <s.icon />
                    </span>

                    <div className="min-w-0 leading-tight">
                      <p className="text-base md:text-lg font-extrabold whitespace-nowrap">
                        {s.value}
                      </p>
                      <p className="text-[10px] md:text-xs text-white/70 whitespace-nowrap">
                        {s.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================== SEARCH CARD ========================== */}
      <div className={`relative z-30 ${CONTAINER} -mt-16 md:-mt-20 pb-4`}>
        <div className="bg-white rounded-xl shadow-[0_10px_35px_rgba(15,35,70,0.16)] border border-white overflow-hidden">
          {/* ================= TABS ================= */}
          <div className="flex items-center gap-1 px-3 pt-3 pb-2 border-b border-gray-100">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => {
                  setTab(t.key);

                  if (t.key !== "find") {
                    router.push("/schools");
                  }
                }}
                className={`
            inline-flex items-center gap-2
            rounded-lg
            px-4 py-2
            text-[13px]
            font-semibold
            transition-all
            whitespace-nowrap
            ${
              tab === t.key
                ? "bg-[#17458f] text-white shadow-sm"
                : "text-[#263b5f] hover:bg-[#f1f5fb]"
            }
          `}
              >
                <t.icon className="text-[13px]" />
                {t.label}
              </button>
            ))}
          </div>

          {/* ================= FILTERS ================= */}
          <div className="px-4 md:px-5 pt-3 pb-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] gap-3">
              {/* School Type */}
              <div>
                <label className="block mb-1 text-[11px] font-semibold text-[#5d6b82]">
                  School Type
                </label>

                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  className="
              h-10
              w-full
              rounded-lg
              border border-[#e1e6ee]
              bg-white
              px-3
              text-[13px]
              text-[#132d57]
              outline-none
              appearance-none
              cursor-pointer
              transition
              focus:border-[#17458f]
              focus:ring-2
              focus:ring-[#17458f]/10
            "
                >
                  <option value="">Select type</option>

                  {SCHOOL_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* Curriculum */}
              <div>
                <label className="block mb-1 text-[11px] font-semibold text-[#5d6b82]">
                  Curriculum
                </label>

                <select
                  value={curriculum}
                  onChange={(e) => setCurriculum(e.target.value)}
                  className="
              h-10
              w-full
              rounded-lg
              border border-[#e1e6ee]
              bg-white
              px-3
              text-[13px]
              text-[#132d57]
              outline-none
              appearance-none
              cursor-pointer
              transition
              focus:border-[#17458f]
              focus:ring-2
              focus:ring-[#17458f]/10
            "
                >
                  <option value="">Select curriculum</option>

                  {CURRICULA.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Area */}
              <div>
                <label className="block mb-1 text-[11px] font-semibold text-[#5d6b82]">
                  Area
                </label>

                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="
              h-10
              w-full
              rounded-lg
              border border-[#e1e6ee]
              bg-white
              px-3
              text-[13px]
              text-[#132d57]
              outline-none
              appearance-none
              cursor-pointer
              transition
              focus:border-[#17458f]
              focus:ring-2
              focus:ring-[#17458f]/10
            "
                >
                  <option value="">Select area</option>

                  {AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              {/* Fees */}
              <div>
                <label className="block mb-1 text-[11px] font-semibold text-[#5d6b82]">
                  Fees Range
                </label>

                <select
                  value={fees}
                  onChange={(e) => setFees(e.target.value)}
                  className="
              h-10
              w-full
              rounded-lg
              border border-[#e1e6ee]
              bg-white
              px-3
              text-[13px]
              text-[#132d57]
              outline-none
              appearance-none
              cursor-pointer
              transition
              focus:border-[#17458f]
              focus:ring-2
              focus:ring-[#17458f]/10
            "
                >
                  <option value="">Any range</option>

                  {FEES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <div className="flex items-end">
                <button
                  onClick={onSearch}
                  className="
              h-10
              w-full
              lg:w-auto
              min-w-[145px]
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-lg
              bg-[#17458f]
              hover:bg-[#123a78]
              px-5
              text-[13px]
              font-bold
              text-white
              shadow-sm
              transition-all
              whitespace-nowrap
            "
                >
                  Search Schools
                  <FaArrowRight className="text-[11px]" />
                </button>
              </div>
            </div>

            {/* ================= POPULAR SEARCHES ================= */}
            <div className="mt-2.5 flex items-center gap-2 flex-wrap text-[12px]">
              <span className="text-[#8a96a8] font-medium">Popular:</span>

              {POPULAR.map((p) => (
                <button
                  key={p}
                  onClick={() => router.push("/schools")}
                  className="
              text-[#17458f]
              hover:text-[#b8952e]
              font-medium
              transition-colors
              whitespace-nowrap
            "
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================== CATEGORIES ========================== */}
      <section className="bg-[#eef4fb]">
        <div className={`${CONTAINER} py-14`}>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-gold mb-2">
                Explore Top Categories
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-blacky-light">
                Popular School Categories
              </h2>
              <p className="text-sm text-blacky-light/60 mt-1">
                Discover the right school, tailored to your child&apos;s needs.
              </p>
            </div>
            <Link
              href="/schools"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-gold-dark"
            >
              View All Categories <FaArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((c) => (
              <Link
                key={c.title}
                href="/schools"
                className="group bg-white rounded-2xl p-4 border border-gray-100 hover:shadow-spread hover:-translate-y-1 transition-all duration-300 text-center"
              >
                <span
                  className="mx-auto h-14 w-14 rounded-xl flex items-center justify-center text-2xl mb-3"
                  style={{ backgroundColor: c.bg, color: c.fg }}
                >
                  <c.icon />
                </span>
                <p className="text-sm font-bold text-blacky-light leading-tight">
                  {c.title}
                </p>
                <p className="text-[11px] text-blacky-light/55 mt-0.5">
                  {c.desc}
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-green-600">
                  Explore{" "}
                  <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= FEATURED SCHOOLS ======================= */}
      <section className="bg-white">
        <div className={`${CONTAINER} py-14`}>
          <h2 className="text-2xl md:text-3xl font-extrabold text-blacky-light">
            Featured Schools in Dubai
          </h2>
          <p className="text-sm text-gold mt-1 mb-8">
            Discover some of the top-rated schools across Dubai.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURED.map((s) => (
              <div
                key={s.name}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-light hover:shadow-spread transition-shadow flex flex-col"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={s.img}
                    alt={s.name}
                    className="h-full w-full object-cover"
                  />
                  {s.featured && (
                    <span className="absolute top-3 left-3 rounded-md bg-gold px-2 py-1 text-[10px] font-bold text-white">
                      Featured
                    </span>
                  )}
                  <button
                    aria-label="Shortlist"
                    className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 flex items-center justify-center text-green-500 hover:text-gold-dark"
                  >
                    <FaHeart />
                  </button>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="text-sm font-bold text-blacky-light leading-snug min-h-[40px]">
                    {s.name}
                  </h3>
                  <p className="mt-1 flex items-center gap-1 text-xs text-blacky-light/60">
                    <FaLocationDot className="text-green-500" /> {s.area}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <span className="rounded-md bg-[#eef4fb] px-2 py-1 text-[11px] font-medium text-green-600">
                      {s.curriculum}
                    </span>
                    <span className="rounded-md bg-[#eef4fb] px-2 py-1 text-[11px] font-medium text-blacky-light/70">
                      {s.grades}
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs">
                    <FaStar className="text-gold" />
                    <span className="font-bold text-blacky-light">
                      {s.rating}
                    </span>
                    <span className="text-blacky-light/50">
                      ({s.reviews} reviews)
                    </span>
                  </div>
                  <Link
                    href="/schools"
                    className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg border border-green-600 py-2 text-xs font-semibold text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                  >
                    View Details <FaArrowRight className="text-[10px]" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================== WHY CHOOSE ========================== */}
      <section className="bg-white">
        <div
          className={`${CONTAINER} py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center`}
        >
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-500 mb-2">
              Why Choose {SITE_NAME}
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-blacky-light leading-snug">
              Making School Search <br /> Simple, Transparent &amp; Trusted
            </h2>
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-5">
              {WHY_POINTS.map((p) => (
                <div key={p.title} className="flex items-start gap-3">
                  <span className="h-11 w-11 shrink-0 rounded-full bg-green-600/10 text-green-600 flex items-center justify-center text-lg">
                    <p.icon />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-blacky-light">
                      {p.title}
                    </p>
                    <p className="text-xs text-blacky-light/60">{p.text}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/about"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-500 px-6 py-3 text-sm font-semibold text-white transition-colors"
            >
              Learn More About Us <FaArrowRight />
            </Link>
          </div>
          <div className="relative">
            <img
              src="/about.png"
              alt="Choosing the right school in Dubai"
              className="w-full h-[320px] object-cover rounded-2xl"
            />
            <div className="absolute bottom-4 right-4 bg-white rounded-xl shadow-spread px-4 py-3 flex items-center gap-2">
              <FaStar className="text-gold text-xl" />
              <div className="leading-none">
                <p className="text-lg font-extrabold text-blacky-light">
                  4.8/5
                </p>
                <p className="text-[11px] text-blacky-light/60">
                  Parent Satisfaction
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================== ADMISSIONS BANNER ====================== */}
      <section className="relative overflow-hidden">
        <img
          src="/admission-bg.png"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1f45] via-[#0b1f45]/94 to-[#0b1f45]/85" />
        {/* decorative glows */}
        <div className="pointer-events-none absolute -top-24 -right-16 h-72 w-72 rounded-full bg-gold/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 left-1/4 h-64 w-64 rounded-full bg-green-500/25 blur-3xl" />

        <div
          className={`relative ${CONTAINER} grid grid-cols-1 items-center gap-10 py-16 text-white lg:grid-cols-2 md:py-20`}
        >
          {/* left content */}
          <div>
            <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-gold/15 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-gold ring-1 ring-gold/30">
              Admissions Open for 2026-27
            </p>
            <h2 className="max-w-xl text-3xl font-extrabold leading-tight md:text-[42px]">
              Give Your Child a{" "}
              <span className="text-gold">Brighter Future</span> in Dubai
            </h2>
            <p className="mt-4 max-w-lg text-sm text-white/85 md:text-base">
              Explore the best schools and take the next step towards a world of
              opportunities. Our counsellors help you shortlist, compare and
              apply — completely free.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <button
                onClick={() => router.push("/schools")}
                className="group inline-flex items-center gap-2 rounded-xl bg-gold px-7 py-3.5 text-sm font-bold text-blacky-light shadow-[0_12px_30px_-10px_rgba(212,175,55,0.7)] transition hover:opacity-90"
              >
                Search Schools Now
                <FaArrowRight className="text-[12px] transition-transform group-hover:translate-x-1" />
              </button>
              <a
                href="#get-admission-help"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/5 px-7 py-3.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15"
              >
                <FaHeadset className="text-gold" /> Get Free Guidance
              </a>
            </div>
          </div>

          {/* right stat card */}
          <div className="lg:justify-self-end">
            <div className="grid w-full max-w-md grid-cols-2 gap-3 rounded-2xl border border-white/20 bg-[#0b1f45]/70 p-4 shadow-[0_25px_60px_-25px_rgba(0,0,0,0.7)] backdrop-blur-md sm:gap-4 sm:p-5">
              {[
                {
                  icon: FaBuildingColumns,
                  value: "500+",
                  label: "Schools Listed",
                },
                { icon: FaUsers, value: "50K+", label: "Happy Parents" },
                {
                  icon: FaScaleBalanced,
                  value: "Free",
                  label: "Compare & Apply",
                },
                {
                  icon: FaShieldHalved,
                  value: "Verified",
                  label: "Information",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl bg-white/10 p-4 ring-1 ring-white/15"
                >
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold/20 text-lg text-gold">
                    <s.icon />
                  </span>
                  <p className="mt-3 text-xl font-extrabold text-white">
                    {s.value}
                  </p>
                  <p className="text-[11px] text-white/75">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================= TESTIMONIALS ========================= */}
      <section className="bg-white">
        <div className={`${CONTAINER} py-16`}>
          <div className="flex items-end justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-extrabold text-blacky-light">
              What Parents Say
            </h2>
            <Link
              href="/schools"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-gold-dark"
            >
              View All Reviews <FaArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-[#f6f9fd] rounded-2xl p-6">
                <FaQuoteLeft className="text-gold text-2xl mb-3" />
                <p className="text-sm text-blacky-light/75 leading-relaxed min-h-[96px]">
                  {t.text}
                </p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div className="leading-tight">
                    <p className="text-sm font-bold text-blacky-light">
                      {t.name}
                    </p>
                    <p className="text-xs text-blacky-light/50">{t.role}</p>
                  </div>
                  <div className="ml-auto flex text-gold text-xs">
                    {"★★★★★"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== EXPLORE BY AREA ===================== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#123a78] via-green-600 to-green-500" />
        {/* decorative glows */}
        <div className="pointer-events-none absolute -top-20 right-1/4 h-64 w-64 rounded-full bg-gold/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />

        <div
          className={`relative ${CONTAINER} grid grid-cols-1 items-center gap-10 py-16 text-white lg:grid-cols-2`}
        >
          {/* left: heading + area cards */}
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.2em] text-gold">
              Explore by Location
            </p>
            <h2 className="text-2xl font-extrabold md:text-3xl">
              Find Schools in Your Preferred Area
            </h2>
            <p className="mt-3 max-w-md text-sm text-white/85">
              Search schools by popular areas across Dubai and find the best
              options near you.
            </p>

            <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {AREAS_STRIP.map((a) => (
                <Link
                  key={a.name}
                  href="/schools"
                  className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/10 px-4 py-3 transition hover:border-white/25 hover:bg-white/20"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gold/20 text-gold">
                    <a.icon />
                  </span>
                  <span className="min-w-0 leading-tight">
                    <span className="block truncate text-sm font-semibold">
                      {a.name}
                    </span>
                    <span className="block text-[11px] text-white/65">
                      {a.count}
                    </span>
                  </span>
                  <FaArrowRight className="ml-auto text-xs text-white/50 transition-transform group-hover:translate-x-1 group-hover:text-gold" />
                </Link>
              ))}
            </div>

            <Link
              href="/schools"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-bold text-green-600 transition-colors hover:bg-gold hover:text-white"
            >
              Explore All Dubai Areas <FaArrowRight />
            </Link>
          </div>

          {/* right: image with floating badge */}
          <div className="relative lg:justify-self-end">
            <img
              src="/search-bg.png"
              alt="Dubai school areas"
              className="h-[300px] w-full rounded-3xl object-cover shadow-[0_25px_60px_-20px_rgba(0,0,0,0.5)] ring-1 ring-white/20 md:h-[340px]"
            />
            <div className="absolute bottom-4 left-4 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-spread backdrop-blur">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-600/10 text-green-600">
                <FaLocationDot />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-extrabold text-blacky-light">
                  All Dubai Areas
                </p>
                <p className="text-[11px] text-blacky-light/60">
                  500+ verified schools
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HomeRedesign;
