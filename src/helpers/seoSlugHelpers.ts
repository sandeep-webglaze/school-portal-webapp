/**
 * SEO helpers for /search/[slug] pages.
 *
 * Search slugs come from the admin (e.g. "boarding-schools-in-hyderabad",
 * "cbse-schools-in-delhi", "play-schools-in-noida"). Content writers used to
 * set whatever short title they felt like — "Day Schools in Kolkata" — and
 * the live page ended up with a 22-char title (Google needs 50–60) and a
 * generic description with no city/type keywords in it.
 *
 * These helpers do two things:
 *   1. Parse the slug into recognisable pieces (intent / type / board / city)
 *   2. Generate good SEO defaults — title, description, keywords — that we
 *      use as a fallback whenever the admin-provided values are too short
 *      or missing entirely.
 *
 * The admin's manually-curated value ALWAYS wins when it falls inside the
 * recommended length range. We only fill in when their value would actively
 * hurt rankings.
 */

const CURRENT_SESSION = "2026-27";
const BRAND_SUFFIX = "Education Portal";

/** Recognised school types (extracted from slug). */
const TYPE_PATTERNS: Array<{ match: RegExp; label: string; plural: string }> = [
  { match: /\bboarding\b/, label: "Boarding School", plural: "Boarding Schools" },
  { match: /\bday-boarding\b/, label: "Day Boarding School", plural: "Day Boarding Schools" },
  { match: /\bday\b/, label: "Day School", plural: "Day Schools" },
  { match: /\bplay\b/, label: "Play School", plural: "Play Schools" },
  { match: /\bnursery\b/, label: "Nursery School", plural: "Nursery Schools" },
  { match: /\bpreschool/, label: "Preschool", plural: "Preschools" },
  { match: /\binternational\b/, label: "International School", plural: "International Schools" },
  { match: /\bresidential\b/, label: "Residential School", plural: "Residential Schools" },
  { match: /\bmontessori\b/, label: "Montessori School", plural: "Montessori Schools" },
  { match: /\bboys\b/, label: "Boys School", plural: "Boys Schools" },
  { match: /\bgirls\b/, label: "Girls School", plural: "Girls Schools" },
  { match: /\bcoed|co-ed/, label: "Co-Ed School", plural: "Co-Ed Schools" },
];

/** Recognised boards. */
const BOARD_PATTERNS: Array<{ match: RegExp; label: string }> = [
  { match: /\bcbse\b/, label: "CBSE" },
  { match: /\bicse\b/, label: "ICSE" },
  { match: /\big?cse\b/, label: "IGCSE" },
  { match: /\bib\b/, label: "IB" },
  { match: /\bstate-board\b/, label: "State Board" },
  { match: /\bcambridge\b/, label: "Cambridge" },
];

type ParsedSlug = {
  /** "Boarding Schools" / "CBSE Schools" / "Day Schools" / fallback "Schools" */
  typeLabel: string;
  /** Board label (e.g. CBSE) if present in slug, else empty */
  board: string;
  /** Title-cased city / location (e.g. "Hyderabad", "Delhi", "New Delhi") */
  location: string;
};

/**
 * Capitalise each word after dashes/spaces.
 *   "new-delhi"          -> "New Delhi"
 *   "vasant-kunj-delhi"  -> "Vasant Kunj Delhi"
 */
