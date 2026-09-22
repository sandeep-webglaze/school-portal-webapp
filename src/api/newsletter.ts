import { API_HOST } from "@/constants";
import { responseHandler } from "./errors";
import { Response } from "./types";

// Subscribe an email to the newsletter (public endpoint).
export async function subscribeNewsletter(
  email: string
): Promise<Response<{ email: string }>> {
  const endpoint = `${API_HOST}/newsletter`;
  const res = await fetch(endpoint, {
    method: "post",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return await responseHandler(res);
}
