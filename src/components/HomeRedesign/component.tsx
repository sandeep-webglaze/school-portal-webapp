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
} from "react-icons/fa6";

// ---------------------------------------------------------------------------
// Full home page redesign (Dubai schools portal).
// Self-contained: all data below is static placeholder content and every image
// points at a file already in /public/images (swap them anytime). Branding uses
// SITE_NAME from constants so the name stays changeable from one place.
// Colours come from the Tailwind theme (royal blue + gold).
// ---------------------------------------------------------------------------

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

const POPULAR = [
  "British Schools",
  "American Schools",
  "IB Schools",
  "Indian Schools",
  "Near Me",
];

const STATS_TOP = [
  { icon: FaBuildingColumns, value: "500+", label: "Schools Listed" },
  { icon: FaUsers, value: "50K+", label: "Parents Trust Us" },
  { icon: FaShieldHalved, value: "Verified", label: "Information" },
  { icon: FaMapLocationDot, value: "All Areas", label: "in Dubai" },
  { icon: FaHeadset, value: "Free", label: "Counselling Support" },
  { icon: FaHeart, value: "100%", label: "Independent Platform" },
];

const CATEGORIES = [
  {
    title: "Day Schools",
    desc: "Top day schools near you",
    icon: FaBuildingColumns,
    bg: "#eaf1fb",
    fg: "#1e4fa3",
  },
  {
    title: "Boarding Schools",
    desc: "Residential & boarding",
    icon: FaBuilding,
    bg: "#fbf3dd",
    fg: "#b8952e",
  },
  {
    title: "British Curriculum",
    desc: "GCSE, A-Levels & IGCSE",
    icon: FaGlobe,
    bg: "#eaf1fb",
    fg: "#1e4fa3",
  },
  {
    title: "American Curriculum",
    desc: "US high-school diploma",
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
    desc: "CBSE & ICSE schools",
    icon: FaGraduationCap,
    bg: "#fbf3dd",
    fg: "#b8952e",
  },
];

const WHY_POINTS = [
  "Verified & Updated School Information",
  "Compare Facilities, Fees & Curriculum",
  "Real Parent Reviews",
  "Expert Counselling Support",
  "Completely Free for Parents",
];

const FEATURED = [
  {
    name: "GEMS Wellington International School",
    area: "Al Sufouh, Dubai",
    curriculum: "British Curriculum",
    grades: "FS – Year 13",
    rating: "4.8",
    reviews: "256",
    img: "/images/day-school.avif",
  },
  {
    name: "Dubai International Academy",
    area: "Emirates Hills, Dubai",
    curriculum: "IB Curriculum",
    grades: "FS – Year 13",
    rating: "4.7",
    reviews: "189",
    img: "/images/boarding-school.avif",
  },
  {
    name: "Jumeirah English Speaking School",
    area: "Jumeirah, Dubai",
    curriculum: "British Curriculum",
    grades: "FS – Year 13",
    rating: "4.6",
    reviews: "120",
    img: "/images/day-boarding.avif",
  },
  {
    name: "American School of Dubai",
    area: "Al Barsha, Dubai",
    curriculum: "American Curriculum",
    grades: "KG – Grade 12",
    rating: "4.3",
    reviews: "210",
    img: "/images/home-banner3.avif",
  },
];

const STATS_STRIP = [
  { icon: FaGraduationCap, value: "500+", label: "Schools Listed" },
  { icon: FaUsers, value: "50K+", label: "Happy Parents" },
  { icon: FaStar, value: "4.8/5", label: "Average Rating" },
  { icon: FaLocationDot, value: "All Dubai Areas", label: "Covered" },
];

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    role: "Parent, Dubai",
    text: "Education Portal made it so easy for us to find the right school for our daughter. The information is accurate and really helpful!",
  },
  {
    name: "Ahmed Khan",
    role: "Parent, Dubai",
    text: "The comparison feature saved us so much time. Highly recommended for all parents in Dubai.",
  },
  {
    name: "Sarah Ali",
    role: "Parent, Dubai",
    text: "Great platform with genuine reviews and detailed school information. Helped us make the right decision!",
  },
];

