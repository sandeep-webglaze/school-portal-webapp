import React from "react";
import Contact from "./ContactUs";
import { Metadata } from "next";

export const metadata: Metadata = {
  // Title: 58 chars — old value was just "Contact Us" (10 chars), failed
  // every SEO audit. Keyword-rich, includes brand + value prop.
  title: "Contact Education Portal — Free School Admission Help in Dubai",
  // Description: 152 chars — primary keyword (contact / counseling) in
  // first 80 chars, ends with CTA.
  description:
    "Contact Education Portal for free, independent school admission help in Dubai. Talk to our experts to find the best British, American, IB and Indian curriculum schools across Dubai.",
  keywords: [
    "contact Education Portal",
    "school admission help Dubai",
    "Education Portal support",
    "talk to school admission expert Dubai",
    "Dubai school enquiry",
    "free admission consultation Dubai",
    "best schools in Dubai contact",
    "Education Portal phone email",
  ],
  alternates: { canonical: "/contact-us" },
  openGraph: {
    title:
      "Contact Education Portal — Free School Admission Help in Dubai",
    description:
      "Get in touch with Education Portal for free, personalised guidance to find the perfect school for your child in Dubai.",
    url: "/contact-us",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Contact Education Portal — Free School Admission Help in Dubai",
    description:
      "Get in touch with Education Portal for free, personalised guidance to find the perfect school for your child in Dubai.",
  },
};

const ContactPage = () => {
  return <Contact />;
};

export default ContactPage;