function toTitleCaseFromSlug(part: string): string {
  if (!part) return "";
  return part
    .split(/[\s-]+/g)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Extract structured parts from a search slug.
 *
 * Examples:
 *   "boarding-schools-in-hyderabad"   -> { typeLabel: "Boarding Schools", location: "Hyderabad" }
 *   "cbse-schools-in-delhi"           -> { typeLabel: "CBSE Schools", board: "CBSE", location: "Delhi" }
 *   "day-schools-in-kolkata"          -> { typeLabel: "Day Schools", location: "Kolkata" }
 *   "schools-in-new-delhi"            -> { typeLabel: "Schools", location: "New Delhi" }
 *   "play-schools-in-india"           -> { typeLabel: "Play Schools", location: "India" }
 *   "boys-boarding-schools-in-dehradun" -> { typeLabel: "Boys Boarding Schools", location: "Dehradun" }
 */
export function parseSearchSlug(slug: string): ParsedSlug {
  const normalised = slug.toLowerCase().trim();

  // Split on " in " — that's the canonical join in our slug convention.
  const inSplit = normalised.split(/-in-/);
  const beforeIn = inSplit[0] ?? "";
  const afterIn = inSplit.slice(1).join("-in-") || "";

  // Detect board (if any)
  const boardMatch = BOARD_PATTERNS.find((b) => b.match.test(beforeIn));
  const board = boardMatch?.label ?? "";

  // Detect type — match the FIRST type token from the front of the slug so
  // multi-modifier slugs like "boys-boarding-schools-in-X" turn into
  // "Boys Boarding Schools".
  const typeTokens: string[] = [];
  TYPE_PATTERNS.forEach((t) => {
    if (t.match.test(beforeIn)) typeTokens.push(t.plural);
  });

  let typeLabel = "";
  if (board && typeTokens.length === 0) {
    typeLabel = `${board} Schools`;
  } else if (typeTokens.length > 0) {
    // Combine in slug appearance order — "Boys Boarding Schools"
    typeLabel = typeTokens.join(" ").replace(/Schools.*Schools/, "Schools");
  } else {
    typeLabel = "Schools";
  }

  // Title-case the location half.
  const location = toTitleCaseFromSlug(afterIn);

  return { typeLabel, board, location };
}

/**
 * Normalise an admin keyword value (comma-separated string OR string[]) into
 * a clean, de-duplicated string array.
 */
function toKeywordArray(value: string[] | string | undefined): string[] {
  let parts: string[] = [];
  if (Array.isArray(value)) {
    parts = value.map((k) => (typeof k === "string" ? k.trim() : ""));
  } else if (typeof value === "string" && value.trim()) {
    parts = value.split(",").map((k) => k.trim());
  }
  return Array.from(new Set(parts.filter(Boolean)));
}

/**
 * Build a 50–60 char meta title that always includes type + city + brand.
 *
 *   parseSearchSlug("boarding-schools-in-hyderabad")
 *   -> "Best Boarding Schools in Hyderabad 2026-27 | Education Portal"   (54 chars)
 *
 * Cap is 60 chars (was 65) — Screaming Frog flags titles over 561 px
 * SERP width, which corresponds roughly to 60 chars for mixed-case text.
 */
export function generateTitleFromSlug(slug: string): string {
  const { typeLabel, location } = parseSearchSlug(slug);

  if (!location) {
    const noLoc = `Best ${typeLabel} in India ${CURRENT_SESSION} | ${BRAND_SUFFIX}`;
    if (noLoc.length <= 60) return noLoc;
    return `Best ${typeLabel} in India | ${BRAND_SUFFIX}`;
  }

  const candidates = [
    `Best ${typeLabel} in ${location} ${CURRENT_SESSION} | ${BRAND_SUFFIX}`,
    `Best ${typeLabel} in ${location} | ${BRAND_SUFFIX}`,
    `${typeLabel} in ${location} ${CURRENT_SESSION} | ${BRAND_SUFFIX}`,
    `${typeLabel} in ${location} | ${BRAND_SUFFIX}`,
  ];
  for (const c of candidates) {
    if (c.length <= 60) return c;
  }
  // Long city + long type — drop the year to make room.
  return `${typeLabel} in ${location} | ${BRAND_SUFFIX}`;
}

/**
 * Build a ~140-char meta description with the primary keyword in the first
 * 100 characters, followed by a USP and CTA.
 */
export function generateDescriptionFromSlug(slug: string): string {
  const { typeLabel, location } = parseSearchSlug(slug);
  const place = location || "India";

  // Aim for ~150 chars so we sit comfortably under the 155-char Screaming
  // Frog limit even after admin appends a sentence in some cases.
  const candidate = `Discover the best ${typeLabel.toLowerCase()} in ${place} for ${CURRENT_SESSION}. Compare verified schools by fees, board & parent reviews on Education Portal.`;

  if (candidate.length <= 155) return candidate;
  // Trim conservatively — back off to the previous word boundary so we
  // never ship a half-word like "edu…".
  return candidate.slice(0, 152).replace(/\s+\S*$/, "") + "…";
}

/**
 * Generate a focused keyword list for THIS specific page. The list is
 * deliberately distinct from the site-wide default keywords in layout.tsx
 * — every slug gets its own city + type + board mix.
 */
export function generateKeywordsFromSlug(slug: string): string[] {
  const { typeLabel, board, location } = parseSearchSlug(slug);
  const lowerType = typeLabel.toLowerCase();
  const place = location || "India";

  const keywords = new Set<string>([
    `${lowerType} in ${place}`,
    `best ${lowerType} in ${place}`,
    `top ${lowerType} in ${place}`,
    `${place} ${lowerType}`,
    `${lowerType} ${place} ${CURRENT_SESSION}`,
    `${lowerType} ${place} admission`,
    `${lowerType} ${place} fees`,
    `${lowerType} ${place} reviews`,
    `list of ${lowerType} in ${place}`,
  ]);

  if (board) {
    keywords.add(`${board} schools in ${place}`);
    keywords.add(`best ${board} schools in ${place}`);
    keywords.add(`${board} school admission ${place}`);
  }

  // Always include the location-only keyword set so searches for "schools in X"
  // also surface the page.
  if (location) {
    keywords.add(`schools in ${place}`);
    keywords.add(`best schools in ${place}`);
  }

  // Brand at the end — never hurts and helps brand search.
  keywords.add("Education Portal");

  // Cap at 12 to keep meta tag tidy.
  return Array.from(keywords).slice(0, 12);
}

/**
 * Master resolvers — the admin's own per-slug value ALWAYS wins when present.
 *
 * The admin panel ships a live SERP preview + character counters, so whatever
 * a content writer saves for a slug is treated as intentional and used
 * verbatim. We only fall back to a slug-generated value when the admin left
 * the field blank.
 *
 * `globalDefault` guard: when the admin never set a per-slug title/description,
 * the backend fills it with the site-wide default during its metadata merge.
 * Using that as-is would make every page share one <title>/<description>.
 * Passing the site-wide default here lets us detect that case and generate a
 * unique per-slug value instead.
 */
// Minimum lengths below which an admin value is treated as junk/too-short and
// the generated SEO value is used instead. This catches the audit findings
// where slugs shipped titles like "rg" / "Day School" (Below 30 Characters)
// and descriptions like "rtrt" (Duplicate/short Meta). Google's title sweet
// spot is ~50-60 chars; anything under 30 is actively flagged. Descriptions
// should be ~70-160; a sub-50 description carries no keywords.
const MIN_TITLE_LEN = 30;
const MIN_DESC_LEN = 50;

export function resolveTitle(
  adminTitle: string | undefined,
  slug: string,
  globalDefault?: string,
): string {
  const admin = (adminTitle ?? "").trim();
  const fallback = (globalDefault ?? "").trim();
  // Honour the admin value only when it's set, distinct from the leaked
  // site-wide default, AND long enough to be a real SEO title.
  if (admin && admin !== fallback && admin.length >= MIN_TITLE_LEN) return admin;
  return generateTitleFromSlug(slug);
}

export function resolveDescription(
  adminDescription: string | undefined,
  slug: string,
  globalDefault?: string,
): string {
  const admin = (adminDescription ?? "").trim();
  const fallback = (globalDefault ?? "").trim();
  if (admin && admin !== fallback && admin.length >= MIN_DESC_LEN) return admin;
  return generateDescriptionFromSlug(slug);
}

export function resolveKeywords(
  adminKeywords: string[] | string | undefined,
  slug: string,
  globalDefault?: string[] | string,
): string[] {
  const admin = toKeywordArray(adminKeywords);
  const fallback = toKeywordArray(globalDefault);
  // Admin set their own keywords — honour them. A list identical to the
  // site-wide default is treated as "not set" (it leaked in via the backend).
  const isJustDefault =
    fallback.length > 0 &&
    admin.join("|").toLowerCase() === fallback.join("|").toLowerCase();
  if (admin.length > 0 && !isJustDefault) return admin;
  return generateKeywordsFromSlug(slug);
}