const HomeRedesign: React.FC = () => {
  const router = useRouter();
  const [type, setType] = useState("");
  const [curriculum, setCurriculum] = useState("");
  const [area, setArea] = useState("");

  const onSearch = () => {
    const params = new URLSearchParams();
    if (type) params.set("type", type);
    if (curriculum) params.set("curriculum", curriculum);
    if (area) params.set("area", area);
    const qs = params.toString();
    router.push(qs ? `/schools?${qs}` : "/schools");
  };

  const selectClass =
    "h-12 w-full rounded-lg border border-gray-200 bg-white pl-10 pr-3 text-sm text-blacky-light outline-none focus:border-green-500 appearance-none cursor-pointer";

  return (
    <main className="bg-white">
      {/* ============================= HERO ============================= */}
      <section className="relative">
        <img
          src="/banner-bg.png"
          alt="Best schools in Dubai"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/80 to-white/30" />
        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-500 mb-3">
              Your child&apos;s brighter tomorrow starts here
            </p>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight text-blacky-light">
              Find the Best Schools <br />
              <span className="text-green-500">in Dubai</span>
            </h1>
            <p className="mt-4 text-sm md:text-base text-blacky-light/70 max-w-xl">
              Explore, compare and choose from the top international, British,
              American, IB and more schools across Dubai. Make the right choice
              for your child&apos;s future.
            </p>

            {/* Search card */}
            <div className="mt-6 bg-white rounded-xl shadow-spread border border-gray-100 p-3">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_1fr_auto] gap-3">
                <div className="relative">
                  <FaGraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" />
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">School Type</option>
                    {SCHOOL_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <FaBuildingColumns className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" />
                  <select
                    value={curriculum}
                    onChange={(e) => setCurriculum(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select Curriculum</option>
                    {CURRICULA.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="relative">
                  <FaLocationDot className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500" />
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className={selectClass}
                  >
                    <option value="">Select Area</option>
                    {AREAS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={onSearch}
                  className="h-12 inline-flex items-center justify-center gap-2 rounded-lg bg-green-600 hover:bg-green-500 px-6 text-sm font-semibold text-white transition-colors"
                >
                  <FaMagnifyingGlass /> Search Schools
                </button>
              </div>
            </div>

            {/* Popular searches */}
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-blacky-light/60 font-medium">
                Popular Searches:
              </span>
              {POPULAR.map((p) => (
                <button
                  key={p}
                  onClick={() => router.push("/schools")}
                  className="text-green-600 hover:text-gold-dark font-medium"
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ========================= TOP STATS BAR ========================= */}
      <section className="border-b border-gray-100 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-6">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {STATS_TOP.map((s) => (
              <div
                key={s.label}
                className="flex flex-col items-center text-center gap-1"
              >
                <s.icon className="text-2xl text-green-500" />
                <p className="text-base font-extrabold text-blacky-light leading-none mt-1">
                  {s.value}
                </p>
                <p className="text-xs text-blacky-light/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================== CATEGORIES ========================== */}
      <section className="bg-[#eef4fb]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-14">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-500 mb-2">
                Explore by Category
              </p>
              <h2 className="text-2xl md:text-3xl font-extrabold text-blacky-light">
                Find the Right School for Your Child
              </h2>
            </div>
            <Link
              href="/schools"
              className="hidden sm:inline-flex items-center gap-2 text-sm font-semibold text-green-600 hover:text-gold-dark"
            >
              View All Categories <FaArrowRight />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {CATEGORIES.map((c) => (
              <Link
                key={c.title}
                href="/schools"
                className="group relative bg-white rounded-2xl p-5 border border-gray-100 hover:border-transparent shadow-light hover:shadow-spread hover:-translate-y-1 transition-all duration-300 flex items-center gap-4 overflow-hidden"
              >
                <span
                  className="absolute left-0 top-0 h-full w-1.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: c.fg }}
                />
                <span
                  className="h-14 w-14 shrink-0 rounded-2xl flex items-center justify-center text-2xl transition-transform group-hover:scale-110"
                  style={{ backgroundColor: c.bg, color: c.fg }}
                >
                  <c.icon />
                </span>
                <div className="flex-1">
                  <p className="text-base font-bold text-blacky-light leading-tight">
                    {c.title}
                  </p>
                  <p className="text-xs text-blacky-light/55 mt-0.5">
                    {c.desc}
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-green-600">
                    Explore{" "}
                    <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================== WHY CHOOSE ========================== */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-500 mb-2">
              Why Choose {SITE_NAME}
            </p>
            <h2 className="text-2xl md:text-3xl font-extrabold text-blacky-light leading-snug">
              Making School Search <br /> Simple &amp; Stress-Free
            </h2>
            <p className="mt-4 text-sm text-blacky-light/70 max-w-md">
              We help parents find the right school with accurate information,
              genuine reviews, and expert guidance — all in one place.
            </p>
            <ul className="mt-6 space-y-3">
              {WHY_POINTS.map((p) => (
                <li
                  key={p}
                  className="flex items-center gap-3 text-sm text-blacky-light/80"
                >
                  <FaCircleCheck className="text-green-500 shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
            <Link
              href="/about"
              className="mt-7 inline-flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-500 px-6 py-3 text-sm font-semibold text-white transition-colors"
            >
              Start Exploring <FaArrowRight />
            </Link>
          </div>
          <div className="relative">
            <img
              src="/img-search-card.png"
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

      {/* ======================= FEATURED SCHOOLS ======================= */}
      <section className="bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 pb-16">
          <h2 className="text-2xl md:text-3xl font-extrabold text-blacky-light">
            Featured Schools in Dubai
          </h2>
          <p className="text-sm text-blacky-light/60 mt-1 mb-8">
            Discover some of the top-rated schools across Dubai
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURED.map((s) => (
              <div
                key={s.name}
                className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-light hover:shadow-spread transition-shadow flex flex-col"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={s.img}
                    alt={s.name}
                    className="h-full w-full object-cover"
                  />
                  <button
                    aria-label="Shortlist school"
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

      {/* ======================== STATS STRIP ======================== */}
      <section className="bg-white pb-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="rounded-2xl bg-[#eef4fb] py-8 px-6 grid grid-cols-2 md:grid-cols-4 gap-6">
            {STATS_STRIP.map((s) => (
              <div
                key={s.label}
                className="flex items-center gap-3 justify-center"
              >
                <s.icon className="text-2xl text-green-500" />
                <div className="leading-tight">
                  <p className="text-lg font-extrabold text-blacky-light">
                    {s.value}
                  </p>
                  <p className="text-xs text-blacky-light/60">{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== LEADING PLATFORM BAND ==================== */}
      <section className="bg-white pb-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-blacky-light">
              Dubai&apos;s Leading School Search Platform
            </h2>
            <p className="mt-4 text-sm text-blacky-light/70 max-w-lg">
              Whether you&apos;re looking for British, American, IB, Indian or
              other international curricula, {SITE_NAME} helps you make an
              informed decision. Compare fees, facilities, location, and more —
              all in one place.
            </p>
            <Link
              href="/about"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-500 px-6 py-3 text-sm font-semibold text-white transition-colors"
            >
              Learn More About Us <FaArrowRight />
            </Link>
          </div>
          <div className="flex justify-center">
            <img
              src="/find-ld.png"
              alt="Dubai school search"
              className="max-h-[240px] w-auto object-contain"
            />
          </div>
        </div>
      </section>

      {/* ====================== ADMISSIONS BANNER ====================== */}
      <section className="bg-white pb-16">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="relative overflow-hidden rounded-2xl">
            <img
              src="/banner-bg.png"
              alt="Admissions now open in Dubai"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/95 via-green-600/70 to-green-600/10" />
            <div className="relative grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6 items-center p-6 sm:p-10">
              {/* Left text */}
              <div className="text-white max-w-md">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight">
                  Admissions Now Open <br /> for{" "}
                  <span className="text-gold">2026–27</span>
                </h2>
                <p className="mt-3 text-sm text-white/85">
                  Take the next step towards your child&apos;s future.
                </p>
                <button
                  onClick={() => router.push("/schools")}
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-green-600 hover:bg-gold hover:text-white transition-colors"
                >
                  Explore Schools <FaArrowRight />
                </button>
              </div>
              {/* Right quick-links card */}
              <div className="rounded-xl bg-white/90 backdrop-blur p-3 shadow-spread">
                {[
                  { icon: FaBuildingColumns, label: "Day Schools" },
                  { icon: FaBuilding, label: "Boarding Schools" },
                  { icon: FaChildren, label: "Nursery & Early Years" },
                  { icon: FaHeart, label: "Special Needs Schools" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href="/schools"
                    className="group flex items-center gap-3 rounded-lg px-3 py-2.5 hover:bg-[#eef4fb] transition-colors"
                  >
                    <span className="h-9 w-9 shrink-0 rounded-full bg-[#eef4fb] flex items-center justify-center text-green-600 group-hover:bg-green-600 group-hover:text-white transition-colors">
                      <item.icon />
                    </span>
                    <span className="text-sm font-semibold text-blacky-light">
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================= TESTIMONIALS ========================= */}
      <section className="bg-[#eef4fb]">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-green-500 mb-2">
            Testimonials
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-blacky-light mb-8">
            What Parents Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-xl p-6 shadow-light"
              >
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

      {/* ============================ CTA ============================ */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-green-500" />
        <div className="relative max-w-[1200px] mx-auto px-4 sm:px-6 py-14 text-center">
          <h2 className="text-2xl md:text-3xl font-extrabold text-white">
            Ready to Find the Perfect School?
          </h2>
          <p className="mt-3 text-sm text-white/85 max-w-xl mx-auto">
            Join thousands of parents who trust {SITE_NAME} for their
            child&apos;s education journey.
          </p>
          <button
            onClick={() => router.push("/schools")}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-7 py-3 text-sm font-bold text-green-600 hover:bg-gold hover:text-white transition-colors"
          >
            Search Schools Now <FaArrowRight />
          </button>
        </div>
      </section>
    </main>
  );
};

export default HomeRedesign;
