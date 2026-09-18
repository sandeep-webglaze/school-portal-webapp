import type { Metadata } from "next";

/**
 * Sanitiser for admin-provided slug metadata.
 *
 * The /school/[slug] and /search/[slug] routes spread an admin-managed
 * `slugMetaData` object from the backend straight into Next.js' generateMetadata
 * return value. That used to be a one-way ticket to disaster:
 *
 *   - 88 URLs flagged as `noindex` in Screaming Frog (including the
 *     boarding-schools-in-bengaluru landing page!) because admin had saved
 *     `robots: { index: false }` somewhere upstream.
 *   - 32 URLs with `notranslate`, 5 with `noimageindex`, 1 with `nosnippet`
 *     — same root cause. Each of these is a real SEO regression.
 *   - 42 URLs with duplicate <title> tags ("Education Portal Academy | Find Top
 *     Boarding Schools in India") because admin saved empty / missing
 *     metadata and the layout's default leaked down.
 *
 * This helper:
 *   1. Strips every robots/googlebot/translate/imageIndex/snippet field —
 *      the admin must NEVER be able to noindex a page by accident.
 *   2. Passes through safe fields (title, description, keywords, openGraph,
 *      twitter, authors, etc.) only when they're non-empty.
 *   3. Returns a clean object the caller can spread without worrying about
 *      poisoning the page's SEO signals.
 *
 * If we ever want admin to be able to noindex a page on purpose, add a
 * dedicated boolean field on the slug (e.g. `slugIsPublished: false`) and
 * gate the route at the page level — never via raw metadata spread.
 */

/** Fields we explicitly REFUSE to accept from admin data. */
const FORBIDDEN_FIELDS = new Set([
  "robots",
  "googleBot",
  "googlebot",
  "google",
  "yandex",
  "bingbot",
  "verification",
  "metadataBase",
  "alternates",
  "manifest",
  "icons",
  "themeColor",
  "viewport",
  "appleWebApp",
]);

/** Fields we explicitly DO accept (allowlist). */
const SAFE_FIELDS = new Set([
  "title",
  "description",
  "keywords",
  "authors",
  "creator",
  "publisher",
  "applicationName",
  "generator",
  "openGraph",
  "twitter",
  "category",
  "classification",
  "referrer",
  "formatDetection",
  "abstract",
  "archives",
  "assets",
  "bookmarks",
  "appLinks",
]);

/**
 * Clean a single string field — drops empty strings and trims whitespace
 * so the spread doesn't insert `title: ""` (which then renders an empty
 * <title> tag, just as bad as a missing one).
 */
function cleanString(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export type SanitizedSlugMeta = Partial<
  Pick<
    Metadata,
    | "title"
    | "description"
    | "keywords"
    | "openGraph"
    | "twitter"
    | "authors"
    | "creator"
    | "publisher"
    | "category"
  >
>;

/**
 * Take an arbitrary admin metadata blob and return a safe subset.
 *
 * The output is shaped so it can be spread directly into a Next.js
 * generateMetadata return:
 *
 *   return {
 *     ...sanitizeSlugMeta(metaData?.data?.slugMetaData),
 *     metadataBase: new URL(SITE_BASE_URL),
 *     alternates: { canonical: canonicalPath },
 *     robots: { index: true, follow: true },   // ← caller always forces this
 *   };
 */
export function sanitizeSlugMeta(input: unknown): SanitizedSlugMeta {
  if (!input || typeof input !== "object") return {};

  const raw = input as Record<string, unknown>;
  const out: SanitizedSlugMeta = {};

  // Title — must be a non-empty string after trim. Empty title is the
  // single biggest cause of the "duplicate title" Screaming Frog warning
  // because Next falls back to the layout default for every empty slug.
  const title = cleanString(raw.title);
  if (title) out.title = title;

  // Description — same treatment as title.
  const description = cleanString(raw.description);
  if (description) out.description = description;

  // Keywords — accept string ("a, b, c") or string[]. Coerce to string[]
  // because Next 14's Metadata type prefers that shape.
  if (Array.isArray(raw.keywords)) {
    const cleaned = raw.keywords
      .map((k) => (typeof k === "string" ? k.trim() : ""))
      .filter(Boolean);
    if (cleaned.length > 0) out.keywords = cleaned;
  } else {
    const keywordsString = cleanString(raw.keywords);
    if (keywordsString) {
      const parts = keywordsString
        .split(",")
        .map((k) => k.trim())
        .filter(Boolean);
      if (parts.length > 0) out.keywords = parts;
    }
  }

  // OpenGraph + Twitter — pass through if it's a plain object. We don't
  // deep-validate every field; the worst case is a malformed OG image URL
  // which is a cosmetic bug, not an SEO one.
  if (raw.openGraph && typeof raw.openGraph === "object") {
    out.openGraph = raw.openGraph as Metadata["openGraph"];
  }
  if (raw.twitter && typeof raw.twitter === "object") {
    out.twitter = raw.twitter as Metadata["twitter"];
  }

  // Authors / creator / publisher — flow through if present.
  const authors = cleanString(raw.authors) ?? cleanString(raw.author);
  if (authors) out.authors = [{ name: authors }];

  const creator = cleanString(raw.creator);
  if (creator) out.creator = creator;

  const publisher = cleanString(raw.publisher);
  if (publisher) out.publisher = publisher;

  // Debug-friendly: warn (server-side) when admin tried to set a forbidden
  // field. This shows up in server logs once and is easy to act on, but
  // doesn't break the build.
  for (const key of Object.keys(raw)) {
    if (FORBIDDEN_FIELDS.has(key) && raw[key] != null) {
      console.warn(
        `[sanitizeSlugMeta] Ignoring forbidden admin field "${key}" — set this in code, not in admin slugMetaData.`,
      );
    } else if (!SAFE_FIELDS.has(key) && !FORBIDDEN_FIELDS.has(key)) {
      // Unknown field — silently dropped. Add to SAFE_FIELDS if you
      // intentionally want admin to be able to set it.
    }
  }

  return out;
}
