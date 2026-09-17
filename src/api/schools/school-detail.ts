import { API_HOST } from "@/constants";
import { Response } from "../types";
import { responseHandler } from "../errors";
import { IReview, ISchoolReview, School } from "./types";
import { getToken } from "@/helpers";

export async function getSchoolDetail(
  slug: string,
  revalidateSec?: number,
): Promise<Response<School>> {
  try {
    const endpoint = `${API_HOST}/school/${slug}/slug`;
    const res = await fetch(endpoint, {
      next: { tags: ["school-detail"], revalidate: revalidateSec ?? 10 },
    });
    return await responseHandler(res);
  } catch (error) {
    console.log("Err in Detail=>", error);
    return {};
  }
}

export async function getSchoolDetailById(
  id: string,
): Promise<Response<School>> {
  try {
    const endpoint = `${API_HOST}/school/${id}`;
    const res = await fetch(endpoint);
    return responseHandler(res);
  } catch (error) {
    console.error("Error in getSchoolDetailById:", error);
    return {};
  }
}

export async function addReview(
  body: IReview,
): Promise<Response<ISchoolReview>> {
  const endpoint = `${API_HOST}/school-review`;
  const res = await fetch(endpoint, {
    method: "post",
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  });
  return await responseHandler(res);
}

export async function editReview(
  reviewId: string,
  body: IReview,
): Promise<Response<ISchoolReview>> {
  const endpoint = `${API_HOST}/school-review/${reviewId}`;
  const res = await fetch(endpoint, {
    method: "PUT",
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  });
  return await responseHandler(res);
}

export async function deleteReview(
  reviewId: string,
): Promise<Response<ISchoolReview>> {
  const endpoint = `${API_HOST}/school-review/${reviewId}`;
  const res = await fetch(endpoint, {
    method: "DELETE",
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });
  return await responseHandler(res);
}
