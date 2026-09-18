"use client";

/**
 * Global error boundary — top-level fallback for ANY uncaught server- or
 * client-side error in the app.
 *
 * Why this file exists separately from `error.tsx`:
 *   - `error.tsx` is rendered INSIDE the root layout, so it can catch errors
 *     that happen inside `{children}` (your pages) but NOT errors that happen
 *     in the root layout itself (e.g. `getAppConfig()` throws, `cookies()`
 *     blows up, a server component imported from layout crashes).
 *   - `global-error.tsx` is rendered ABOVE the root layout. It owns its own
 *     <html> / <body> tags and is the ONLY thing standing between an
 *     unexpected error and the bare "Application error: a server-side
 *     exception has occurred" page that Next.js falls back to in production.
 *
 * Without this file, ANY backend hiccup that crashes a server component in
 * the root layout produces that ugly raw error page — which is what just
 * happened on Education Portal.com. With it, users always see a polished error UI
 * with a recovery action, and you get a digest in the logs to debug from.
 *
 * Per Next.js requirements, global-error.tsx:
 *   - MUST be a Client Component (the "use client" directive above)
 *   - MUST render its own <html> and <body> tags
 *   - MUST be in the SAME directory as the root layout
 *   - Only renders in production (in dev, Next shows the overlay instead)
 */

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error so it shows up in server logs / browser console with
    // the digest the user sees on the page — makes incident debugging easy.
    console.error("[global-error]", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          fontFamily:
            "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
          background: "#f8fafc",
          color: "#0f172a",
        }}
      >
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "#fee2e2",
              marginBottom: 24,
            }}
          >
            <svg
              width="36"
              height="36"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#dc2626"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </div>

          <h1
            style={{
              fontSize: "2rem",
              fontWeight: 700,
              margin: "0 0 0.75rem 0",
            }}
          >
            Something went wrong
          </h1>

          <p
            style={{
              fontSize: "1.125rem",
              color: "#475569",
              maxWidth: 520,
              lineHeight: 1.6,
              margin: "0 0 2rem 0",
            }}
          >
            We hit an unexpected issue loading this page. The team has been
            notified — please try again in a moment, or head back to the
            homepage to continue your school search.
          </p>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => reset()}
              style={{
                background: "#1daf68",
                color: "white",
                border: "none",
                padding: "0.75rem 1.75rem",
                borderRadius: 8,
                fontSize: "1rem",
                fontWeight: 600,
                cursor: "pointer",
              }}
            >
              Try again
            </button>
            <a
              href="/"
              style={{
                background: "white",
                color: "#0f172a",
                border: "1px solid #e2e8f0",
                padding: "0.75rem 1.75rem",
                borderRadius: 8,
                fontSize: "1rem",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Back to homepage
            </a>
          </div>

          {error?.digest && (
            <p
              style={{
                marginTop: 32,
                fontSize: "0.75rem",
                color: "#94a3b8",
                fontFamily: "monospace",
              }}
            >
              Reference: {error.digest}
            </p>
          )}
        </main>
      </body>
    </html>
  );
}
