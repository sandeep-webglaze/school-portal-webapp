import { IAppConfig } from "@/api/AppConfig";
import { safeJsonParse } from "@/helpers/functions";

// ---------------------------------------------------------------------------
// Single source of truth for the HOME page's structured data.
//
// The admin manages the homepage JSON-LD in Basic SEO → "Slug Json Schema",
// which is persisted on config.defaultSlugJsonSchema. It can be a single
// JSON-LD object (typically one with an "@graph") OR an array of objects.
//
// getHomeAdminSchemas() parses that field defensively and returns an array of
// schema objects, or [] when the field is empty/blank/malformed.
//
// Contract used across layout.tsx + page.tsx:
//   - returns a NON-EMPTY array  -> admin owns the homepage schema. Render
//       ONLY these, and SUPPRESS the hardcoded static schemas (Organization /
//       LocalBusiness / WebSite / VideoObject) so we don't ship duplicate or
//       conflicting entities (the "double-double" + name mismatch issue).
//   - returns an EMPTY array      -> no admin schema, fall back to the static
//       schemas so the homepage is never left with zero structured data.
//
// Because it reads from admin config (revalidated every 5 min), any future
// edit the admin makes flows through automatically — no code change needed.
// ---------------------------------------------------------------------------
export function getHomeAdminSchemas(
  config?: IAppConfig,
): Array<Record<string, unknown>> {
  const parsed = safeJsonParse<unknown>(config?.defaultSlugJsonSchema, null);
  if (parsed == null) return [];
  const arr = Array.isArray(parsed) ? parsed : [parsed];
  return arr.filter(
    (s): s is Record<string, unknown> =>
      !!s && typeof s === "object" && !Array.isArray(s),
  );
}

/** True when the admin has supplied a usable homepage schema. */
export function hasHomeAdminSchema(config?: IAppConfig): boolean {
  return getHomeAdminSchemas(config).length > 0;
}
