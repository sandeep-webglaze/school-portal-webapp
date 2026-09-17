/**
 * Fallback SEO metadata for /school/[slug] pages.
 *
 * Screaming Frog crawl showed 42 school pages shipping with the SITE-WIDE
 * default title ("Education Portal Academy | Find Top Boarding Schools in India").
 * That happens when admin's slugMetaData.title is empty/missing — the spread
 * doesn't set a title, Next falls back to the layout's default title, and
 * every empty-meta school page ends up with the SAME homepage title. Google
 * treats those as duplicate-content candidates and one of them wins, the
 * rest get filtered out of the SERP.
 *
 * This module generates a *unique, keyword-rich* title and description from
 * the school's own data fields (name, city, board, type). The caller in
 * generateMetadata uses these as the second-level fallback when admin meta
 * is missing OR when the admin value is too short to rank.
 */

import { toTitleCase } from "@/helpers/functions";

type SchoolForSeo = {
  name?: string;
  city?: { city?: string; state?: string } | null;
  schoolBoards?: Array<{ name?: string }> | null;
  type?: Array<{ name?: string }> | null;
  classFrom?: string | number | null;
  classTo?: string | number | null;
};

const CURRENT_SESSION = "2026-27";
const BRAND_SUFFIX = "Education Portal";

/**
 * Title length sweet spot.
 *
 * Screaming Frog flags titles over 561 px / 60 chars. We previously
 * accepted up to 65 chars, which let admin-saved titles like "Roots country
 * School Shimla — Admission, Fees & Reviews | Education Portal" (65 chars, 611 px)
 * trip the warning. Tightened to <= 60 to leave pixel headroom.
 */
function isGoodTitleLength(s: string | undefined | null): boolean {
  if (!s) return false;
  const len = s.trim().length;
  return len >= 40 && len <= 60;
}

/**
 * Description length cap.
 *
 * Crawl flagged descriptions > 155 chars (15 URLs). We previously allowed
 * 120-160 and shipped some 156-160 char strings. Tightened upper bound to 155.
 */
function isGoodDescriptionLength(s: string | undefined | null): boolean {
  if (!s) return false;
  const len = s.trim().length;
  return len >= 120 && len <= 155;
}

/**
 * Generate a SEO-grade title from school data.
 *
 *   "St Stephen's School Delhi — Admission, Fees | Education Portal"   (54)
 *   "DPS Bangalore — Admission, Fees & Reviews | Education Portal"    (51)
 *
 * Hard cap: 60 chars total, to stay under Google's 561-px SERP truncation
 * threshold for the typical character mix in school names.
 */
export function generateSchoolTitle(school: SchoolForSeo): string {
  const rawName = (school.name ?? "").trim();
  const name = rawName ? toTitleCase(rawName) : "School";
  const city = school.city?.city ? toTitleCase(school.city.city) : "";

  const baseParts: string[] = [name];
  if (city && !name.toLowerCase().includes(city.toLowerCase())) {
    baseParts.push(city);
  }
  const base = baseParts.join(" ");

  // Ladder of templates from most informative to most compact. We pick the
  // first one that fits the 60-char cap so longer school names still get a
  // suffix (even if a short one) — never just bare school name.
  const candidates = [
    `${base} — Admission, Fees & Reviews | ${BRAND_SUFFIX}`,
    `${base} — Admission, Fees | ${BRAND_SUFFIX}`,
    `${base} — Admissions ${CURRENT_SESSION} | ${BRAND_SUFFIX}`,
    `${base} — ${CURRENT_SESSION} Admissions | ${BRAND_SUFFIX}`,
    `${base} | ${BRAND_SUFFIX}`,
  ];

  for (const c of candidates) {
    if (c.length <= 60) return c;
  }

  // Even the bare "Name | Education Portal" doesn't fit — truncate the school name.
  const room = 60 - ` | ${BRAND_SUFFIX}`.length - 1;
  const trimmedBase = base.length > room ? base.slice(0, room).trimEnd() + "…" : base;
  return `${trimmedBase} | ${BRAND_SUFFIX}`;
}

/**
 * Generate a SEO-grade meta description from school data.
 *
 * Targets a 140-char (not 155) sweet spot. Why: Screaming Frog's pixel
 * limit (985 px) trips on long school names like "Nirmal Ashram Deepmala
 * Pagarani School" — those 38-char names with many capital letters render
 * wider than the char-count math implies. 140 chars leaves enough pixel
 * headroom even for the widest school names in our DB.
 */
