import React from "react";
import Contact from "./ContactUs";
import { Metadata } from "next";

export const metadata: Metadata = {
  // Title: 58 chars — old value was just "Contact Us" (10 chars), failed
  // every SEO audit. Keyword-rich, includes brand + value prop.
  title: "Contact EdHippo Academy — Free School Admission Counseling",
  // Description: 152 chars — primary keyword (contact / counseling) in
  // first 80 chars, ends with CTA.
  description:
    "Contact EdHippo Academy for free school admission counseling. Talk to our experts to find the best CBSE, ICSE, IB & boarding schools across India.",
  keywords: [
    "contact EdHippo Academy",
    "school admission counseling India",
    "EdHippo customer support",
    "talk to school admission expert",
    "EdHippo helpline",
    "school enquiry India",
    "free admission consultation",
    "EdHippo phone email",
  ],
  alternates: { canonical: "/contact-us" },
  openGraph: {
    title: "Contact EdHippo Academy — Free School Admission Counseling",
    description:
      "Get in touch with EdHippo for free, personalised guidance to find the perfect school for your child across India.",
    url: "/contact-us",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact EdHippo Academy — Free School Admission Counseling",
    description:
      "Get in touch with EdHippo for free, personalised guidance to find the perfect school for your child across India.",
  },
};

const ContactPage = () => {
  return <Contact />;
};

export default ContactPage;
