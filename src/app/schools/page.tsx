import React from "react";
import { Metadata } from "next";
import SchoolListing from "@/components/SchoolListing/component";
import { SITE_NAME } from "@/constants";

export const metadata: Metadata = {
  title: `Schools in Dubai — Browse & Compare | ${SITE_NAME}`,
  description: `Browse and compare the best schools in Dubai on ${SITE_NAME}. Filter by curriculum, school type, fees and facilities.`,
  alternates: { canonical: "/schools" },
};

export default function SchoolsPage() {
  return <SchoolListing />;
}
