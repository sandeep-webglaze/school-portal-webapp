import { NextResponse, NextRequest } from "next/server";

// ---------------------------------------------------------------------------
// Expose the current request pathname to server components via an `x-pathname`
// request header. App-Router server components can't read the pathname
// directly, so the root layout reads this header to know when it is rendering
// the home route ("/").
//
// Why we need it: on "/" the admin-managed homepage JSON-LD (Basic SEO → Slug
// Json Schema) already describes Organization / LocalBusiness / WebSite /
// WebPage / Video. The layout ships hardcoded site-wide versions of the first
// three on EVERY page. Knowing we're on "/" lets the layout suppress those
// statics there so the admin schema is the single source of truth — no more
// duplicate/conflicting structured-data entities on the homepage.
// ---------------------------------------------------------------------------
export function middleware(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", request.nextUrl.pathname);
  return NextResponse.next({ request: { headers: requestHeaders } });
}

export const config = {
  matcher: [
    // Run on every route except Next.js internals and static asset files —
    // we only need the header on real page renders.
    "/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|txt|xml|json|webmanifest)$).*)",
  ],
};
