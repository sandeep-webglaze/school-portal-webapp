import { Fragment } from "react";
import { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import dynamic from "next/dynamic";

import { Container } from "@/components/Container";
import SearchBanner from "@/components/Banner/SearchBanner";
import JsonLd from "@/components/JsonLd";
import ScrollToContentCta from "@/components/Listings/ScrollToContentCta";
import {
  resolveTitle,
  resolveDescription,
  resolveKeywords,
} from "@/helpers/seoSlugHelpers";

import { API_HOST, SITE_BASE_URL } from "@/constants";
import { fetchSchools } from "@/actions/fetch-schools";
import { getFiltersMap } from "@/api/schools";

import "../../user-agent.css";
import SearchSchools from "./SearchSchools";
import DOMPurify from "isomorphic-dompurify";
import Whatsapp from "./Whatsapppopup";
import { getAppConfig } from "@/api/getAppConfig";
import FaqSchema, { FaqItem } from "@/components/FaqSchema";
import { buildSearchFaqs } from "@/helpers/searchFaq";
import { generateTitleFromSlug, generateDescriptionFromSlug } from "@/helpers/seoSlugHelpers";
import { sanitizeSlugMeta } from "@/helpers/sanitizeSlugMeta";
import { normaliseAdminHtml } from "@/helpers/sanitizeAdminHtml";
import { getAlternateSlugs } from "@/helpers/citySlugAliases";
import { safeCall } from "@/helpers/safeAsync";
import AuthorBioBox from "@/components/Author/AuthorBioBox";
import { IAuthor } from "@/api/author";

// Dynamically import Testimonials component
const DynamicTestimonials = dynamic(
  () => import("@/components/Testimonials/component")
);
const videoMap: Record<string, string> = {
  "boarding-schools-in-delhi":
    "https://www.youtube.com/embed/e9kZ4kqRSjE?si=AU30tRfoDVW_P6i4",

  "boarding-schools-in-dehradun":
    "https://www.youtube.com/embed/OCqdyTEkuTE?si=fxVyEsGl4WEx-9IB",

  // Add more mappings as needed
};

function wrapTables(html: string) {
  return html.replace(
    /<table[\s\S]*?<\/table>/g,
    (table) => `
      <div class="overflow-x-auto my-6">
        <div class="min-w-[700px]">${table}</div>
      </div>
    `
  );
}

const Schools = async ({ params, searchParams }: SchoolsProps) => {
  const slug = params.slug;
  const videoUrl = videoMap[slug];
  // safeCall — if either fetchSchools OR getFiltersMap throws (backend 5xx,
  // timeout, malformed JSON, anything), we get a null fallback instead of
  // crashing the whole page render. The downstream `if (!schools.data)`
  // check still triggers notFound() / city-alias redirect correctly.
  const [schools, filtersMap] = await Promise.all([
    safeCall(
      () => fetchSchools(params, { ...searchParams, page: 1 }),
      null,
      `search:${slug}:fetchSchools`,
    ),
    safeCall(
      () => getFiltersMap(),
      { data: undefined } as Awaited<ReturnType<typeof getFiltersMap>>,
      `search:${slug}:getFiltersMap`,
    ),
  ]);

  // ---------------------------------------------------------------------
  // City-spelling fallback. If the original slug has no backing data, try
  // alternate spellings (Bengaluru ↔ Bangalore, Mumbai ↔ Bombay, etc.) one
  // at a time. The FIRST variant that returns real data wins, and we 301
  // the user there so Google indexes only one canonical URL.
  //
  // Why this matters: admin doesn't always create slug records for every
  // spelling. Without this fallback, /search/boarding-schools-in-bengaluru
  // 404s even though /search/boarding-schools-in-bangalore is live — and
  // future renames (Calcutta → Kolkata, Madras → Chennai, etc.) would
  // each create a fresh batch of 404s.
  //
  // Implementation note: the guard is a single `if` (instead of stashing
  // the boolean in a `const hasNoData` first) so TypeScript can narrow
  // `schools.data` to non-undefined after the early return. Otherwise
  // every downstream `schools.data.X` access errors with
  //   "Type error: 'schools.data' is possibly 'undefined'"
  // because TS can't follow control flow through an intermediate variable.
  // ---------------------------------------------------------------------
  if (schools === null || schools === undefined || !schools.data) {
    const alternateSlugs = getAlternateSlugs(slug);
    for (const altSlug of alternateSlugs) {
      // safeCall here too — never let a network blip on the alternate
      // lookup tear down the page. Worst case: that alternate is treated
      // as "no data" and we move on to the next alias.
      const altResult = await safeCall(
        () =>
          fetchSchools({ slug: altSlug }, { ...searchParams, page: 1 }),
        null,
        `search:${slug}:alt:${altSlug}`,
      );
      if (altResult && altResult.data) {
        // Found a working alternate — 301 the user there. Preserves link
        // equity, avoids duplicate content, and means Google only ever
        // indexes one of the two URLs.
        permanentRedirect(`/search/${altSlug}`);
      }
    }
    // No alternate found either — genuine 404.
    return notFound();
  }

  // normaliseAdminHtml — demotes admin <h1>s to <h2>, strips <meta>/<title>/
  // <link>/<base>/<script>, and adds rel="noopener noreferrer" to every
  // target="_blank" link from the admin.
  //
  // Then DOMPurify runs with an explicit FORBID_TAGS list as a second line
  // of defense. The default DOMPurify allowlist is supposed to drop <meta>
  // already, but Screaming Frog still found 87 pages shipping
  // `<meta name="robots" content="noindex">` from admin body HTML — meaning
  // either the default allowlist behaves differently in our isomorphic-
  // dompurify setup, or the meta survived via some HTML entity edge case.
  // Forcing FORBID_TAGS makes the behaviour explicit and crawl-proof.
  const rawContent = DOMPurify.sanitize(
    normaliseAdminHtml(schools.data.slugData?.slugContent || ""),
    {
      FORBID_TAGS: ["meta", "title", "base", "link", "script", "style"],
      FORBID_ATTR: ["http-equiv"],
    },
  );
  const words = rawContent.split(/\s+/);

  const topWordLimit = 120;
  const topContent = words.slice(0, topWordLimit).join(" ");
  let bottomContent = words.slice(topWordLimit).join(" ");

  // ⭐ ONLY WRAP TABLES IN BOTTOM CONTENT
  bottomContent = wrapTables(bottomContent);

  // BreadcrumbList JSON-LD — surfaces "Home > Search > {slug}" in Google
  // search results. Pretty-print the slug for the visible name (kebab → words).
  const prettyName = slug
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
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
        name: "Search",
        item: `${SITE_BASE_URL}/search`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: prettyName,
        item: `${SITE_BASE_URL}/search/${slug}`,
      },
    ],
  };

  // Admin-managed extra schemas (FAQ / Article / VideoObject, etc.) live on
  // the slug record. Previously we wrapped them in <Head> from "next/head"
  // which is a Pages-Router-only API — in App Router it silently emits the
  // children into the body and Search Console flags it under "Robots
  // directives outside head". Render them via the shared <JsonLd> helper
  // so they ship as plain inline <script type="application/ld+json">.
  let adminSchemas: any[] = [];
  try {
    if (schools.data?.slugData?.slugJsonSchema) {
      const parsed = JSON.parse(schools.data.slugData.slugJsonSchema);
      adminSchemas = Array.isArray(parsed) ? parsed : [parsed];
    }
  } catch {
    adminSchemas = [];
  }

  // FAQ resolution — the admin's structured FAQ editor wins. When it's empty
  // we check for an admin-shipped FAQPage JSON-LD, and only as a last resort
  // auto-generate a default FAQ set from the slug. The SAME list drives both
  // the FAQPage schema and the visible accordion (Google anti-cloaking rule).
  const adminHasFaq = adminSchemas.some(
    (s) => s && (s["@type"] === "FAQPage" || s.type === "FAQPage")
  );
  const adminFaqs: FaqItem[] = Array.isArray(schools.data.slugData?.faqs)
    ? schools.data.slugData!.faqs!
        .filter(
          (f) =>
            f &&
            typeof f.question === "string" &&
            typeof f.answer === "string" &&
            f.question.trim().length > 0 &&
            f.answer.trim().length > 0
        )
        .map((f) => ({ question: f.question.trim(), answer: f.answer.trim() }))
    : [];
  const faqs: FaqItem[] =
    adminFaqs.length > 0 ? adminFaqs : adminHasFaq ? [] : buildSearchFaqs(slug);

  // De-dupe FAQPage emission. The admin can technically place an FAQPage
  // schema in TWO places: the raw JSON-LD textarea (slugJsonSchema, legacy
  // path) AND the structured Page FAQs editor (new path). When both are
  // populated, we previously emitted two FAQPage JSON-LDs on the same page —
  // Google Search Console flags this as `Duplicate field "FAQPage"` and the
  // rich result becomes ineligible.
  //
  // Fix: whenever the structured editor has content, it is the source of
  // truth. We strip any FAQPage entry out of the raw schemas list before
  // rendering, so the page ships exactly one FAQPage block (the one built
  // from the structured editor by <FaqSchema /> below).
  const renderedAdminSchemas =
    adminFaqs.length > 0
      ? adminSchemas.filter(
          (s) => !(s && (s["@type"] === "FAQPage" || s.type === "FAQPage"))
        )
      : adminSchemas;

  // Page-level H1 + sub-heading. The admin's hero fields win; when blank we
  // fall back to the slug-generated keyword phrase so existing slugs with no
  // hero data never render an empty banner. The generator strips the brand
  // suffix and session — those belong in <title>, but the on-page H1 should
  // be a clean keyword phrase.
  const adminHeroTitle = (schools.data.slugData?.heroTitle ?? "").trim();
  const adminHeroSubtitle = (schools.data.slugData?.heroSubtitle ?? "").trim();
  const pageHeading =
    adminHeroTitle ||
    generateTitleFromSlug(slug)
      .replace(/\s*\|\s*EdHippo\s*$/i, "")
      .replace(/\s+2026-27\s*$/i, "");
  const pageSubheading = adminHeroSubtitle || generateDescriptionFromSlug(slug);

  // ---------------------------------------------------------------------
  // Page author (E-E-A-T). Admin assigns an author to the slug from the
  // admin panel; the backend populates the full author object on public
  // reads. A plain string means an un-populated id (admin-only read shape)
  // — treat that as "no author" instead of crashing on author.name.
  // ---------------------------------------------------------------------
  const rawAuthor = schools.data.slugData?.author;
  const pageAuthor: IAuthor | null =
    rawAuthor && typeof rawAuthor === "object" && (rawAuthor as IAuthor).name
      ? (rawAuthor as IAuthor)
      : null;

  // Person JSON-LD for the page author — tells Google exactly who stands
  // behind this content and links to their profile page.
  const authorSchema = pageAuthor
    ? {
        "@context": "https://schema.org",
        "@type": "Person",
        name: pageAuthor.name,
        url: `${SITE_BASE_URL}/author/${pageAuthor.slug}`,
        ...(pageAuthor.designation ? { jobTitle: pageAuthor.designation } : {}),
        ...(pageAuthor.photo ? { image: pageAuthor.photo } : {}),
        ...(pageAuthor.linkedinUrl ? { sameAs: [pageAuthor.linkedinUrl] } : {}),
        worksFor: {
          "@type": "Organization",
          name: "EdHippo Academy Private Limited",
          url: SITE_BASE_URL,
        },
      }
    : null;

  return (
    <Fragment>
      <JsonLd id="ld-search-breadcrumb" data={breadcrumbSchema} />
      {renderedAdminSchemas.map((schema, idx) => (
        <JsonLd key={idx} id={`ld-search-admin-${idx}`} data={schema} />
      ))}
      {faqs.length > 0 && (
        <FaqSchema id="ld-search-faq" items={faqs} />
      )}
      {authorSchema && <JsonLd id="ld-search-author" data={authorSchema} />}
      <SearchBanner
        heading={pageHeading}
        subheading={pageSubheading}
        backgroundImage={schools.data.slugData?.heroImage}
      />
      {/* -------- TOP CONTENT -------- */}
      {topContent && (
        <Container bgColor="!pb-0">
          <div
            className="text-editor-content mb-6"
            dangerouslySetInnerHTML={{ __html: topContent }}
          />
        </Container>
      )}

      {/* "Read the Complete Guide" CTA — placed RIGHT AFTER the intro
          paragraph so users see it before they scroll into the school list.
          Clicking smooth-scrolls past the filters + listings straight to
          the long-form guide near the bottom of the page. */}
      {bottomContent && <ScrollToContentCta targetId="full-guide" />}

      {videoUrl && (
        <Container maxWidth="max-w-5xl">
          <div className="justify-center items-center aspect-video rounded-xl overflow-hidden shadow-lg">
            <iframe
              width="100%"
              height="100%"
              src={videoUrl}
              title="School Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="rounded-xl max-w-5xl"
            />
          </div>
        </Container>
      )}

      <Whatsapp />
      <SearchSchools
        filtersMap={filtersMap.data}
        schoolsData={{
          schools: schools.data?.schools ?? [],
          totalCount: schools.data?.totalCount ?? 0,
        }}
      />
      {bottomContent && (
        <Container>
          <section
            id="full-guide"
            aria-label="Complete guide and information"
            className="scroll-mt-24"
          >
            <div
              className="text-editor-content"
              dangerouslySetInnerHTML={{ __html: bottomContent }}
            />
          </section>
        </Container>
      )}

      {/* "Expert Behind This Page" — admin-assigned author bio box. Placed
          right after the long-form guide so the expertise attribution sits
          next to the content it vouches for (E-E-A-T). Renders nothing when
          the slug has no author assigned in admin. */}
      {pageAuthor && (
        <Container bgColor="!py-0">
          <div className="max-w-4xl mx-auto">
            <AuthorBioBox author={pageAuthor} />
          </div>
        </Container>
      )}

      {/* Visible FAQ accordion — REQUIRED to be on-page when we emit FAQPage
          JSON-LD. Google treats schema without matching visible content as
          cloaking and will refuse to surface the rich result. The questions
          come from the admin's FAQ editor when set, otherwise buildSearchFaqs()
          — the same `faqs` list that feeds the FAQPage schema above. */}
      {faqs.length > 0 && (
        <Container>
          <section
            id="faqs"
            aria-label="Frequently asked questions"
            className="scroll-mt-24 max-w-4xl mx-auto"
          >
            {/* Heading uses the page's own keyword phrase to make this h2
                unique across the site. Previously all FAQ headings read
                "Frequently Asked Questions" which Screaming Frog flagged
                as H2: Duplicate on 100+ URLs. With pageHeading interpolated
                ("FAQs about Best Boarding Schools in Hyderabad") every
                slug now ships a distinct h2. */}
            <h2 className="text-2xl md:text-3xl font-bold text-green-800 mb-6 text-center">
              FAQs about {pageHeading.replace(/^Best\s+/i, "")}
            </h2>
            <div className="divide-y divide-green-100 rounded-xl border border-green-100 bg-white shadow-sm">
              {faqs.map((faq, idx) => (
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
        </Container>
      )}

      {/* Render the dynamically imported Testimonials component */}
      <DynamicTestimonials />
    </Fragment>
  );
};

interface GenerateMetadataParams {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

interface SchoolsProps extends GenerateMetadataParams {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] | undefined };
}

interface MetadataResponse extends Metadata {
  metadataBase: URL;
  openGraph: {
    url: string;
    title?: string;
    description?: string;
  };
}

export async function generateMetadata({
  params,
}: GenerateMetadataParams): Promise<MetadataResponse | undefined> {
  const slug = params.slug;
  // safeCall — if the cached app config promise rejects (cache eviction
  // race, backend down for hours), we still ship a valid metadata object
  // built from the slug fallback helpers. Page never crashes here.
  const globalMetaData = await safeCall(
    () => getAppConfig(),
    undefined,
    `search-metadata:${slug}:getAppConfig`,
  );
  // Canonical MUST point at this page, not the site root. Without an explicit
  // override here, the layout's default canonical ("/") leaks down to every
  // search slug and Google treats them all as duplicates of the homepage.
  const canonicalPath = `/search/${slug}`;

  // Positive robots state — used as the base for every search-slug page.
  // Admin can NOT override this via metadata spread (we sanitize first).
  // 88+ URLs in the latest Screaming Frog crawl were flagged as `noindex`
  // because the previous code spread raw admin meta which sometimes carried
  // a robots field. This stops that bleed at the source.
  const POSITIVE_ROBOTS = {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large" as const,
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  };

  if (slug === "all-schools") {
    return {
      title: "List of All Schools | EDHIPPO ACADEMY Pvt Ltd",
      description:
        "Find a complete list of schools with EDHIPPO ACADEMY Pvt Ltd. Compare options to make the best choice for your child’s future.",
      metadataBase: new URL(SITE_BASE_URL),
      alternates: { canonical: canonicalPath },
      robots: POSITIVE_ROBOTS,
      openGraph: {
        url: canonicalPath,
        title: "List of All Schools | EDHIPPO ACADEMY Pvt Ltd",
        description:
          "Find a complete list of schools with EDHIPPO ACADEMY Pvt Ltd. Compare options to make the best choice for your child’s future.",
      },
    };
  }
  // Catch ALL failures here — network errors, non-JSON responses (nginx
  // HTML error pages), invalid JSON. Whatever comes back, treat as "admin
  // didn't set meta" and the smart fallback layer below builds a clean
  // title/description from the slug itself.
  const metaData = await safeCall(
    async () => {
      const res = await fetch(`${API_HOST}/slug/${slug}/slug`);
      if (!res.ok) return null;
      return res.json();
    },
    null,
    `search-metadata:${slug}:fetch-slug-meta`,
  );

  const rawAdminMeta = metaData?.data?.slugMetaData ?? {};
  // Sanitize: strips robots/googleBot/notranslate/noimageindex/nosnippet.
  // Admin can only set title/description/keywords/openGraph/twitter going
  // forward — directives are owned by code, not by admin data.
  const adminMeta = sanitizeSlugMeta(rawAdminMeta);

  // Admin-first layer — the admin's own per-slug title/description/keywords
  // win whenever they're set. We pass the site-wide default metadata so the
  // resolvers can tell "admin set this" apart from "the backend merge leaked
  // the site-wide default in" — the latter is treated as blank and a unique
  // city+type-aware value is generated from the slug instead.
  const globalDefaults = globalMetaData?.defaultSlugMetaData;
  const finalTitle = resolveTitle(
    adminMeta.title as string | undefined,
    slug,
    globalDefaults?.title,
  );
  const finalDescription = resolveDescription(
    adminMeta.description as string | undefined,
    slug,
    globalDefaults?.description,
  );
  const finalKeywords = resolveKeywords(
    adminMeta.keywords as string[] | string | undefined,
    slug,
    globalDefaults?.keywords,
  );

  return {
    ...adminMeta,
    title: finalTitle,
    description: finalDescription,
    keywords: finalKeywords,
    metadataBase: new URL(SITE_BASE_URL),
    alternates: { canonical: canonicalPath },
    robots: POSITIVE_ROBOTS,
    openGraph: {
      ...(metaData?.data?.openGraph ??
        globalMetaData?.defaultSlugMetaData?.openGraph),
      title: (adminMeta.openGraph as any)?.title || finalTitle,
      description: (adminMeta.openGraph as any)?.description || finalDescription,
      url: canonicalPath,
    },
    twitter: {
      card: "summary_large_image",
      title: (adminMeta.twitter as any)?.title || finalTitle,
      description:
        (adminMeta.twitter as any)?.description || finalDescription,
    },
  };
}

export default Schools;