/**
 * Reusable FAQPage JSON-LD schema component.
 *
 * Renders an FAQPage structured-data block so Google can surface a Q&A
 * accordion in the search results. Pair this with a visible FAQ section
 * on the page — the schema MUST match visible content, or Google flags
 * it as cloaking.
 *
 * Typical placement:
 *   - School detail pages (admission FAQs)
 *   - Search/listing pages (common questions for a city + school type)
 *   - Blog articles (article FAQs)
 *   - Static pages like /register-school, /claim-school, /compare-schools
 *
 * Usage:
 *   import FaqSchema from "@/components/FaqSchema";
 *
 *   const FAQS = [
 *     { question: "...", answer: "..." },
 *     ...
 *   ];
 *
 *   <FaqSchema id="ld-faq-register" items={FAQS} />
 */

import JsonLd from "@/components/JsonLd";

export type FaqItem = {
  question: string;
  answer: string;
};

type FaqSchemaProps = {
  /** Unique id for the <script> tag — must be unique per page if multiple */
  id?: string;
  items: FaqItem[];
};

export default function FaqSchema({ id = "ld-faq", items }: FaqSchemaProps) {
  if (!items?.length) return null;

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };

  return <JsonLd id={id} data={schema} />;
}
