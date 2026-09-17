import { HomePageSlug } from "../HomePage";

export interface ISchool {
  _id: string;
  name: string;
}
export interface SchoolList {
  _id: string;
  name: string;
  slug: string;
  contactNumber: string;
  mail: string;
  website: string;
  schoolBoards: ISchool[];
  images: string[];
  establishmentYear: number;
  minFees: number;
  maxFees: number;
  avgRating: number;
  classification: string;
  type: { _id: string; name: string }[];
  city: { _id: string; city: string };
  classFrom: string;
  classTo: string;
  isFavorite: boolean;
}

export interface School {
  _id: string;
  name: string;
  chairman: string;
  medium: string;
  admissionStart: string;
  admissionEnd: string;
  contactNumber: string;
  mail: string;
  website: string;
  about: string;
  classFrom: string;
  classTo: string;
  classification: {
    _id: string;
    name: string;
    id: string;
  };
  type: {
    _id: string;
    name: string;
    id: string;
  }[];
  city: {
    _id: string;
    country: string;
    state: string;
    city: string;
    icon: string;
    id: string;
  };
  slug: HomePageSlug;
  images: string[];
  categoriesSlugs: string[];
  schoolBoards: SchoolBoard[];
  facilities: Facility[];
  establishmentYear: number;
  minFees: number;
  maxFees: number;
  avgRating: number;
  avgAcademicsRating: number;
  avgAddmissionRating: number;
  avgExtracurriclarRating: number;
  avgInfrastructureRating: number;
  coordinates: number[];
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  id: string;
  reviews: ISchoolReview[];
}

export interface IReview {
  schoolId: string;
  academics: number;
  infrastructure: number;
  addmission: number;
  extracurriclar: number;
  overallRating: number;
  review: string;
}
export interface ISchoolReview extends IReview {
  user: { name: string; imageUrl: string };
  createdAt: string;
  _id: string;
}

export interface SchoolBoard {
  _id: string;
  name: string;
  id: string;
}

export interface Facility {
  _id: string;
  name: string;
  icon: string; // Assuming facility icons are stored as URLs
  id: string;
}



export interface SchoolBoard {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}

export interface SchoolType {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}

export interface SchoolClassification {
  _id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  id: string;
}
