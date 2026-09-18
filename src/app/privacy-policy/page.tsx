import React from "react";
import { Metadata } from "next";
import LegalInfo from "@/components/LegalInfo";

export const metadata: Metadata = {
  // Title was "Privacy Policy" (14 chars) — failed every SEO audit for being
  // too short. Now 52 chars, brand-suffixed, primary intent in first 30 chars.
  title: "Privacy Policy — Education Portal Academy School Finder India",
  description:
    "Education Portal Academy Privacy Policy — learn how we collect, use, and protect your personal information while you use our school discovery platform.",
  alternates: { canonical: "/privacy-policy" },
  openGraph: {
    title: "Privacy Policy — Education Portal Academy",
    description:
      "How Education Portal Academy collects, uses, and protects your personal information.",
    url: "/privacy-policy",
    type: "article",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy — Education Portal Academy",
    description:
      "How Education Portal Academy collects, uses, and protects your personal information.",
  },
};

const PrivacyPolicy = () => {
  return (
    <LegalInfo
      name="privacyPolicy"
      pageTitle="Privacy Policy"
      pageIntro="How Education Portal Academy collects, uses, and protects your personal information."
    />
  );
};

export default PrivacyPolicy;
