/**
 * City slug alias resolver.
 *
 * Indian cities have multiple official spellings — Bengaluru/Bangalore,
 * Mumbai/Bombay, Kolkata/Calcutta, Chennai/Madras, Pune/Poona,
 * Gurugram/Gurgaon. Admin might create a slug record for ONE spelling but
 * users / Google may visit either variant. Without this resolver, the
 * unsupported variant returns a hard 404 — bad for users (broken links)
 * and bad for SEO (Google flags 404s as low quality).
 *
 * What this module does:
 *   1. Given a slug like "boarding-schools-in-bengaluru", generate the
 *      list of alternate slugs that should ALSO try to resolve.
 *   2. Caller in search/[slug]/page.tsx falls back through that list and
 *      301-redirects to the first one that actually returns content.
 *
 * Why a static alias map (not a fuzzy regex):
 *   - Bilingual city names are LIMITED and well-known. A hardcoded map
 *     covers ~99% of real Indian search traffic.
 *   - Fuzzy matching risks false positives (we don't want "kanpur" to
 *     accidentally match "kannur").
 *
 * To add a new alias pair:
 *   1. Pick the canonical / preferred spelling (Bengaluru, not Bangalore)
 *   2. Add it as a key with the alternate spelling(s) as its value
 *   3. Also add the reverse entry so look-ups work both ways
 */

/**
 * Bidirectional alias map. Each key maps to the list of OTHER spellings
 * the caller should try. Order in the array is the priority order — first
 * entry is tried first. We deliberately repeat both directions so callers
 * don't have to do a double lookup.
 *
 * NOTE: keys are lowercase, hyphen-free, and match the city token used in
 * the slug between "-in-" and the trailing dash / end.
 */
const CITY_ALIASES: Record<string, string[]> = {
  // Karnataka — Bengaluru is the official 2014+ name, Bangalore is the
  // legacy spelling Google still surfaces in most SERPs.
  bengaluru: ["bangalore"],
  bangalore: ["bengaluru"],

  // Maharashtra — Mumbai vs Bombay (renamed 1995).
  mumbai: ["bombay"],
  bombay: ["mumbai"],

  // West Bengal — Kolkata vs Calcutta (renamed 2001).
  kolkata: ["calcutta"],
  calcutta: ["kolkata"],

  // Tamil Nadu — Chennai vs Madras (renamed 1996).
  chennai: ["madras"],
  madras: ["chennai"],

  // Maharashtra — Pune vs Poona (older spelling).
  pune: ["poona"],
  poona: ["pune"],

  // Haryana — Gurugram vs Gurgaon (renamed 2016).
  gurugram: ["gurgaon"],
  gurgaon: ["gurugram"],

  // Delhi — "new-delhi" is sometimes used interchangeably with "delhi" in
  // slugs even though they're technically different administrative regions.
  // Treat them as aliases for slug fallback purposes only.
  "new-delhi": ["delhi"],
  delhi: ["new-delhi"],

  // Uttar Pradesh — Prayagraj vs Allahabad (renamed 2018).
  prayagraj: ["allahabad"],
  allahabad: ["prayagraj"],

  // Uttar Pradesh — Varanasi vs Banaras (older spelling).
  varanasi: ["banaras", "benares"],
  banaras: ["varanasi", "benares"],
  benares: ["varanasi", "banaras"],

  // Kerala — Thiruvananthapuram vs Trivandrum (commonly used short form).
  thiruvananthapuram: ["trivandrum"],
  trivandrum: ["thiruvananthapuram"],

  // Tamil Nadu — Puducherry vs Pondicherry (renamed 2006).
  puducherry: ["pondicherry"],
  pondicherry: ["puducherry"],

  // Odisha — Bhubaneswar spelling variants.
  bhubaneswar: ["bhubaneshwar"],
  bhubaneshwar: ["bhubaneswar"],

  // Mussoorie — common misspellings.
  mussoorie: ["mussorie"],
  mussorie: ["mussoorie"],
};

/**
 * Parse the city portion out of a search slug.
 *
 *   "boarding-schools-in-bengaluru"     → "bengaluru"
 *   "schools-in-new-delhi"              → "new-delhi"
 *   "cbse-schools-in-bangalore"         → "bangalore"
 *   "best-day-schools"                  → null  (no "-in-" segment)
 *
 * The convention in our codebase is `<type>-in-<city>` where <city> can
 * itself contain hyphens (e.g. "new-delhi"). We split on the FIRST
 * occurrence of "-in-" and treat everything after it as the city token.
 */
export function extractCityFromSlug(slug: string): string | null {
  const idx = slug.toLowerCase().indexOf("-in-");
  if (idx === -1) return null;
  const city = slug.slice(idx + 4).trim();
  return city.length > 0 ? city : null;
}

/**
 * Given a slug, return an ordered list of alternate slugs to try when the
 * original returns 404. Empty array if no aliases apply.
 *
 *   "boarding-schools-in-bengaluru"
 *     → ["boarding-schools-in-bangalore"]
 *
 *   "schools-in-mumbai"
 *     → ["schools-in-bombay"]
 *
 *   "icse-schools-in-noida"
 *     → []   (no alias for noida)
 */
export function getAlternateSlugs(slug: string): string[] {
  const city = extractCityFromSlug(slug);
  if (!city) return [];

  const aliases = CITY_ALIASES[city];
  if (!aliases || aliases.length === 0) return [];

  // Rebuild the slug with each alias substituted in.
  return aliases.map((alt) => slug.slice(0, slug.length - city.length) + alt);
}

/**
 * Return the canonical city spelling. By policy we treat the modern
 * official name as canonical (Bengaluru, Mumbai, Kolkata, etc.) — Google
 * understands both and the canonical name will dominate SERPs over time.
 *
 * This is used to choose which slug variant a 301 should point to when
 * BOTH spellings exist in the backend (rare but possible).
 */
const CANONICAL_CITY_NAMES = new Set([
  "bengaluru",
  "mumbai",
  "kolkata",
  "chennai",
  "pune",
  "gurugram",
  "delhi",
  "prayagraj",
  "varanasi",
  "thiruvananthapuram",
  "puducherry",
  "bhubaneswar",
  "mussoorie",
]);

export function isCanonicalCity(city: string): boolean {
  return CANONICAL_CITY_NAMES.has(city.toLowerCase());
}
