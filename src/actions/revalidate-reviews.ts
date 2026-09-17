"use server";

import { revalidateTag } from "next/cache";

export default async function revalidateReviews() {
  revalidateTag("my-reviews-list");
}
