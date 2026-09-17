import { API_HOST } from "@/constants";
import { Response } from "@/api/types";
import { responseHandler } from "./errors";
import { getToken } from "@/helpers";
import { IReview } from "./schools";


export interface IUser {
  _id: string;
  name: string;
  status: string;
  imageUrl: string | null;
  phoneNumber: string;
  password?: string;
  mail: string;
  createdAt: string;
}

export async function getCurrentUser(token: string): Promise<Response<IUser>> {
  const endpoint = `${API_HOST}/user/profile`;
  const res = await fetch(endpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await responseHandler(res);
}

export async function updateUser(
  body: Partial<IUser>
): Promise<Response<IUser>> {
  const endpoint = `${API_HOST}/user/profile`;
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

export interface MyReviewsResponse extends Omit<IReview, "schoolId"> {
  _id: string;
  schoolId: { name: string; images: string[]; slug: string };
}

export async function getMyReviews(
  token: string
): Promise<Response<MyReviewsResponse[]>> {
  const endpoint = `${API_HOST}/school-review`;
  const res = await fetch(endpoint, {
    method: "GET",
    next: { revalidate: 1000, tags: ["my-reviews-list"] },
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await responseHandler(res);
}

export async function deleteAccount(): Promise<Response<MyReviewsResponse[]>> {
  const endpoint = `${API_HOST}/delete-account-requests`;
  const res = await fetch(endpoint, {
    method: "POST",
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
