/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { SITE_NAME } from "@/constants";
import {
  FaMagnifyingGlass,
  FaLocationDot,
  FaStar,
  FaHeart,
  FaArrowRight,
  FaFilter,
  FaXmark,
} from "react-icons/fa6";

// ---------------------------------------------------------------------------
// School listing page — static placeholder data for Dubai schools with working
// client-side filters. Wire this to your own API later; the card + filter UI
// stays the same.
// ---------------------------------------------------------------------------
type School = {
  name: string;
  area: string;
  curriculum: string;
  type: string;
  gender: string;
  fees: string;
  grades: string;
  rating: string;
  reviews: string;
  img: string;
  facilities: string[];
};

const SCHOOLS: School[] = [
  { name: "GEMS Wellington International School", area: "Al Sufouh, Dubai", curriculum: "British", type: "Day School", gender: "Co-ed", fees: "5L+", grades: "FS – Year 13", rating: "4.8", reviews: "256", img: "/images/day-school.avif", facilities: ["Transport", "Sports", "Swimming Pool", "Library", "Lab", "Smart Classes", "Medical"] },
  { name: "Dubai International Academy", area: "Emirates Hills, Dubai", curriculum: "IB", type: "Day School", gender: "Co-ed", fees: "5L+", grades: "FS – Year 13", rating: "4.7", reviews: "189", img: "/images/boarding-school.avif", facilities: ["Transport", "Sports", "Library", "Lab", "Smart Classes"] },
  { name: "Jumeirah English Speaking School", area: "Jumeirah, Dubai", curriculum: "British", type: "Day School", gender: "Co-ed", fees: "2L-5L", grades: "FS – Year 13", rating: "4.6", reviews: "120", img: "/images/day-boarding.avif", facilities: ["Sports", "Library", "Lab", "Medical"] },
  { name: "American School of Dubai", area: "Al Barsha, Dubai", curriculum: "American", type: "Day School", gender: "Co-ed", fees: "5L+", grades: "KG – Grade 12", rating: "4.3", reviews: "210", img: "/images/home-banner3.avif", facilities: ["Transport", "Sports", "Swimming Pool", "Library", "Smart Classes"] },
  { name: "Delhi Private School", area: "Al Quoz, Dubai", curriculum: "CBSE", type: "Day School", gender: "Co-ed", fees: "1L-2L", grades: "KG – Grade 12", rating: "4.5", reviews: "340", img: "/images/play-school.avif", facilities: ["Transport", "Sports", "Library", "Lab", "Smart Classes"] },
  { name: "Repton School Dubai", area: "Nad Al Sheba, Dubai", curriculum: "British", type: "Day Boarding", gender: "Co-ed", fees: "5L+", grades: "FS – Year 13", rating: "4.7", reviews: "98", img: "/images/boarding-school.avif", facilities: ["Hostel", "Transport", "Sports", "Swimming Pool", "Library", "Lab", "Medical"] },
  { name: "GEMS Modern Academy", area: "Nad Al Sheba, Dubai", curriculum: "CBSE", type: "Day School", gender: "Co-ed", fees: "2L-5L", grades: "KG – Grade 12", rating: "4.6", reviews: "275", img: "/images/day-school.avif", facilities: ["Transport", "Sports", "Swimming Pool", "Library", "Lab", "Smart Classes", "Medical"] },
  { name: "Dubai College", area: "Al Sufouh, Dubai", curriculum: "British", type: "Day School", gender: "Co-ed", fees: "5L+", grades: "Year 7 – Year 13", rating: "4.9", reviews: "150", img: "/images/home-banner3.avif", facilities: ["Sports", "Swimming Pool", "Library", "Lab", "Smart Classes"] },
];

const FILTER_GROUPS: { key: keyof School | "facilities"; label: string; options: string[] }[] = [
  { key: "type", label: "School Type", options: ["Day School", "Boarding School", "Day Boarding", "Play School", "Residential School"] },
  { key: "curriculum", label: "Curriculum / Board", options: ["CBSE", "ICSE", "IB", "IGCSE", "British", "American"] },
  { key: "gender", label: "Gender", options: ["Boys", "Girls", "Co-ed"] },
  { key: "fees", label: "Fees", options: ["0-50K", "50K-1L", "1L-2L", "2L-5L", "5L+"] },
  { key: "facilities", label: "Facilities", options: ["Hostel", "Transport", "Swimming Pool", "Sports", "Library", "Lab", "Smart Classes", "Medical"] },
];

