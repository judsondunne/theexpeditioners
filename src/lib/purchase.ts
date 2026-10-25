import type { Book, PurchaseLink } from "@/content/types";

export interface PurchaseBook {
  slug: string;
  number: number;
  ordinal: string;
  title: string;
  href: string;
  cover: { src: string; alt: string };
  links: PurchaseLink[];
  format: string;
  isbn?: string;
}

/** Only the public facts needed by the bookstore chooser cross the client boundary. */
export function purchaseBook(book: Book): PurchaseBook {
  const edition = book.editions.find(e => e.current) ?? book.editions[0];
  return {
    slug: book.slug,
    number: book.number,
    ordinal: ["One", "Two", "Three"][book.number - 1],
    title: book.title,
    href: `/books/${book.slug}`,
    cover: { src: book.cover.src, alt: book.cover.alt },
    links: book.purchase.filter(link => link.verified),
    format: edition.format,
    isbn: edition.isbn13,
  };
}
