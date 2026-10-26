import type { BookSlug, Recognition, ReviewExcerpt, SourceRef } from "./types";

/*
 * Review excerpts and recognition. Pull quotes are kept short and exact;
 * an ellipsis marks where the printed sentence continues.
 * Every quote below is printed on the books themselves (Harlow Brook Books
 * paperbacks, 2019) and was traced back to the original review.
 * Before launch, confirm the publisher is happy for these to appear on the web.
 */

const back = (n: "One" | "Two" | "Three"): SourceRef => ({
  label: `Back cover, Book ${n}, Harlow Brook Books paperback (2019)`,
});

export const reviews: ReviewExcerpt[] = [
  {
    id: "kirkus-book-one",
    outlet: "Kirkus Reviews",
    quote: "Full of kid power, clues, codes and maps…",
    book: "the-treasure-of-drowned-mans-canyon",
    year: 2012,
    url: "https://www.kirkusreviews.com/book-reviews/ss-taylor/expeditioners/",
    status: "verified",
    source: { label: "Kirkus Reviews, Oct. 15, 2012; also printed on the Book One back cover" },
  },
  {
    id: "slj-book-one",
    outlet: "School Library Journal",
    quote: "A wonderful example of steampunk done well…",
    book: "the-treasure-of-drowned-mans-canyon",
    year: 2013,
    url: "https://www.slj.com/review/the-expeditioners-and-the-treasure-of-drowned-mans-canyon",
    status: "verified",
    source: { label: "School Library Journal, Jan. 1, 2013; also printed on the Book One back cover" },
  },
  {
    id: "boingboing-book-one",
    outlet: "Boing Boing",
    quote: "…a thoroughly smashing read.",
    book: "the-treasure-of-drowned-mans-canyon",
    year: 2013,
    url: "https://boingboing.net/2013/08/20/the-expeditioners-and-the-trea.html",
    status: "verified",
    source: { label: "Boing Boing (Cory Doctorow), Aug. 20, 2013; also printed on the Book One back cover" },
  },
  {
    id: "sf-chronicle-series",
    outlet: "San Francisco Chronicle",
    quote: "Beautifully written and nail-bitingly thrilling, this is an easy series to get hooked on.",
    year: 2012,
    url: "https://www.sfgate.com/books/article/Books-for-the-younger-reader-Dec-30-4152997.php",
    status: "verified",
    source: { label: "San Francisco Chronicle, Dec. 28, 2012; printed on all three Harlow Brook front covers" },
  },
  {
    id: "kirkus-book-two",
    outlet: "Kirkus Reviews",
    quote: "A quickly paced and entertainingly twisty adventure.",
    book: "the-secret-of-king-tritons-lair",
    year: 2014,
    url: "https://www.kirkusreviews.com/book-reviews/ss-taylor/the-expeditioners-and-the-secret-of-king-tritons-l/",
    status: "verified",
    source: { label: "Kirkus Reviews, Sept. 1, 2014; also printed on the Book Two back cover" },
  },
  {
    id: "boingboing-book-two",
    outlet: "Boing Boing",
    quote: "…an absolutely cracking yarn, the pure strain of kids' adventure tales.",
    book: "the-secret-of-king-tritons-lair",
    year: 2014,
    url: "https://boingboing.net/2014/11/27/the-expeditioners-and-the-sec.html",
    status: "verified",
    source: { label: "Boing Boing (Cory Doctorow), Nov. 27, 2014; also printed on the Book Two back cover" },
  },
  {
    id: "slj-series",
    outlet: "School Library Journal",
    quote: "…plows its own course with mystery, suspense, and a well-thought out plot.",
    book: "the-secret-of-king-tritons-lair",
    year: 2014,
    url: "https://www.slj.com/review/the-expeditioners-and-the-secret-of-king-tritons-lair",
    status: "verified",
    source: { label: "School Library Journal review of Book Two, Sept. 1, 2014; printed as series praise on the Book Three back cover" },
  },
];

export const recognition: Recognition[] = [
  {
    id: "bluebonnet",
    label: "Texas Bluebonnet Award Master List, 2014–15",
    kind: "shortlist",
    book: "the-treasure-of-drowned-mans-canyon",
    year: "2014–2015",
    status: "verified",
    stamp: { shape: "seal", ink: "blue", top: "Texas Bluebonnet Award", bottom: "Master List", centre: "2014–15" },
    sources: [
      {
        label: "Texas Library Association, 2014–2015 Texas Bluebonnet Award Master List (archived PDF)",
        url: "https://web.archive.org/web/20160729204715/http://txla.org/sites/tla/files/groups/TBA/Texas%20Bluebonnet%20Award%20Master%20List%202014.pdf",
      },
      back("One"),
    ],
  },
  {
    id: "dcf",
    label: "Dorothy Canfield Fisher Award Master List, 2013–14",
    kind: "shortlist",
    book: "the-treasure-of-drowned-mans-canyon",
    year: "2013–2014",
    status: "verified",
    stamp: { shape: "ring", ink: "rust", top: "Dorothy Canfield Fisher Award", bottom: "Master List", centre: "2013–14" },
    sources: [
      { label: "Vermont Public Radio, Oct. 8, 2013", url: "https://www.vermontpublic.org/vpr-news/2013-10-08/dorothys-list-the-expeditioners" },
      back("One"),
    ],
  },
  {
    id: "indie-next",
    label: "Indie Next pick",
    kind: "pick",
    book: "the-treasure-of-drowned-mans-canyon",
    year: "Winter 2012–13",
    status: "single-source",
    stamp: { shape: "box", ink: "sepia", top: "Indie Next List", bottom: "Winter 2012–13", centre: "Pick" },
    sources: [back("One")],
  },
];

export function reviewsFor(slug: BookSlug): ReviewExcerpt[] {
  return reviews.filter((r) => r.book === slug);
}

export function seriesReviews(): ReviewExcerpt[] {
  return reviews.filter((r) => !r.book);
}

export function recognitionFor(slug: BookSlug): Recognition[] {
  return recognition.filter((r) => r.book === slug);
}

export function review(id: string): ReviewExcerpt {
  const r = reviews.find((x) => x.id === id);
  if (!r) throw new Error(`Unknown review ${id}`);
  return r;
}

/** The three quotes that rotate in the homepage hero. */
export const heroQuotes = [review("kirkus-book-one"), review("slj-book-one"), { ...review("sf-chronicle-series"), quote: "Beautifully written and nail-bitingly thrilling…" }];
