import { getSiteMapData } from "@/api/sitemap-api";
import { SITE_BASE_URL } from "@/constants";
import { MetadataRoute } from "next";

// Refresh sitemap hourly. Without this, Next caches the entire sitemap at
// build time and never re-fetches new schools / category slugs until a redeploy.
export const revalidate = 3600;

/**
 * Returns the list of shard ids needed to cover all dynamic slugs
 * (50k URLs per shard per Google's sitemap limit).
 *
 * Wrapped in try-catch so an API blip can't take the whole root sitemap
 * down — we'd rather ship a sitemap with just the static pages than no
 * sitemap at all.
 */
async function getTotalDynamicPagesCount(isSchoolOnly: boolean) {
  try {
    const res = await getSiteMapData({ isSchoolOnly });
    const totalCount = res.totalCount ?? 0;
    const numberOfSitemaps = Math.ceil(totalCount / 50000);
    return Array.from({ length: numberOfSitemaps }, (_, index) => ({
      id: index,
    }));
  } catch (error) {
    console.log("error in getTotalDynamicPagesCount=>", error);
    return [];
  }
}

// All static / marketing pages that should appear in the sitemap.
// Skipped on purpose:
//   - /account/*       (private, behind auth)
//   - /delete-account  (utility only)
//   - /thank-you       (post-submit confirmation, no SEO value)
const STATIC_ROUTES: Array<{
  path: string;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
}> = [
  { path: "", changeFrequency: "daily", priority: 1.0 },
  { path: "/about", changeFrequency: "monthly", priority: 0.7 },
  { path: "/contact-us", changeFrequency: "monthly", priority: 0.6 },
  { path: "/compare-schools", changeFrequency: "weekly", priority: 0.8 },
  { path: "/register-school", changeFrequency: "monthly", priority: 0.6 },
  { path: "/claim-school", changeFrequency: "monthly", priority: 0.6 },
  // /pro is currently a stub (noindex) — re-enable when content ships.
  { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
  { path: "/terms", changeFrequency: "yearly", priority: 0.3 },
  { path: "/refund-policy", changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const baseRoutes: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${SITE_BASE_URL}${r.path}`,
    lastModified: now,
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }));

  // Run shard-count fetches in parallel — they're independent endpoints.
  const [searchRoutes, schoolRoutes] = await Promise.all([
    getTotalDynamicPagesCount(false),
    getTotalDynamicPagesCount(true),
  ]);

  const finalSearchRoutes: MetadataRoute.Sitemap = searchRoutes.map(({ id }) => ({
    url: `${SITE_BASE_URL}/search/sitemap/${id}.xml`,
    lastModified: now,
  }));
  const finalSchoolRoutes: MetadataRoute.Sitemap = schoolRoutes.map(({ id }) => ({
    url: `${SITE_BASE_URL}/school/sitemap/${id}.xml`,
    lastModified: now,
  }));

  return [...baseRoutes, ...finalSearchRoutes, ...finalSchoolRoutes];
}
