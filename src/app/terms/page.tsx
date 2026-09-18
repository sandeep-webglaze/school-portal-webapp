import { Metadata } from "next";
import LegalInfo from "@/components/LegalInfo";

export const metadata: Metadata = {
  // Title was "Terms & Conditions" (18 chars) — too short for SERPs. Now
  // 54 chars with brand and platform context.
  title: "Terms & Conditions — Education Portal Academy School Finder",
  description:
    "Education Portal Academy Terms of Service — guidelines and policies for using our school discovery platform. Read before using the website or services.",
  alternates: { canonical: "/terms" },
  openGraph: {
    title: "Terms & Conditions — Education Portal Academy",
    description:
      "Terms of service for using the Education Portal Academy platform.",
    url: "/terms",
    type: "article",
  },
  twitter: {
    card: "summary",
    title: "Terms & Conditions — Education Portal Academy",
    description:
      "Terms of service for using the Education Portal Academy platform.",
  },
};

const TermsAndConditions = () => {
  return (
    <LegalInfo
      name="termsAndConditions"
      pageTitle="Terms & Conditions"
      pageIntro="Guidelines and policies for using the Education Portal Academy platform."
    />
  );
};

export default TermsAndConditions;
