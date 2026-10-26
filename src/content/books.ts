import type { Book, BookSlug, SourceRef } from "./types";

/*
 * The three books, in reading order.
 *
 * EDITING GUIDE (see README → "Editing content"):
 *  - Synopses are written for this site from the facts printed on the books'
 *    own back covers. If the family prefers the official jacket copy, paste it
 *    into `synopsis.paragraphs` and set `status: "verified"`.
 *  - Purchase links render only when `verified: true`.
 *  - `sample` stays null until an approved excerpt is supplied.
 */

const backCover = (n: 1 | 2 | 3): SourceRef => ({
  label: `Back cover, Book ${n === 1 ? "One" : n === 2 ? "Two" : "Three"}, Harlow Brook Books paperback (2019)`,
  note: "Primary source: text printed on the book.",
});

const kirkusB1: SourceRef = {
  label: "Kirkus Reviews — The Expeditioners and the Treasure of Drowned Man's Canyon (Oct. 15, 2012 issue)",
  url: "https://www.kirkusreviews.com/book-reviews/ss-taylor/expeditioners/",
};

const pwB1: SourceRef = {
  label: "Publishers Weekly listing, ISBN 978-1-938073-06-9",
  url: "https://www.publishersweekly.com/978-1-938073-06-9",
};

const kirkusB2: SourceRef = {
  label: "Kirkus Reviews — The Expeditioners and the Secret of King Triton's Lair (Sept. 1, 2014 issue)",
  url: "https://www.kirkusreviews.com/book-reviews/ss-taylor/the-expeditioners-and-the-secret-of-king-tritons-l/",
};

const teachingBooksB1: SourceRef = {
  label: "TeachingBooks and OverDrive reading-level data",
  url: "https://ac.teachingbooks.net/tb.cgi?tid=34505",
};

const coverCredit = "Cover art by Katherine Roy";

