"use server";

import { revalidateTag } from "next/cache";

export default async function revalidateShortList() {
  revalidateTag("shortlist");
}
