import { API_HOST } from "@/constants";
import { IUser } from "./CurrentUser";
import { responseHandler } from "./errors";
import { Response } from "./types";
import * as crypto from "crypto";
import { fetchPublicKey } from "@/actions/fetch-public-key";

interface LoginRequest {
  mail: string;
  password: string;
}

export interface LoginResponse extends IUser {
  access_token: string;
}

async function encryptPassword(password: string) {
  try {
    const publicKey = await fetchPublicKey();
    console.log("public key==>", publicKey);
    if (!publicKey) return;
    const encryptedData = crypto.publicEncrypt(
      publicKey,
      Buffer.from(password)
    );

    return encryptedData.toString("hex");
  } catch (error) {
    console.error("error in encryption:", error);
  }
}

export async function signin(
  body: LoginRequest
): Promise<Response<LoginResponse>> {
  const encryptedPassword = await encryptPassword(body.password);
  console.log("passwordEncryption==>", encryptedPassword);
  const endpoint = `${API_HOST}/auth/web/login`;
  const res = await fetch(endpoint, {
    method: "post",
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ mail: body.mail, password: encryptedPassword }),
  });
  return await responseHandler(res);
}

type ResetPasswordReq = {
  password: string;
  token: string;
};
export async function resetPassword(
  body: ResetPasswordReq
): Promise<Response<IUser>> {
  const endpoint = `${API_HOST}/auth/reset-password`;
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
