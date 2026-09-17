export const dynamic = "force-dynamic";
import React from "react";
import type { Metadata } from "next";
import { getMyReviews } from "@/api/CurrentUser";
import { ColoredHeading } from "@/components/Heading";
import NoDataFound from "@/components/NoDataFound";
import MyReviewsList from "@/components/Review/MyReviewsList";
import { CLIENT_TOKEN_STORAGE_KEY } from "@/constants";
import { cookies } from "next/headers";

// Private, auth-only page — exclude from search index.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const MyReviews = async () => {
  const reviews = await getReviews();
  if (!reviews || reviews?.length < 1) return <NoDataFound />;
  return (
    <div className="w-full">
      <ColoredHeading mt={false} greenText={"Reviews"} title={"My"} />
      <MyReviewsList reviews={reviews} />
    </div>
  );

  async function getReviews() {
    try {
      const token = cookies().get(CLIENT_TOKEN_STORAGE_KEY);
      if (!token?.value) return;
      const reviews = await getMyReviews(token?.value);
      if (reviews?.data) {
        return reviews?.data;
      }
    } catch (error) {
      console.log("Error in getting reviews=>", error);
    }
  }
};

export default MyReviews;