/* eslint-disable @next/next/no-img-element */
"use client";

// ---------------------------------------------------------------------------
// /compare-schools — put 2 to 4 Dubai schools side by side.
//   • Loads real schools from the backend (getAllSchools) for the picker.
//   • Add up to 4 schools; compare board, type, fees, rating, classes,
//     area and facilities in one clean grid.
//   • Fully responsive: cards scroll horizontally on phones, sit in a
//     sticky-label grid on desktop.
//   • Shimmer while the picker list loads; friendly empty slots.
// Matches the brand system used across the site (royal blue + gold).
// ---------------------------------------------------------------------------

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { getAllSchools } from "@/api/schools/ListofSchools";
import { SchoolList } from "@/api/schools/types";
import {
  FaScaleBalanced,
  FaMagnifyingGlass,
  FaPlus,
  FaXmark,
  FaLocationDot,
  FaStar,
  FaGraduationCap,
  FaBuildingColumns,
  FaMoneyBillWave,
  FaLayerGroup,
  FaCircleCheck,
  FaCircleXmark,
  FaArrowRight,
  FaHeadset,
  FaCheck,
} from "react-icons/fa6";

const CONTAINER = "mx-auto w-[90%] max-w-[1280px]";
const MAX = 4;

const feeK = (n: number) => (n >= 1000 ? `${Math.round(n / 1000)}K` : `${n}`);
const feeLabel = (min?: number, max?: number) =>
  !max ? "On request" : `AED ${feeK(min || 0)}–${feeK(max)}`;

const imgSrc = (s: SchoolList) => {
  const first = s.images?.[0];
  return first && first.startsWith("http") ? first : "/day-school.avif";
};

// Facilities we show as a tick / cross matrix. Falls back gracefully if a
// school has no facilities recorded.
const FACILITY_ROWS = [
  "Transport",
  "Swimming Pool",
  "Sports",
  "Library",
  "Smart Classes",
  "Medical",
];

const hasFacility = (s: SchoolList, name: string) => {
  const facs = (s as unknown as { facilities?: Array<{ name?: string }> })
    .facilities;
  if (!facs?.length) return undefined; // unknown -> dash
  return facs.some((f) => f?.name?.toLowerCase().includes(name.toLowerCase()));
};

