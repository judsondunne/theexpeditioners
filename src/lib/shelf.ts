import { purchaseBook } from "@/lib/purchase";
import type { ShelfEntry } from "@/components/home/TrilogyShelf";
import { books, bookPath, currentEdition, ordinal, physicalSize } from "@/content/books";
import { reviewsFor, seriesReviews } from "@/content/praise";

const formatLabel = { hardcover: "Hardcover", paperback: "Paperback", ebook: "Ebook", audiobook: "Audiobook" } as const;

/** Serialisable data for the WebGL shelf and its HTML panels. */
export function shelfEntries(): ShelfEntry[] {
  return books.map((b) => {
    const edition = currentEdition(b);
    const selectedReviews = reviewsFor(b.slug);
    const praise = selectedReviews[0] ?? seriesReviews()[0];
    const second = selectedReviews[1] ?? (selectedReviews.length ? seriesReviews()[0] : undefined);
    return {
      slug: b.slug,
      purchase: purchaseBook(b),
      number: b.number,
      ordinal: ordinal(b.number),
      title: b.title,
      fullTitle: b.fullTitle,
      hook: b.hook.text,
      summary: b.synopsis.paragraphs[0],
      href: bookPath(b),
      edition: `${formatLabel[edition.format]} · ${edition.publisher}, ${edition.published.slice(0, 4)}`,
      praise: praise ? { quote: praise.quote, outlet: praise.outlet } : undefined,
      secondPraise: second ? { quote: second.quote, outlet: second.outlet } : undefined,
      cover: { src: b.cover.src, alt: b.cover.alt },
      palette: { deep: b.palette.deep, mid: b.palette.mid, light: b.palette.light, accent: b.palette.accent },
      shelf: {
        id: b.slug,
        front: `/images/textures/book-${b.number}-front.webp`,
        back: `/images/textures/book-${b.number}-back.webp`,
        size: physicalSize(b),
        spine: {
          ...b.palette.spine,
          author: "S. S. Taylor",
          series: "The Expeditioners",
          title: `and the ${b.title.replace(/^The /, "")}`,
          number: b.number,
        },
      },
    };
  });
}
