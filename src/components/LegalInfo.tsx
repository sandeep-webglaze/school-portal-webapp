"use client";
import React, { FC } from "react";
import { Container } from "./Container";
import useConfigStore from "@/hooks/useConfigStore";
import { IAppConfig } from "@/api/AppConfig";
import DOMPurify from "isomorphic-dompurify";
import { normaliseAdminHtml } from "@/helpers/sanitizeAdminHtml";
import "../app/user-agent.css";

type LegalInfoProps = {
  /** The key into the app config that holds the legal HTML body. */
  name: keyof IAppConfig;
  /**
   * Required H1 for the page. Screaming Frog flagged the legal pages
   * (/privacy-policy, /terms, /refund-policy, /claim-school) as "H1: Missing"
   * because the admin's HTML body usually starts with an <h2> or just a <p>.
   * The H1 should describe the main title of the page and is one of the
   * strongest on-page ranking signals — so we render it from a hard-coded
   * page-level value, not from the admin HTML.
   */
  pageTitle: string;
  /** Optional kicker text shown beneath the H1 — e.g. last-updated date. */
  pageIntro?: string;
};

const LegalInfo: FC<LegalInfoProps> = ({ name, pageTitle, pageIntro }) => {
  const config = useConfigStore();

  return (
    <Container>
      <header className="mb-6">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-800">
          {pageTitle}
        </h1>
        {pageIntro && (
          <p className="mt-2 text-sm md:text-base text-slate-500">
            {pageIntro}
          </p>
        )}
      </header>
      <div
        className="text-editor-content"
        dangerouslySetInnerHTML={{
          // normaliseAdminHtml demotes admin h1s to h2 (the page H1 lives
          // in our <header> above), strips <meta>/<title>/<link>/<base>,
          // and adds rel="noopener noreferrer" to every target="_blank"
          // link in the admin body. DOMPurify is then configured to also
          // FORBID those tags as a second line of defense (Screaming Frog
          // kept finding admin-embedded noindex meta tags on 87 URLs).
          __html: DOMPurify.sanitize(
            normaliseAdminHtml((config.config?.[name] as string) ?? ""),
            {
              FORBID_TAGS: ["meta", "title", "base", "link", "script", "style"],
              FORBID_ATTR: ["http-equiv"],
            },
          ),
        }}
      />
    </Container>
  );
};

export default LegalInfo;
