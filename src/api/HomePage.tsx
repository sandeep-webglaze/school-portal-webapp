import { API_HOST } from "@/constants";
import { responseHandler } from "./errors";
import { Response } from "./types";
import { ISchool, SchoolBoard, SchoolList, SchoolType } from "./schools";

export interface SlugFaq {
  question: string;
  answer: string;
}

export interface HomePageSlug {
  _id: string;
  slug: string;
  formattedText: string;
  slugMetaData?: any;
  slugJsonSchema?: string;
  slugContent?: string;
  /** Admin-managed on-page H1 for the search landing page. */
  heroTitle?: string;
  /** Admin-managed sub-heading shown beneath the hero H1. */
  heroSubtitle?: string;
  /** Admin-uploaded banner image URL used as the search page hero background. */
  heroImage?: string;
  /** Admin-managed FAQ list — drives the on-page accordion + FAQPage schema. */
  faqs?: SlugFaq[];
  /**
   * Admin-assigned page expert. Populated object on public reads (drives the
   * "Expert Behind This Page" box), plain id on admin reads, null when unset.
   */
  author?: import("./author").IAuthor | string | null;
  isHomepageSlug: boolean;
  filters: {
    _id: string;
    id: string;
    city: string | ICity;
    classification: string;
    type: string | SchoolType;
    schoolBoard: string | SchoolBoard;
    school: string | ISchool;
  };
  __v: number;
  id: string;
}

export interface ICity {
  _id: string;
  country: string;
  state: string;
  slug: string;
  city: string;
  icon: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}

interface HomePageResponse {
  homePageSlugs: HomePageSlug[];
  popularCities: ICity[];
  featuredSchools: SchoolList[];
}

export async function getHomepageDetails(): Promise<
  Response<HomePageResponse>
> {
  try {
    const endpoint = `${API_HOST}/homepage`;
    const res = await fetch(endpoint, { next: { revalidate: 500 } });
    return await responseHandler(res);
  } catch (error) {
    console.log("Err in fetching home page datat=>", error);
    return {};
  }
}
