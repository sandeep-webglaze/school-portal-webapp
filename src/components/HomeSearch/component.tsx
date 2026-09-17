"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FaMagnifyingGlass, FaChevronDown, FaChevronUp } from "react-icons/fa6";

// ---------------------------------------------------------------------------
// Home search + filters panel (redesign).
// Self-contained client component. Renders the parent search inputs and all
// filter groups requested for the Dubai schools portal. On "Search" it builds
// a query string and navigates to /search so the results page can read it.
// The filter data below is the single source of truth — edit these arrays to
// change what shows.
// ---------------------------------------------------------------------------

const TEXT_FIELDS: { key: string; label: string; placeholder: string }[] = [
  { key: "name", label: "School Name", placeholder: "e.g. GEMS Modern Academy" },
  { key: "city", label: "City", placeholder: "e.g. Dubai" },
  { key: "state", label: "State / Emirate", placeholder: "e.g. Dubai" },
  { key: "pincode", label: "Pincode", placeholder: "e.g. 00000" },
  { key: "nearby", label: "Nearby Location", placeholder: "e.g. Al Barsha" },
];

const FILTER_GROUPS: { key: string; label: string; options: string[] }[] = [
  {
    key: "schoolType",
    label: "School Type",
    options: [
      "Day School",
      "Boarding School",
      "Day Boarding",
      "Play School",
      "Residential School",
    ],
  },
  {
    key: "board",
    label: "Board",
    options: ["CBSE", "ICSE", "IB", "IGCSE", "State Board", "Other"],
  },
  {
    key: "gender",
    label: "Gender",
    options: ["Boys", "Girls", "Co-ed"],
  },
  {
    key: "class",
    label: "Class",
    options: [
      "Nursery",
      "KG",
      "Class 1",
      "Class 2",
      "Class 3",
      "Class 4",
      "Class 5",
      "Class 6",
      "Class 7",
      "Class 8",
      "Class 9",
      "Class 10",
      "Class 11",
      "Class 12",
    ],
  },
  {
    key: "fees",
    label: "Fees",
    options: ["0-50K", "50K-1L", "1L-2L", "2L-5L", "5L+"],
  },
  {
    key: "facilities",
    label: "Facilities",
    options: [
      "Hostel",
      "Transport",
      "Swimming Pool",
      "Sports",
      "Library",
      "Lab",
      "Smart Classes",
      "Medical",
    ],
  },
];

const HomeSearch: React.FC = () => {
  const router = useRouter();
  const [fields, setFields] = useState<Record<string, string>>({});
  const [selected, setSelected] = useState<Record<string, string[]>>({});
  const [showFilters, setShowFilters] = useState(true);

  const setField = (key: string, value: string) =>
    setFields((prev) => ({ ...prev, [key]: value }));

  const toggleOption = (groupKey: string, option: string) =>
    setSelected((prev) => {
      const current = prev[groupKey] ?? [];
      const next = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      return { ...prev, [groupKey]: next };
    });

  const clearAll = () => {
    setFields({});
    setSelected({});
  };

  const onSearch = () => {
    const params = new URLSearchParams();
    Object.entries(fields).forEach(([k, v]) => {
      if (v && v.trim()) params.set(k, v.trim());
    });
    Object.entries(selected).forEach(([k, v]) => {
      if (v && v.length) params.set(k, v.join(","));
    });
    const qs = params.toString();
    router.push(qs ? `/search?${qs}` : "/search");
  };

  return (
    <section className="relative z-30 px-3 sm:px-6">
      <div className="max-w-[1200px] mx-auto -mt-16 md:-mt-20">
        <div className="bg-white rounded-2xl shadow-spread border border-grayish-light overflow-hidden">
          {/* Gold top accent */}
          <div className="h-1.5 w-full bg-gold" />

          <div className="p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg sm:text-xl font-bold text-blacky-light">
                Find the right school in Dubai
              </h2>
            </div>

            {/* Parent search inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
              {TEXT_FIELDS.map((f) => (
                <div key={f.key} className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-blacky-light/70">
                    {f.label}
                  </label>
                  <input
                    type="text"
                    value={fields[f.key] ?? ""}
                    onChange={(e) => setField(f.key, e.target.value)}
                    placeholder={f.placeholder}
                    className="h-11 rounded-lg border border-grayish-light bg-grayish-light/60 px-3 text-sm outline-none focus:border-green-500 focus:bg-white transition-colors"
                  />
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onSearch}
                className="inline-flex items-center gap-2 rounded-lg bg-green-600 hover:bg-green-500 text-white font-semibold text-sm px-6 h-11 transition-colors shadow-md"
              >
                <FaMagnifyingGlass /> Search
              </button>
              <button
                type="button"
                onClick={() => setShowFilters((s) => !s)}
                className="inline-flex items-center gap-2 rounded-lg border border-green-600 text-green-600 hover:bg-green-600 hover:text-white font-semibold text-sm px-4 h-11 transition-colors"
              >
                Filters {showFilters ? <FaChevronUp /> : <FaChevronDown />}
              </button>
              <button
                type="button"
                onClick={clearAll}
                className="text-sm font-medium text-blacky-light/60 hover:text-green-600 transition-colors"
              >
                Clear all
              </button>
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="mt-5 border-t border-grayish-light pt-5 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
                {FILTER_GROUPS.map((group) => (
                  <div key={group.key}>
                    <p className="text-sm font-bold text-blacky-light mb-2">
                      {group.label}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {group.options.map((opt) => {
                        const active = (selected[group.key] ?? []).includes(opt);
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => toggleOption(group.key, opt)}
                            className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                              active
                                ? "bg-green-600 border-green-600 text-white"
                                : "bg-white border-grayish-light text-blacky-light/80 hover:border-green-500 hover:text-green-600"
                            }`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSearch;
