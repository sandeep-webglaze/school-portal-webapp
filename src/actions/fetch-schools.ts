"use server";

import { getAllSchools } from "@/api/schools";
import { CLIENT_TOKEN_STORAGE_KEY } from "@/constants";
import { cookies } from "next/headers";

export async function fetchSchools(
  params: { slug: string },
  searchParams: any
) {
  const token = cookies().get(CLIENT_TOKEN_STORAGE_KEY);
  try {
    let filters: any = { ...searchParams, limit: 30 };
    if (params.slug !== "all-schools")
      filters = { ...filters, categorySlug: params.slug };
    const schools = await getAllSchools(filters, token?.value);
    return schools;
  } catch (error) {
    console.error("Err in Fetching School List=>", error);
    return null;
  }
}