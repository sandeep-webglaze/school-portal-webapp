export const dynamic = "force-dynamic";
import React from "react";
import type { Metadata } from "next";
import DeleteAccountContent from "./DeleteAccountContent";

// Private, auth-only utility page — exclude from search index. The UI lives in
// the client component DeleteAccountContent; this server wrapper exists so we
// can export a noindex robots tag (a client component cannot).
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const DeleteProfile = () => {
  return <DeleteAccountContent />;
};

export default DeleteProfile;
