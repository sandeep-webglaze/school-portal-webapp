"use client";
import React, { useState, FC } from "react";
import DOMPurify from "dompurify";
import { normaliseAdminHtml } from "@/helpers/sanitizeAdminHtml";

type ListingDescriptionProps = {
  about: string;
};
const ListingDescription: FC<ListingDescriptionProps> = ({ about }) => {
  const [showMore, setShowMore] = useState(false);
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  if (!about || about.trim() === "") return null;

  // Normalise once (demotes admin h1→h2, strips <meta>/<title>/<link>/<base>,
  // adds rel="noopener" to external links). DOMPurify runs with an explicit
  // FORBID_TAGS list as a second line of defense — Screaming Frog kept
  // finding a `<meta name="robots" content="noindex">` from admin body
  // HTML on 87 pages, so we belt-and-suspenders block it at the sanitiser
  // layer too.
  const PURIFY_OPTS = {
    FORBID_TAGS: ["meta", "title", "base", "link", "script", "style"],
    FORBID_ATTR: ["http-equiv"],
  };
  const fullSafeHtml = DOMPurify.sanitize(
    normaliseAdminHtml(about),
    PURIFY_OPTS,
  );
  const sliceSafeHtml =
    about.length > 400
      ? DOMPurify.sanitize(normaliseAdminHtml(about.slice(0, 400)), PURIFY_OPTS)
      : fullSafeHtml;

  return (
    <div className="text-sm text-black">
      <div
        className="text-editor-content inline"
        dangerouslySetInnerHTML={{
          __html:
            about.length > 400
              ? showMore
                ? fullSafeHtml
                : sliceSafeHtml
              : fullSafeHtml,
        }}
      />
      {about.length > 400 && (
        <button
          type="button"
          className="text-blue-500 cursor-pointer underline ml-1"
          onClick={toggleShowMore}
          aria-expanded={showMore}
        >
          {showMore ? "Show less" : "Read more"}
        </button>
      )}
    </div>
  );
};

export default ListingDescription;
