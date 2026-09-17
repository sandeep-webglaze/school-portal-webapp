"use server";

import { revalidateTag } from "next/cache";

export default async function revalidateSchools() {
  revalidateTag("school-list");
}