const SchoolListing: React.FC = () => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [showFilters, setShowFilters] = useState(false);

  const toggle = (group: string, opt: string) =>
    setSelected((prev) => {
      const cur = prev[group] ?? [];
      const next = cur.includes(opt) ? cur.filter((o) => o !== opt) : [...cur, opt];
      return { ...prev, [group]: next };
    });

  const clearAll = () => {
    setSelected({});
    setQuery("");
  };

  const results = useMemo(() => {
    return SCHOOLS.filter((s) => {
      if (query.trim()) {
        const q = query.toLowerCase();
        if (!s.name.toLowerCase().includes(q) && !s.area.toLowerCase().includes(q))
          return false;
      }
      for (const g of FILTER_GROUPS) {
        const sel = selected[g.key as string] ?? [];
        if (!sel.length) continue;
        if (g.key === "facilities") {
          if (!sel.every((f) => s.facilities.includes(f))) return false;
        } else {
          if (!sel.includes(s[g.key as keyof School] as string)) return false;
        }
      }
      return true;
    });
  }, [query, selected]);

  const FilterPanel = (
    <div className="space-y-6">
      {FILTER_GROUPS.map((g) => (
        <div key={g.key as string}>
          <p className="text-sm font-bold text-blacky-light mb-2">{g.label}</p>
          <div className="space-y-1.5">
            {g.options.map((opt) => {
              const active = (selected[g.key as string] ?? []).includes(opt);
              return (
                <label
                  key={opt}
                  className="flex items-center gap-2 text-sm text-blacky-light/75 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => toggle(g.key as string, opt)}
                    className="h-4 w-4 accent-green-600 rounded"
                  />
                  {opt}
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <main className="bg-[#f5f8fd] min-h-screen">
      {/* Header band */}
      <section className="bg-gradient-to-r from-green-600 to-green-500 text-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-10">
          <h1 className="text-2xl md:text-3xl font-extrabold">
            Schools in Dubai
          </h1>
          <p className="text-sm text-white/85 mt-1">
            Browse and compare verified schools on {SITE_NAME}.
          </p>
          <div className="mt-5 relative max-w-xl">
            <FaMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 text-green-500" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by school name or area..."
              className="w-full h-12 rounded-xl pl-11 pr-4 text-sm text-blacky-light outline-none"
            />
          </div>
        </div>
      </section>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* Sidebar (desktop) */}
        <aside className="hidden lg:block">
          <div className="bg-white rounded-2xl p-5 shadow-light sticky top-24">
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-blacky-light flex items-center gap-2">
                <FaFilter className="text-green-600" /> Filters
              </p>
              <button onClick={clearAll} className="text-xs font-medium text-green-600 hover:underline">
                Clear
              </button>
            </div>
            {FilterPanel}
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-blacky-light/70">
              <span className="font-bold text-blacky-light">{results.length}</span>{" "}
              schools found
            </p>
            <button
              onClick={() => setShowFilters(true)}
              className="lg:hidden inline-flex items-center gap-2 rounded-lg border border-green-600 text-green-600 px-3 py-2 text-sm font-semibold"
            >
              <FaFilter /> Filters
            </button>
          </div>

          {results.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center text-blacky-light/60">
              No schools match your filters. Try clearing some.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {results.map((s) => (
                <div
                  key={s.name}
                  className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-light hover:shadow-spread transition-shadow flex flex-col"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img src={s.img} alt={s.name} className="h-full w-full object-cover" />
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
                        {s.type}
                      </span>
                      <span className="rounded-md bg-[#fbf3dd] px-2 py-1 text-[11px] font-medium text-gold-dark">
                        {s.fees}
                      </span>
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-xs">
                      <FaStar className="text-gold" />
                      <span className="font-bold text-blacky-light">{s.rating}</span>
                      <span className="text-blacky-light/50">({s.reviews})</span>
                      <span className="ml-auto text-blacky-light/50">{s.grades}</span>
                    </div>
                    <Link
                      href="/register-school"
                      className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg border border-green-600 py-2 text-xs font-semibold text-green-600 hover:bg-green-600 hover:text-white transition-colors"
                    >
                      View Details <FaArrowRight className="text-[10px]" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showFilters && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowFilters(false)}
          />
          <div className="relative ml-auto h-full w-[85%] max-w-xs bg-white p-5 overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-blacky-light flex items-center gap-2">
                <FaFilter className="text-green-600" /> Filters
              </p>
              <button onClick={() => setShowFilters(false)} className="text-blacky-light/60">
                <FaXmark size={20} />
              </button>
            </div>
            {FilterPanel}
            <div className="mt-6 flex gap-2">
              <button
                onClick={clearAll}
                className="flex-1 rounded-lg border border-gray-200 py-2.5 text-sm font-semibold text-blacky-light"
              >
                Clear
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 rounded-lg bg-green-600 py-2.5 text-sm font-semibold text-white"
              >
                Show {results.length}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default SchoolListing;
