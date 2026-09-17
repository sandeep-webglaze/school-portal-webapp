import { API_HOST } from "@/constants";
import { responseHandler } from "./errors";
import { Response } from "./types";
import { getToken } from "@/helpers";
import { IUser } from "./CurrentUser";

interface SendOtpRequest {
  phoneNumber: string;
}
interface SendOtpRequestMail {
  mail: string;
}
interface verifyOtpRequest {
  otp: string;
  phoneNumber: string;
}
interface verifyOtpRequestMail {
  otp: string;
  mail: string;
}
interface OtpResponse {
  phoneNumber: string;
}
interface OtpResponseMail {
  mail: string;
}

export async function requestVerificationPhone(
  body: SendOtpRequest
): Promise<Response<OtpResponse>> {
  const endpoint = `${API_HOST}/user/request-verification-phone`;
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

export async function confirmVerificationPhone(
  body: verifyOtpRequest
): Promise<Response<IUser>> {
  const endpoint = `${API_HOST}/user/confirm-verification`;
  const res = await fetch(endpoint, {
    method: "post",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  });
  return await responseHandler(res);
}

export async function verfiyPhoneByFireBase(
  idToken: string
): Promise<Response<IUser>> {
  const endpoint = `${API_HOST}/user/verify-phone-firebase`;
  const res = await fetch(endpoint, {
    method: "post",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify({ idToken }),
  });
  return await responseHandler(res);
}

export async function requestVerificationEmail(
  body: SendOtpRequestMail
): Promise<Response<OtpResponseMail>> {
  const endpoint = `${API_HOST}/user/request-verification-email`;
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

export async function confirmVerificationEmail(
  body: verifyOtpRequestMail
): Promise<Response<IUser>> {
  const endpoint = `${API_HOST}/user/confirm-verification-email`;
  const res = await fetch(endpoint, {
    method: "post",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  });
  return await responseHandler(res);
}
