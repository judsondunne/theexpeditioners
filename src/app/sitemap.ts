import type { MetadataRoute } from "next";
import { books, bookPath } from "@/content/books";
import { publishedArticles } from "@/content/journal";
import { absoluteUrl } from "@/content/site";

/** Only canonical, indexable pages. Printable sheets and 404s are left out. */
export default function sitemap(): MetadataRoute.Sitemap {
  const updated = new Date("2026-10-26");
  const page = (path: string, priority: number): MetadataRoute.Sitemap[number] => ({
    url: absoluteUrl(path),
    lastModified: updated,
    priority,
  });
  return [
    page("/", 1),
    page("/books", 0.9),
    page("/buy", 0.9),
    ...books.map((b) => ({
      ...page(bookPath(b), b.number === 1 ? 0.9 : 0.8),
      images: [absoluteUrl(b.cover.src)],
    })),
    page("/explore", 0.7),
    page("/educators", 0.7),
    page("/about", 0.6),
    page("/credits", 0.2),
    page("/journal", 0.5),
    ...publishedArticles.map((a) => ({ ...page(`/journal/${a.slug}`, 0.5), lastModified: new Date(a.updated ?? a.published) })),
    page("/privacy", 0.2),
  ];
}
