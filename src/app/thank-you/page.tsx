import React from "react";
import type { Metadata } from "next";
import ThankYouContent from "./ThankYouContent";

/**
 * /thank-you is a post-submit confirmation page. It must be kept out of
 * Google's index — duplicate confirmation pages dilute the site's quality
 * signal and Detailed flags it as "thin content".
 *
 * Robots disallow alone (in /robots.txt) only blocks crawling — Google can
 * still index a URL it learned about from a link and show a "no description"
 * SERP entry. An explicit `robots.index = false` meta tag is the only
 * guaranteed way to keep it out.
 */
export const metadata: Metadata = {
  title: "Thank You — EdHippo Academy",
  description:
    "Thank you for your enquiry on EdHippo Academy. Our admission counsellor will reach out to you shortly.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/thank-you" },
};

const Thankyou = () => {
  return <ThankYouContent />;
};

export default Thankyou;
