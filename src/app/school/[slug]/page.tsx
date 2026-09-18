import { getSchoolDetail } from "@/api/schools";
import { Button } from "@/components/Button";
import { ContactForm } from "@/components/ContactUs";
import { Container } from "@/components/Container";
import { ListingHead, ListingInfo } from "@/components/Listings";
import { ContactModal } from "@/components/Modals/ContactModal";
import Reviews from "@/components/Review/component";
import { API_HOST } from "@/constants";
import DOMPurify from "isomorphic-dompurify";
import { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { notFound } from "next/navigation";
import React, { Fragment } from "react";
import { safeJsonParse, toTitleCase } from "@/helpers/functions";
import JsonLd from "@/components/JsonLd";
import FaqSchema, { FaqItem } from "@/components/FaqSchema";
import { SITE_BASE_URL } from "@/constants";
import { sanitizeSlugMeta } from "@/helpers/sanitizeSlugMeta";
import {
  resolveSchoolTitle,
  resolveSchoolDescription,
  generateSchoolKeywords,
} from "@/helpers/schoolSeoFallbacks";
import { safeCall } from "@/helpers/safeAsync";

const RequestCallBack = dynamic(
  () => import("@/components/RequestCalback/component"),
  { ssr: false }
);

export async function generateMetadata(
  { params, searchParams }: any,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const slug = params.slug;

  // Fetch admin meta AND the school record in parallel — we need the school
  // for our fallback title/description generators (so when admin meta is
  // missing or too short, we still ship a unique, keyword-rich title built
  // from the school's name + city + board instead of leaking the layout
  // default like "EdHippo Academy | Find Top Boarding Schools in India").
  // That layout-default leak was the single cause of the 42 "duplicate
  // title" warnings in Screaming Frog.
  // safeCall around both — backend can be down, return non-JSON, etc.
  // Either failure here returns a clean null and the fallback layer below
  // ships a slug-derived title/description. Page never crashes.
  const [metaData, schoolRes] = await Promise.all([
    safeCall(
      async () => {
        const res = await fetch(`${API_HOST}/slug/${slug}/slug`);
        if (!res.ok) return null;
        return res.json();
      },
      null,
      `school-metadata:${slug}:fetch-slug-meta`,
    ),
    safeCall(
      () => getSchoolDetail(slug),
      null,
      `school-metadata:${slug}:getSchoolDetail`,
    ),
  ]);

  const canonicalPath = `/school/${slug}`;
  const schoolForSeo = schoolRes?.data ?? {};
  const adminMeta = metaData?.data?.slugMetaData ?? {};

  // Sanitize admin meta — strips robots/googleBot/notranslate/noimageindex
  // fields that were poisoning 88+ URLs with noindex. After sanitize, admin
  // can ONLY set title/description/keywords/openGraph/twitter; robots state
  // is owned by code and always positive.
  const safeAdminMeta = sanitizeSlugMeta(adminMeta);

  const finalTitle = resolveSchoolTitle(
    typeof safeAdminMeta.title === "string" ? safeAdminMeta.title : undefined,
    schoolForSeo,
  );
  const finalDescription = resolveSchoolDescription(
    safeAdminMeta.description as string | undefined,
    schoolForSeo,
  );
  const finalKeywords =
    Array.isArray(safeAdminMeta.keywords) && safeAdminMeta.keywords.length >= 5
      ? safeAdminMeta.keywords
      : generateSchoolKeywords(schoolForSeo);

  return {
    ...safeAdminMeta,
    title: finalTitle,
    description: finalDescription,
    keywords: finalKeywords,
    metadataBase: new URL(SITE_BASE_URL),
    alternates: { canonical: canonicalPath },
    // FORCE positive robots state. The admin can no longer accidentally
    // noindex a school page — if a page needs to be hidden, hide it at the
    // route level (return notFound()) not via metadata spread.
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      ...(safeAdminMeta.openGraph ?? {}),
      title:
        (safeAdminMeta.openGraph as any)?.title || finalTitle,
      description:
        (safeAdminMeta.openGraph as any)?.description || finalDescription,
      url: canonicalPath,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title:
        (safeAdminMeta.twitter as any)?.title || finalTitle,
      description:
        (safeAdminMeta.twitter as any)?.description || finalDescription,
    },
  };
}

