import { Response } from "../types";
import { removeNullOrUndefinedEmptyFields } from "@/helpers";
import { responseHandler } from "../errors";
import {
  School,
  SchoolBoard,
  SchoolClassification,
  SchoolList,
  SchoolType,
} from "./types";
import { API_HOST, SORTING_TYPE } from "@/constants";
import { HomePageSlug } from "../HomePage";

export interface SortFilters {
  maxFees?: SORTING_TYPE;
  minFees?: SORTING_TYPE;
  avgRating?: SORTING_TYPE;
  isFeatured?: string;
}
export interface ISchoolFilters {
  name?: string;
  categorySlug?: string;
  classification?: string[];
  type?: string[];
  schoolBoards?: string[];
  minFees?: number;
  maxFees?: number;
  city?: string;
  sortBy?: SortFilters;
}

interface SchoolListResponse {
  slugData: HomePageSlug;
  schools: SchoolList[];
  totalCount: number;
}

export async function getAllSchools(
  filters: ISchoolFilters,
  token?: string,
): Promise<Response<SchoolListResponse>> {
  try {
    const API_ENDPOINT = `${API_HOST}/school/list`;
    const newFilters = removeNullOrUndefinedEmptyFields(filters);
    if (newFilters?.sortBy) newFilters.sortBy = JSON.parse(newFilters.sortBy);
    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(API_ENDPOINT, {
      method: "POST",
      next: { tags: ["school-list"], revalidate: 1000 },
      headers,
      body: JSON.stringify(newFilters),
    });
    return await responseHandler(res);
  } catch (error) {
    console.error("Error in getAllSchools:", error);
    return {};
  }
}

export interface FiltersMap {
  schoolBoards: SchoolBoard[];
  schoolTypes: SchoolType[];
  schoolClassifications: SchoolClassification[];
}

export async function getFiltersMap(): Promise<Response<FiltersMap>> {
  try {
    const endpoint = `${API_HOST}/homepage/school-filters`;
    const res = await fetch(endpoint);
    return responseHandler(res);
  } catch (error) {
    console.error("Error in getFiltersMap:", error);
    return {};
  }
}

export interface ISchoolType {
  _id: string;
  name: string;
}

export async function getSchoolTypes(): Promise<Response<ISchoolType[]>> {
  try {
    const endpoint = `${API_HOST}/school-type`;
    const res = await fetch(endpoint);
    return await responseHandler(res);
  } catch (error) {
    console.error("Error in getSchoolTypes:", error);
    return {};
  }
}
