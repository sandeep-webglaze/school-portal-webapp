import { getSiteMapData } from "@/api/sitemap-api";
import { SITE_BASE_URL } from "@/constants";
import { MetadataRoute } from "next";

// Refresh each shard hourly — keeps newly added category / search slugs
// in the index without waiting for a full redeploy.
export const revalidate = 3600;

async function getTotalSearchPagesCount() {
  try {
    const res = await getSiteMapData({ isSchoolOnly: false });
    if (res.totalCount) return res.totalCount;
  } catch (error) {
    console.log("error in getTotalSearchPagesCount=>", error);
  }
}

export async function generateSitemaps() {
  const totalCount = (await getTotalSearchPagesCount()) ?? 0;

  // Calculate the number of sitemaps needed based on Google's limit (50,000 URLs per sitemap)
  const numberOfSitemaps = Math.ceil(totalCount / 50000);

  // Generate an array of objects with IDs
  return Array.from({ length: numberOfSitemaps }, (_, index) => ({
    id: index,
  }));
}

export default async function sitemap({
  id,
}: {
  id: number;
}): Promise<MetadataRoute.Sitemap> {
  // Google's limit is 50,000 URLs per sitemap
  try {
    const slugs = await getSiteMapData({
      isSchoolOnly: false,
      page: id + 1,
      limit: 50000,
    });
    if (slugs.data)
      return slugs.data
        .filter((s) => Boolean(s?.slug))
        .map((slug) => ({
          url: `${SITE_BASE_URL}/search/${slug.slug}`,
          lastModified: new Date(),
          changeFrequency: "weekly" as const,
          priority: 0.7,
        }));
    return [];
  } catch (error) {
    // Never throw — Next will serve a broken XML otherwise. Empty shard
    // is recoverable on next revalidate.
    console.log(`error in search sitemap shard ${id}=>`, error);
    return [];
  }
}
