import Link from "next/link";

/**
 * RelatedLinks — renders a keyword-rich internal-link cluster.
 *
 * Use this on search/listing pages to expose siblings (other school types
 * in the same city, same school type in other cities, etc.). Internal
 * linking with descriptive anchors is one of the strongest on-page SEO
 * signals — anchors like "Best CBSE Schools in Delhi" carry far more
 * weight than generic "Click here".
 *
 * Usage:
 *   <RelatedLinks
 *     title="Explore More School Options in Delhi"
 *     links={[
 *       { label: "Best CBSE Schools in Delhi", href: "/search/cbse-schools-in-delhi" },
 *       { label: "Boarding Schools in Delhi",  href: "/search/boarding-schools-in-delhi" },
 *       { label: "Play Schools in Delhi",      href: "/search/play-schools-in-delhi" },
 *     ]}
 *   />
 */

export type RelatedLink = {
  /** Visible, keyword-rich anchor text. Avoid generic labels like "Click here". */
  label: string;
  /** Target URL. Use relative paths (/search/...) for internal links. */
  href: string;
};

type RelatedLinksProps = {
  title: string;
  links: RelatedLink[];
  /** Optional class names appended to the wrapper section. */
  className?: string;
};

export default function RelatedLinks({
  title,
  links,
  className = "",
}: RelatedLinksProps) {
  if (!links?.length) return null;

  return (
    <section
      aria-labelledby="related-links-heading"
      className={`my-12 px-4 ${className}`.trim()}
    >
      <h2
        id="related-links-heading"
        className="text-xl md:text-2xl font-semibold mb-4"
      >
        {title}
      </h2>
      <ul className="flex flex-wrap gap-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="inline-block px-4 py-2 rounded-full bg-green-50 text-green-700 hover:bg-green-100 transition-colors"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
