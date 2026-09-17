/**
 * Defensive async helpers.
 *
 * The site has been crashing with "Application error: a server-side exception
 * has occurred" whenever the backend API returns an unexpected payload (or
 * the upstream service is down). The crash bypasses our normal /error.tsx
 * fallback because it happens during the root-layout render — Next.js then
 * shows its bare default error page, which is the worst possible UX.
 *
 * This module solves the problem at the call site:
 *
 *   const homePage = await safeCall(() => getHomepageDetails(), {});
 *   const { popularCities = [], homePageSlugs = [], featuredSchools = [] } =
 *     homePage?.data ?? {};
 *
 * `safeCall` runs the async function, catches any throw, logs it, and
 * returns the provided fallback. The fallback's TypeScript type is the same
 * as the function's return so callers don't have to type-cast.
 *
 * Use this around any await of an API call from a server component or
 * generateMetadata function. The frontend should ALWAYS be able to render
 * SOMETHING, even when the backend is completely down.
 */

/**
 * Run an async fn, return its value or `fallback` if it throws.
 * Logs the error with `label` so server logs are searchable.
 */
export async function safeCall<T>(
  fn: () => Promise<T>,
  fallback: T,
  label?: string,
): Promise<T> {
  try {
    const result = await fn();
    // Treat null/undefined as "no data" and prefer the fallback — saves
    // every caller from writing `?? fallback` themselves and keeps the
    // server component happy with a well-shaped object.
    if (result === null || result === undefined) return fallback;
    return result;
  } catch (err) {
    const tag = label ? `[${label}]` : "[safeCall]";
    console.error(`${tag} async call failed — returning fallback`, err);
    return fallback;
  }
}

/**
 * Run multiple parallel async fns. If ANY of them throw, the failed ones
 * resolve to their fallback while the successful ones return their real
 * value. Drop-in replacement for Promise.all that doesn't bring the whole
 * page down because of one slow / dead endpoint.
 *
 *   const [user, config] = await safeAll([
 *     () => checkUserLoggedIn(),
 *     () => getAppConfig(),
 *   ], [undefined, undefined]);
 */
export async function safeAll<T extends readonly unknown[]>(
  fns: { [K in keyof T]: () => Promise<T[K]> },
  fallbacks: T,
): Promise<T> {
  const results = await Promise.all(
    fns.map((fn, idx) =>
      safeCall(fn, fallbacks[idx], `safeAll[${idx}]`),
    ),
  );
  return results as unknown as T;
}
