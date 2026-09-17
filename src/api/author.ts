import { API_HOST } from "@/constants";
import { responseHandler } from "./errors";
import { Response } from "./types";

export interface IAuthorStat {
  value: string;
  label: string;
}

export interface IAuthorCard {
  icon?: string;
  title: string;
  description?: string;
}

export interface IAuthor {
  _id: string;
  name: string;
  /** Author page slug — /author/[slug]. */
  slug: string;
  designation?: string;
  photo?: string;
  shortBio?: string;
  /** Only present on the author-detail endpoint (excluded from slug populate). */
  fullBioHtml?: string;
  quote?: string;
  linkedinUrl?: string;
  whatsappNumber?: string;
  stats?: IAuthorStat[];
  specialisations?: IAuthorCard[];
  credentials?: IAuthorCard[];
  isActive?: boolean;
}

/** A slug attributed to the author — an "article" on their page. */
export interface IAuthorArticle {
  _id: string;
  slug: string;
  formattedText?: string;
  heroTitle?: string;
  heroSubtitle?: string;
  /** "combination" (search landing page) or "individual" (school page). */
  slugType?: string;
}

export interface IAuthorDetail {
  author: IAuthor;
  articles: IAuthorArticle[];
  totalArticles: number;
}

export async function getAuthorDetail(
  slug: string,
): Promise<Response<IAuthorDetail>> {
  try {
    const res = await fetch(`${API_HOST}/author/${slug}/detail`, {
      next: { revalidate: 1000 },
    });
    return await responseHandler(res);
  } catch (error) {
    console.error("Error in getAuthorDetail:", error);
    return {};
  }
}
