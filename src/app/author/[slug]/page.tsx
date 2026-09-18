import { Fragment } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";

import { getAuthorDetail } from "@/api/author";
import JsonLd from "@/components/JsonLd";
import { SITE_BASE_URL } from "@/constants";
import { normaliseAdminHtml } from "@/helpers/sanitizeAdminHtml";
import { safeCall } from "@/helpers/safeAsync";

import "../../user-agent.css";

interface AuthorPageProps {
  params: { slug: string };
}

/**
 * Dedicated author profile page — /author/[slug]. Fully admin-driven: every
 * section renders only when the admin filled the matching field, and the
 * "Pages by" list is auto-built from the combination slugs assigned to this
 * author in the admin panel.
 */
const AuthorPage = async ({ params }: AuthorPageProps) => {
  const detail = await safeCall(
    () => getAuthorDetail(params.slug),
    null,
    `author:${params.slug}:getAuthorDetail`,
  );

  const author = detail?.data?.author;
  if (!author) return notFound();

  const articles = detail?.data?.articles ?? [];

  const initials = author.name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const whatsappHref = author.whatsappNumber
    ? `https://wa.me/${author.whatsappNumber.replace(/\D/g, "")}`
    : null;

  // Admin rich-text bio — same normalise + sanitize pipeline as slugContent
  // on the search page (demote H1s, strip meta/script, force FORBID_TAGS).
  const bioHtml = DOMPurify.sanitize(
    normaliseAdminHtml(author.fullBioHtml || ""),
    {
      FORBID_TAGS: ["meta", "title", "base", "link", "script", "style"],
      FORBID_ATTR: ["http-equiv"],
    },
  );

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: author.name,
    url: `${SITE_BASE_URL}/author/${author.slug}`,
    ...(author.designation ? { jobTitle: author.designation } : {}),
    ...(author.photo ? { image: author.photo } : {}),
    ...(author.shortBio ? { description: author.shortBio } : {}),
    ...(author.linkedinUrl ? { sameAs: [author.linkedinUrl] } : {}),
    worksFor: {
      "@type": "Organization",
      name: "Education Portal Academy Private Limited",
      url: SITE_BASE_URL,
    },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_BASE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: author.name,
        item: `${SITE_BASE_URL}/author/${author.slug}`,
      },
    ],
  };

  return (
    <Fragment>
      <JsonLd id="ld-author-person" data={personSchema} />
      <JsonLd id="ld-author-breadcrumb" data={breadcrumbSchema} />

      {/* ---------- HERO ---------- */}
      <section className="bg-green-950 text-white">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-10 md:py-14">
          <div className="flex flex-col-reverse md:flex-row md:items-center gap-6 md:gap-10">
            <div className="flex-1 min-w-0">
              {author.designation && (
                <span className="inline-block rounded-full border border-green-500/50 bg-green-900/60 px-3 py-1 text-[11px] md:text-xs font-bold uppercase tracking-wider text-green-300 mb-4">
                  ✦ {author.designation}
                </span>
              )}
              <h1 className="text-3xl md:text-5xl font-bold">{author.name}</h1>
              {author.shortBio && (
                <p className="mt-4 text-sm md:text-base leading-relaxed text-green-100/90 max-w-2xl">
                  {author.shortBio}
                </p>
              )}
              {Array.isArray(author.stats) && author.stats.length > 0 && (
                <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {author.stats.map((stat, idx) => (
                    <div key={idx}>
                      <p className="text-2xl md:text-3xl font-bold">
                        {stat.value}
                      </p>
                      <p className="text-xs md:text-sm text-green-200/80">
                        {stat.label}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="shrink-0">
              {author.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={author.photo}
                  alt={author.name}
                  width={120}
                  height={120}
                  className="h-24 w-24 md:h-32 md:w-32 rounded-full object-cover border-4 border-green-500"
                />
              ) : (
                <div className="h-24 w-24 md:h-32 md:w-32 rounded-full bg-green-700 flex items-center justify-center text-3xl md:text-4xl font-bold border-4 border-green-500">
                  {initials}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ---------- CTA BAR ---------- */}
      {(whatsappHref || articles.length > 0) && (
        <div className="bg-green-600">
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-3 flex flex-wrap gap-3">
            {whatsappHref && (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="rounded-full bg-white px-4 py-2 text-xs md:text-sm font-bold text-green-800 hover:bg-green-50"
              >
                Free Counselling on WhatsApp
              </a>
            )}
            {articles.length > 0 && (
              <a
                href="#author-articles"
                className="rounded-full bg-green-800 px-4 py-2 text-xs md:text-sm font-bold text-white hover:bg-green-900"
              >
                Read My Pages
              </a>
            )}
            {author.linkedinUrl && (
              <a
                href={author.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer nofollow"
                className="rounded-full bg-green-800 px-4 py-2 text-xs md:text-sm font-bold text-white hover:bg-green-900"
              >
                LinkedIn
              </a>
            )}
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 md:px-8 py-8 md:py-12 space-y-10 md:space-y-14">
        {/* ---------- ABOUT ---------- */}
        {bioHtml && (
          <section aria-label="About the author">
            <p className="text-xs font-bold uppercase tracking-wider text-green-700 mb-2">
              About Me
            </p>
            <div
              className="text-editor-content"
              dangerouslySetInnerHTML={{ __html: bioHtml }}
            />
          </section>
        )}

        {/* ---------- QUOTE ---------- */}
        {author.quote && (
          <blockquote className="border-l-4 border-green-600 bg-green-50 rounded-r-xl px-5 py-4 text-sm md:text-base italic text-gray-700">
            “{author.quote}”
          </blockquote>
        )}

        {/* ---------- SPECIALISATIONS ---------- */}
        {Array.isArray(author.specialisations) &&
          author.specialisations.length > 0 && (
            <section aria-label="Areas of specialisation">
              <p className="text-xs font-bold uppercase tracking-wider text-green-700 mb-1">
                What I Cover
              </p>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
                Areas of specialisation
              </h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
                {author.specialisations.map((item, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                  >
                    {item.icon && <p className="text-2xl mb-2">{item.icon}</p>}
                    <p className="font-bold text-gray-900 text-sm md:text-base">
                      {item.title}
                    </p>
                    {item.description && (
                      <p className="text-xs md:text-sm text-gray-600 mt-1">
                        {item.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

        {/* ---------- CREDENTIALS ---------- */}
        {Array.isArray(author.credentials) && author.credentials.length > 0 && (
          <section aria-label="Credentials and recognition">
            <p className="text-xs font-bold uppercase tracking-wider text-green-700 mb-1">
              Credentials &amp; Recognition
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
              How this expertise was built
            </h2>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {author.credentials.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                >
                  {item.icon && <p className="text-2xl mb-2">{item.icon}</p>}
                  <p className="font-bold text-gray-900 text-sm md:text-base">
                    {item.title}
                  </p>
                  {item.description && (
                    <p className="text-xs md:text-sm text-gray-600 mt-1">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ---------- ARTICLES / ASSIGNED PAGES ---------- */}
        {articles.length > 0 && (
          <section
            id="author-articles"
            aria-label="Pages by this author"
            className="scroll-mt-24"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-green-700 mb-1">
              My Work
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
              Pages &amp; guides by {author.name}
            </h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {articles.map((article) => (
                <Link
                  key={article._id}
                  // Individual slugs are school detail pages (/school/...);
                  // combination slugs are search landing pages (/search/...).
                  href={
                    article.slugType === "individual"
                      ? `/school/${article.slug}`
                      : `/search/${article.slug}`
                  }
                  className="group rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:border-green-400 hover:shadow-md transition"
                >
                  <p className="font-semibold text-gray-900 text-sm md:text-base group-hover:text-green-700">
                    {article.heroTitle || article.formattedText || article.slug}
                  </p>
                  {article.heroSubtitle && (
                    <p className="text-xs md:text-sm text-gray-600 mt-1 line-clamp-2">
                      {article.heroSubtitle}
                    </p>
                  )}
                  <p className="text-xs font-semibold text-green-700 mt-2">
                    Read the guide →
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </Fragment>
  );
};

export async function generateMetadata({
  params,
}: AuthorPageProps): Promise<Metadata | undefined> {
  const detail = await safeCall(
    () => getAuthorDetail(params.slug),
    null,
    `author-metadata:${params.slug}:getAuthorDetail`,
  );
  const author = detail?.data?.author;

  const canonicalPath = `/author/${params.slug}`;
  if (!author) {
    return {
      title: "Author | Education Portal",
      metadataBase: new URL(SITE_BASE_URL),
      alternates: { canonical: canonicalPath },
    };
  }

  const title = `${author.name} — ${author.designation || "Education Expert"} | Education Portal`;
  const description =
    author.shortBio ||
    `${author.name} writes school guides and rankings on Education Portal.`;

  return {
    title,
    description,
    metadataBase: new URL(SITE_BASE_URL),
    alternates: { canonical: canonicalPath },
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      url: canonicalPath,
      title,
      description,
      ...(author.photo ? { images: [author.photo] } : {}),
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default AuthorPage;
