import HomeRedesign from "@/components/HomeRedesign/component";
import { Fragment } from "react";
import dynamic from "next/dynamic";
import Whatsapp from "./search/[slug]/Whatsapppopup";
import JsonLd from "@/components/JsonLd";
import { safeCall } from "@/helpers/safeAsync";
import { getAppConfig } from "@/api/getAppConfig";
import { getHomeAdminSchemas } from "@/helpers/homeSchema";

// Home-page structured data (fallback when admin has not set a homepage schema).
const HOME_VIDEO_SCHEMA = {
  "@context": "http://schema.org",
  "@type": "VideoObject",
  name: "Find the Best Schools in Dubai | Search by Curriculum, Area, Fees & Facilities",
  description:
    "Education Portal helps parents find the perfect school in Dubai — search and compare British, American, IB and Indian curriculum schools by area, fees and facilities.",
  thumbnailUrl: "https://i.ytimg.com/vi/01odl690sug/default.jpg",
  uploadDate: "2024-09-16T07:35:43Z",
  duration: "PT3M43S",
  embedUrl: "https://www.youtube.com/embed/01odl690sug",
  interactionCount: "51",
};

const RequestCallBack = dynamic(
  () => import("@/components/RequestCalback/component"),
  { ssr: false }
);

export default async function Home() {
  const config = await safeCall(
    () => getAppConfig(),
    undefined,
    "homepage:getAppConfig",
  );

  const homeAdminSchemas = getHomeAdminSchemas(config);

  return (
    <Fragment>
      {homeAdminSchemas.length > 0 ? (
        homeAdminSchemas.map((schema, idx) => (
          <JsonLd key={idx} id={`ld-home-admin-${idx}`} data={schema} />
        ))
      ) : (
        <JsonLd id="ld-home-video" data={HOME_VIDEO_SCHEMA} />
      )}
      <RequestCallBack
        autoOpen={true}
        showButton={false}
        delay={20000}
        title="Find the Best School for Your Child"
      />
      <Whatsapp side="left" />
      <HomeRedesign />
    </Fragment>
  );
}
