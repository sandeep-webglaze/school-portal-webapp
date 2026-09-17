export const dynamic = "force-dynamic";
import Myprofile from "@/components/Profile-page";
import React, { Fragment } from "react";
import type { Metadata } from "next";

// Private, auth-only page — keep it out of the index. robots.txt blocks
// crawling but a noindex tag is what actually prevents a SERP listing.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const Profile = () => {
  return (
    <Fragment>
      <Myprofile />
    </Fragment>
  );
};

export default Profile;