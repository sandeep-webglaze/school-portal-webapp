import React from "react";
import { Metadata } from "next";
import AiSchoolMatch from "@/components/AiSchoolMatch/component";

export const metadata: Metadata = {
  title: "AI School Match — Find the Best School in Dubai for Your Child",
  description:
    "Answer 5 quick questions and let our AI match your child with the best-fit schools in Dubai — ranked by curriculum, fees, location and your priorities. Free.",
  keywords: [
    "AI school finder Dubai",
    "best school for my child Dubai",
    "school match Dubai",
    "find schools Dubai quiz",
    "Dubai school recommendation",
  ],
  alternates: { canonical: "/school-match" },
  openGraph: {
    title: "AI School Match — Find the Best School in Dubai",
    description:
      "Let our AI match your child with the best-fit Dubai schools in under a minute.",
    url: "/school-match",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI School Match — Find the Best School in Dubai",
    description:
      "Let our AI match your child with the best-fit Dubai schools in under a minute.",
  },
};

export default function SchoolMatchPage() {
  return <AiSchoolMatch />;
}