export const books: Book[] = [
  {
    slug: "the-treasure-of-drowned-mans-canyon",
    number: 1,
    title: "The Treasure of Drowned Man's Canyon",
    fullTitle: "The Expeditioners and the Treasure of Drowned Man's Canyon",
    hook: {
      text: "Computers have failed, electricity is extinct, and the race to discover new lands is underway!",
      status: "verified",
      source: { label: "S. S. Taylor’s official book description", url: "https://www.sarahstewarttaylor.com/expeditioners" },
    },
    synopsis: {
      paragraphs: [
        "Alexander West, a famed Explorer of the Realm, is presumed dead somewhere in the Fazian rainforest. Then a mysterious man with a clockwork hand leads West's son Kit to half of a strange map.",
        "Soon Kit, his brother Zander and his sister M.K. are on their way to a remote canyon in the Arizona desert, on the trail of a fabled treasure in gold, with government agents in pursuit.",
        "As danger closes in from every side, the three of them will need every bit of their smarts and talent to follow their father's map, wherever it leads.",
      ],
      status: "original-copy",
      basedOn: [backCover(1), kirkusB1],
    },
    elements: [
      { label: "Alexander West", detail: "Famed Explorer of the Realm; the West siblings' father.", source: backCover(1) },
      { label: "The man with the clockwork hand", detail: "Leads Kit to half of a strange map.", source: backCover(1) },
      { label: "The Fazian rainforest", detail: "Where Alexander West is presumed dead.", source: backCover(1) },
      { label: "A remote canyon in the Arizona desert", detail: "Where the siblings follow their father's map.", source: backCover(1) },
    ],
    ageRange: { label: "Ages 10–14", status: "verified", source: kirkusB1 },
    readingLevel: { label: "Lexile 880L", status: "verified", source: teachingBooksB1 },
    editions: [
      {
        format: "paperback",
        publisher: "Harlow Brook Books",
        published: "2019-07-23",
        isbn13: "9780960083503",
        pages: 364,
        current: true,
        status: "verified",
        sources: [backCover(1), { label: "Amazon product page", url: "https://www.amazon.com/dp/0960083502" }],
      },
      {
        format: "ebook",
        publisher: "Harlow Brook Books",
        published: "2020-04-06",
        isbn13: "9781393621485",
        status: "verified",
        sources: [{ label: "OverDrive library listing", url: "https://melsa.overdrive.com/media/5410985" }],
      },
      {
        format: "hardcover",
        publisher: "McSweeney's McMullens",
        published: "2012-12-11",
        isbn13: "9781938073069",
        pages: 384,
        status: "verified",
        sources: [kirkusB1, pwB1],
      },
      {
        format: "paperback",
        publisher: "McSweeney's McMullens",
        published: "2013",
        isbn13: "9781938073717",
        status: "verified",
        sources: [{ label: "Amazon product page", url: "https://www.amazon.com/dp/1938073711" }],
      },
    ],
    cover: {
      id: "cover-book-1",
      src: "/images/covers/book-1-front.jpg",
      width: 880,
      height: 1360,
      alt: "Cover of The Expeditioners and the Treasure of Drowned Man's Canyon: four young explorers wade through a canyon river beneath a waterfall; one holds a map, one an oar, and a dark bird lands on a shoulder.",
      credit: coverCredit,
      usage: "Book One cover — hero, shelf, book page, social image",
      source: { label: "Retailer product image of the Harlow Brook Books paperback (2019)" },
      rights: "pending-approval",
    },
    backCover: {
      id: "back-book-1",
      src: "/images/covers/book-1-back.jpg",
      width: 880,
      height: 1360,
      alt: "Back cover of Book One, showing a canyon, an airship and riders on mechanical horses, with the jacket copy and review quotes.",
      credit: coverCredit,
      usage: "Back face of the 3D book",
      source: { label: "Retailer product image of the Harlow Brook Books paperback (2019)" },
      rights: "pending-approval",
    },
    palette: {
      deep: "#26131a",
      mid: "#633940",
      light: "#f4ebe7",
      accent: "#e3bf62",
      spine: { background: "#5a3540", ink: "#f5ece6", accent: "#e3bf62" },
    },
    purchase: [
      {
        retailer: "bookshop",
        url: "https://bookshop.org/p/books/the-expeditioners-and-the-treasure-of-drowned-man-s-canyon-s-s-taylor/d6b7e7141f69c028?ean=9780960083503",
        isbn13: "9780960083503",
        format: "paperback",
        verified: true,
      },
      {
        retailer: "barnes-noble",
        url: "https://www.barnesandnoble.com/w/the-expeditioners-and-the-treasure-of-drowned-mans-canyon-s-s-taylor/1112878987?ean=9780960083503",
        isbn13: "9780960083503",
        format: "paperback",
        verified: true,
      },
      {
        retailer: "amazon",
        url: "https://www.amazon.com/dp/0960083502",
        isbn13: "9780960083503",
        format: "paperback",
        verified: true,
      },
      {
        retailer: "worldcat",
        url: "https://search.worldcat.org/search?q=bn%3A9780960083503",
        isbn13: "9780960083503",
        verified: true,
        note: "Find it in a library",
      },
    ],
    sample: null,
  },
  {
    slug: "the-secret-of-king-tritons-lair",
    number: 2,
    title: "The Secret of King Triton's Lair",
    fullTitle: "The Expeditioners and the Secret of King Triton's Lair",
    hook: {
      text: "Why did Alexander leave the maps behind, and why are government agents so determined to seize them?",
      status: "verified",
      source: { label: "S. S. Taylor’s official book description", url: "https://www.sarahstewarttaylor.com/expeditioners" },
    },
    synopsis: {
      paragraphs: [
        "Kit, Zander and M.K. West are settling into their new lives as students at the Academy for the Exploratory Sciences when Kit finds another mysterious map, left for him by their father, the famous Explorer Alexander West.",
        "With two world powers edging toward war, Kit has to travel to a hidden island in the Caribbean, an island known for its deadly storms, and unlock its secrets.",
        "Following the trail of maps will take more courage than he knows he has.",
      ],
      status: "original-copy",
      basedOn: [backCover(2)],
    },
    elements: [
      {
        label: "The Academy for the Exploratory Sciences",
        detail: "Where the West siblings become students.",
        source: backCover(2),
      },
      { label: "A hidden island in the Caribbean", detail: "Known for its deadly storms.", source: backCover(2) },
    ],
    ageRange: { label: "Ages 10–14", status: "verified", source: kirkusB2 },
    readingLevel: { label: "Lexile 820L", status: "single-source", source: { label: "OverDrive and library catalogue records" } },
    editions: [
      {
        format: "paperback",
        publisher: "Harlow Brook Books",
        published: "2019-07-23",
        isbn13: "9780960083510",
        pages: 380,
        current: true,
        status: "verified",
        sources: [backCover(2), { label: "Amazon product page", url: "https://www.amazon.com/dp/0960083510" }],
      },
      {
        format: "ebook",
        publisher: "Harlow Brook Books",
        published: "2020-04-06",
        isbn13: "9781393396185",
        status: "verified",
        sources: [{ label: "OverDrive library listing", url: "https://melsa.overdrive.com/media/5410984" }],
      },
      {
        format: "hardcover",
        publisher: "McSweeney's McMullens",
        published: "2014-09-23",
        isbn13: "9781940450209",
        status: "verified",
        sources: [kirkusB2, { label: "Amazon product page", url: "https://www.amazon.com/dp/1940450209" }],
      },
    ],
    cover: {
      id: "cover-book-2",
      src: "/images/covers/book-2-front.jpg",
      width: 880,
      height: 1360,
      alt: "Cover of The Expeditioners and the Secret of King Triton's Lair: a diver in a bubble-helmeted suit swims with a flashlight outside a submarine while three companions watch from its window.",
      credit: coverCredit,
      usage: "Book Two cover — shelf, book page, social image",
      source: { label: "Retailer product image of the Harlow Brook Books paperback (2019)" },
      rights: "pending-approval",
    },
    backCover: {
      id: "back-book-2",
      src: "/images/covers/book-2-back.jpg",
      width: 880,
      height: 1360,
      alt: "Back cover of Book Two: an underwater scene with a wrecked ship, with the jacket copy and review quotes.",
      credit: coverCredit,
      usage: "Back face of the 3D book",
      source: { label: "Retailer product image of the Harlow Brook Books paperback (2019)" },
      rights: "pending-approval",
    },
    palette: {
      deep: "#101b27",
      mid: "#2f4558",
      light: "#e4ece8",
      accent: "#e8c47a",
      spine: { background: "#2f4357", ink: "#eef3f0", accent: "#e8c47a" },
    },
    purchase: [
      {
        retailer: "barnes-noble",
        url: "https://www.barnesandnoble.com/w/the-expeditioners-and-the-secret-of-king-tritons-lair-s-s-taylor/1118592898?ean=9780960083510",
        isbn13: "9780960083510",
        format: "paperback",
        verified: true,
      },
      {
        retailer: "amazon",
        url: "https://www.amazon.com/dp/0960083510",
        isbn13: "9780960083510",
        format: "paperback",
        verified: true,
      },
      {
        retailer: "worldcat",
        url: "https://search.worldcat.org/search?q=bn%3A9780960083510",
        isbn13: "9780960083510",
        verified: true,
        note: "Find it in a library",
      },
    ],
    sample: null,
  },
  {
    slug: "the-lost-city-of-maps",
    number: 3,
    title: "The Lost City of Maps",
    fullTitle: "The Expeditioners and the Lost City of Maps",
    hook: {
      text: "Will Kit have what it takes to find the map and a secret desert city known only in legend?",
      status: "verified",
      source: { label: "S. S. Taylor’s official book description", url: "https://www.sarahstewarttaylor.com/expeditioners" },
    },
    synopsis: {
      paragraphs: [
        "The world is on the edge of war. Kit West, now an Explorer-in-Training, finishes his spy training and is sent on his first secret mission: a dangerous crossing of the Simerian Desert to bring back a secret map that could help his government fend off an invasion.",
        "Nothing is quite what it seems. Between deadly sandstorms, ruthless spies and government agents, Kit must find the map, search for a secret desert city known only in legend, and stay on the trail of his father, the famous Explorer Alexander West.",
        "And at the end of it, he may finally learn where his father has been leading him.",
      ],
      status: "original-copy",
      basedOn: [backCover(3)],
    },
    elements: [
      { label: "The Simerian Desert", detail: "Crossed on Kit's first secret mission.", source: backCover(3) },
      { label: "A secret desert city", detail: "Known only in legend.", source: backCover(3) },
    ],
    editions: [
      {
        format: "paperback",
        publisher: "Harlow Brook Books",
        published: "2019-09",
        isbn13: "9780960083527",
        pages: 256,
        current: true,
        status: "verified",
        sources: [
          backCover(3),
          { label: "Amazon product page", url: "https://www.amazon.com/dp/0960083529" },
          { label: "Library catalogue records (e.g. McKinney Public Library)", url: "https://ipac.mckinneytexas.org/Record/342904" },
        ],
      },
      {
        format: "ebook",
        publisher: "Harlow Brook Books",
        published: "2020-04-06",
        isbn13: "9781393147299",
        status: "verified",
        sources: [{ label: "OverDrive library listing", url: "https://melsa.overdrive.com/media/5410983" }],
      },
    ],
    cover: {
      id: "cover-book-3",
      src: "/images/covers/book-3-front.jpg",
      width: 880,
      height: 1360,
      alt: "Cover of The Expeditioners and the Lost City of Maps: two young travellers ride a giant lizard across desert sands toward a distant city.",
      credit: undefined,
      usage: "Book Three cover — shelf, book page, social image",
      source: { label: "Retailer product image of the Harlow Brook Books paperback (2019)" },
      rights: "pending-approval",
      notes: "Retailers credit Katherine Roy for this cover, but the cover itself carries no credit. Confirm before crediting on the site.",
    },
    backCover: {
      id: "back-book-3",
      src: "/images/covers/book-3-back.jpg",
      width: 880,
      height: 1360,
      alt: "Back cover of Book Three: a starry desert night sky fading to sand, with the jacket copy and series praise.",
      credit: undefined,
      usage: "Back face of the 3D book",
      source: { label: "Retailer product image of the Harlow Brook Books paperback (2019)" },
      rights: "pending-approval",
    },
    palette: {
      deep: "#211d18",
      mid: "#8f7d63",
      light: "#f6e8cb",
      accent: "#d9a74a",
      spine: { background: "#cdb68d", ink: "#2b241c", accent: "#7c4b22" },
    },
    purchase: [
      {
        retailer: "bookshop",
        url: "https://bookshop.org/p/books/the-expeditioners-and-the-lost-city-of-maps-s-s-taylor/afcab27fb5bd67c0?ean=9780960083527",
        isbn13: "9780960083527",
        format: "paperback",
        verified: true,
      },
      {
        retailer: "barnes-noble",
        url: "https://www.barnesandnoble.com/w/the-expeditioners-and-the-lost-city-of-maps-s-s-taylor/1133364068?ean=9780960083527",
        isbn13: "9780960083527",
        format: "paperback",
        verified: true,
      },
      {
        retailer: "amazon",
        url: "https://www.amazon.com/dp/0960083529",
        isbn13: "9780960083527",
        format: "paperback",
        verified: true,
      },
      {
        retailer: "worldcat",
        url: "https://search.worldcat.org/search?q=bn%3A9780960083527",
        isbn13: "9780960083527",
        verified: true,
        note: "Find it in a library",
      },
    ],
    sample: null,
  },
];

export const bookOne = books[0];

export function getBook(slug: string): Book | undefined {
  return books.find((b) => b.slug === slug);
}

export function bookPath(book: Pick<Book, "slug">): string {
  return `/books/${book.slug}`;
}

export function currentEdition(book: Book) {
  return book.editions.find((e) => e.current) ?? book.editions[0];
}

export function ordinal(n: 1 | 2 | 3): "One" | "Two" | "Three" {
  return n === 1 ? "One" : n === 2 ? "Two" : "Three";
}

export function otherBooks(slug: BookSlug): Book[] {
  return books.filter((b) => b.slug !== slug);
}

/** Paperback trim (5.5 × 8.5 in) and an approximate thickness from the page count. */
export function physicalSize(book: Book) {
  const pages = book.editions.find((e) => e.current)?.pages ?? book.editions.find((e) => e.pages)?.pages ?? 320;
  return { width: 5.5, height: 8.5, thickness: Math.max(0.5, pages / 430 + 0.04) };
}
