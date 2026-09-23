/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { SITE_NAME } from "@/constants";
import { getAllSchools } from "@/api/schools/ListofSchools";
import { SchoolCardSkeleton } from "@/components/Shimmer";
import { Picker } from "@/components/Picker";
import {
  FaMagnifyingGlass,
  FaGraduationCap,
  FaUsers,
  FaLocationDot,
  FaHeart,
  FaStar,
  FaHeadset,
  FaShieldHalved,
  FaArrowRight,
  FaChevronDown,
  FaChevronLeft,
  FaChevronRight,
  FaTag,
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
  { icon: FaMapLocationDot, value: "All Areas", label: "Covered" },
];

const TABS = [
  { key: "find", label: "Find Schools", icon: FaMagnifyingGlass },
  { key: "compare", label: "Compare Schools", icon: FaScaleBalanced },
  { key: "explore", label: "Explore Areas", icon: FaLocationDot },
];

const CATEGORIES = [
  {
    title: "Day Schools",
    desc: "Full-time day learning",
    icon: FaBuildingColumns,
    bg: "#eaf1fb",
    fg: "#1e4fa3",
  },
  {
    title: "Boarding Schools",
    desc: "Live & learn on campus",
    icon: FaBuilding,
    bg: "#fbf3dd",
    fg: "#b8952e",
  },
  {
    title: "Day Boarding",
    desc: "Best of both worlds",
    icon: FaScaleBalanced,
    bg: "#eaf1fb",
    fg: "#1e4fa3",
  },
  {
    title: "Play Schools",
    desc: "Early years & nursery",
    icon: FaChildren,
    bg: "#fbf3dd",
    fg: "#b8952e",
  },
  {
    title: "Residential Schools",
    desc: "Full residential care",
    icon: FaGraduationCap,
    bg: "#eaf1fb",
    fg: "#1e4fa3",
  },
  {
    title: "Special Needs",
    desc: "Inclusive education",
    icon: FaHeart,
    bg: "#fbf3dd",
    fg: "#b8952e",
  },
];

