/** @type {import('next').NextConfig} */
const nextConfig = {
  // Explicit trailingSlash:false avoids the /path/ vs /path duplicate-content
  // problem in Search Console. Whatever you choose, choose it once and stick
  // with it — Google treats the two as separate URLs.
  trailingSlash: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.eduminatti.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "images.uniapply.com",
      },
      {
        protocol: "https",
        hostname: "api.edhippo.com",
      },
      {
        protocol: "https",
        hostname: "cdn.edhippo.com",
      },
      {
        protocol: "https",
        hostname: "www.web-glaze.com",
      },
      {
        protocol: "https",
        hostname: "img.freepik.com",
      },
      { protocol: "https", hostname: "ui-avatars.com" },
    ],
  },

  // ------------------------------------------------------------------
  // Security + SEO headers. The previous version set only Referrer-Policy.
  // The new headers are scored by Lighthouse + Detailed and improve the
  // overall site security grade, which Google uses as a quality signal.
  //   - X-Content-Type-Options: blocks MIME-type sniffing
  //   - X-Frame-Options: anti-clickjacking
  //   - Strict-Transport-Security: forces HTTPS for 2 years
  //   - Permissions-Policy: turns off APIs we don't use (camera, mic, etc.)
  // ------------------------------------------------------------------
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Referrer-Policy",
            value: "no-referrer-when-downgrade",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(self)",
          },
        ],
      },
    ];
  },

  // ------------------------------------------------------------------
  // 301 redirects.
  //
  // VERIFIED-ONLY POLICY: every entry here MUST point to a slug that
  // returns 200. Pointing a redirect to a 404 destination is worse than
  // having no redirect at all — Google sees the chain Old → Redirect →
  // 404 and treats the old URL as broken too. We learned that the hard
  // way: we previously had bulk redirects bangalore→bengaluru for all
  // five school-type slugs, but only "day-schools-in-bengaluru" actually
  // exists in the backend. The rest 404'd, so they're removed.
  //
  // To add a new bangalore→bengaluru redirect:
  //   1. Hit the destination URL in a browser, confirm 200
  //   2. Hit the source URL with a browser dev-tools network tab open
  //      to confirm it's still being requested by users / indexed by Google
  //   3. Add the entry below
  // ------------------------------------------------------------------
  async redirects() {
    return [
      // Day Schools — the only verified working bengaluru slug.
      {
        source: "/search/day-schools-in-bangalore",
        destination: "/search/day-schools-in-bengaluru",
        permanent: true,
      },
      // Legacy URL patterns that never had real content.
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/index",
        destination: "/",
        permanent: true,
      },
      {
        source: "/index.html",
        destination: "/",
        permanent: true,
      },
    ];
  },

  // NOTE: We previously rewrote `/robots.txt` → `/api/robots` which pulled the
  // robots content from a backend config field. That field had a malformed
  // value ("-Agent: *" instead of "User-Agent: *") and pointed at the wrong
  // host, so the public /robots.txt was broken. The rewrite has been removed
  // so Next.js' native MetadataRoute serves `src/app/robots.ts` directly,
  // which is properly configured with Allow/Disallow rules + sitemap + host.
  // The legacy `/api/robots` endpoint remains accessible but is no longer the
  // canonical source.
};

module.exports = nextConfig;
