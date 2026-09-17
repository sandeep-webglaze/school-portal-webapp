// =============================================================================
// SINGLE SOURCE OF TRUTH FOR BRANDING
// -----------------------------------------------------------------------------
// To rename the whole app, change SITE_NAME below on this ONE line. It flows
// into the header, footer, page titles, SEO metadata and structured data.
// =============================================================================
export const SITE_NAME = "Education Portal";

export const CLIENT_TOKEN_STORAGE_KEY = "access_token";
export const SITE_BASE_URL = "https://www.educationportal.ae";
export const SCHOOL_PANEL_BASE_URL = "https://school.educationportal.ae";
export const CLAIM_SCHOOL_URL = SCHOOL_PANEL_BASE_URL + "/register";

// Contact fallbacks — used whenever the backend AppConfig (config.contactUs.*)
// is missing or hasn't hydrated yet on the client. Replace these with the real
// Dubai contact details for this project.
export const CONTACT_PHONE = "+971-4-000-0000";
// WhatsApp wants a country-code-prefixed number with no symbols.
export const CONTACT_WHATSAPP_NUMBER = "97140000000";
export const CONTACT_EMAIL = "info@educationportal.ae";

// Social profile URLs. Set these to the project's real profiles when ready.
// Left as "#" placeholders so no old branding leaks through the header/footer.
export const SOCIAL_LINKS = {
  facebook: "#",
  instagram: "#",
  twitter: "#",
  linkedIn: "#",
  pinterest: "#",
  youtube: "#",
} as const;

// SEO constants — title kept inside the 50–65 char Google sweet spot,
// description in the 140–160 char band so it never gets truncated in SERPs.
export const SITE_TITLE =
  "Education Portal — Find the Best Schools in Dubai 2026-27";
export const SITE_DESCRIPTION =
  "Discover & compare the best schools in Dubai on Education Portal. Search by curriculum, fees, area & facilities — get free admission guidance for your child.";
