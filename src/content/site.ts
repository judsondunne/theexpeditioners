/**
 * Site-wide configuration. The production domain is configured through the
 * environment so preview deployments never claim to be the canonical site.
 *
 *   NEXT_PUBLIC_SITE_URL  e.g. https://www.example.com  (no trailing slash)
 *   SITE_INDEXABLE        "true" only on the production deployment
 */

import { resolveSiteConfig } from "@/lib/site-config";

const deployment = resolveSiteConfig({ origin: process.env.NEXT_PUBLIC_SITE_URL, indexable: process.env.SITE_INDEXABLE, deployment: process.env.VERCEL_ENV });

export const site = {
  name: "The Expeditioners",
  shortName: "Expeditioners",
  /** Absolute origin used for canonical URLs, sitemaps and structured data. */
  url: deployment.url,
  /** True only when a real domain is configured AND indexing is switched on. */
  indexable: deployment.indexable,
  locale: "en_US",
  description:
    "The official home of The Expeditioners, the illustrated middle-grade adventure trilogy by S. S. Taylor, illustrated by Katherine Roy. Maps, codes, clockwork and three siblings on the trail of their father's secrets.",
  /** The tagline printed on every back cover, shortened. */
  tagline: "What if the maps of the world were all wrong?",
  themeColor: "#ece3d1",
} as const;

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export const navigation = [
  { href: "/books", label: "The Books" },
  { href: "/explore", label: "Explore" },
  { href: "/educators", label: "Educators" },
  { href: "/about", label: "About" },
  { href: "/journal", label: "Journal" },
] as const;