const SchoolDetail = async ({ params }: { params: { slug: string } }) => {
  // safeCall — backend hiccup must NOT crash the page. Returns null on any
  // failure, which then drops into the `if (!school?.data)` notFound() path
  // below. That's a clean 404 instead of a raw "Application error" page.
  const school = await safeCall(
    () => getSchoolDetail(params.slug),
    null,
    `school:${params.slug}:getSchoolDetail`,
  );
  // safeJsonParse — slugJsonSchema can be null, empty, or malformed JSON
  // straight from the DB. A bad row used to crash the whole page render.
  const schemas = safeJsonParse<any[]>(school?.data?.slug?.slugJsonSchema, []);
  if (!school?.data) return notFound();
  const {
    avgRating,
    avgAcademicsRating,
    avgAddmissionRating,
    avgExtracurriclarRating,
    avgInfrastructureRating,
  } = school.data;

  // BreadcrumbList JSON-LD — surfaces "Home > Schools > {School Name}" in
  // Google search results and ties this page back to /search and / for
  // crawlers building the site graph.
  const schoolName = toTitleCase(school.data?.name ?? "");
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Schools",
        item: `${SITE_BASE_URL}/search/all-schools`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: schoolName,
        item: `${SITE_BASE_URL}/school/${params.slug}`,
      },
    ],
  };

  // EducationalOrganization JSON-LD — presents this school as a standalone
  // entity to Google so it can show rich results (address, rating, contact)
  // directly in SERPs. Field names map to the existing School API shape
  // (see src/api/schools/types.ts) so no backend changes are required:
  //   contactNumber → telephone
  //   mail          → email
  //   website       → sameAs
  //   city.state    → addressRegion
  //   city.country  → addressCountry
  // aggregateRating is emitted only when real reviews exist — empty/zero
  // ratings trigger Google's "rating without enough data" warning.
  const educationalOrgSchema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: schoolName,
    url: `${SITE_BASE_URL}/school/${params.slug}`,
    image:
      (Array.isArray(school.data.images) && school.data.images[0]) ||
      `${SITE_BASE_URL}/logo.png`,
    address: {
      "@type": "PostalAddress",
      addressLocality: school.data.city?.city ?? "",
      addressRegion: school.data.city?.state ?? "",
      addressCountry: school.data.city?.country ?? "IN",
    },
  };

  if (
    Array.isArray(school.data.reviews) &&
    school.data.reviews.length > 0 &&
    typeof avgRating === "number" &&
    avgRating > 0
  ) {
    educationalOrgSchema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: avgRating.toFixed(1),
      bestRating: "5",
      worstRating: "1",
      ratingCount: school.data.reviews.length,
    };
  }

  if (school.data.contactNumber) {
    educationalOrgSchema.telephone = school.data.contactNumber;
  }
  if (school.data.mail) {
    educationalOrgSchema.email = school.data.mail;
  }
  if (school.data.website) {
    educationalOrgSchema.sameAs = [school.data.website];
  }
  if (school.data.establishmentYear) {
    educationalOrgSchema.foundingDate = String(school.data.establishmentYear);
  }
  if (
    Array.isArray(school.data.schoolBoards) &&
    school.data.schoolBoards.length > 0
  ) {
    // EducationalCredentialAwarded surfaces the board (CBSE / ICSE / IB / etc.)
    // as a Google-recognised credential — improves entity understanding.
    educationalOrgSchema.educationalCredentialAwarded = school.data.schoolBoards
      .map((b: any) => b?.name)
      .filter(Boolean)
      .join(", ");
  }

  // ---------------------------------------------------------------------
  // Per-school FAQ — paired with a visible accordion further down. We only
  // emit it when the admin has NOT already shipped a custom FAQPage schema
  // for this slug (to avoid duplicate FAQPage entries on one page, which
  // Google rejects).
  // ---------------------------------------------------------------------
  const adminHasFaq =
    Array.isArray(schemas) &&
    schemas.some(
      (s: any) => s && (s["@type"] === "FAQPage" || s?.type === "FAQPage")
    );

  const cityName = school.data.city?.city
    ? toTitleCase(school.data.city.city)
    : "your city";
  const boardNames =
    Array.isArray(school.data.schoolBoards) && school.data.schoolBoards.length
      ? school.data.schoolBoards.map((b: any) => b?.name).filter(Boolean).join(", ")
      : "CBSE, ICSE & State Board";

  // Admin-managed structured FAQ on the school's slug record wins. Each
  // school in admin can fill its own Question / Answer pairs via the same
  // editor used for combination slugs; those drive both the FAQPage JSON-LD
  // and the visible accordion on this page.
  const adminSchoolFaqs: FaqItem[] = Array.isArray(school.data?.slug?.faqs)
    ? school.data!.slug!.faqs!
        .filter(
          (f: any) =>
            f &&
            typeof f.question === "string" &&
            typeof f.answer === "string" &&
            f.question.trim().length > 0 &&
            f.answer.trim().length > 0
        )
        .map((f: any) => ({
          question: f.question.trim(),
          answer: f.answer.trim(),
        }))
    : [];

  // Resolution order — admin structured FAQ → raw FAQPage JSON-LD admin
  // already shipped (legacy path; we skip the visible accordion to avoid
  // duplicate FAQPage entries) → auto-generated school FAQ as a final
  // fallback so existing schools with no admin FAQ data never render blank.
  const schoolFaqs: FaqItem[] = adminSchoolFaqs.length > 0
    ? adminSchoolFaqs
    : adminHasFaq
    ? []
    : [
        {
          question: `Where is ${schoolName} located?`,
          answer: `${schoolName} is located in ${cityName}. You can see the full address, contact details and a Google Maps location on this page above — and request a callback to confirm directions before visiting the campus.`,
        },
        {
          question: `Which board is followed at ${schoolName}?`,
          answer: `${schoolName} is affiliated with ${boardNames}. EdHippo verifies each school's affiliation before listing, so the board information you see here is the latest reported by the school.`,
        },
        {
          question: `How can I apply for admission at ${schoolName}?`,
          answer: `Click the "Request Callback" or "Enquire Now" button on this page. An EdHippo admission counsellor will contact you within 24 hours to walk you through the admission process, eligibility, dates and required documents — completely free of cost.`,
        },
        {
          question: `What are the fees at ${schoolName}?`,
          answer: `Fee details vary by grade and stream. The latest fee structure reported for ${schoolName} is shown on this page — for the most up-to-date and grade-wise breakdown, request a callback and our team will share the official fee structure from the school.`,
        },
        {
          question: `Are reviews of ${schoolName} on EdHippo verified?`,
          answer: `Yes. Every review on EdHippo is tied to a verified parent account and moderated before publication. Ratings shown for ${schoolName} cover academics, admissions, infrastructure and extracurriculars so you get a balanced view before deciding.`,
        },
      ];

  return (
    <Fragment>
      <JsonLd id="ld-school-breadcrumb" data={breadcrumbSchema} />
      <JsonLd id="ld-school-organization" data={educationalOrgSchema} />
      <Container>
        <div className="  max-w-screen-lg mx-auto ">
          <div className="flex flex-col gap-6">
            <ListingHead
              title={toTitleCase(school.data?.name)}
              images={
                school.data.images ?? [
                  "https://www.eduminatti.com/_next/image?url=%2FhomeImg.jpg&w=1200&q=100",
                ]
              }
              locationValue={school.data.city.city}
              rating={school.data.avgRating}
              id={"listing.id"}
            />
            <div
              className="w-full
                        md:grid-cols-7 
                        md:gap-10 
                         "
            >
              <ListingInfo school={school.data} />
              {/* <div className="order-first hidden md:block md:order-last mb-10 md:col-span-3">
                <ContactForm name="school-claim-form" paddingLarge={false} />
              </div> */}
            </div>
          </div>
          <Reviews
            ratings={{
              avgRating,
              avgAcademicsRating,
              avgAddmissionRating,
              avgExtracurriclarRating,
              avgInfrastructureRating,
            }}
            schoolId={school.data._id}
            reviews={school.data.reviews ?? []}
          />

          {/* Visible FAQ accordion — paired 1:1 with the FAQPage JSON-LD
              emitted just below. Schema + DOM MUST match or Google rejects
              the rich result as cloaking. */}
          {schoolFaqs.length > 0 && (
            <section
              id="faqs"
              aria-label="Frequently asked questions"
              className="scroll-mt-24 max-w-4xl mx-auto my-10"
            >
              {/* Heading uses the school name so the h2 is unique per
                  page (avoids Screaming Frog's H2: Duplicate finding). */}
              <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-6 text-center">
                FAQs about {schoolName}
              </h2>
              <div className="divide-y divide-green-100 rounded-xl border border-green-100 bg-white shadow-sm">
                {schoolFaqs.map((faq, idx) => (
                  <details
                    key={idx}
                    className="group p-4 md:p-5 [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex cursor-pointer items-start justify-between gap-4 text-base md:text-lg font-semibold text-gray-800 hover:text-green-700">
                      <span>{faq.question}</span>
                      <span className="ml-2 mt-1 shrink-0 text-green-600 transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <p className="mt-3 text-sm md:text-base leading-relaxed text-gray-600">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </section>
          )}

          <RequestCallBack />
        </div>
      </Container>
      {/* Admin-managed JSON-LD schemas attached to this school slug.
          IMPORTANT: previously these were wrapped in <Head> from "next/head"
          — that API is Pages-Router-only. In App Router it silently renders
          the children inline in the body, which trips Search Console's
          "Robots directives appear outside the head" warning whenever any
          <meta> tags leak through. We use the existing <JsonLd> component
          (it dangerouslySets a safe <script type="application/ld+json">),
          which Google reads from anywhere in the document. */}
      {Array.isArray(schemas) &&
        schemas.map((schema: any, idx: number) => (
          <JsonLd key={idx} id={`ld-school-admin-${idx}`} data={schema} />
        ))}

      {/* Per-school FAQPage JSON-LD — mirrors the visible accordion above. */}
      {schoolFaqs.length > 0 && (
        <FaqSchema id="ld-school-faq" items={schoolFaqs} />
      )}
    </Fragment>
  );
};

export default SchoolDetail;