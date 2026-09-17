import { API_HOST } from "@/constants";
import { responseHandler } from "./errors";
import { Response } from "./types";

export interface CtaRequest {
  name: string;
  phoneNumber: string;
  pageUrl: string;
}
export async function addCta(body: CtaRequest): Promise<Response<CtaRequest>> {
  const endpoint = `${API_HOST}/cta-enquiry`;
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
