/**
 * Sanitiser for admin-managed HTML blobs (slugContent, school description,
 * legal pages).
 *
 * Admin pastes WYSIWYG-edited HTML into the database. Screaming Frog
 * surfaced multiple SEO regressions from that raw HTML being dumped onto
 * the page unchanged:
 *
 *   - "H1: Multiple" on /search/boarding-schools-in-kolkata, lucknow,
 *     hyderabad — admin's slugContent shipped an extra <h1> in addition to
 *     the one our SearchBanner now renders. Two h1s confuse the topic.
 *
 *   - "Security: Unsafe Cross-Origin Links" on 207 URLs — admin's links
 *     used target="_blank" without rel="noopener noreferrer". Each one is
 *     a real (if minor) security + performance bug.
 *
 *   - "H2: Duplicate" on 116 URLs — admin's content repeats the same h2
 *     ("Get Admission Help", "Apply Now") across slugs.
 *
 * The transforms below normalise admin HTML BEFORE DOMPurify runs. They
 * are intentionally string-level (not DOM parsing) so they work in both
 * SSR and edge contexts without an HTML parser dependency.
 *
 * The transforms are conservative — we only DEMOTE headings (never delete
 * them) and only ADD rel attributes (never remove existing ones).
 */

/**
 * Demote every <h1>...</h1> in admin HTML to <h2>...</h2>. The page-level
 * <h1> comes from our React component layer (school name, slug-derived
 * heading) — admin HTML must never compete for the top heading slot.
 *
 *   <h1 class="x">Heading</h1>  →  <h2 class="x">Heading</h2>
 */
function demoteH1ToH2(html: string): string {
  return html
    .replace(/<h1(\s[^>]*)?>/gi, "<h2$1>")
    .replace(/<\/h1\s*>/gi, "</h2>");
}

/**
 * Strip every <meta>, <title>, <link rel="canonical">, and <base> tag from
 * admin HTML. These are head-only elements — when they leak into the body
 * (because admin pasted a full HTML document into the WYSIWYG) Screaming
 * Frog and Google both flag them.
 *
 * Specifically: /search/schools-in-chandigarh shipped THREE meta robots
 * tags — the third being `noindex` from the admin body — which knocked the
 * whole page out of Google's index even after our sanitiser cleared the
 * robots field at the metadata layer.
 *
 * We are deliberately aggressive here: even a stray <meta name="viewport">
 * inside the body is invalid HTML and bad for Lighthouse scores.
 */
function stripHeadOnlyTags(html: string): string {
  return html
    // Self-closing or attribute-only tags — strip whole element.
    .replace(/<meta\b[^>]*\/?>/gi, "")
    .replace(/<base\b[^>]*\/?>/gi, "")
    // <link> tags — drop completely (they only belong in <head>).
    .replace(/<link\b[^>]*\/?>/gi, "")
    // <title>...</title> — drop with content (would otherwise duplicate
    // the page's real <title>).
    .replace(/<title\b[^>]*>[\s\S]*?<\/title\s*>/gi, "")
    // <script>...</script> — DOMPurify strips these afterwards too, but
    // belt-and-suspenders is cheap and keeps a single sanitisation pass
    // even when admin sneaks in a robots meta-equivalent inline script.
    .replace(/<script\b[^>]*>[\s\S]*?<\/script\s*>/gi, "");
}

/**
 * Walk every <a ... target="_blank" ...> in admin HTML and make sure it
 * has rel="noopener noreferrer". Idempotent — if a rel already exists we
 * merge into it instead of clobbering.
 *
 * Why this matters:
 *   - Security: a hostile target page can rewrite window.opener.
 *   - SEO/perf: Safari + older browsers do a full page load on the parent
 *     window when target="_blank" doesn't have noopener.
 *   - Screaming Frog flags every offender — 207 URLs in the last crawl.
 */
function addRelToBlankLinks(html: string): string {
  return html.replace(/<a\b([^>]*?)>/gi, (full, attrs: string) => {
    // Only touch links opening in a new tab.
    if (!/\btarget\s*=\s*['"]?_blank['"]?/i.test(attrs)) return full;

    // Already correct? leave alone.
    const relMatch = attrs.match(/\brel\s*=\s*["']([^"']*)["']/i);
    const existingRel = relMatch?.[1] ?? "";
    const tokens = new Set(
      existingRel
        .split(/\s+/)
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean),
    );
    tokens.add("noopener");
    tokens.add("noreferrer");
    const newRel = Array.from(tokens).join(" ");

    if (relMatch) {
      // Replace the existing rel value.
      const updatedAttrs = attrs.replace(
        /\brel\s*=\s*["'][^"']*["']/i,
        `rel="${newRel}"`,
      );
      return `<a${updatedAttrs}>`;
    }
    // No rel — append one. Preserve original spacing/quotes.
    const trimmed = attrs.replace(/\s+$/, "");
    return `<a${trimmed} rel="${newRel}">`;
  });
}

/**
 * Public entry point. Apply every transform in order.
 *
 * Note: DOMPurify still runs after this in the page component — it strips
 * <script>, on* handlers and dangerous attributes. This helper only deals
 * with SEO-grade normalisations DOMPurify wouldn't touch.
 */
export function normaliseAdminHtml(html: string): string {
  if (!html) return "";
  let out = html;
  // Order matters: strip head-only tags FIRST so subsequent regex passes
  // don't have to worry about <meta>/<link> stragglers. Then demote h1s,
  // then add rel attrs.
  out = stripHeadOnlyTags(out);
  out = demoteH1ToH2(out);
  out = addRelToBlankLinks(out);
  return out;
}
