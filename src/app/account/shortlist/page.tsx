export const dynamic = "force-dynamic";
import { getShortListSchools } from "@/api/shortlist";
import { CLIENT_TOKEN_STORAGE_KEY } from "@/constants";
import { cookies } from "next/headers";
import React from "react";
import ShortListSchools from "./ShortListSchools";
import type { Metadata } from "next";

// Private, auth-only page — exclude from search index.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

const Shortlist = async () => {
  const shortListedSchools = await getMyShortlistSchools();

  return (
    <div className="w-full">
      {shortListedSchools && <ShortListSchools schools={shortListedSchools} />}
    </div>
  );

  async function getMyShortlistSchools() {
    try {
      const token = cookies().get(CLIENT_TOKEN_STORAGE_KEY);
      if (!token?.value) return;
      const shortListedSchools = await getShortListSchools(token?.value);
      if (shortListedSchools?.data) {
        return shortListedSchools.data.schools;
      }
    } catch (error) {
      console.log("Error in getting Shortlist=>", error);
    }
  }
};

export default Shortlist;