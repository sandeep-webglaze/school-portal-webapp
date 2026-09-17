import Link from "next/link";

import { IAuthor } from "@/api/author";

/**
 * "Expert Behind This Page" — inline author bio box rendered at the bottom of
 * search/[slug] pages (E-E-A-T). Fully admin-driven: the box only appears when
 * an author is assigned to the slug from the admin panel, and every field
 * (photo, bio, links, stats) comes from the author record.
 */
const AuthorBioBox = ({ author }: { author: IAuthor }) => {
  if (!author?.name) return null;

  const initials = author.name
    .split(/\s+/)
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const profileHref = `/author/${author.slug}`;
  const whatsappHref = author.whatsappNumber
    ? `https://wa.me/${author.whatsappNumber.replace(/\D/g, "")}`
    : null;

  return (
    <section
      aria-label="About the author of this page"
      className="rounded-2xl border border-green-100 bg-white shadow-sm overflow-hidden"
    >
      <div className="px-5 pt-5 md:px-7 md:pt-6">
        <p className="text-xs font-bold uppercase tracking-wider text-green-700 mb-4">
          Expert Behind This Page
        </p>
        <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
          {/* Photo / initials avatar */}
          <div className="shrink-0">
            {author.photo ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={author.photo}
                alt={author.name}
                width={72}
                height={72}
                loading="lazy"
                className="h-[72px] w-[72px] rounded-full object-cover border-2 border-green-600"
              />
            ) : (
              <div className="h-[72px] w-[72px] rounded-full bg-green-700 text-white flex items-center justify-center text-xl font-bold border-2 border-green-600">
                {initials}
              </div>
            )}
          </div>

          <div className="min-w-0">
            <h2 className="text-lg md:text-xl font-bold text-gray-900">
              <Link
                href={profileHref}
                className="hover:text-green-700 hover:underline"
              >
                {author.name}
              </Link>
            </h2>
            {author.designation && (
              <p className="text-sm font-semibold text-green-700 mt-0.5">
                {author.designation}
              </p>
            )}
            {author.shortBio && (
              <p className="text-sm md:text-base leading-relaxed text-gray-600 mt-2">
                {author.shortBio}
              </p>
            )}

            {/* Action chips */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Link
                href={profileHref}
                className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3.5 py-1.5 text-xs md:text-sm font-semibold text-green-800 hover:bg-green-100"
              >
                View Full Profile →
              </Link>
              {author.linkedinUrl && (
                <a
                  href={author.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-xs md:text-sm font-semibold text-gray-700 hover:bg-gray-100"
                >
                  in LinkedIn
                </a>
              )}
              {whatsappHref && (
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer nofollow"
                  className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3.5 py-1.5 text-xs md:text-sm font-semibold text-gray-700 hover:bg-gray-100"
                >
                  WhatsApp
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats strip */}
      {Array.isArray(author.stats) && author.stats.length > 0 && (
        <div className="mt-5 border-t border-green-100 bg-green-50/60 px-5 py-3 md:px-7">
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            {author.stats.map((stat, idx) => (
              <p key={idx} className="text-xs md:text-sm text-gray-700">
                <span className="font-bold text-green-800">{stat.value}</span>{" "}
                {stat.label}
              </p>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};

export default AuthorBioBox;
