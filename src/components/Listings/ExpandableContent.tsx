"use client";

import { useRef, useState } from "react";

/**
 * ExpandableContent — animated "Read More" wrapper for long-form SEO content.
 *
 * UX flow:
 *   - Default: collapsed to ~280 px with a soft gradient fade so the user
 *     sees that there's more below.
 *   - A floating, gently-bouncing pill button labels the action clearly
 *     ("Continue Reading — Full Guide" + animated chevron + word count).
 *   - On click: smoothly expands AND scrolls the content into view, so the
 *     user lands inside the guide instead of having to scroll back up.
 *
 * Why this matters for SEO:
 *   - All the HTML is in the DOM at all times, so Google indexes 100 % of
 *     the content — only the visual gate is user-controlled.
 *   - Increased scroll-depth + dwell-time are real engagement signals.
 *
 * Animations are pure CSS — no extra libs.
 */
type ExpandableContentProps = {
  html: string;
  /** Collapsed height in pixels. Default 280 — ~8 lines on desktop. */
  collapsedHeight?: number;
  /** Override CTA label. */
  expandLabel?: string;
  collapseLabel?: string;
};

export default function ExpandableContent({
  html,
  collapsedHeight = 280,
  expandLabel = "Read the Full Guide",
  collapseLabel = "Show Less",
}: ExpandableContentProps) {
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  if (!html) return null;

  // Rough word count for the teaser badge — "1,800 words below".
  const wordCount = html
    .replace(/<[^>]+>/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  const wordsApprox = wordCount > 100 ? `${Math.round(wordCount / 100) * 100}+ words` : `${wordCount} words`;

  const handleToggle = () => {
    const willExpand = !expanded;
    setExpanded(willExpand);

    // Smooth scroll INTO the guide so the user keeps reading without having
    // to scroll back up to the previous section. Slight delay so the layout
    // settles after the max-height transition kicks in.
    if (willExpand && containerRef.current) {
      window.setTimeout(() => {
        containerRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 80);
    }
  };

  return (
    <div className="my-10">
      {/* Component-scoped keyframes — no external CSS needed */}
      <style jsx>{`
        @keyframes ehGentleBounce {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(-4px); }
        }
        @keyframes ehShimmer {
          0%   { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes ehChevronPulse {
          0%, 100% { transform: translateY(0); opacity: 0.85; }
          50%      { transform: translateY(3px); opacity: 1; }
        }
        .eh-cta {
          animation: ehGentleBounce 2.4s ease-in-out infinite;
          background-image: linear-gradient(
            110deg,
            #1daf68 0%,
            #2cc97c 35%,
            #1daf68 70%
          );
          background-size: 200% 100%;
        }
        .eh-cta:hover {
          animation-play-state: paused;
          background-image: linear-gradient(
            110deg,
            #166543 0%,
            #1daf68 35%,
            #166543 70%
          );
        }
        .eh-shimmer {
          background-image: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255,255,255,0.35) 50%,
            transparent 100%
          );
          background-size: 200% 100%;
          animation: ehShimmer 2.6s linear infinite;
        }
        .eh-chevron {
          animation: ehChevronPulse 1.4s ease-in-out infinite;
        }
      `}</style>

      {/* The actual content — height-clamped when collapsed */}
      <div
        ref={containerRef}
        className="relative overflow-hidden transition-[max-height] duration-700 ease-in-out"
        style={{ maxHeight: expanded ? 10000 : collapsedHeight }}
      >
        <div
          className="text-editor-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        {!expanded && (
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/95 to-transparent pointer-events-none"
          />
        )}
      </div>

      {/* CTA — only show "Read the Full Guide" when collapsed.
          A more subtle "Show Less" button when expanded. */}
      <div className="flex flex-col items-center mt-4 gap-2">
        {!expanded && (
          <span className="text-xs text-gray-500 uppercase tracking-wider">
            {wordsApprox} of in-depth guide below
          </span>
        )}

        <button
          type="button"
          onClick={handleToggle}
          aria-expanded={expanded}
          className={`eh-cta relative overflow-hidden inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-white font-semibold shadow-lg transition-shadow hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2`}
        >
          {/* Shimmer overlay */}
          {!expanded && (
            <span
              aria-hidden="true"
              className="eh-shimmer absolute inset-0 rounded-full pointer-events-none"
            />
          )}

          <span className="relative z-10">
            {expanded ? collapseLabel : expandLabel}
          </span>

          <svg
            className={`relative z-10 w-5 h-5 ${expanded ? "rotate-180" : "eh-chevron"}`}
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.06l3.71-3.83a.75.75 0 1 1 1.08 1.04l-4.25 4.39a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
