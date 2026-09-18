/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { SITE_NAME } from "@/constants";
import {
  getAllSchools,
  getFiltersMap,
  ISchoolFilters,
} from "@/api/schools/ListofSchools";
import { getCities } from "@/api/city";
import { SchoolList } from "@/api/schools/types";
import { SchoolCardSkeleton } from "@/components/Shimmer";
import {
  FaMagnifyingGlass,
  FaLocationDot,
  FaStar,
  FaHeart,
  FaArrowRight,
  FaFilter,
  FaXmark,
  FaBuildingColumns,
  FaScaleBalanced,
  FaUsers,
  FaFileLines,
  FaHeadset,
  FaCirclePlay,
  FaPaperPlane,
  FaListUl,
  FaTableCellsLarge,
} from "react-icons/fa6";

// ---------------------------------------------------------------------------
// /schools — Dubai school listing. Pulls REAL data from the backend:
//   • getFiltersMap()  -> school types + boards for the sidebar
//   • getCities()      -> areas for the Location filter
//   • getAllSchools()  -> the school cards (respects the selected filters)
// Falls back to sensible Dubai defaults for the filter labels when the DB is
// still empty, so the page looks complete before you add schools in admin.
// Width is 90% of the screen (max 1400px), matching the home page.
// ---------------------------------------------------------------------------

const CONTAINER = "mx-auto w-[90%] max-w-[1400px]";

type Opt = { id?: string; name: string };

const FALLBACK_TYPES: Opt[] = [
  { name: "Day School" },
  { name: "Boarding School" },
  { name: "Day Boarding" },
  { name: "Play School" },
  { name: "Residential School" },
];
const FALLBACK_BOARDS: Opt[] = [
  { name: "British" },
  { name: "American" },
  { name: "IB" },
  { name: "IGCSE" },
  { name: "CBSE" },
  { name: "ICSE" },
];
const FALLBACK_AREAS: Opt[] = [
  { name: "Al Barsha" },
  { name: "Dubai Marina" },
  { name: "Jumeirah" },
  { name: "Downtown Dubai" },
  { name: "Emirates Hills" },
  { name: "Al Sufouh" },
  { name: "Palm Jumeirah" },
  { name: "Nad Al Sheba" },
];
const FACILITIES = [
  "Swimming Pool",
  "Transport",
  "Sports",
  "Library",
  "Lab",
  "Smart Classes",
  "Medical",
  "Hostel",
];

const FEATURES = [
  { icon: FaBuildingColumns, title: "Verified Schools", text: "Trusted & updated" },
  { icon: FaScaleBalanced, title: "Compare Easily", text: "Make the right choice" },
  { icon: FaLocationDot, title: "Find Near You", text: "Search by location" },
  { icon: FaFileLines, title: "Complete Information", text: "Fees, facilities, reviews" },
  { icon: FaUsers, title: "Trusted by Parents", text: "50,000+ happy families" },
];

const STATS = [
  { icon: FaBuildingColumns, value: "320+", label: "Verified Schools" },
  { icon: FaUsers, value: "50,000+", label: "Happy Parents" },
  { icon: FaStar, value: "4.7", label: "Average Rating" },
  { icon: FaLocationDot, value: "20+", label: "Areas in Dubai" },
];

const POPULAR = ["British", "American", "IB", "CBSE", "Day School", "Near Me"];

