import { responseHandler } from "./errors";
import { Response } from "./types";
import { generateURI } from "@/helpers";

interface ISiteMap {
  _id: string;
  slug: string;
}

interface ISiteMapFilters {
  isSchoolOnly: boolean;
  page?: number;
  limit?: number;
}
export async function getSiteMapData(
  filters: ISiteMapFilters
): Promise<Response<ISiteMap[]>> {
  try {
    const { isSchoolOnly, ...rest } = filters;
    const endpoint = filters.isSchoolOnly
      ? `/slug/school/site-map`
      : `/slug/search/site-map`;
    const res = await fetch(generateURI(endpoint, rest), {
      next: { revalidate: 1000 },
    });
    return responseHandler(res);
  } catch (error) {
    console.log("Err in Detail=>", error);
    return {};
  }
}
