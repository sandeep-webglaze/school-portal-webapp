import React from "react";
import AboutContent from "./AboutContent";
import { Metadata } from "next";
import { SITE_NAME } from "@/constants";

export const metadata: Metadata = {
  title: `About ${SITE_NAME} — Dubai's Trusted School Finder`,
  description: `Learn about ${SITE_NAME} — Dubai's school discovery and admission guidance platform helping families find the right school for their child.`,
  keywords: [
    `about ${SITE_NAME}`,
    "school finder Dubai",
    "school discovery platform Dubai",
    "admission guidance Dubai",
    "best schools Dubai",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    title: `About ${SITE_NAME} — Dubai's Trusted School Finder`,
    description: `Learn about ${SITE_NAME} — Dubai's school discovery and admission guidance platform.`,
    url: "/about",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `About ${SITE_NAME} — Dubai's Trusted School Finder`,
    description: `Learn about ${SITE_NAME} — Dubai's school discovery and admission guidance platform.`,
  },
};

export default function About() {
  return <AboutContent />;
}
