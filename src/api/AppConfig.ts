import { API_HOST } from "@/constants";
import { Response } from "./types";
import { responseHandler } from "./errors";

interface IContactUs {
  phoneNumber: string;
  mail: string;
  address: string;
}

interface ISocialMedia {
  facebook: string;
  intstagram: string;
  tweeter: string;
  linkedIn: string;
  youtube: string;
  pinterest: string;
  medium: string;
}

export type ISlugMetaRobots = {
  index: boolean;
  follow: boolean;
  noarchive: boolean;
  nosnippet: boolean;
  noimageindex: boolean;
  nocache: boolean;
  notranslate: boolean;
  indexifembedded: boolean;
  nositelinkssearchbox: boolean;
  unavailable_after: string;
  "max-video-preview": string;
  "max-image-preview": string;
  "max-snippet": number;
};

export type ISlugMetaOpenGraph = {
  locale: string;
  type: string;
  title: string;
  description: string;
  url: string;
  images: string;
  siteName: string;
};

export type ISlugMetaTweeter = {
  card: string;
  title: string;
  description: string;
  site: string;
  images: string;
  creator: string;
};

export type ISlugMetaData = {
  title: string;
  description: string;
  keywords?: string;
  robots: ISlugMetaRobots;
  openGraph: ISlugMetaOpenGraph;
  twitter: ISlugMetaTweeter;
};

export interface IAppConfig {
  _id: string;
  contactUs: IContactUs;
  termsAndConditions?: string;
  privacyPolicy?: string;
  refundPolicy?: string;
  aboutUs?: string;
  socialMedia?: ISocialMedia;
  robots?: string;
  defaultSlugMetaData?: ISlugMetaData;
  defaultSlugJsonSchema?: string;
}

export async function getAppConfiguration(): Promise<Response<IAppConfig>> {
  try {
    const endpoint = `${API_HOST}/app-configuration`;
    const res = await fetch(endpoint);
    return responseHandler(res);
  } catch (error) {
    console.error("Error fetching app config:", error);
    return {} as Response<IAppConfig>; 
  }
}
