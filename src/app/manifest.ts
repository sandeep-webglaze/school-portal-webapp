import { MetadataRoute } from "next";
import { SITE_NAME, SITE_DESCRIPTION } from "@/constants";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#1e4fa3",
    prefer_related_applications: false,
    orientation: "any",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "16x16",
        type: "image/x-icon",
      },
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-256x256.png",
        sizes: "256x256",
        type: "image/png",
      },
      {
        src: "/maskable_icon_x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
