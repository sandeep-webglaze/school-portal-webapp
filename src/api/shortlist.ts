import { API_HOST } from "@/constants";
import { responseHandler } from "./errors";
import { Response } from "./types";
import { SchoolList } from "./schools";
import { getToken } from "@/helpers";

interface FavoriteResonse {
  schools: SchoolList[];
  totalCount: number;
}
export async function getShortListSchools(
  token: string
): Promise<Response<FavoriteResonse>> {
  const endpoint = `${API_HOST}/favorite-school`;
  const res = await fetch(endpoint, {
    method: "GET",
    next: { tags: ["shortlist"], revalidate: 1000 },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await responseHandler(res);
}

export async function toogleFavorite(
  token: string,
  schoolId: string
): Promise<Response<SchoolList>> {
  const endpoint = `${API_HOST}/favorite-school/${schoolId}`;
  const res = await fetch(endpoint, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await responseHandler(res);
}

export async function removeFavorite(
  token: string,
  schoolId: string
): Promise<Response<SchoolList>> {
  const endpoint = `${API_HOST}/favorite-school/${schoolId}`;
  const res = await fetch(endpoint, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await responseHandler(res);
}

export async function sendShortListDetailsOnMail(
  schoolId: string
): Promise<Response<SchoolList>> {
  const endpoint = `${API_HOST}/school/${schoolId}/mail-detail`;
  const res = await fetch(endpoint, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return await responseHandler(res);
}
