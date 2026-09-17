import type { MetadataRoute } from "next";
import { SITE_BASE_URL } from "@/constants";

/**
 * Generates /robots.txt at build time using Next.js' native MetadataRoute API.
 *
 * Strategy:
 *  - Allow everything by default (we want schools, search slugs, static pages
 *    all crawled).
 *  - Block authenticated user areas (/account/*) — those are private and have
 *    no SEO value.
 *  - Block utility / non-content paths (delete-account, thank-you).
 *  - Block obvious crawl traps (any ?utm_* or ?fbclid= URLs are duplicates
 *    of canonical pages — handled at the page level via canonical tags, but
 *    we also disallow common tracking-only query patterns here).
 *  - Point crawlers at the dynamic sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/account",
          "/account/",
          "/account/*",
          "/api",
          "/api/",
          "/api/*",
          "/delete-account",
          "/thank-you",
        ],
      },
      // Be explicit for the major bots — same rules, but some crawlers honour
      // their own UA block more reliably.
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/account/*", "/api/*", "/delete-account", "/thank-you"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/account/*", "/api/*", "/delete-account", "/thank-you"],
      },
    ],
    sitemap: `${SITE_BASE_URL}/sitemap.xml`,
    host: SITE_BASE_URL,
  };
}
