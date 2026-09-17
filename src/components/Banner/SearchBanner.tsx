"use client";
import React from "react";
import useContactModal from "@/hooks/useContactFoemModal";
import { ContactModal } from "@/components/Modals/ContactModal";

type SearchBannerProps = {
  /**
   * The main on-page H1 — should be the keyword-rich phrase derived from
   * the slug (e.g. "Best Boarding Schools in Hyderabad 2026-27"). Falls
   * back to a generic value when not supplied (e.g. when SearchBanner is
   * used in a context where no slug is available).
   */
  heading?: string;
  /** Short marketing subhead shown beneath the H1. */
  subheading?: string;
  /**
   * Optional admin-uploaded banner URL used as the section's background.
   * Falls back to the bundled default image when blank so every existing
   * slug keeps its current banner.
   */
  backgroundImage?: string;
};

const DEFAULT_BANNER_BG = "/banner-bg.png";

const SearchBanner: React.FC<SearchBannerProps> = ({
  heading,
  subheading,
  backgroundImage,
}) => {
  // The hero "Enquire Now" CTA now opens the on-site lead-capture modal
  // (ContactModal) instead of deep-linking to WhatsApp. The separate floating
  // WhatsApp chat icon (bottom-left, <Whatsapp />) is intentionally left
  // untouched and still links to WhatsApp.
  const contactModal = useContactModal();
  // Heading hierarchy is the single biggest on-page SEO signal for a search
  // results landing page. Previously this banner shipped a generic <p> with
  // "We're changing the whole your career." — every /search/[slug] page
  // therefore had NO <h1> at all and Google had to fall back to the <title>
  // tag for the topic, which dropped rankings on long-tail keywords like
  // "best boarding schools in hyderabad". Now the slug page passes its
  // keyword-rich heading down and we render it as the page's single H1.
  const finalHeading =
    heading && heading.trim().length > 0
      ? heading
      : "Find the Best Schools in India";

  // Per-slug admin upload wins; blank/missing falls back to the bundled
  // default. We set the background via the inline `style` attribute rather
  // than a Tailwind arbitrary background utility, because Tailwind's JIT
  // can only generate utilities from build-time literals — it cannot bake
  // in a URL that arrives at runtime via props.
  //
  // NOTE: Do NOT write the literal Tailwind arbitrary background-image
  // class syntax anywhere in this file (even inside a comment). Tailwind's
  // file scanner is regex-based and does not skip comments, so any such
  // pattern with a placeholder inside the parentheses would be picked up
  // and emitted as a real CSS rule that points at an unresolvable URL,
  // which then breaks `next build` with a webpack "Cannot find module"
  // error against globals.css.
  const finalBackground =
    backgroundImage && backgroundImage.trim().length > 0
      ? backgroundImage.trim()
      : DEFAULT_BANNER_BG;

  return (
    <section
      className="flex items-center px-4 sm:px-8 lg:px-10 max-w-screen lg:w-screen md:h-[450px] sm:h-[350px] h-[300px] bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url('${finalBackground}')` }}
    >
      {/* `flex items-center` on the section vertically centers this inner
          container. We dropped the old top padding (pt-10 md:pt-20) and the
          mt-10 spacer — those pushed the content to the top of the banner,
          leaving a big empty area at the bottom. Horizontal alignment stays
          LEFT (no items-center on the column itself). */}
      <div className="w-full max-w-[1450px]">
        <div className="px-3 xl:px-28">
          {/* Constrain the entire text column to the LEFT half of the banner
              so it never overlaps the artwork that sits on the right side of
              the background image. Admins can now set custom long titles
              from the slug editor (e.g. "Best Boarding Schools in Hyderabad
              2026-27: Fees, Admissions, Rankings & Complete Guide"), so we
              cap the column width here and use a tighter type scale than
              before. Without this cap, long titles wrap into the notebook
              artwork and the Enquire button drifts under the magnifier.

              Type scale also tuned down — previously xl:text-6xl (60px)
              which was fine for the short auto-generated title but caused
              4-line overflow on admin-set long titles. Capped at xl:text-5xl
              and added leading-tight + break-words as belt-and-braces. */}
          <div className="max-w-2xl xl:max-w-3xl">
            <h1 className="font-bold text-xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl text-white drop-shadow-md leading-tight break-words">
              {finalHeading}
            </h1>
            {subheading && (
              <p className="mt-3 text-sm sm:text-base md:text-lg text-white/90">
                {subheading}
              </p>
            )}
            <button
              type="button"
              onClick={() => contactModal.onOpen()}
              aria-label="Enquire about school admissions"
              className={`
                max-w-max
                rounded
                hover:opacity-80
                transition
                shadow-md
                font-semibold
                flex
                items-center
              bg-green-600
                border-none
              text-white
                text-md
                py-2 px-4
                mt-4
              `}
            >
              Enquire Now
            </button>
          </div>
        </div>
      </div>

      {/* Lead-capture modal opened by the "Enquire Now" CTA above. Rendered here
          so every listing page that uses <SearchBanner /> gets the popup. */}
      <ContactModal name="school-listing-enquiry" />
    </section>
  );
};

export default SearchBanner;
