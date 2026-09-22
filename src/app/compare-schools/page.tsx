import React from "react";
import { Metadata } from "next";
import CompareSchools from "./CompareSchools";

export const metadata: Metadata = {
  title: "Compare Schools in Dubai — Fees, Curriculum & Ratings",
  description:
    "Compare the best schools in Dubai side by side — fees, curriculum, parent ratings and facilities — and choose the right school for your child with confidence.",
  keywords: [
    "compare schools Dubai",
    "Dubai school comparison",
    "compare school fees Dubai",
    "best schools in Dubai",
    "British vs IB schools Dubai",
    "Dubai school ratings",
  ],
  alternates: { canonical: "/compare-schools" },
  openGraph: {
    title: "Compare Schools in Dubai — Fees, Curriculum & Ratings",
    description:
      "Put Dubai schools side by side and compare fees, curriculum, ratings and facilities in one place.",
    url: "/compare-schools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compare Schools in Dubai — Fees, Curriculum & Ratings",
    description:
      "Put Dubai schools side by side and compare fees, curriculum, ratings and facilities in one place.",
  },
};

export default function CompareSchoolsPage() {
  return <CompareSchools />;
}
