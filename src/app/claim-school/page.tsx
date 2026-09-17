import React from "react";
import ClaimSchoolContent from "./ClaimSchoolContent";
import { Metadata } from "next";

export const metadata: Metadata = {
  // Title: 51 chars — already good.
  title: "Claim Your School — Manage & Enhance Your Profile",
  // Description: 145 chars — already good.
  description:
    "Claim your school's listing on EdHippo Academy. Manage your profile, respond to enquiries, and showcase your strengths to thousands of parents.",
  keywords: [
    "claim my school EdHippo",
    "school profile management",
    "claim school listing India",
    "school owner login EdHippo",
    "manage school profile online",
    "respond to parent enquiries",
    "school admin dashboard India",
    "EdHippo school verification",
  ],
  alternates: { canonical: "/claim-school" },
  openGraph: {
    title: "Claim Your School on EdHippo — Manage Your Listing",
    description:
      "Take ownership of your school's profile and connect directly with interested parents.",
    url: "/claim-school",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Claim Your School on EdHippo — Manage Your Listing",
    description:
      "Take ownership of your school's profile and connect directly with interested parents.",
  },
};

const ClaimSchool = () => {
  return <ClaimSchoolContent />;
};

export default ClaimSchool;