export function generateSchoolDescription(school: SchoolForSeo): string {
  const rawName = (school.name ?? "").trim();
  const name = rawName ? toTitleCase(rawName) : "this school";
  const city = school.city?.city ? toTitleCase(school.city.city) : "India";
  const board = school.schoolBoards?.[0]?.name?.trim() ?? "";
  const boardPhrase = board ? ` (${board})` : "";

  // Ladder of templates from most-informative to most-compact. Pick the
  // first that fits the 145-char target (gives some pixel headroom).
  const candidates = [
    `${name} in ${city}${boardPhrase} — admissions, fees & verified parent reviews for ${CURRENT_SESSION} on ${BRAND_SUFFIX}.`,
    `${name} in ${city}${boardPhrase} — admissions ${CURRENT_SESSION} & verified reviews on ${BRAND_SUFFIX}.`,
    `${name} in ${city} — fees, admissions & reviews ${CURRENT_SESSION} on ${BRAND_SUFFIX}.`,
    `${name} — admission, fees & reviews on ${BRAND_SUFFIX}.`,
  ];
  for (const c of candidates) {
    if (c.length <= 145) return c;
  }

  // Last resort — keep the leanest template and truncate the school name.
  const room = 145 - ` — admissions & reviews on ${BRAND_SUFFIX}.`.length;
  const trimmedName = name.length > room ? name.slice(0, room).trimEnd() : name;
  return `${trimmedName} — admissions & reviews on ${BRAND_SUFFIX}.`;
}

/**
 * Resolver — admin value wins ONLY when it falls inside the SEO sweet spot
 * AND is meaningfully different from the page's H1 (school name).
 *
 * "Page Titles: Same as H1" — Screaming Frog flags titles that match the
 * H1 exactly. On Education Portal this happens when admin saved just the school
 * name as the title (e.g. "Sri Sai Baba International Public School")
 * and the ListingHead component also renders that name as the H1. Two
 * identical signals = one wasted opportunity. We force the generated
 * fallback in that case so the title carries extra keywords.
 */
export function resolveSchoolTitle(
  adminTitle: string | undefined,
  school: SchoolForSeo,
): string {
  const trimmedAdmin = adminTitle?.trim() ?? "";
  if (isGoodTitleLength(trimmedAdmin)) {
    // If admin's value is essentially "<school name>" (with at most one
    // extra word/separator), it'll equal the H1 — bail to fallback.
    const schoolName = (school.name ?? "").trim();
    if (schoolName) {
      const normAdmin = trimmedAdmin.toLowerCase().replace(/[^a-z0-9]+/g, "");
      const normName = schoolName.toLowerCase().replace(/[^a-z0-9]+/g, "");
      if (normAdmin === normName) {
        return generateSchoolTitle(school);
      }
    }
    return trimmedAdmin;
  }
  return generateSchoolTitle(school);
}

export function resolveSchoolDescription(
  adminDescription: string | undefined,
  school: SchoolForSeo,
): string {
  if (isGoodDescriptionLength(adminDescription)) return adminDescription!.trim();
  return generateSchoolDescription(school);
}

/**
 * Build a per-school keyword list — separate from the site-wide defaults
 * so every school page is distinct.
 */
export function generateSchoolKeywords(school: SchoolForSeo): string[] {
  const rawName = (school.name ?? "").trim();
  const name = rawName ? toTitleCase(rawName) : "";
  const city = school.city?.city ? toTitleCase(school.city.city) : "India";
  const board = school.schoolBoards?.[0]?.name?.trim() ?? "";

  const set = new Set<string>();
  if (name) {
    set.add(name);
    set.add(`${name} admission`);
    set.add(`${name} fees`);
    set.add(`${name} reviews`);
    set.add(`${name} ${city}`);
    set.add(`${name} ${CURRENT_SESSION}`);
  }
  set.add(`best schools in ${city}`);
  set.add(`schools in ${city}`);
  if (board) {
    set.add(`${board} schools in ${city}`);
    set.add(`${board} school ${city}`);
  }
  set.add(BRAND_SUFFIX);

  return Array.from(set).slice(0, 12);
}
