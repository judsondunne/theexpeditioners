import type { Metadata } from "next";
import { absoluteUrl, site } from "@/content/site";

/**
 * One place to build page metadata: unique title and description, a
 * canonical URL, and Open Graph / Twitter cards. Social images come from the
 * route's `opengraph-image` file when one exists, otherwise the site default.
 */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
  image,
  type = "website",
  noindex = false,
  published,
  modified,
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
  image?: { url: string; width: number; height: number; alt: string };
  type?: "website" | "article" | "book";
  noindex?: boolean;
  published?: string;
  modified?: string;
}): Metadata {
  const url = absoluteUrl(path);
  const images = [{ ...(image ?? { url: "/opengraph-image", width: 1200, height: 630, alt: "The Expeditioners adventure trilogy by S. S. Taylor" }), url: absoluteUrl(image?.url ?? "/opengraph-image") }];
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: absoluteTitle ? title : `${title} · ${site.name}`,
      description,
      url,
      siteName: site.name,
      locale: site.locale,
      type: type === "book" ? "book" : type,
      images,
      ...(type === "article" && published ? { publishedTime: published, modifiedTime: modified ?? published } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: absoluteTitle ? title : `${title} · ${site.name}`,
      description,
      images: images.map((i) => i.url),
    },
    ...(noindex || !site.indexable ? { robots: { index: false, follow: !noindex } } : {}),
  };
}
