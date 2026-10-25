/**
 * Schema.org JSON-LD builders. Only verified facts go in here: no prices,
 * ratings, availability or review aggregates are ever emitted.
 */
import { books, bookPath, currentEdition } from "@/content/books";
import { recognitionFor } from "@/content/praise";
import { author, illustrator } from "@/content/people";
import { absoluteUrl, site } from "@/content/site";
import type { Book, Edition } from "@/content/types";

const SERIES_ID = absoluteUrl("/#series");
const AUTHOR_ID = absoluteUrl("/about#author");
const ILLUSTRATOR_ID = absoluteUrl("/about#illustrator");

const formatMap: Record<Edition["format"], string> = {
  hardcover: "https://schema.org/Hardcover",
  paperback: "https://schema.org/Paperback",
  ebook: "https://schema.org/EBook",
  audiobook: "https://schema.org/AudiobookFormat",
};

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": absoluteUrl("/#website"),
    name: site.name,
    alternateName: ["The Expeditioners Books", "Expeditioners"],
    url: absoluteUrl("/"),
    description: site.description,
    inLanguage: "en",
    about: { "@id": SERIES_ID },
  };
}

export function seriesSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "BookSeries",
    "@id": SERIES_ID,
    name: site.name,
    url: absoluteUrl("/books"),
    author: personRef("author"),
    illustrator: personRef("illustrator"),
    genre: ["Middle-grade fiction", "Adventure", "Steampunk"],
    inLanguage: "en",
    hasPart: books.map((b) => ({ "@id": absoluteUrl(`${bookPath(b)}#book`) })),
  };
}

/** Kept under the old name for the root layout. */
export const organizationSchema = seriesSchema;

function personRef(which: "author" | "illustrator") {
  return { "@id": which === "author" ? AUTHOR_ID : ILLUSTRATOR_ID };
}

export function personSchema(which: "author" | "illustrator") {
  const p = which === "author" ? author : illustrator;
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": which === "author" ? AUTHOR_ID : ILLUSTRATOR_ID,
    name: p.name,
    ...(p.alsoKnownAs?.length ? { alternateName: p.alsoKnownAs } : {}),
    url: absoluteUrl(`/about#${which}`),
    sameAs: p.links.map((l) => l.url),
    jobTitle: which === "author" ? "Author" : "Illustrator",
  };
}

export function bookSchema(book: Book) {
  const edition = currentEdition(book);
  return {
    "@context": "https://schema.org",
    "@type": "Book",
    "@id": absoluteUrl(`${bookPath(book)}#book`),
    name: book.fullTitle,
    url: absoluteUrl(bookPath(book)),
    image: absoluteUrl(book.cover.src),
    description: book.synopsis.paragraphs.join(" "),
    author: personRef("author"),
    illustrator: personRef("illustrator"),
    inLanguage: "en",
    genre: ["Middle-grade fiction", "Adventure"],
    isPartOf: { "@id": SERIES_ID },
    position: book.number,
    ...(book.ageRange?.status === "verified" ? { typicalAgeRange: book.ageRange.label.replace(/[^\d–-]/g, "") } : {}),
    ...(edition?.isbn13 ? { isbn: edition.isbn13 } : {}),
    bookFormat: formatMap[edition.format],
    publisher: { "@type": "Organization", name: edition.publisher },
    datePublished: edition.published,
    ...(edition.pages ? { numberOfPages: edition.pages } : {}),
    ...(recognitionFor(book.slug).length ? { award: recognitionFor(book.slug).map(r => r.label) } : {}),
    workExample: book.editions
      .filter((e) => e.status === "verified" && e.isbn13)
      .map((e) => ({
        "@type": "Book",
        isbn: e.isbn13,
        bookFormat: formatMap[e.format],
        publisher: { "@type": "Organization", name: e.publisher },
        datePublished: e.published,
        ...(e.pages ? { numberOfPages: e.pages } : {}),
      })),
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function articleSchema(a: { title: string; description: string; path: string; published: string; updated?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    mainEntityOfPage: absoluteUrl(a.path),
    image: [absoluteUrl(`${a.path}/opengraph-image`)],
    inLanguage: "en",
    description: a.description,
    url: absoluteUrl(a.path),
    datePublished: a.published,
    dateModified: a.updated ?? a.published,
    author: { "@type": "Organization", name: site.name, url: absoluteUrl("/") },
    publisher: { "@type": "Organization", name: site.name, url: absoluteUrl("/") },
    about: { "@id": SERIES_ID },
  };
}

/** A crawlable, ordered list of the actual books, not invented product offers. */
export function bookListSchema(path = "/books") {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "@id": absoluteUrl(`${path}#reading-order`),
    name: "The Expeditioners books in reading order",
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: books.length,
    itemListElement: books.map(book => ({ "@type": "ListItem", position: book.number, url: absoluteUrl(bookPath(book)), item: { "@id": absoluteUrl(`${bookPath(book)}#book`), "@type": "Book", name: book.fullTitle } })),
  };
}
