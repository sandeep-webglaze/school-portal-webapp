/**
 * Default FAQs for /search/[slug] pages.
 *
 * Each search slug encodes a (school-type, location) pair — e.g.
 * "day-schools-in-bengaluru", "boarding-schools-in-dehradun",
 * "cbse-schools-in-delhi". From that we build a short, on-topic FAQ set so
 * the page always has at least ~4 questions with answers that include the
 * primary keyword. Used as:
 *
 *   1. <FaqSchema items={...}/>  → FAQPage JSON-LD for Google rich results
 *   2. A visible <details> accordion on the page (so schema matches DOM
 *      and we don't trip Google's cloaking rule).
 *
 * If the admin has already provided an FAQPage schema for this slug we skip
 * this generator entirely (see search/[slug]/page.tsx).
 */

import { parseSearchSlug } from "./seoSlugHelpers";
import type { FaqItem } from "@/components/FaqSchema";

const CURRENT_SESSION = "2026-27";

export function buildSearchFaqs(slug: string): FaqItem[] {
  const { typeLabel, location } = parseSearchSlug(slug);
  const place = location || "India";
  const typeLower = typeLabel.toLowerCase();

  return [
    {
      question: `Which are the best ${typeLower} in ${place} for ${CURRENT_SESSION}?`,
      answer: `Education Portal lists the top ${typeLower} in ${place} ranked by parent reviews, infrastructure, academics and admission process. You can filter by board (CBSE / ICSE / IB / State), fees, gender and location, and compare any two schools side-by-side before applying.`,
    },
    {
      question: `What is the average fee structure of ${typeLower} in ${place}?`,
      answer: `Fees for ${typeLower} in ${place} vary by board and grade. Most schools list annual tuition in the ₹50,000 – ₹4,00,000 range, with premium institutions going higher. Each school's detail page on Education Portal shows the latest fee bracket reported for ${CURRENT_SESSION}.`,
    },
    {
      question: `How do I apply for admission to ${typeLower} in ${place}?`,
      answer: `Pick any school from the listing, open its detail page on Education Portal and use the "Enquire Now" / "Request Callback" button. Our admission counsellor will contact you, walk you through eligibility, dates and documents required, and help you submit the school's official application form — free of cost.`,
    },
    {
      question: `Are the ${typeLower} listed on Education Portal verified?`,
      answer: `Yes. Every school on Education Portal goes through a verification step — we cross-check the board affiliation, address, contact details and official website before listing. Reviews are moderated and tied to verified parent accounts so the ratings you see for ${typeLower} in ${place} reflect real experiences.`,
    },
    {
      question: `Can I compare different ${typeLower} in ${place} on Education Portal?`,
      answer: `Yes. Open any two (or more) schools and click "Add to Compare". Education Portal's comparison view shows fees, board, infrastructure, hostel facilities, reviews and admission timelines side-by-side so you can shortlist the right ${typeLabel.toLowerCase()} for your child without juggling tabs.`,
    },
  ];
}
