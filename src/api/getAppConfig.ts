import { unstable_cache } from "next/cache";
import { getAppConfiguration } from "./AppConfig";

// ---------------------------------------------------------------------------
// Cached, deduped app-config fetch shared by the root layout and the home
// page. unstable_cache collapses the build-time burst (many pages calling
// /app-configuration at once) into a SINGLE backend request and revalidates
// every 5 minutes, so an admin change in Settings / Basic SEO (phone, social
// links, default JSON-LD) appears on the live site within ~5 min. You can
// also bust it instantly with revalidateTag("app-config") from a route
// handler if you want admin saves to reflect immediately.
//
// Lives in its own module (instead of inside layout.tsx) so app/page.tsx can
// import the exact same cached function without dragging in the whole layout
// module or firing a second network request.
// ---------------------------------------------------------------------------
export const getAppConfig = unstable_cache(
  async () => {
    try {
      const appConfig = await getAppConfiguration();
      // Always return null (never undefined) — unstable_cache serializes the
      // result as JSON, and undefined cannot be cached (it becomes the string
      // "undefined" and later throws `"undefined" is not valid JSON`).
      return appConfig?.data ?? null;
    } catch (error) {
      console.log("Error in fetching app config", error);
      return null;
    }
  },
  ["app-config-global"],
  { revalidate: 300, tags: ["app-config"] },
);
