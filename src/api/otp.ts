import { API_HOST } from "@/constants";
import { IUser } from "./CurrentUser";
import { responseHandler } from "./errors";
import { Response } from "./types";
import { LoginResponse } from "./SignIn";

interface SendOtpRequest {
  phoneNumber: string;
}

interface verifyOtpRequest {
  otp: string;
  name: string;
  phoneNumber: string;
}

interface OtpResponse {
  phoneNumber: string;
  name?: string;
  timeout: string;
}

export async function sendOtpPhone(
  body: SendOtpRequest
): Promise<Response<OtpResponse>> {
  const endpoint = `${API_HOST}/auth/send-otp`;
  const res = await fetch(endpoint, {
    method: "post",
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return await responseHandler(res);
}

export async function verifyOtpPhone(
  body: verifyOtpRequest
): Promise<Response<LoginResponse>> {
  const endpoint = `${API_HOST}/auth/otp-login`;
  const res = await fetch(endpoint, {
    method: "post",
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return await responseHandler(res);
}

export async function sendOtpForForgot(
  mail: string
): Promise<Response<OtpResponse>> {
  const endpoint = `${API_HOST}/auth/forgot-otp`;
  const res = await fetch(endpoint, {
    method: "post",
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mail }),
  });
  return await responseHandler(res);
}

type VerifyOtpAndCreateSessionReq = {
  mail: string;
  otp: string;
};
export async function verifyOtpAndCreateSession(
  body: VerifyOtpAndCreateSessionReq
): Promise<Response<{ token: string }>> {
  const endpoint = `${API_HOST}/auth/forgot-session`;
  const res = await fetch(endpoint, {
    method: "post",
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return await responseHandler(res);
}

interface verifyByFireBase {
  idToken: string;
  name: string;
  phoneNumber?: string;

  mail?: string;
}
export async function verifyByFireBase(
  body: verifyByFireBase
): Promise<Response<LoginResponse>> {
  const endpoint = `${API_HOST}/auth/verify`;
  const res = await fetch(endpoint, {
    method: "POST",
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return await responseHandler(res);
}
interface verifyByFireBaseGoogle {
  idToken: string;
  imageUrl?: string;
  mail?: string;
  name: string;
}
export async function verifyByFireBaseGoogle(
  body: verifyByFireBaseGoogle
): Promise<Response<LoginResponse>> {
  const endpoint = `${API_HOST}/auth/google-firebase`;
  const res = await fetch(endpoint, {
    method: "POST",
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  return await responseHandler(res);
}
export interface ISendName {
  phoneNumber: string;
}
export async function sendName(
  body: ISendName
): Promise<Response<{ name: string }>> {
  const endpoint = `${API_HOST}/auth/name-user`;
  const res = await fetch(endpoint, {
    method: "POST",
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json", // ✅ Required
    },
    body: JSON.stringify(body),
  });
  return await responseHandler(res);
}
