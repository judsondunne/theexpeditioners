import type { MetadataRoute } from "next";
import { absoluteUrl, site } from "@/content/site";

/**
 * Production (a real domain + SITE_INDEXABLE=true) is open to crawlers.
 * Every other deployment — previews, local builds — asks crawlers to stay out.
 */
export default function robots(): MetadataRoute.Robots {
  if (!site.indexable) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/educators/field-sheet"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: site.url,
  };
}
