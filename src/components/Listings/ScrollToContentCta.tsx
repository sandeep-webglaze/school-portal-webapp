"use client";

/**
 * ScrollToContentCta — slim CTA strip rendered BETWEEN the school listing
 * grid and the long-form SEO guide.
 *
 * UX intent:
 *   1. The bottom guide is now ALWAYS fully visible (we removed the
 *      collapse/expand pattern). So this CTA isn't gating any content — it's
 *      purely a navigation aid.
 *   2. Users scrolling through the school cards often miss the deep guide
 *      because it sits below a long list. A friendly "Continue to Guide →"
 *      pill with a bouncing arrow draws the eye and lets one click skip the
 *      remaining cards.
 *
 * Behaviour:
 *   - Smooth-scrolls to the element with the given `targetId`.
 *   - Falls back to a window scroll if the target isn't found.
 *   - Pure CSS animation, no external libs.
 */

type ScrollToContentCtaProps = {
  /** id of the element to scroll to. Default 'full-guide' to match search page. */
  targetId?: string;
  label?: string;
};

export default function ScrollToContentCta({
  targetId = "full-guide",
  label = "Read the Complete Guide",
}: ScrollToContentCtaProps) {
  const handleClick = () => {
    if (typeof document === "undefined") return;
    const el = document.getElementById(targetId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // Fallback: scroll down by one viewport height
      window.scrollBy({ top: window.innerHeight * 0.9, behavior: "smooth" });
    }
  };

  return (
    <div className="w-full flex justify-center my-10 px-4">
      <style jsx>{`
        @keyframes ehArrowBounce {
          0%, 100% { transform: translateY(0); }
          50%      { transform: translateY(4px); }
        }
        @keyframes ehGlow {
          0%, 100% { box-shadow: 0 6px 24px rgba(29, 175, 104, 0.25); }
          50%      { box-shadow: 0 10px 32px rgba(29, 175, 104, 0.55); }
        }
        .eh-scroll-cta {
          animation: ehGlow 2.2s ease-in-out infinite;
          background-image: linear-gradient(110deg, #1daf68 0%, #2cc97c 100%);
        }
        .eh-scroll-cta:hover {
          animation-play-state: paused;
          background-image: linear-gradient(110deg, #166543 0%, #1daf68 100%);
        }
        .eh-scroll-arrow {
          animation: ehArrowBounce 1.3s ease-in-out infinite;
        }
      `}</style>

      <button
        type="button"
        onClick={handleClick}
        className="eh-scroll-cta inline-flex items-center gap-3 px-7 py-3.5 rounded-full text-white font-semibold transition-transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-green-300 focus:ring-offset-2"
        aria-label={`Scroll down to ${label}`}
      >
        <span>{label}</span>
        <svg
          className="eh-scroll-arrow w-5 h-5"
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
  );
}
