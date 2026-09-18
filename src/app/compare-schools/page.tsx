import React from "react";
import CompareSchools from "./CompareSchools";
import { Metadata } from "next";

export const metadata: Metadata = {
  // Title: 56 chars — already good.
  title: "Compare Schools — Find the Best Educational Institutions",
  // Description: trimmed from 159 to 152 chars so the Detailed extension
  // doesn't flag it as borderline. Primary keyword still in first 30 chars.
  description:
    "Compare schools side by side on academics, facilities, fees, board & location — make an informed decision for your child's education on Education Portal.",
  keywords: [
    "compare schools India",
    "school comparison tool",
    "compare CBSE schools",
    "compare ICSE schools",
    "side by side school comparison",
    "school vs school India",
    "best schools comparison",
    "Education Portal school comparison",
  ],
  alternates: { canonical: "/compare-schools" },
  openGraph: {
    title: "Compare Schools — Education Portal Academy",
    description:
      "Side-by-side comparison of schools across India. Find the best fit for your child.",
    url: "/compare-schools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare Schools — Education Portal Academy",
    description:
      "Side-by-side comparison of schools across India. Find the best fit for your child.",
  },
};

const page = () => {
  return <CompareSchools />;
};

export default page;
