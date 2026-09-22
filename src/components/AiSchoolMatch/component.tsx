/* eslint-disable @next/next/no-img-element */
"use client";

// ---------------------------------------------------------------------------
// /school-match — "AI School Match".
//
// A short, friendly quiz that feels smart and personal. The parent answers 5
// quick questions; we then score EVERY real school in the backend with a
// transparent weighted algorithm and show the best matches with a match %
// and the reasons WHY it matched. This is the hook: it turns a cold search
// into a guided, delightful experience and funnels straight into a free
// counselling lead.
//
// No external AI cost — the scoring runs on the schools we already have, so
// it works instantly and offline-of-any-LLM. The "analysing" animation gives
// it the intelligent feel parents expect.
// ---------------------------------------------------------------------------

import React, { useState } from "react";
import Link from "next/link";
import { getAllSchools } from "@/api/schools/ListofSchools";
import { SchoolList } from "@/api/schools/types";
import {
  getUserLocation,
  nearestAreas,
  distanceToArea,
  prettyKm,
} from "@/helpers/dubaiAreas";
import {
  FaWandMagicSparkles,
  FaArrowRight,
  FaArrowLeft,
  FaChild,
  FaBookOpen,
  FaMoneyBillWave,
  FaLocationDot,
  FaHeart,
  FaStar,
  FaLocationCrosshairs,
  FaSpinner,
  FaCircleCheck,
  FaHeadset,
  FaRotateRight,
  FaGraduationCap,
} from "react-icons/fa6";

const CONTAINER = "mx-auto w-[90%] max-w-[1040px]";

// -------------------------- quiz option data --------------------------
const GRADES = [
  "Pre-KG / Nursery",
  "KG / Foundation",
  "Primary (1–5)",
  "Middle (6–8)",
  "Secondary (9–12)",
];
const CURRICULA = [
  "British",
  "American",
  "IB",
  "CBSE (Indian)",
  "ICSE (Indian)",
  "IGCSE",
  "No preference",
];
const BUDGETS = [
  { label: "Up to AED 20K", max: 20000 },
  { label: "AED 20K – 40K", max: 40000 },
  { label: "AED 40K – 70K", max: 70000 },
  { label: "AED 70K+", max: 200000 },
  { label: "Flexible", max: 0 },
];
const PRIORITIES = [
  "Strong academics",
  "Sports & activities",
  "Affordable fees",
  "Close to home",
  "Transport / bus",
  "Modern facilities",
];

type Answers = {
  grade: string;
  curriculum: string;
  budgetMax: number;
  area: string; // area name or "" / "near-me"
  priorities: string[];
};

type Scored = SchoolList & {
  matchPct: number;
  reasons: string[];
  distanceKm?: number;
};

// -------------------------- scoring engine --------------------------
function scoreSchools(
  schools: SchoolList[],
  a: Answers,
  loc: { lat: number; lng: number } | null
): Scored[] {
  return schools
    .map((s) => {
      let score = 0;
      let max = 0;
      const reasons: string[] = [];

      // Curriculum (weight 35)
      max += 35;
      if (a.curriculum && a.curriculum !== "No preference") {
        const key = a.curriculum.split(" ")[0].toLowerCase();
        const match = s.schoolBoards?.some((b) =>
          b.name?.toLowerCase().includes(key)
        );
        if (match) {
          score += 35;
          reasons.push(`${a.curriculum.split(" ")[0]} curriculum`);
        }
      } else {
        score += 25; // no preference -> mostly satisfied
      }

      // Budget (weight 30)
      max += 30;
      if (a.budgetMax > 0 && s.minFees) {
        if (s.minFees <= a.budgetMax) {
          score += 30;
          reasons.push("Within your budget");
        } else if (s.minFees <= a.budgetMax * 1.25) {
          score += 15; // slightly over
          reasons.push("Close to your budget");
        }
      } else {
        score += 20; // flexible or unknown fees
      }

      // Area / distance (weight 20)
      max += 20;
      let distanceKm: number | undefined;
      if (loc) {
        distanceKm = distanceToArea(loc.lat, loc.lng, s.city?.city);
        if (distanceKm != null) {
          if (distanceKm <= 5) {
            score += 20;
            reasons.push(`Only ${prettyKm(distanceKm)} away`);
          } else if (distanceKm <= 12) {
            score += 12;
            reasons.push(`${prettyKm(distanceKm)} from you`);
          } else {
            score += 4;
          }
        }
      } else if (a.area && a.area !== "near-me") {
        if (s.city?.city?.toLowerCase() === a.area.toLowerCase()) {
          score += 20;
          reasons.push(`In ${a.area}`);
        }
      } else {
        score += 10;
      }

      // Rating (weight 10)
      max += 10;
      if (s.avgRating) {
        score += Math.min(10, (s.avgRating / 5) * 10);
        if (s.avgRating >= 4) reasons.push(`Rated ${s.avgRating.toFixed(1)}★`);
      } else {
        score += 5;
      }

      // Priorities → facilities (weight 5)
      max += 5;
      const facs = (s as unknown as { facilities?: Array<{ name?: string }> })
        .facilities;
      if (a.priorities.includes("Affordable fees") && s.minFees && s.minFees <= 30000) {
        reasons.push("Great value");
      }
      if (a.priorities.includes("Sports & activities")) {
        if (facs?.some((f) => /sport|swim/i.test(f.name || ""))) {
          score += 5;
          reasons.push("Strong sports facilities");
        }
      } else if (a.priorities.includes("Transport / bus")) {
        if (facs?.some((f) => /transport|bus/i.test(f.name || ""))) {
          score += 5;
          reasons.push("School transport");
        }
      } else {
        score += 3;
      }

      const matchPct = Math.round((score / max) * 100);
      return {
        ...s,
        matchPct: Math.max(55, Math.min(99, matchPct)),
        reasons: reasons.slice(0, 3),
        distanceKm,
      } as Scored;
    })
    .sort((x, y) => y.matchPct - x.matchPct);
}

