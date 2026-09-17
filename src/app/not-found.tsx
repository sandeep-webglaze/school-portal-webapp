import Link from "next/link";
import type { Metadata } from "next";

/**
 * Custom 404 page. Next.js automatically returns HTTP 404 for routes hitting
 * this component, so we don't need to do anything manual — but a polished
 * 404 with internal links has two SEO benefits:
 *   1. Lower bounce rate from misclicked SERP entries — users see useful
 *      links instead of a blank wall and stay on the site.
 *   2. Distributes link equity from any 404s Google has indexed to the
 *      surviving important pages (homepage, popular search slugs).
 */
export const metadata: Metadata = {
  title: "Page Not Found (404) — Education Portal",
  description:
    "Sorry, the page you were looking for does not exist. Explore our school directory or compare schools to continue your search.",
  robots: { index: false, follow: true },
};

const POPULAR_LINKS: Array<{ label: string; href: string }> = [
  { label: "All Schools", href: "/search/all-schools" },
  { label: "Boarding Schools", href: "/search/boarding-schools-in-india" },
  { label: "Day Schools", href: "/search/day-schools" },
  { label: "CBSE Schools", href: "/search/cbse-schools" },
  { label: "ICSE Schools", href: "/search/icse-isc-schools" },
  { label: "Compare Schools", href: "/compare-schools" },
];

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center flex-col gap-6 px-4 py-12">
      <h1 className="text-6xl md:text-8xl font-bold text-slate-800">404</h1>
      <p className="text-slate-700 text-xl md:text-2xl font-semibold">
        Page not found
      </p>
      <p className="text-slate-500 text-center max-w-md">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
        Try one of the popular links below to continue your search.
      </p>

      <Link
        href="/"
        className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition-colors"
      >
        Back to Homepage
      </Link>

      <div className="mt-6 w-full max-w-2xl">
        <h2 className="text-center text-sm font-semibold uppercase tracking-wider text-slate-500 mb-4">
          Popular pages
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {POPULAR_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="block px-4 py-2 rounded-lg border border-green-100 bg-white text-green-700 hover:bg-green-50 hover:border-green-300 transition-colors text-center"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
