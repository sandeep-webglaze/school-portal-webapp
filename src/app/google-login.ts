"use server";

import { API_HOST } from "@/constants";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function googleLogin(path: string) {
  cookies().set({
    name: "redirect_uri",
    value: path,
    httpOnly: true,
    path: "/",
    maxAge: 300, // cookie will be auto delete afetr 5 mins
  });
  redirect(`${API_HOST}/auth/login/google`);
}
