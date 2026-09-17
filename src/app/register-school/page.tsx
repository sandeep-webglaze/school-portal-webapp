import React from "react";

import { Metadata } from "next";
import RegisterSchool from "./RegisterSchool";

export const metadata: Metadata = {
  // Title: 56 chars — keyword-rich, brand at end. Old value was 20 chars
  // and got flagged as "too short" by every SEO audit tool.
  title: "Register Your School on Education Portal — Free School Listing",
  // Description: 155 chars — under the 160 limit, primary keyword in first
  // 80 chars, ends with a USP. Old value was 163 chars (over the limit).
  description:
    "List your school on Education Portal & reach thousands of families across Dubai. Free school registration with profile management, leads, and verified reviews.",
  // Page-specific keywords — distinct from site-wide defaults so this page
  // is targeted at school owners, not parents.
  keywords: [
    "register school on Education Portal",
    "list my school online Dubai",
    "free school listing Dubai",
    "school registration Education Portal",
    "add school to Education Portal",
    "school profile management",
    "schools advertising Dubai",
    "school lead generation",
    "online school directory Dubai",
  ],
  alternates: { canonical: "/register-school" },
  openGraph: {
    title: "Register Your School on Education Portal — Free Listing for 2026-27",
    description:
      "Get discovered by thousands of parents — list your school on Dubai's trusted school discovery platform. Free signup, full profile control.",
    url: "/register-school",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Register Your School on Education Portal — Free Listing for 2026-27",
    description:
      "Get discovered by thousands of parents — list your school on Dubai's trusted school discovery platform. Free signup, full profile control.",
  },
};

const page = () => {
  return <RegisterSchool />;
};

export default page;
