"use server";
import { CLIENT_TOKEN_STORAGE_KEY } from "@/constants";
import { cookies } from "next/headers";

export default async function logOut() {
  cookies().delete({ name: CLIENT_TOKEN_STORAGE_KEY, path: "/" });
  // redirect("/");
}