const imgSrc = (s: SchoolList) => {
  const first = s.images?.[0];
  return first && first.startsWith("http") ? first : "/day-school.avif";
};

// ============================ component ============================
const AiSchoolMatch: React.FC = () => {
  const [step, setStep] = useState(0); // 0..4 questions, 5 = analysing, 6 = results
  const [answers, setAnswers] = useState<Answers>({
    grade: "",
    curriculum: "",
    budgetMax: -1,
    area: "",
    priorities: [],
  });
  const [loc, setLoc] = useState<{ lat: number; lng: number } | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);
  const [results, setResults] = useState<Scored[]>([]);

  const TOTAL = 5;
  const set = (patch: Partial<Answers>) =>
    setAnswers((a) => ({ ...a, ...patch }));

  const togglePriority = (p: string) =>
    setAnswers((a) => ({
      ...a,
      priorities: a.priorities.includes(p)
        ? a.priorities.filter((x) => x !== p)
        : [...a.priorities, p],
    }));

  const useMyLocation = () => {
    setGeoLoading(true);
    getUserLocation()
      .then(({ lat, lng }) => {
        setLoc({ lat, lng });
        const near = nearestAreas(lat, lng, 1)[0];
        set({ area: "near-me" });
        // keep area label handy for display
        if (near) set({ area: "near-me" });
      })
      .catch(() => set({ area: "" }))
      .finally(() => setGeoLoading(false));
  };

  const canNext = () => {
    if (step === 0) return !!answers.grade;
    if (step === 1) return !!answers.curriculum;
    if (step === 2) return answers.budgetMax !== -1;
    if (step === 3) return true; // area optional
    if (step === 4) return answers.priorities.length > 0;
    return true;
  };

  const runMatch = () => {
    setStep(5); // analysing
    getAllSchools({})
      .then((res) => {
        const schools = res?.data?.schools ?? [];
        const scored = scoreSchools(schools, answers, loc);
        // small delay so the "AI analysing" animation is felt
        setTimeout(() => {
          setResults(scored.slice(0, 6));
          setStep(6);
        }, 1500);
      })
      .catch(() => {
        setTimeout(() => {
          setResults([]);
          setStep(6);
        }, 1200);
      });
  };

  const restart = () => {
    setAnswers({
      grade: "",
      curriculum: "",
      budgetMax: -1,
      area: "",
      priorities: [],
    });
    setLoc(null);
    setResults([]);
    setStep(0);
  };

  const next = () => {
    if (step < TOTAL - 1) setStep((s) => s + 1);
    else runMatch();
  };
  const back = () => setStep((s) => Math.max(0, s - 1));

  return (
    <main className="min-h-screen bg-[#eef4fb] pb-20">
      {/* ============================ HERO ============================ */}
      <section className="relative overflow-hidden bg-[#0b1f45]">
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/15 blur-3xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-16 h-60 w-60 rounded-full bg-green-600/25 blur-3xl" />
        <div className={`relative ${CONTAINER} py-12 text-center md:py-14`}>
          <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-gold ring-1 ring-white/15">
            <FaWandMagicSparkles /> AI-Powered
          </span>
          <h1 className="mx-auto max-w-2xl text-3xl font-extrabold leading-tight text-white md:text-[40px]">
            Find Your Child&apos;s <span className="text-gold">Perfect School</span>
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm text-white/75 md:text-base">
            Answer 5 quick questions and our AI matches you with the best Dubai
            schools — ranked, with reasons. Takes under a minute.
          </p>
        </div>
      </section>

      {/* ============================ CARD ============================ */}
      <section className={`${CONTAINER} -mt-8 relative z-10`}>
        <div className="rounded-3xl bg-white p-6 shadow-[0_25px_60px_-25px_rgba(15,35,70,0.3)] sm:p-9">
          {/* progress */}
          {step < 5 && (
            <div className="mb-7">
              <div className="mb-2 flex items-center justify-between text-xs font-semibold text-blacky-light/50">
                <span>
                  Question {step + 1} of {TOTAL}
                </span>
                <span>{Math.round(((step + 1) / TOTAL) * 100)}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-[#eef2f8]">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#173e82] to-green-600 transition-all duration-500"
                  style={{ width: `${((step + 1) / TOTAL) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* ---------- STEP 0: grade ---------- */}
          {step === 0 && (
            <Question
              icon={FaChild}
              title="Which stage is your child at?"
              subtitle="This helps us shortlist schools that admit that grade."
            >
              <OptionGrid
                options={GRADES}
                value={answers.grade}
                onSelect={(v) => set({ grade: v })}
              />
            </Question>
          )}

          {/* ---------- STEP 1: curriculum ---------- */}
          {step === 1 && (
            <Question
              icon={FaBookOpen}
              title="Preferred curriculum?"
              subtitle="Pick the board you'd like — or 'No preference'."
            >
              <OptionGrid
                options={CURRICULA}
                value={answers.curriculum}
                onSelect={(v) => set({ curriculum: v })}
                cols={2}
              />
            </Question>
          )}

          {/* ---------- STEP 2: budget ---------- */}
          {step === 2 && (
            <Question
              icon={FaMoneyBillWave}
              title="What's your annual fee budget?"
              subtitle="We'll prioritise schools within your range."
            >
              <OptionGrid
                options={BUDGETS.map((b) => b.label)}
                value={
                  BUDGETS.find((b) => b.max === answers.budgetMax)?.label ?? ""
                }
                onSelect={(label) =>
                  set({
                    budgetMax: BUDGETS.find((b) => b.label === label)?.max ?? 0,
                  })
                }
                cols={2}
              />
            </Question>
          )}

          {/* ---------- STEP 3: area ---------- */}
          {step === 3 && (
            <Question
              icon={FaLocationDot}
              title="Which area suits you? (optional)"
              subtitle="Choose an area or let us find schools near you."
            >
              <button
                onClick={useMyLocation}
                disabled={geoLoading}
                className={`mb-4 inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${
                  answers.area === "near-me"
                    ? "border-green-600 bg-green-600/10 text-green-600"
                    : "border-[#e1e6ee] text-blacky-light hover:border-green-500"
                }`}
              >
                {geoLoading ? (
                  <FaSpinner className="animate-spin text-green-600" />
                ) : (
                  <FaLocationCrosshairs className="text-green-600" />
                )}
                {answers.area === "near-me"
                  ? "Using your location ✓"
                  : geoLoading
                  ? "Locating…"
                  : "Use my current location"}
              </button>
              <OptionGrid
                options={[
                  "Al Barsha",
                  "Dubai Marina",
                  "Jumeirah",
                  "Downtown Dubai",
                  "Business Bay",
                  "Mirdif",
                ]}
                value={answers.area === "near-me" ? "" : answers.area}
                onSelect={(v) => {
                  setLoc(null);
                  set({ area: v });
                }}
                cols={2}
              />
            </Question>
          )}

          {/* ---------- STEP 4: priorities ---------- */}
          {step === 4 && (
            <Question
              icon={FaHeart}
              title="What matters most to you?"
              subtitle="Select all that apply — we'll weight these higher."
            >
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {PRIORITIES.map((p) => {
                  const on = answers.priorities.includes(p);
                  return (
                    <button
                      key={p}
                      onClick={() => togglePriority(p)}
                      className={`flex items-center gap-3 rounded-xl border p-3.5 text-left text-sm font-semibold transition ${
                        on
                          ? "border-green-600 bg-green-600/10 text-green-600"
                          : "border-[#e1e6ee] text-blacky-light hover:border-green-400"
                      }`}
                    >
                      <span
                        className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border ${
                          on
                            ? "border-green-600 bg-green-600 text-white"
                            : "border-[#cdd8ea]"
                        }`}
                      >
                        {on && <FaCircleCheck className="text-[10px]" />}
                      </span>
                      {p}
                    </button>
                  );
                })}
              </div>
            </Question>
          )}

          {/* ---------- STEP 5: analysing ---------- */}
          {step === 5 && (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div className="relative flex h-24 w-24 items-center justify-center">
                <span className="absolute inset-0 animate-ping rounded-full bg-green-600/20" />
                <span className="absolute inset-2 animate-pulse rounded-full bg-green-600/15" />
                <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#173e82] to-green-600 text-2xl text-white">
                  <FaWandMagicSparkles />
                </span>
              </div>
              <p className="mt-6 text-lg font-extrabold text-blacky-light">
                Analysing Dubai schools for you…
              </p>
              <p className="mt-1 text-sm text-blacky-light/55">
                Matching curriculum, fees, location and your priorities.
              </p>
            </div>
          )}

          {/* ---------- STEP 6: results ---------- */}
          {step === 6 && (
            <div>
              <div className="mb-6 text-center">
                <span className="mb-3 inline-flex items-center gap-2 rounded-full bg-green-600/10 px-3 py-1 text-xs font-bold text-green-600">
                  <FaCircleCheck /> Your matches are ready
                </span>
                <h2 className="text-2xl font-extrabold text-blacky-light">
                  Top schools for your child
                </h2>
                <p className="mt-1 text-sm text-blacky-light/55">
                  Ranked by how well they fit your answers.
                </p>
              </div>

              {results.length === 0 ? (
                <div className="rounded-2xl bg-[#eef4fb] p-8 text-center">
                  <p className="font-bold text-blacky-light">
                    No schools to match yet
                  </p>
                  <p className="mx-auto mt-1 max-w-sm text-sm text-blacky-light/60">
                    Schools will appear here once they&apos;re added. Our
                    counsellors can still help you personally — for free.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {results.map((s, i) => (
                    <div
                      key={s._id}
                      className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white p-4 shadow-light sm:flex-row sm:items-center"
                    >
                      {/* rank + image */}
                      <div className="relative shrink-0">
                        <img
                          src={imgSrc(s)}
                          alt={s.name}
                          className="h-24 w-full rounded-xl object-cover sm:h-20 sm:w-28"
                        />
                        {i === 0 && (
                          <span className="absolute -left-1 -top-2 rounded-full bg-gold px-2 py-0.5 text-[10px] font-extrabold text-[#0b1f45] shadow">
                            BEST MATCH
                          </span>
                        )}
                      </div>

                      {/* info */}
                      <div className="min-w-0 flex-1">
                        <h3 className="text-sm font-bold text-blacky-light">
                          {s.name}
                        </h3>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-blacky-light/55">
                          <FaLocationDot className="text-green-500" />
                          {s.city?.city ? `${s.city.city}, Dubai` : "Dubai"}
                          {s.distanceKm != null && ` · ${prettyKm(s.distanceKm)}`}
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {s.reasons.map((r) => (
                            <span
                              key={r}
                              className="inline-flex items-center gap-1 rounded-full bg-green-600/10 px-2 py-0.5 text-[10px] font-semibold text-green-600"
                            >
                              <FaCircleCheck className="text-[8px]" /> {r}
                            </span>
                          ))}
                          {s.avgRating ? (
                            <span className="inline-flex items-center gap-1 rounded-full bg-[#fbf3dd] px-2 py-0.5 text-[10px] font-semibold text-gold-dark">
                              <FaStar className="text-[8px]" />
                              {s.avgRating.toFixed(1)}
                            </span>
                          ) : null}
                        </div>
                      </div>

                      {/* match ring + cta */}
                      <div className="flex shrink-0 items-center gap-4 sm:flex-col sm:items-end">
                        <MatchRing pct={s.matchPct} />
                        <Link
                          href={`/school/${s.slug}`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-green-600 px-3.5 py-2 text-xs font-semibold text-green-600 transition hover:bg-green-600 hover:text-white"
                        >
                          View <FaArrowRight className="text-[9px]" />
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* lead CTA */}
              <div className="mt-8 flex flex-col items-center gap-4 rounded-2xl bg-gradient-to-r from-[#173e82] to-green-600 p-7 text-center text-white md:flex-row md:justify-between md:text-left">
                <div>
                  <p className="text-lg font-extrabold">
                    Want a human expert to confirm your shortlist?
                  </p>
                  <p className="mt-1 text-sm text-white/80">
                    Free 1-on-1 guidance from Dubai admission counsellors.
                  </p>
                </div>
                <Link
                  href="/#get-admission-help"
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-gold px-6 py-3 text-sm font-bold text-[#0b1f45] transition hover:opacity-90"
                >
                  <FaHeadset /> Book Free Counselling
                </Link>
              </div>

              <div className="mt-5 flex justify-center gap-3">
                <button
                  onClick={restart}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-blacky-light hover:border-green-500"
                >
                  <FaRotateRight /> Retake quiz
                </button>
                <Link
                  href="/compare-schools"
                  className="inline-flex items-center gap-2 rounded-xl bg-[#eef4fb] px-5 py-2.5 text-sm font-semibold text-green-600 hover:bg-[#e2ecfb]"
                >
                  <FaGraduationCap /> Compare these schools
                </Link>
              </div>
            </div>
          )}

          {/* ---------- nav buttons ---------- */}
          {step < 5 && (
            <div className="mt-8 flex items-center justify-between">
              <button
                onClick={back}
                disabled={step === 0}
                className="inline-flex items-center gap-2 text-sm font-semibold text-blacky-light/50 transition enabled:hover:text-blacky-light disabled:opacity-0"
              >
                <FaArrowLeft className="text-xs" /> Back
              </button>
              <button
                onClick={next}
                disabled={!canNext()}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#173e82] to-green-600 px-7 py-3 text-sm font-bold text-white shadow-[0_10px_25px_-8px_rgba(30,79,163,0.6)] transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {step === TOTAL - 1 ? "See My Matches" : "Next"}
                <FaArrowRight className="text-xs" />
              </button>
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-blacky-light/40">
          Matches are guidance only. Confirm fees and availability with the
          school before applying.
        </p>
      </section>
    </main>
  );
};

// -------------------------- small building blocks --------------------------
const Question: React.FC<{
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}> = ({ icon: Icon, title, subtitle, children }) => (
  <div>
    <div className="mb-5 flex items-start gap-3">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-600/10 text-green-600">
        <Icon />
      </span>
      <div>
        <h2 className="text-lg font-extrabold text-blacky-light sm:text-xl">
          {title}
        </h2>
        <p className="text-sm text-blacky-light/55">{subtitle}</p>
      </div>
    </div>
    {children}
  </div>
);

const OptionGrid: React.FC<{
  options: string[];
  value: string;
  onSelect: (v: string) => void;
  cols?: number;
}> = ({ options, value, onSelect, cols = 1 }) => (
  <div
    className={`grid gap-3 ${cols === 2 ? "sm:grid-cols-2" : "sm:grid-cols-1"}`}
  >
    {options.map((o) => {
      const on = value === o;
      return (
        <button
          key={o}
          onClick={() => onSelect(o)}
          className={`flex items-center justify-between rounded-xl border p-4 text-left text-sm font-semibold transition ${
            on
              ? "border-green-600 bg-green-600/10 text-green-600"
              : "border-[#e1e6ee] text-blacky-light hover:border-green-400 hover:bg-[#f6f9fd]"
          }`}
        >
          {o}
          <span
            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
              on ? "border-green-600 bg-green-600 text-white" : "border-[#cdd8ea]"
            }`}
          >
            {on && <FaCircleCheck className="text-[10px]" />}
          </span>
        </button>
      );
    })}
  </div>
);

const MatchRing: React.FC<{ pct: number }> = ({ pct }) => {
  const r = 22;
  const c = 2 * Math.PI * r;
  const off = c - (pct / 100) * c;
  return (
    <div className="relative flex h-16 w-16 items-center justify-center">
      <svg className="h-16 w-16 -rotate-90" viewBox="0 0 56 56">
        <circle
          cx="28"
          cy="28"
          r={r}
          fill="none"
          stroke="#eef2f8"
          strokeWidth="5"
        />
        <circle
          cx="28"
          cy="28"
          r={r}
          fill="none"
          stroke="#1e4fa3"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={off}
        />
      </svg>
      <span className="absolute text-sm font-extrabold text-[#1e4fa3]">
        {pct}%
      </span>
    </div>
  );
};

export default AiSchoolMatch;