const CompareSchools: React.FC = () => {
  const [all, setAll] = useState<SchoolList[]>([]);
  const [loading, setLoading] = useState(true);
  const [picked, setPicked] = useState<SchoolList[]>([]);
  const [q, setQ] = useState("");
  const [openPicker, setOpenPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getAllSchools({})
      .then((res) => setAll(res?.data?.schools ?? []))
      .catch(() => setAll([]))
      .finally(() => setLoading(false));
  }, []);

  // close picker on outside click
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node))
        setOpenPicker(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const pickedIds = new Set(picked.map((s) => s._id));
  const results = useMemo(() => {
    const base = all.filter((s) => !pickedIds.has(s._id));
    if (!q.trim()) return base.slice(0, 30);
    const n = q.trim().toLowerCase();
    return base
      .filter(
        (s) =>
          s.name?.toLowerCase().includes(n) ||
          s.city?.city?.toLowerCase().includes(n) ||
          s.schoolBoards?.some((b) => b.name?.toLowerCase().includes(n))
      )
      .slice(0, 30);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all, q, picked]);

  const add = (s: SchoolList) => {
    if (picked.length >= MAX) return;
    setPicked((p) => [...p, s]);
    setQ("");
    setOpenPicker(false);
  };
  const remove = (id?: string) =>
    setPicked((p) => p.filter((s) => s._id !== id));

  // best-value highlights for a couple of rows
  const cheapest = useMemo(() => {
    const withFee = picked.filter((s) => s.minFees);
    if (!withFee.length) return undefined;
    return withFee.reduce((a, b) =>
      (a.minFees || 0) <= (b.minFees || 0) ? a : b
    )._id;
  }, [picked]);
  const topRated = useMemo(() => {
    const withR = picked.filter((s) => s.avgRating);
    if (!withR.length) return undefined;
    return withR.reduce((a, b) =>
      (a.avgRating || 0) >= (b.avgRating || 0) ? a : b
    )._id;
  }, [picked]);

  return (
    <main className="min-h-screen bg-[#eef4fb] pb-20">
      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden bg-[#0b1f45]">
        <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-gold/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 bottom-0 h-52 w-52 rounded-full bg-green-600/25 blur-3xl" />
        <div className={`relative ${CONTAINER} py-12 text-center md:py-16`}>
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gold ring-1 ring-white/15">
            <FaScaleBalanced /> Compare Schools
          </span>
          <h1 className="mx-auto max-w-2xl text-3xl font-extrabold leading-tight text-white md:text-[42px]">
            Compare Dubai Schools <span className="text-gold">Side by Side</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/75 md:text-base">
            Add up to {MAX} schools and see fees, curriculum, ratings and
            facilities together — so you can choose with confidence.
          </p>
        </div>
      </section>

      {/* ========================= PICKER BAR ========================= */}
      <section className={`${CONTAINER} -mt-7 relative z-20`}>
        <div className="rounded-2xl bg-white p-4 shadow-[0_15px_40px_-20px_rgba(15,35,70,0.35)] sm:p-5">
          <div ref={pickerRef} className="relative">
            <div className="flex items-center gap-2 rounded-xl border border-[#e1e6ee] bg-white px-4 focus-within:border-green-500">
              <FaMagnifyingGlass className="text-[#9aa6ba]" />
              <input
                value={q}
                onChange={(e) => {
                  setQ(e.target.value);
                  setOpenPicker(true);
                }}
                onFocus={() => setOpenPicker(true)}
                disabled={picked.length >= MAX}
                placeholder={
                  picked.length >= MAX
                    ? `You can compare up to ${MAX} schools`
                    : "Search a school by name, area or curriculum to add…"
                }
                className="h-12 w-full bg-transparent text-sm text-blacky-light outline-none placeholder:text-[#a3adbf] disabled:cursor-not-allowed"
              />
              <span className="hidden shrink-0 rounded-lg bg-[#eef4fb] px-2.5 py-1 text-[11px] font-bold text-green-600 sm:block">
                {picked.length}/{MAX} added
              </span>
            </div>

            {/* dropdown */}
            {openPicker && picked.length < MAX && (
              <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-30 max-h-80 overflow-auto rounded-xl border border-[#e1e6ee] bg-white p-2 shadow-[0_20px_50px_-20px_rgba(15,35,70,0.4)]">
                {loading ? (
                  <div className="space-y-2 p-1">
                    {Array.from({ length: 4 }).map((_, i) => (
                      <div
                        key={i}
                        className="h-12 animate-pulse rounded-lg bg-[#eef2f8]"
                      />
                    ))}
                  </div>
                ) : results.length === 0 ? (
                  <div className="p-4 text-center text-sm text-blacky-light/55">
                    No schools found. Once schools are added in the admin they
                    will appear here.
                  </div>
                ) : (
                  results.map((s) => (
                    <button
                      key={s._id}
                      onClick={() => add(s)}
                      className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-left transition hover:bg-[#eef4fb]"
                    >
                      <img
                        src={imgSrc(s)}
                        alt=""
                        className="h-10 w-10 shrink-0 rounded-lg object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-blacky-light">
                          {s.name}
                        </span>
                        <span className="block truncate text-[11px] text-blacky-light/55">
                          {s.city?.city ? `${s.city.city}, Dubai` : "Dubai"}
                          {s.schoolBoards?.[0]?.name
                            ? ` · ${s.schoolBoards[0].name}`
                            : ""}
                        </span>
                      </span>
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-green-600/10 text-green-600">
                        <FaPlus className="text-xs" />
                      </span>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          {/* quick chips of picked schools */}
          {picked.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {picked.map((s) => (
                <span
                  key={s._id}
                  className="inline-flex items-center gap-2 rounded-full bg-[#eef4fb] py-1.5 pl-3 pr-2 text-xs font-semibold text-blacky-light"
                >
                  {s.name}
                  <button
                    onClick={() => remove(s._id)}
                    aria-label={`Remove ${s.name}`}
                    className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-blacky-light/50 hover:text-red-500"
                  >
                    <FaXmark className="text-[10px]" />
                  </button>
                </span>
              ))}
              {picked.length > 1 && (
                <button
                  onClick={() => setPicked([])}
                  className="text-xs font-semibold text-green-600 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ========================= COMPARISON ========================= */}
      <section className={`${CONTAINER} mt-8`}>
        {picked.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="overflow-x-auto rounded-2xl bg-white p-4 shadow-light sm:p-6">
            <div
              className="grid min-w-[640px] gap-4"
              style={{
                gridTemplateColumns: `160px repeat(${picked.length}, minmax(180px, 1fr))`,
              }}
            >
              {/* header row */}
              <div className="flex items-end pb-2 text-sm font-bold text-blacky-light/40">
                Overview
              </div>
              {picked.map((s) => (
                <div
                  key={s._id}
                  className="relative rounded-2xl border border-gray-100 bg-white p-3 text-center shadow-light"
                >
                  <button
                    onClick={() => remove(s._id)}
                    aria-label="Remove"
                    className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#eef4fb] text-blacky-light/45 hover:text-red-500"
                  >
                    <FaXmark className="text-[10px]" />
                  </button>
                  <img
                    src={imgSrc(s)}
                    alt={s.name}
                    className="mx-auto h-24 w-full rounded-xl object-cover"
                  />
                  <h3 className="mt-3 min-h-[38px] text-sm font-bold leading-snug text-blacky-light">
                    {s.name}
                  </h3>
                  <p className="mt-1 flex items-center justify-center gap-1 text-[11px] text-blacky-light/55">
                    <FaLocationDot className="text-green-500" />
                    {s.city?.city ? `${s.city.city}, Dubai` : "Dubai"}
                  </p>
                  <Link
                    href={`/school/${s.slug}`}
                    className="mt-3 inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-green-600 py-1.5 text-[11px] font-semibold text-green-600 transition hover:bg-green-600 hover:text-white"
                  >
                    View Details <FaArrowRight className="text-[9px]" />
                  </Link>
                </div>
              ))}

              {/* empty add-slot cell for the header row if fewer than MAX */}

              {/* data rows */}
              <Row
                icon={FaBuildingColumns}
                label="Curriculum"
                cells={picked.map((s) =>
                  s.schoolBoards?.length
                    ? s.schoolBoards.map((b) => b.name).join(", ")
                    : "—"
                )}
              />
              <Row
                icon={FaLayerGroup}
                label="School Type"
                cells={picked.map((s) =>
                  s.type?.length ? s.type.map((t) => t.name).join(", ") : "—"
                )}
              />
              <Row
                icon={FaMoneyBillWave}
                label="Annual Fees"
                cells={picked.map((s) => feeLabel(s.minFees, s.maxFees))}
                highlightId={cheapest}
                highlightIds={picked.map((s) => s._id)}
                highlightTag="Lowest"
              />
              <Row
                icon={FaStar}
                label="Parent Rating"
                cells={picked.map((s) =>
                  s.avgRating ? `${s.avgRating.toFixed(1)} / 5` : "New"
                )}
                highlightId={topRated}
                highlightIds={picked.map((s) => s._id)}
                highlightTag="Top rated"
              />
              <Row
                icon={FaGraduationCap}
                label="Classes"
                cells={picked.map((s) =>
                  s.classFrom || s.classTo
                    ? `${s.classFrom || "—"} – ${s.classTo || "—"}`
                    : "—"
                )}
              />

              {/* facilities matrix */}
              {FACILITY_ROWS.map((fac) => (
                <React.Fragment key={fac}>
                  <div className="flex items-center gap-2 border-t border-gray-100 py-3 text-xs font-semibold text-blacky-light/70">
                    <FaLayerGroup className="text-green-600/70 text-[11px]" />
                    {fac}
                  </div>
                  {picked.map((s) => {
                    const val = hasFacility(s, fac);
                    return (
                      <div
                        key={s._id + fac}
                        className="flex items-center justify-center border-t border-gray-100 py-3"
                      >
                        {val === undefined ? (
                          <span className="text-blacky-light/30">—</span>
                        ) : val ? (
                          <FaCircleCheck className="text-green-600" />
                        ) : (
                          <FaCircleXmark className="text-red-300" />
                        )}
                      </div>
                    );
                  })}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ============================ CTA ============================ */}
      <section className={`${CONTAINER} mt-10`}>
        <div className="flex flex-col items-center gap-4 rounded-2xl bg-gradient-to-r from-[#173e82] to-green-600 p-8 text-center text-white md:flex-row md:justify-between md:text-left">
          <div>
            <p className="text-lg font-extrabold md:text-xl">
              Still not sure which one fits your child?
            </p>
            <p className="mt-1 text-sm text-white/80">
              Our Dubai admission counsellors will help you decide — 100% free.
            </p>
          </div>
          <Link
            href="/#get-admission-help"
            className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-bold text-[#0b1f45] transition hover:opacity-90"
          >
            <FaHeadset /> Get Free Guidance
          </Link>
        </div>
      </section>
    </main>
  );
};

// ----------------------------- sub-components -----------------------------

const Row: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  cells: string[];
  highlightId?: string;
  highlightIds?: (string | undefined)[];
  highlightTag?: string;
}> = ({ icon: Icon, label, cells, highlightId, highlightIds, highlightTag }) => (
  <>
    <div className="flex items-center gap-2 border-t border-gray-100 py-3 text-xs font-semibold text-blacky-light/70">
      <Icon className="text-green-600 text-[11px]" />
      {label}
    </div>
    {cells.map((c, i) => {
      const id = highlightIds?.[i];
      const isBest = highlightId && id === highlightId;
      return (
        <div
          key={i}
          className="flex flex-col items-center justify-center gap-1 border-t border-gray-100 py-3 text-center text-sm font-medium text-blacky-light"
        >
          <span>{c}</span>
          {isBest && (
            <span className="inline-flex items-center gap-1 rounded-full bg-green-600/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-green-600">
              <FaCheck className="text-[8px]" /> {highlightTag}
            </span>
          )}
        </div>
      );
    })}
  </>
);

const EmptyState: React.FC = () => (
  <div className="rounded-2xl bg-white p-10 text-center shadow-light">
    <span className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-600/10 text-2xl text-green-600">
      <FaScaleBalanced />
    </span>
    <p className="text-lg font-extrabold text-blacky-light">
      Start comparing schools
    </p>
    <p className="mx-auto mt-1 max-w-md text-sm text-blacky-light/60">
      Use the search box above to add schools. You can compare fees, curriculum,
      ratings and facilities for up to {MAX} schools at once.
    </p>
    <div className="mx-auto mt-6 grid max-w-lg grid-cols-2 gap-3 sm:grid-cols-4">
      {Array.from({ length: MAX }).map((_, i) => (
        <div
          key={i}
          className="flex h-28 flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#cdd8ea] text-blacky-light/35"
        >
          <FaPlus />
          <span className="text-[11px] font-semibold">School {i + 1}</span>
        </div>
      ))}
    </div>
  </div>
);

export default CompareSchools;
