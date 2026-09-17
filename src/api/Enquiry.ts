import { API_HOST } from "@/constants";
import { IUser } from "./CurrentUser";
import { responseHandler } from "./errors";
import { Response } from "./types";

export interface EnquiryRequest {
  email: string;
  message: string;
  pageUrl: string;
  name: string;
  phoneNumber: string;
  city: string;
  schoolType: string;
  class: string;
  gender: string;
}
export async function addEnquiry(
  body: EnquiryRequest
): Promise<Response<EnquiryRequest>> {
  const endpoint = `${API_HOST}/school-enquiry`;
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

export interface IRegisterSchoolReq {
  email: string;
  schoolAddress: string;
  school: string;
  name: string;
  phoneNumber: string;
}
export async function registerSchoolEnquiry(
  body: IRegisterSchoolReq
): Promise<Response<IRegisterSchoolReq>> {
  const endpoint = `${API_HOST}/claim-school-enquiry`;
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
