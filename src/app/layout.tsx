export const dynamic = "force-dynamic";

import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import { ResponsiveHeader } from "@/components/Header";
import { Footer } from "@/components/Footer";
import NextTopLoader from "nextjs-toploader";
import { cookies, headers } from "next/headers";
import {
  CLIENT_TOKEN_STORAGE_KEY,
  SITE_BASE_URL,
  SITE_DESCRIPTION,
  SITE_TITLE,
  SITE_NAME,
  CONTACT_PHONE,
  SOCIAL_LINKS,
} from "@/constants";
import { getCurrentUser } from "@/api/CurrentUser";
import StoreInitializer from "@/components/StoreInitializer";
import { IAppConfig } from "@/api/AppConfig";
import { getAppConfig } from "@/api/getAppConfig";
import { hasHomeAdminSchema } from "@/helpers/homeSchema";
import { ReactNode } from "react";
import ConfigStore from "@/components/ConfigStore";
import nextDynamic from "next/dynamic";
import { Toaster } from "react-hot-toast";
import AuthModals from "@/components/AuthModals";
import JsonLd from "@/components/JsonLd";
import { safeCall } from "@/helpers/safeAsync";

// ---------------------------------------------------------------------------
// Site-wide structured data (JSON-LD). These render on every page via the
// root layout so search engines always see them.
// ---------------------------------------------------------------------------
function buildSameAs(config?: IAppConfig): string[] {
  const s = config?.socialMedia;
  return [
    s?.facebook || SOCIAL_LINKS.facebook,
    s?.tweeter || SOCIAL_LINKS.twitter,
    s?.intstagram || SOCIAL_LINKS.instagram,
    s?.youtube || SOCIAL_LINKS.youtube,
    s?.linkedIn || SOCIAL_LINKS.linkedIn,
    s?.pinterest || SOCIAL_LINKS.pinterest,
  ].filter((v) => Boolean(v) && v !== "#");
}

function buildOrganizationSchema(config?: IAppConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: SITE_NAME,
    url: `${SITE_BASE_URL}/`,
    logo: `${SITE_BASE_URL}/logo.png`,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: config?.contactUs?.phoneNumber || CONTACT_PHONE,
      contactType: "customer service",
      areaServed: "AE",
      availableLanguage: ["en", "Arabic"],
    },
    sameAs: buildSameAs(config),
  };
}

function buildLocalBusinessSchema(config?: IAppConfig) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: SITE_NAME,
    image: `${SITE_BASE_URL}/logo.png`,
    "@id": `${SITE_BASE_URL}/`,
    url: `${SITE_BASE_URL}/`,
    telephone: config?.contactUs?.phoneNumber || CONTACT_PHONE,
    priceRange: "0",
    address: {
      "@type": "PostalAddress",
      streetAddress:
        config?.contactUs?.address || "Dubai, United Arab Emirates",
      addressLocality: "Dubai",
      addressCountry: "AE",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 25.2048,
      longitude: 55.2708,
    },
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"],
      opens: "09:00",
      closes: "18:00",
    },
    sameAs: buildSameAs(config),
  };
}

// ---------------------------------------------------------------------------
// WebSite + SearchAction schema — tells Google about our site search.
// ---------------------------------------------------------------------------
const WEBSITE_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: `${SITE_BASE_URL}/`,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE_BASE_URL}/search/{search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
};

const ScrollToTop = nextDynamic(() => import("@/components/ScrollToTop"), {
  ssr: false,
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-outfit",
});

type LayoutProps = {
  children: ReactNode;
};

export default async function RootLayout({ children }: LayoutProps) {
  const [user, config] = await Promise.all([
    safeCall(() => checkUserLoggedIn(), undefined, "layout:checkUserLoggedIn"),
    safeCall(() => getAppConfig(), undefined, "layout:getAppConfig"),
  ]);
  const organizationSchema = buildOrganizationSchema(config ?? undefined);
  const localBusinessSchema = buildLocalBusinessSchema(config ?? undefined);

  const pathname = headers().get("x-pathname") ?? "";
  const isHome = pathname === "/";
  const suppressSiteWideSchemas =
    isHome && hasHomeAdminSchema(config ?? undefined);
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        {!suppressSiteWideSchemas && (
          <>
            <JsonLd id="ld-organization" data={organizationSchema} />
            <JsonLd id="ld-localbusiness" data={localBusinessSchema} />
            <JsonLd id="ld-website" data={WEBSITE_SCHEMA} />
          </>
        )}
      </head>
      <body>
        <Toaster />
        <StoreInitializer
          isAuthenticated={user?.isAuthenticated ?? false}
          user={user?.user ?? null}
        />
        <ConfigStore config={config ?? undefined} />
        <NextTopLoader color="#3b6fd4" showSpinner={false} />
        <AuthModals />
        <ScrollToTop />
        <ResponsiveHeader
          user={user?.user ?? null}
          config={config ?? undefined}
        />
        {children}
        <Footer config={config ?? undefined} />
      </body>
    </html>
  );

  async function checkUserLoggedIn() {
    try {
      const cookieStore = await cookies();
      const token = cookieStore.get(CLIENT_TOKEN_STORAGE_KEY);
      if (!token?.value) return;
      const user = await getCurrentUser(token?.value);
      if (user?.data) {
        return { isAuthenticated: true, user: user.data };
      }
    } catch (error) {
      console.log("Error in checkUserLoggedIn=>", error);
    }
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const metaData = await safeCall(
    () => getAppConfig(),
    undefined,
    "layout:generateMetadata:getAppConfig",
  );

  const title = metaData?.defaultSlugMetaData?.title ?? SITE_TITLE;
  const description =
    metaData?.defaultSlugMetaData?.description ?? SITE_DESCRIPTION;

  const defaultOgImage = `${SITE_BASE_URL}/logo.png`;

  return {
    title: {
      default: title,
      template: `%s | ${SITE_NAME}`,
    },
    description,
    keywords: [
      "best schools in Dubai",
      "school finder Dubai",
      "Dubai schools",
      "CBSE schools Dubai",
      "ICSE schools Dubai",
      "IB schools Dubai",
      "British curriculum schools Dubai",
      "school admission Dubai",
      "compare schools Dubai",
      "school fees Dubai",
    ],
    metadataBase: new URL(SITE_BASE_URL),

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

    alternates: {
      canonical: "/",
    },

    openGraph: {
      type: "website",
      locale: "en_AE",
      siteName: SITE_NAME,
      url: SITE_BASE_URL,
      title,
      description,
      images: [
        {
          url: defaultOgImage,
          width: 1200,
          height: 630,
          alt: `${SITE_NAME} — Find the best schools in Dubai`,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [defaultOgImage],
    },

    manifest: "/manifest.webmanifest",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        {
          url: "/android-chrome-192x192.png",
          sizes: "192x192",
          type: "image/png",
        },
        {
          url: "/android-chrome-256x256.png",
          sizes: "256x256",
          type: "image/png",
        },
      ],
      apple: "/android-chrome-192x192.png",
    },

    ...(metaData?.defaultSlugMetaData as any),
  };
}

export const viewport: Viewport = {
  themeColor: "#1e4fa3",
  width: "device-width",
  initialScale: 1,
};