const WHY_POINTS = [
  {
    title: "Trusted & Verified",
    text: "Only genuine and verified schools listed",
    icon: FaGraduationCap,
    bg: "#e7eefc",
    fg: "#1e4fa3",
  },
  {
    title: "Compare Easily",
    text: "Compare curriculum, fees, facilities & more",
    icon: FaMagnifyingGlass,
    bg: "#fbf1d9",
    fg: "#c79a2e",
  },
  {
    title: "Real Parent Reviews",
    text: "Get honest feedback from parents",
    icon: FaUsers,
    bg: "#dff3ec",
    fg: "#1a9c78",
  },
  {
    title: "Expert Guidance",
    text: "Our education experts are always here to help",
    icon: FaHeart,
    bg: "#fce4ec",
    fg: "#e0517a",
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

const BOARDS = [
  { name: "British", icon: FaGlobe },
  { name: "American", icon: FaFlag },
  { name: "IB", icon: FaEarthAmericas },
  { name: "CBSE", icon: FaGraduationCap },
  { name: "ICSE", icon: FaBuildingColumns },
  { name: "IGCSE", icon: FaGlobe },
];

const STEPS = [
  {
    icon: FaMagnifyingGlass,
    title: "Search Schools",
    text: "Filter by area, curriculum, fees and facilities to find the right fit.",
  },
  {
    icon: FaScaleBalanced,
    title: "Compare",
    text: "See schools side by side — fees, ratings and real parent reviews.",
  },
  {
    icon: FaHeadset,
    title: "Enquire",
    text: "Request details or a free callback from our expert counsellors.",
  },
  {
    icon: FaGraduationCap,
    title: "Get Admission",
    text: "We guide you through the admission process, start to finish.",
  },
];

const TRENDING = [
  {
    name: "GEMS Wellington International School",
    area: "Al Sufouh, Dubai",
    curriculum: "British",
    rating: "4.8",
    img: "/day-school.avif",
  },
  {
    name: "Dubai International Academy",
    area: "Emirates Hills, Dubai",
    curriculum: "IB",
    rating: "4.7",
    img: "/boarding-school.avif",
  },
  {
    name: "Jumeirah English Speaking School",
    area: "Jumeirah, Dubai",
    curriculum: "British",
    rating: "4.6",
    img: "/day-boarding.avif",
  },
  {
    name: "American School of Dubai",
    area: "Al Barsha, Dubai",
    curriculum: "American",
    rating: "4.5",
    img: "/about.png",
  },
  {
    name: "Delhi Private School",
    area: "Al Quoz, Dubai",
    curriculum: "CBSE",
    rating: "4.5",
    img: "/play-school.avif",
  },
  {
    name: "Repton School Dubai",
    area: "Nad Al Sheba, Dubai",
    curriculum: "British",
    rating: "4.7",
    img: "/boarding-school.avif",
  },
];

const FAQS = [
  {
    q: "Is Education Portal free for parents?",
    a: "Yes — searching, comparing and requesting admission help is completely free for parents. We never charge you.",
  },
  {
    q: "How do I find the right school for my child?",
    a: "Use the search and filters (area, curriculum, fees, facilities) to shortlist schools, compare them side by side, then request details or a callback.",
  },
  {
    q: "Can you help with the admission process?",
    a: "Absolutely. Leave your details in Get Admission Help and our counsellors will guide you from shortlisting to final admission.",
  },
  {
    q: "Are the schools and information verified?",
    a: "Yes. Every listed school and its information is verified and kept up to date, so you can decide with confidence.",
  },
  {
    q: "Which curriculums are covered?",
    a: "British, American, IB, CBSE, ICSE, IGCSE and more — across all major areas of Dubai.",
  },
];

const HomeRedesign: React.FC = () => {
  const router = useRouter();
  const [tab, setTab] = useState("find");
  const [type, setType] = useState("");
  const [curriculum, setCurriculum] = useState("");
  const [area, setArea] = useState("");
  const [fees, setFees] = useState("");
  const trackRef = useRef<HTMLDivElement>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [trending, setTrending] = useState<any[]>([]);
  const [trLoading, setTrLoading] = useState(true);
  const scrollTrending = (dir: number) =>
    trackRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });

  useEffect(() => {
    getAllSchools({})
      .then((res) => {
        const list = res?.data?.schools;
        if (list && list.length) {
          setTrending(
            list.slice(0, 8).map((s: any) => ({
              name: s.name,
              area: s.city?.city ? `${s.city.city}, ${s.city.state || "Dubai"}` : "Dubai",
              curriculum: s.schoolBoards?.[0]?.name ?? "School",
              rating: s.avgRating ? s.avgRating.toFixed(1) : "New",
              img:
                s.images?.[0] && s.images[0].startsWith("http")
                  ? s.images[0]
                  : "/day-school.avif",
              slug: s.slug,
            })),
          );
        } else {
          setTrending(TRENDING);
        }
      })
      .catch(() => setTrending(TRENDING))
      .finally(() => setTrLoading(false));
  }, []);

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
    <main className="bg-white">
      {/* ============================= HERO ============================= */}
      <section className="relative">
        <img
          src="/banner-home.jpeg"
          alt="Best schools in Dubai"
          className="absolute inset-0 h-full w-full object-cover"
        />
        {/* dark navy gradient so white text is readable, skyline visible on the right */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1f45] via-[#0b1f45]/50 to-[#0b1f45]/0" />
        {/* <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/65 to-white/10" /> */}
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
                    <span className="h-10 w-10 md:h-12 md:w-12 shrink-0 rounded-full bg-white/20 flex items-center justify-center text-gold text-lg md:text-xl">
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
      <div className={`relative z-30 ${CONTAINER} -mt-20 md:-mt-24 pb-4`}>
        <div
          className="
      relative
      rounded-[26px]
      border-x border-b-0
      border-x-[#c7d3ea]
      border-t-[6px] border-t-[#1e4fa3]
      bg-white
    "
        >
          {/* ================= TOP TABS ================= */}
          <div className="flex flex-col gap-3 border-b border-[#edf1f7] px-5 pt-5 sm:flex-row sm:items-center sm:justify-between md:px-7">
            <div className="flex items-center gap-2 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {TABS.map((t) => {
                const active = tab === t.key;

                return (
                  <button
                    key={t.key}
                    onClick={() => {
                      setTab(t.key);

                      if (t.key !== "find") {
                        router.push("/schools");
                      }
                    }}
                    className={`
                group
                inline-flex
                min-h-[50px]
                shrink-0
                items-center
                gap-3
                rounded-2xl
                px-5
                text-sm
                font-bold
                transition-all
                duration-200

                ${
                  active
                    ? `
                      bg-gradient-to-r
                      from-[#1764dc]
                      to-[#1d75ed]
                      text-white
                    `
                    : `
                      border
                      border-gold
                      bg-whtie
                      text-[#30466f]
                      hover:border-[#bcd0ee]
                      hover:bg-[#f7faff]
                    `
                }
              `}
                  >
                    <span
                      className={`
                  flex h-8 w-8 items-center justify-center rounded-xl
                  ${active ? "bg-white/15" : "bg-[#eef4ff] text-[#2463c5]"}
                `}
                    >
                      <t.icon className="text-sm" />
                    </span>

                    <span>{t.label}</span>

                    {t.key === "find" && (
                      <span
                        className={`
                    hidden text-[10px] font-medium sm:block
                    ${active ? "text-white/70" : "text-[#8a99b2]"}
                  `}
                      >
                        Search & Explore
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Right information badge */}
            <div className="mb-4 hidden items-center gap-3 rounded-2xl bg-[#f1f7ff] px-5 py-3 lg:flex">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#1764dc] shadow-sm">
                <FaGraduationCap />
              </span>

              <div className="leading-tight">
                <p className="text-xs font-bold text-[#173b72]">
                  Quality Education
                </p>
                <p className="text-[11px] text-[#8190a8]">
                  For a Brighter Tomorrow
                </p>
              </div>

              <FaArrowRight className="ml-3 text-xs text-[#1764dc]" />
            </div>
          </div>

          {/* ================= FILTER AREA ================= */}
          <div className="px-5 py-5 md:px-7 md:py-6">
            <div
              className="
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-2
          lg:grid-cols-[1fr_1fr_1fr_1fr_190px]
          xl:gap-5
        "
            >
              {/* School Type */}
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-black">
                  School Type
                </label>

                <Picker
                  icon={FaBuildingColumns}
                  value={type}
                  onChange={setType}
                  options={SCHOOL_TYPES}
                  placeholder="Select school type"
                />
              </div>

              {/* Curriculum */}
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-black">
                  Curriculum
                </label>

                <Picker
                  icon={FaGlobe}
                  value={curriculum}
                  onChange={setCurriculum}
                  options={CURRICULA}
                  placeholder="Select curriculum"
                />
              </div>

              {/* Area */}
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-black">
                  Area
                </label>

                <Picker
                  icon={FaLocationDot}
                  value={area}
                  onChange={setArea}
                  options={AREAS}
                  placeholder="Select area"
                />
              </div>

              {/* Fees */}
              <div>
                <label className="mb-2 block text-xs font-medium uppercase tracking-wide text-black">
                  Fees Range
                </label>

                <Picker
                  icon={FaTag}
                  value={fees}
                  onChange={setFees}
                  options={FEES}
                  placeholder="Any range"
                />
              </div>

              {/* Search */}
              <div className="flex items-end">
                <button
                  onClick={onSearch}
                  className="
              group
              flex
              h-[56px]
              w-full
              items-center
              justify-center
              gap-3
              rounded-2xl
              bg-gradient-to-r
              from-[#1459c7]
              to-[#2477ed]
              px-5
              text-sm
              font-bold
              text-white
              shadow-[0_14px_30px_-10px_rgba(20,89,199,0.65)]
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-[0_18px_35px_-10px_rgba(20,89,199,0.7)]
            "
                >
                  {/* <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15">
                    <FaMagnifyingGlass className="text-xs" />
                  </span> */}

                  <span>Search Schools</span>

                  {/* <FaArrowRight className="text-xs transition-transform group-hover:translate-x-1" /> */}
                </button>
              </div>
            </div>

            {/* ================= POPULAR SEARCHES ================= */}
            <div
              className="
          mt-6
          flex
          flex-wrap
          items-center
          gap-2.5
          border-t
          border-[#edf1f7]
          pt-5
        "
            >
              <span className="mr-1 text-xs font-bold text-[#1c3463]">
                Popular Searches:
              </span>

              {POPULAR.map((p) => (
                <button
                  key={p}
                  onClick={() => router.push("/schools")}
                  className="
              inline-flex
              items-center
              rounded-full
              border
              border-[#063285]/40
              bg-[#f9fbfe]
              px-4
              py-2
              text-[11px]
              font-semibold
              text-[#063285]
              transition-all
              hover:border-gold
              hover:bg-[#063285]
              hover:text-white
            "
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => router.push("/schools")}
                className="
            ml-auto
            hidden
            items-center

            text-xs
              rounded-full
              border
              border-[#063285]/40
              bg-[#f9fbfe]
              px-4
              py-2
              text-[11px]
              text-[#063285]
              transition-all
              hover:border-gold
              hover:bg-[#063285]
              hover:text-white
            lg:inline-flex
          "
              >
                <span>Advanced Filters</span>
                <FaArrowRight className="text-[10px]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ========================== CATEGORIES ========================== */}
      <section>
        <div className={`${CONTAINER} py-14`}>
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="mb-3 inline-flex items-center rounded-lg bg-[#0b1f45] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
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

      {/* ===================== CURRICULUM STRIP ===================== */}
      <section className="bg-[#0b1f45]/5 mt-0">
        <div className={`${CONTAINER} py-12`}>
          <div className="mb-6 text-center">
            <p className="mb-3 inline-flex items-center rounded-lg bg-[#0b1f45] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
              Explore by Curriculum
            </p>
            <h2 className="text-2xl font-extrabold text-blacky-light md:text-3xl">
              Find Schools by Board
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {BOARDS.map((b) => (
              <Link
                key={b.name}
                href="/schools"
                className="group flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4 shadow-light transition-all hover:-translate-y-1 hover:shadow-spread"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef4fb] text-xl text-green-600 transition-colors group-hover:bg-green-600 group-hover:text-white">
                  <b.icon />
                </span>
                <span className="text-sm font-bold text-blacky-light">
                  {b.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ======================= FEATURED SCHOOLS ======================= */}
      <section className="bg-white">
        <div className={`${CONTAINER} py-14`}>
          <p className="mb-3 inline-flex items-center rounded-lg bg-[#0b1f45] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
            SPOTLIGHT SCHOOLS
          </p>
          <h2 className="text-2xl md:text-3xl font-extrabold text-blacky-light">
            Featured Schools in Dubai
          </h2>
          <p className="text-sm text-blacky-light mt-1 mb-8">
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

      {/* ===================== HOW IT WORKS ===================== */}
      <section className="bg-[#eef4fb]">
        <div className={`${CONTAINER} py-16`}>
          <div className="mb-10 text-center">
            <p className="mb-3 inline-flex items-center rounded-lg bg-[#0b1f45] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
              How It Works
            </p>
            <h2 className="text-2xl font-extrabold text-blacky-light md:text-3xl">
              Find the Right School in 4 Simple Steps
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((s, i) => (
              <div
                key={s.title}
                className="relative rounded-2xl bg-white p-6 text-center shadow-light"
              >
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600/10 text-2xl text-green-600">
                  <s.icon />
                </span>
                <span className="absolute right-4 top-3 text-3xl font-extrabold text-[#e7eefc]">
                  {i + 1}
                </span>
                <p className="mt-4 text-base font-bold text-blacky-light">
                  {s.title}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-blacky-light/60">
                  {s.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===================== TRENDING CAROUSEL ===================== */}
      <section
        className="
    group
    relative
    overflow-hidden
    bg-[#f5f9ff]
  "
      >
        {/* =========================================================
      GRID BACKGROUND
  ========================================================== */}
        {/* <div
          className="
      pointer-events-none
      absolute
      inset-0
      opacity-[0.72]
      [background-image:linear-gradient(to_right,#d4e2f3_1px,transparent_1px),linear-gradient(to_bottom,#d4e2f3_1px,transparent_1px)]
      [background-size:32px_32px]
    "
        /> */}

        {/* =========================================================
      SOFT WHITE CENTER FADE
  ========================================================== */}
        <div
          className="
      pointer-events-none
      absolute
      inset-0
      bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.78)_0%,rgba(248,251,255,0.42)_45%,rgba(247,250,255,0)_100%)]
    "
        />

        {/* =========================================================
      BLUE GLOW - LEFT
  ========================================================== */}
        <div
          className="
      pointer-events-none
      absolute
      -left-24
      top-1/4
      h-[500px]
      w-[500px]
      rounded-full
      bg-[#2874df]/20
      blur-[80px]
      opacity-50
      transition-all
      duration-700
      group-hover:opacity-100
      group-hover:bg-[#2874df]/25
    "
        />

        {/* =========================================================
      GOLD GLOW - RIGHT
  ========================================================== */}
        <div
          className="
      pointer-events-none
      absolute
      -right-24
      bottom-[-80px]
      h-[460px]
      w-[460px]
      rounded-full
      bg-[#e1ad21]/15
      blur-[80px]
      opacity-50
      transition-all
      duration-700
      group-hover:opacity-100
      group-hover:bg-[#e1ad21]/20
    "
        />

        {/* =========================================================
      TOP CENTER BLUE GLOW
  ========================================================== */}
        <div
          className="
      pointer-events-none
      absolute
      left-1/2
      top-[-180px]
      h-[400px]
      w-[600px]
      -translate-x-1/2
      rounded-full
      bg-[#4b8ff5]/10
      blur-[100px]
      opacity-60
      transition-all
      duration-700
      group-hover:opacity-90
    "
        />

        {/* =========================================================
      MAIN CONTENT
  ========================================================== */}
        <div
          className={`
      ${CONTAINER}
      relative
      z-10
      py-14
    `}
        >
          {/* =======================================================
        SECTION HEADER
    ======================================================== */}
          <div className="mb-7 flex items-end justify-between">
            <div>
              {/* Section Badge */}
              <p
                className="
            mb-3
            inline-flex
            items-center
            rounded-lg
            bg-[#0b1f45]
            px-3
            py-1.5
            text-[10px]
            font-bold
            uppercase
            tracking-[0.18em]
            text-gold
            shadow-sm
          "
              >
                Trending Now
              </p>

              {/* Heading */}
              <h2
                className="
            text-2xl
            font-extrabold
            tracking-tight
            text-[#142f58]
            md:text-3xl
          "
              >
                Popular Schools This Week
              </h2>

              {/* Description */}
              <p
                className="
            mt-1.5
            text-sm
            text-[#64748b]
          "
              >
                Discover schools parents are exploring right now.
              </p>
            </div>

            {/* =====================================================
          CAROUSEL CONTROLS
      ====================================================== */}
            <div className="hidden gap-2 sm:flex">
              {/* Previous */}
              <button
                onClick={() => scrollTrending(-1)}
                aria-label="Previous"
                className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            border
            border-[#dce6f2]
            bg-white/90
            text-[#38527b]
            shadow-[0_8px_20px_-12px_rgba(20,60,110,0.35)]
            backdrop-blur-sm
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:border-[#2874df]
            hover:bg-[#2874df]
            hover:text-white
            hover:shadow-[0_12px_25px_-12px_rgba(40,116,223,0.55)]
          "
              >
                <FaChevronLeft className="text-xs" />
              </button>

              {/* Next */}
              <button
                onClick={() => scrollTrending(1)}
                aria-label="Next"
                className="
            flex
            h-11
            w-11
            items-center
            justify-center
            rounded-full
            border
            border-[#dce6f2]
            bg-white/90
            text-[#38527b]
            shadow-[0_8px_20px_-12px_rgba(20,60,110,0.35)]
            backdrop-blur-sm
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:border-[#2874df]
            hover:bg-[#2874df]
            hover:text-white
            hover:shadow-[0_12px_25px_-12px_rgba(40,116,223,0.55)]
          "
              >
                <FaChevronRight className="text-xs" />
              </button>
            </div>
          </div>

          {/* =======================================================
        CARDS CAROUSEL
    ======================================================== */}
          <div
            ref={trackRef}
            className="
        flex
        snap-x
        gap-5
        overflow-x-auto
        pb-5
        [scrollbar-width:none]
        [&::-webkit-scrollbar]:hidden
      "
          >
            {trLoading
              ? /* =====================================================
           LOADING SKELETONS
        ====================================================== */
                Array.from({ length: 5 }).map((_, i) => (
                  <SchoolCardSkeleton key={i} width="w-[280px] shrink-0" />
                ))
              : /* =====================================================
           TRENDING SCHOOL CARDS
        ====================================================== */
                trending.map((s: any) => (
                  <div
                    key={s.name}
                    className="
              group/card
              relative
              w-[280px]
              shrink-0
              snap-start
              overflow-hidden
              rounded-[22px]
              border
              border-[#dfe8f3]
              bg-white
              shadow-[0_12px_35px_-20px_rgba(20,60,110,0.4)]
              transition-all
              duration-300
              hover:-translate-y-1.5
              hover:border-[#bdd1ed]
              hover:shadow-[0_25px_50px_-20px_rgba(30,90,170,0.38)]
            "
                  >
                    {/* =================================================
                CARD IMAGE
            ================================================== */}
                    <div className="relative h-[165px] overflow-hidden">
                      <img
                        src={s.img}
                        alt={s.name}
                        className="
                  h-full
                  w-full
                  object-cover
                  transition-transform
                  duration-500
                  group-hover/card:scale-105
                "
                      />

                      {/* Image overlay */}
                      <div
                        className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-[#0b1f45]/45
                  via-transparent
                  to-transparent
                "
                      />

                      {/* =================================================
                  TRENDING BADGE
              ================================================== */}
                      <span
                        className="
                  absolute
                  left-3
                  top-3
                  inline-flex
                  items-center
                  rounded-full
                  border
                  border-white/30
                  bg-[#e1ad21]/95
                  px-3
                  py-1
                  text-[10px]
                  font-bold
                  text-white
                  shadow-lg
                  backdrop-blur-sm
                "
                      >
                        Trending
                      </span>

                      {/* =================================================
                  RATING BADGE
              ================================================== */}
                      <span
                        className="
                  absolute
                  bottom-3
                  right-3
                  inline-flex
                  items-center
                  gap-1
                  rounded-full
                  bg-white/95
                  px-2.5
                  py-1.5
                  text-[11px]
                  font-bold
                  text-[#263b5d]
                  shadow-lg
                  backdrop-blur-sm
                "
                      >
                        <FaStar className="text-[10px] text-gold" />
                        {s.rating}
                      </span>
                    </div>

                    {/* =================================================
                CARD CONTENT
            ================================================== */}
                    <div className="p-3 flex flex-col flex-1">
                      {/* School Name */}
                      <h3
                        className="
                  min-h-[42px]
                  text-sm
                  font-extrabold
                  leading-snug
                  text-[#17345f]
                  transition-colors
                  group-hover/card:text-[#1764dc]
                "
                      >
                        {s.name}
                      </h3>

                      {/* Location */}
                      <p
                        className="
                  mt-2
                  flex
                  items-center
                  gap-1.5
                  text-xs
                  text-[#71819a]
                "
                      >
                        <FaLocationDot className="text-[#2874df]" />
                        <span className="truncate">{s.area}</span>
                      </p>

                      {/* =================================================
                  CURRICULUM + RATING
              ================================================== */}
                      <div
                        className="
                  mt-4
                  flex
                  items-center
                  justify-between
                  gap-2
                "
                      >
                        {/* Curriculum */}
                        <span
                          className="
                    max-w-[150px]
                    truncate
                    rounded-full
                    border
                    border-[#dce8f6]
                    bg-[#f3f7fd]
                    px-3
                    py-1.5
                    text-[10px]
                    font-bold
                    text-[#2462a8]
                  "
                        >
                          {s.curriculum}
                        </span>

                        {/* Rating */}
                        <span
                          className="
                    flex
                    items-center
                    gap-1
                    text-xs
                    font-bold
                    text-[#344968]
                  "
                        >
                          <FaStar className="text-[11px] text-gold" />
                          {s.rating}
                        </span>
                      </div>

                      {/* =================================================
                  VIEW DETAILS
              ================================================== */}
                      <Link
                        href={s.slug ? `/school/${s.slug}` : "/schools"}
                        className="
                  group/link
                  mt-4
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  border
                  border-[#2874df]
                  bg-white
                  py-2.5
                  text-xs
                  font-bold
                  text-[#2874df]
                  transition-all
                  duration-200
                  hover:bg-[#2874df]
                  hover:text-white
                  hover:shadow-[0_10px_25px_-12px_rgba(40,116,223,0.7)]
                "
                      >
                        View Details
                        <FaArrowRight
                          className="
                    text-[10px]
                    transition-transform
                    duration-200
                    group-hover/link:translate-x-1
                  "
                        />
                      </Link>
                    </div>
                  </div>
                ))}
          </div>

          {/* =======================================================
        MOBILE SCROLL HINT
    ======================================================== */}
          <div className="mt-1 flex items-center justify-center sm:hidden">
            <span
              className="
          rounded-full
          bg-white/80
          px-4
          py-1.5
          text-[10px]
          font-semibold
          text-[#71819a]
          shadow-sm
          ring-1
          ring-[#e1e9f3]
        "
            >
              Swipe to explore more schools →
            </span>
          </div>
        </div>
      </section>

      {/* ========================== WHY CHOOSE ========================== */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f5f9ff] to-white">
        <div
          className={`${CONTAINER} py-16 grid grid-cols-1 items-center gap-10 lg:grid-cols-[1.12fr_0.88fr]`}
        >
          <div>
            <p className="mb-3 inline-flex items-center rounded-lg bg-[#0b1f45] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
              Why {SITE_NAME}
            </p>
            <h2 className="text-3xl font-extrabold leading-[1.1] text-blacky-light md:text-[40px]">
              Your Child&apos;s <span className="text-gold">Brighter</span>{" "}
              <br className="hidden sm:block" />
              Future Starts Here
            </h2>
            <p className="mt-4 max-w-lg text-sm text-blacky-light/65 md:text-base">
              We connect parents with the best schools in Dubai, making the
              search process simple, transparent and stress-free.
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              {WHY_POINTS.map((p) => (
                <div
                  key={p.title}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_12px_30px_-16px_rgba(15,35,70,0.28)] transition-transform hover:-translate-y-1"
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-lg"
                    style={{ backgroundColor: p.bg, color: p.fg }}
                  >
                    <p.icon />
                  </span>
                  <p className="mt-3 text-sm font-bold text-blacky-light">
                    {p.title}
                  </p>
                  <p className="mt-1 text-[12px] leading-snug text-blacky-light/60">
                    {p.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* photo with handwritten accents */}
          <div className="relative">
            <img
              src="/images/banner-home.jpeg"
              alt="A brighter future for your child in Dubai"
              className="h-[360px] w-full rounded-3xl object-cover shadow-[0_25px_60px_-25px_rgba(15,35,70,0.45)] lg:h-[440px]"
            />
            <span className="pointer-events-none absolute right-4 top-5 max-w-[150px] -rotate-6 text-right font-serif text-base italic leading-tight text-white drop-shadow">
              Great Schools Brighter Futures
            </span>
            <span className="pointer-events-none absolute bottom-4 right-4 max-w-[180px] rotate-2 rounded-xl bg-white/85 px-3 py-2 text-right font-serif text-[13px] italic leading-tight text-[#e08a2b] backdrop-blur">
              A Better Tomorrow Begins with the Right Education
            </span>
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
      </section>z

      {/* ===================== FAQ ===================== */}
      <section
        className="
    group
    relative
    overflow-hidden
    bg-[#f8fbff]
    py-16
  "
      >
        {/* ================= GRID BACKGROUND ================= */}

        {/* fine grid */}
        <div
          className="
      pointer-events-none
      absolute
      inset-0
      opacity-[0.55]
      [background-image:linear-gradient(to_right,#dbe7f5_1px,transparent_1px),linear-gradient(to_bottom,#dbe7f5_1px,transparent_1px)]
      [background-size:32px_32px]
    "
        />

        {/* soft white fade over grid */}
        <div
          className="
      pointer-events-none
      absolute
      inset-0
      bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.95)_0%,rgba(248,251,255,0.65)_45%,rgba(248,251,255,0.15)_100%)]
    "
        />

        {/* ================= MOUSE HOVER GLOW ================= */}

        <div
          className="
      pointer-events-none
      absolute
      -left-32
      top-1/3
      h-[420px]
      w-[420px]
      rounded-full
      bg-[#2874df]/10
      blur-[100px]
      opacity-0
      transition-opacity
      duration-700
      group-hover:opacity-100
    "
        />

        <div
          className="
      pointer-events-none
      absolute
      -right-32
      bottom-0
      h-[380px]
      w-[380px]
      rounded-full
      bg-[#e1ad21]/10
      blur-[100px]
      opacity-0
      transition-opacity
      duration-700
      group-hover:opacity-100
    "
        />

        {/* ================= CONTENT ================= */}

        <div
          className={`
      ${CONTAINER}
      relative
      z-10
      grid
      grid-cols-1
      gap-10
      lg:grid-cols-[0.85fr_1.15fr]
    `}
        >
          {/* ================= LEFT ================= */}

          <div>
            {/* Label */}
            <p
              className="
          mb-3
          inline-flex
          items-center
          rounded-lg
          bg-[#0b1f45]
          px-3
          py-1.5
          text-[10px]
          font-bold
          uppercase
          tracking-[0.18em]
          text-gold
          shadow-sm
        "
            >
              FAQ
            </p>

            {/* Heading */}
            <h2
              className="
          text-2xl
          font-extrabold
          leading-snug
          text-[#142f58]
          md:text-3xl
        "
            >
              Frequently Asked <span className="text-gold">Questions</span>
            </h2>

            {/* Description */}
            <p
              className="
          mt-3
          max-w-sm
          text-sm
          leading-6
          text-[#64748b]
        "
            >
              Everything parents usually ask before choosing a school in Dubai.
              Still unsure? Our team is here for you.
            </p>

            {/* ================= EXPERT CARD ================= */}

            <div
              className="
          relative
          mt-7
          overflow-hidden
          rounded-3xl
          border
          border-white/20
          bg-gradient-to-br
          from-[#123d80]
          via-[#174f9e]
          to-[#178b73]
          p-6
          text-white
          shadow-[0_20px_50px_-20px_rgba(18,61,128,0.45)]
          transition-all
          duration-300
          hover:-translate-y-1
          hover:shadow-[0_25px_60px_-20px_rgba(18,61,128,0.55)]
        "
            >
              {/* decorative glow */}
              <div
                className="
            pointer-events-none
            absolute
            -right-10
            -top-10
            h-32
            w-32
            rounded-full
            bg-gold/25
            blur-3xl
          "
              />

              <div
                className="
            pointer-events-none
            absolute
            -bottom-16
            -left-10
            h-32
            w-32
            rounded-full
            bg-white/10
            blur-3xl
          "
              />

              {/* Icon */}
              <span
                className="
            relative
            flex
            h-12
            w-12
            items-center
            justify-center
            rounded-2xl
            bg-white/15
            text-xl
            text-gold
            ring-1
            ring-white/20
          "
              >
                <FaHeadset />
              </span>

              <p className="relative mt-5 text-lg font-extrabold">
                Still have questions?
              </p>

              <p className="relative mt-1 text-sm leading-6 text-white/75">
                Talk to our counsellors — free, no pressure.
              </p>

              <a
                href="#get-admission-help"
                className="
            group/btn
            relative
            mt-5
            inline-flex
            items-center
            gap-2
            rounded-xl
            bg-gold
            px-5
            py-2.5
            text-sm
            font-bold
            text-[#142f58]
            shadow-lg
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:shadow-xl
          "
              >
                Ask Our Experts
                <FaArrowRight
                  className="
              text-[11px]
              transition-transform
              group-hover/btn:translate-x-1
            "
                />
              </a>
            </div>
          </div>

          {/* ================= RIGHT FAQ ================= */}

          <div className="space-y-3">
            {FAQS.map((f, i) => {
              const open = openFaq === i;

              return (
                <div
                  key={f.q}
                  className={`
              group/faqs
              relative
              overflow-hidden
              rounded-2xl
              border
              transition-all
              duration-300

              ${
                open
                  ? `
                    border-[#2874df]
                    bg-white
                    shadow-[0_15px_40px_-18px_rgba(40,116,223,0.4)]
                  `
                  : `
                    border-[#e0e8f3]
                    bg-white/80
                    backdrop-blur-sm
                    hover:-translate-y-[2px]
                    hover:border-[#b9cfee]
                    hover:bg-white
                    hover:shadow-[0_12px_30px_-18px_rgba(30,70,120,0.3)]
                  `
              }
            `}
                >
                  {/* Active/hover top glow */}
                  <div
                    className={`
                pointer-events-none
                absolute
                inset-x-0
                top-0
                h-px
                bg-gradient-to-r
                from-transparent
                via-[#2874df]
                to-transparent
                transition-opacity
                ${open ? "opacity-100" : "opacity-0 group-hover/faq:opacity-70"}
              `}
                  />

                  {/* Question */}
                  <button
                    onClick={() => setOpenFaq(open ? null : i)}
                    className="
                flex
                w-full
                items-center
                justify-between
                gap-4
                px-5
                py-5
                text-left
              "
                  >
                    <span
                      className={`
                  text-sm
                  font-bold
                  transition-colors
                  ${
                    open
                      ? "text-[#1764dc]"
                      : "text-[#243b61] group-hover/faq:text-[#1764dc]"
                  }
                `}
                    >
                      {f.q}
                    </span>

                    {/* Arrow */}
                    <span
                      className={`
                  flex
                  h-8
                  w-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  transition-all
                  duration-300

                  ${
                    open
                      ? "rotate-180 bg-[#1764dc] text-white"
                      : "bg-[#eef4fb] text-[#1764dc] group-hover/faq:bg-[#1764dc] group-hover/faq:text-white"
                  }
                `}
                    >
                      <FaChevronDown className="text-[10px]" />
                    </span>
                  </button>

                  {/* Answer */}
                  <div
                    className={`
                grid
                transition-all
                duration-300
                ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}
              `}
                  >
                    <div className="overflow-hidden">
                      <p
                        className="
                    px-5
                    pb-5
                    pr-16
                    text-sm
                    leading-6
                    text-[#64748b]
                  "
                      >
                        {f.a}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
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
            <p className="mb-3 inline-flex items-center rounded-lg bg-[#0b1f45] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-gold">
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
