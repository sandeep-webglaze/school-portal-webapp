import React from "react";
import LegalInfo from "@/components/LegalInfo";
import { Metadata } from "next";

export const metadata: Metadata = {
  // Title was "Refund Policy" (13 chars) — too short for SERPs. Now 56 chars
  // with brand + service context.
  title: "Refund & Cancellation Policy — EdHippo Academy India",
  description:
    "EdHippo Academy Refund Policy — guidelines for refunds, cancellations, and the resolution process for paid services across our school discovery platform.",
  alternates: { canonical: "/refund-policy" },
  openGraph: {
    title: "Refund Policy — EdHippo Academy",
    description: "Refund and cancellation policy for EdHippo Academy services.",
    url: "/refund-policy",
    type: "article",
  },
  twitter: {
    card: "summary",
    title: "Refund Policy — EdHippo Academy",
    description: "Refund and cancellation policy for EdHippo Academy services.",
  },
};

const RefundPolicy = () => {
  return (
    <LegalInfo
      name="refundPolicy"
      pageTitle="Refund & Cancellation Policy"
      pageIntro="Guidelines for refunds and cancellations of paid EdHippo Academy services."
    />
  );
};

export default RefundPolicy;