const feeK = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}K` : `${n}`);
const feeLabel = (min?: number, max?: number) => {
  if (!max) return "Fees on request";
  return `AED ${feeK(min || 0)}–${feeK(max)}`;
};
const imgSrc = (s: SchoolList) => {
  const first = s.images?.[0];
  return first && first.startsWith("http") ? first : "/day-school.avif";
};

const SchoolListing: React.FC = () => {
  const [types, setTypes] = useState<Opt[]>(FALLBACK_TYPES);
  const [boards, setBoards] = useState<Opt[]>(FALLBACK_BOARDS);
  const [areas, setAreas] = useState<Opt[]>(FALLBACK_AREAS);

  const [query, setQuery] = useState("");
  const [selType, setSelType] = useState<string[]>([]);
  const [selBoard, setSelBoard] = useState<string[]>([]);
  const [selCity, setSelCity] = useState("");
  const [feeMax, setFeeMax] = useState(200000);
  const [selFac, setSelFac] = useState<string[]>([]);

  const [schools, setSchools] = useState<SchoolList[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");

  // ---- load filter options once ----
  useEffect(() => {
    getFiltersMap()
      .then((res) => {
        const d = res?.data;
        if (d?.schoolTypes?.length)
          setTypes(d.schoolTypes.map((t) => ({ id: t._id, name: t.name })));
        if (d?.schoolBoards?.length)
          setBoards(d.schoolBoards.map((b) => ({ id: b._id, name: b.name })));
      })
      .catch(() => {});
    getCities()
      .then((res) => {
        const list = res?.data as unknown as { _id: string; city: string }[];
        if (list?.length)
          setAreas(list.map((c) => ({ id: c._id, name: c.city })));
      })
      .catch(() => {});
  }, []);

  const buildFilters = (): ISchoolFilters => {
    const f: ISchoolFilters = {};
    if (query.trim()) f.name = query.trim();
    const typeIds = selType
      .map((n) => types.find((t) => t.name === n)?.id)
      .filter(Boolean) as string[];
    if (typeIds.length) f.type = typeIds;
    const boardIds = selBoard
      .map((n) => boards.find((b) => b.name === n)?.id)
      .filter(Boolean) as string[];
    if (boardIds.length) f.schoolBoards = boardIds;
    if (selCity) f.city = selCity;
    if (feeMax < 200000) f.maxFees = feeMax;
    return f;
  };

  const fetchSchools = (f: ISchoolFilters) => {
    setLoading(true);
    getAllSchools(f)
      .then((res) => {
        setSchools(res?.data?.schools ?? []);
        setTotal(res?.data?.totalCount ?? res?.data?.schools?.length ?? 0);
      })
      .catch(() => {
        setSchools([]);
        setTotal(0);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSchools({});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyFilters = () => {
    fetchSchools(buildFilters());
    setShowFilters(false);
  };
  const clearAll = () => {
    setQuery("");
    setSelType([]);
    setSelBoard([]);
    setSelCity("");
    setFeeMax(200000);
    setSelFac([]);
    fetchSchools({});
  };

  const toggle = (
    val: string,
    list: string[],
    setter: (v: string[]) => void
  ) =>
    setter(list.includes(val) ? list.filter((v) => v !== val) : [...list, val]);

  const activeCount =
    selType.length + selBoard.length + selFac.length + (selCity ? 1 : 0);

  const checkbox = (
    label: string,
    checked: boolean,
    onChange: () => void
  ) => (
    <label
      key={label}
      className="flex cursor-pointer items-center gap-2.5 text-sm text-blacky-light/80"
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded accent-green-600"
      />
      {label}
    </label>
  );

  const FilterPanel = (
    <div className="space-y-6">
      <div>
        <p className="mb-3 text-sm font-bold text-blacky-light">School Type</p>
        <div className="space-y-2.5">
          {types.map((t) =>
            checkbox(t.name, selType.includes(t.name), () =>
              toggle(t.name, selType, setSelType)
            )
          )}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-bold text-blacky-light">
          Curriculum / Board
        </p>
        <div className="space-y-2.5">
          {boards.map((b) =>
            checkbox(b.name, selBoard.includes(b.name), () =>
              toggle(b.name, selBoard, setSelBoard)
            )
          )}
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-bold text-blacky-light">
          Fee Range (AED)
        </p>
        <input
          type="range"
          min={0}
          max={200000}
          step={5000}
          value={feeMax}
          onChange={(e) => setFeeMax(Number(e.target.value))}
          className="w-full accent-green-600"
        />
        <div className="mt-1 flex justify-between text-[11px] text-blacky-light/60">
          <span>0</span>
          <span>{feeMax >= 200000 ? "200K+" : `${feeK(feeMax)}`}</span>
        </div>
      </div>

      <div>
        <p className="mb-2 text-sm font-bold text-blacky-light">Location</p>
        <select
          value={selCity}
          onChange={(e) => setSelCity(e.target.value)}
          className="h-11 w-full rounded-xl border border-[#e1e6ee] bg-white px-3 text-sm text-blacky-light outline-none focus:border-green-500"
        >
          <option value="">Select Area</option>
          {areas.map((a) => (
            <option key={a.name} value={a.id ?? ""} disabled={!a.id}>
              {a.name}
            </option>
          ))}
        </select>
        <div className="mt-3 space-y-2">
          {areas.slice(0, 5).map((a) => (
            <button
              key={a.name}
              type="button"
              onClick={() => a.id && setSelCity(a.id)}
              className={`flex w-full items-center gap-2 text-sm ${
                a.id && selCity === a.id
                  ? "font-semibold text-green-600"
                  : "text-blacky-light/70 hover:text-green-600"
              }`}
            >
              <FaLocationDot className="text-gold" /> {a.name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="mb-3 text-sm font-bold text-blacky-light">Facilities</p>
        <div className="space-y-2.5">
          {FACILITIES.map((f) =>
            checkbox(f, selFac.includes(f), () => toggle(f, selFac, setSelFac))
          )}
        </div>
      </div>

      <button
        onClick={applyFilters}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#173e82] to-green-600 text-sm font-bold text-white shadow-[0_10px_25px_-8px_rgba(30,79,163,0.6)] transition hover:opacity-95"
      >
        <FaFilter className="text-xs" /> Apply Filters
      </button>
    </div>
  );

  const onSearch = () => fetchSchools(buildFilters());

  return (
    <main className="min-h-screen bg-[#eef4fb]">
      {/* ========================= HERO ========================= */}
      <section className="relative overflow-hidden">
        <img
          src="/images/banner-home.jpeg"
          alt="Best schools in Dubai"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0b1f45] via-[#0b1f45]/90 to-[#0b1f45]/45" />
        <div className={`relative ${CONTAINER} py-14 md:py-16`}>
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="text-white">
              <p className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-gold ring-1 ring-white/15">
                Find the Right School
              </p>
              <h1 className="text-3xl font-extrabold leading-[1.1] md:text-5xl">
                Discover the Best <br />
                <span className="text-gold">Schools in Dubai</span>
              </h1>
              <p className="mt-4 max-w-lg text-sm text-white/85 md:text-base">
                Explore, compare and choose from verified schools to give your
                child a brighter future.
              </p>

              <div className="mt-6 flex max-w-xl overflow-hidden rounded-xl bg-white shadow-lg">
                <div className="relative flex-1">
                  <FaMagnifyingGlass className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#9aa6ba]" />
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && onSearch()}
                    placeholder="Search by school name, area or curriculum..."
                    className="h-13 w-full py-3.5 pl-11 pr-4 text-sm text-blacky-light outline-none"
                  />
                </div>
                <button
                  onClick={onSearch}
                  className="shrink-0 bg-gold px-6 text-sm font-bold text-blacky-light transition hover:opacity-90"
                >
                  Search
                </button>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                <span className="font-semibold text-white/70">Popular:</span>
                {POPULAR.map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setQuery(p);
                      fetchSchools({ name: p });
                    }}
                    className="rounded-full border border-white/25 px-3 py-1 font-medium text-white/90 transition hover:border-gold hover:text-gold"
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* floating glass card */}
            <div className="hidden lg:flex lg:justify-end">
              <div className="w-full max-w-xs rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-md">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gold/20 text-xl text-gold">
                  <FaBuildingColumns />
                </span>
                <p className="mt-4 text-xl font-extrabold text-white">
                  Bright Futures Start Here
                </p>
                <p className="mt-2 text-sm text-white/80">
                  Quality education for a brighter tomorrow — verified schools,
                  real reviews.
                </p>
                <Link
                  href="/register-school"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-gold"
                >
                  <FaCirclePlay /> Get Free Guidance
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===================== FEATURE STRIP ===================== */}
      <section className={`${CONTAINER} -mt-8 relative z-10`}>
        <div className="grid grid-cols-2 gap-3 rounded-2xl bg-white p-4 shadow-[0_15px_40px_-20px_rgba(15,35,70,0.3)] sm:grid-cols-3 lg:grid-cols-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="flex items-center gap-3 px-2 py-2">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-600/10 text-green-600">
                <f.icon />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-bold text-blacky-light">{f.title}</p>
                <p className="text-[11px] text-blacky-light/55">{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===================== MAIN GRID ===================== */}
      <div
        className={`${CONTAINER} grid grid-cols-1 gap-6 py-10 lg:grid-cols-[280px_1fr]`}
      >
        {/* Sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 rounded-2xl bg-white p-5 shadow-light">
            <div className="mb-4 flex items-center justify-between">
              <p className="flex items-center gap-2 font-bold text-blacky-light">
                <FaFilter className="text-green-600" /> Refine Your Search
              </p>
              <button
                onClick={clearAll}
                className="text-xs font-semibold text-green-600 hover:underline"
              >
                Clear All
              </button>
            </div>
            {FilterPanel}
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-extrabold text-blacky-light md:text-2xl">
                Schools in Dubai
              </h2>
              <p className="text-sm text-blacky-light/60">
                {loading
                  ? "Loading schools..."
                  : `Showing ${schools.length} of ${total || schools.length} verified schools`}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-green-600 px-3 py-2 text-sm font-semibold text-green-600 lg:hidden"
              >
                <FaFilter /> Filters
                {activeCount > 0 && (
                  <span className="rounded-full bg-green-600 px-1.5 text-[10px] text-white">
                    {activeCount}
                  </span>
                )}
              </button>
              <div className="hidden items-center gap-1 rounded-lg border border-gray-200 p-1 sm:flex">
                <button
                  onClick={() => setView("grid")}
                  aria-label="Grid view"
                  className={`rounded p-1.5 ${view === "grid" ? "bg-green-600 text-white" : "text-blacky-light/50"}`}
                >
                  <FaTableCellsLarge className="text-xs" />
                </button>
                <button
                  onClick={() => setView("list")}
                  aria-label="List view"
                  className={`rounded p-1.5 ${view === "list" ? "bg-green-600 text-white" : "text-blacky-light/50"}`}
                >
                  <FaListUl className="text-xs" />
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <SchoolCardSkeleton key={i} />
              ))}
            </div>
          ) : schools.length === 0 ? (
            <div className="rounded-2xl bg-white p-12 text-center shadow-light">
              <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-green-600/10 text-2xl text-green-600">
                <FaBuildingColumns />
              </span>
              <p className="text-lg font-bold text-blacky-light">
                No schools to show yet
              </p>
              <p className="mx-auto mt-1 max-w-md text-sm text-blacky-light/60">
                Verified Dubai schools will appear here as soon as they are
                added. Try clearing filters, or request free guidance and our
                team will help you.
              </p>
              <div className="mt-5 flex justify-center gap-3">
                <button
                  onClick={clearAll}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-blacky-light"
                >
                  Clear filters
                </button>
                <Link
                  href="/register-school"
                  className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white"
                >
                  Get Free Guidance
                </Link>
              </div>
            </div>
          ) : (
            <div
              className={
                view === "grid"
                  ? "grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3"
                  : "flex flex-col gap-4"
              }
            >
              {schools.map((s) => (
                <div
                  key={s._id}
                  className={`flex overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-light transition-shadow hover:shadow-spread ${
                    view === "grid" ? "flex-col" : "flex-col sm:flex-row"
                  }`}
                >
                  <div
                    className={`relative overflow-hidden ${view === "grid" ? "h-40" : "h-40 sm:h-auto sm:w-56"}`}
                  >
                    <img
                      src={imgSrc(s)}
                      alt={s.name}
                      className="h-full w-full object-cover"
                    />
                    <button
                      aria-label="Shortlist school"
                      className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-green-600 hover:text-gold-dark"
                    >
                      <FaHeart />
                    </button>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="min-h-[40px] text-sm font-bold leading-snug text-blacky-light">
                      {s.name}
                    </h3>
                    <p className="mt-1 flex items-center gap-1 text-xs text-blacky-light/60">
                      <FaLocationDot className="text-green-500" />{" "}
                      {s.city?.city ? `${s.city.city}, Dubai` : "Dubai"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {s.schoolBoards?.[0]?.name && (
                        <span className="rounded-md bg-[#eef4fb] px-2 py-1 text-[11px] font-medium text-green-600">
                          {s.schoolBoards[0].name}
                        </span>
                      )}
                      {s.type?.[0]?.name && (
                        <span className="rounded-md bg-[#eef4fb] px-2 py-1 text-[11px] font-medium text-blacky-light/70">
                          {s.type[0].name}
                        </span>
                      )}
                      <span className="rounded-md bg-[#fbf3dd] px-2 py-1 text-[11px] font-medium text-gold-dark">
                        {feeLabel(s.minFees, s.maxFees)}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-xs">
                      <FaStar className="text-gold" />
                      <span className="font-bold text-blacky-light">
                        {s.avgRating ? s.avgRating.toFixed(1) : "New"}
                      </span>
                      {(s.classFrom || s.classTo) && (
                        <span className="ml-auto text-blacky-light/50">
                          {s.classFrom} – {s.classTo}
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/school/${s.slug}`}
                      className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg border border-green-600 py-2 text-xs font-semibold text-green-600 transition-colors hover:bg-green-600 hover:text-white"
                    >
                      View Details <FaArrowRight className="text-[10px]" />
                    </Link>
                  </div>
                </div>
              ))}

              {/* Can't find CTA card */}
              {view === "grid" && (
                <div className="flex flex-col items-center justify-center rounded-2xl bg-[#dbe6f7] p-6 text-center">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-600/15 text-xl text-green-600">
                    <FaBuildingColumns />
                  </span>
                  <p className="mt-3 text-sm font-extrabold text-blacky-light">
                    Can&apos;t find the right school?
                  </p>
                  <p className="text-xs text-blacky-light/60">
                    Let our experts help you.
                  </p>
                  <Link
                    href="/register-school"
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#173e82] to-green-600 px-5 py-2.5 text-xs font-bold text-white"
                  >
                    <FaHeadset /> Get Free Guidance
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ===================== STATS STRIP ===================== */}
      <section className={`${CONTAINER} pb-4`}>
        <div className="grid grid-cols-2 gap-4 rounded-2xl bg-white p-6 shadow-light lg:grid-cols-4">
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

      {/* ===================== TRUSTED BAND ===================== */}
      <section className={`${CONTAINER} py-12`}>
        <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[1fr_1.1fr_0.9fr]">
          <div className="relative overflow-hidden rounded-3xl">
            <img
              src="/about.png"
              alt="Happy family in Dubai"
              className="h-56 w-full object-cover"
            />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-extrabold text-blacky-light md:text-3xl">
              Trusted by Thousands of Parents in Dubai
            </h2>
            <p className="mx-auto mt-3 max-w-md text-sm italic text-blacky-light/70">
              &ldquo;{SITE_NAME} made it so easy to find the perfect school for
              our child. Highly recommended!&rdquo;
            </p>
            <p className="mt-2 text-sm font-bold text-blacky-light">
              — Sarah Ali, Dubai
            </p>
          </div>
          <div className="rounded-3xl bg-[#dbe6f7] p-6 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-gold/20 text-xl text-gold-dark">
              <FaPaperPlane />
            </span>
            <p className="mt-3 text-lg font-extrabold text-blacky-light">
              List Your School
            </p>
            <p className="mt-1 text-xs text-blacky-light/60">
              Reach thousands of parents looking for the right school.
            </p>
            <Link
              href="/register-school"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-2.5 text-sm font-bold text-blacky-light transition hover:opacity-90"
            >
              Register Your School <FaArrowRight className="text-[11px]" />
            </Link>
          </div>
        </div>
      </section>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowFilters(false)}
          />
          <div className="relative ml-auto h-full w-[86%] max-w-xs overflow-y-auto bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <p className="flex items-center gap-2 font-bold text-blacky-light">
                <FaFilter className="text-green-600" /> Refine Your Search
              </p>
              <button
                onClick={() => setShowFilters(false)}
                className="text-blacky-light/60"
              >
                <FaXmark size={20} />
              </button>
            </div>
            {FilterPanel}
          </div>
        </div>
      )}
    </main>
  );
};

export default SchoolListing;
