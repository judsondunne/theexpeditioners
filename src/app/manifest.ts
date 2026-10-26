import type { MetadataRoute } from "next";
import { site } from "@/content/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: site.name,
    short_name: site.shortName,
    description: site.description,
    start_url: "/",
    display: "browser",
    background_color: site.themeColor,
    theme_color: site.themeColor,
    icons: [
      { src: "/icon.png", type: "image/png", sizes: "256x256" },
      { src: "/apple-icon.png", type: "image/png", sizes: "180x180" },
    ],
  };
}
