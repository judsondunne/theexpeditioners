/**
 * Central content model for the official Expeditioners website.
 *
 * Every factual claim carries a `status` so the family (and future editors)
 * can see at a glance what has been verified, what is original site copy, and
 * what still needs sign-off. Components never invent content: if a field is
 * empty, the UI renders an honest "not yet available" state or nothing at all.
 */

/** How much we trust a piece of content. */
export type ContentStatus =
  /** Confirmed by a primary source (printed book, publisher, author) or 2+ independent sources. */
  | "verified"
  /** Found in one reliable source; should be double-checked before launch. */
  | "single-source"
  /** Original marketing or editorial copy written for this site. Needs family approval. */
  | "original-copy"
  /** Present on the site but explicitly awaiting family / rights-holder review. */
  | "needs-review"
  /** Not yet supplied. The UI must not pretend it exists. */
  | "missing";

export interface SourceRef {
  label: string;
  url?: string;
  /** e.g. "Back cover, Harlow Brook Books paperback (2019)" */
  note?: string;
}

export type BookSlug =
  | "the-treasure-of-drowned-mans-canyon"
  | "the-secret-of-king-tritons-lair"
  | "the-lost-city-of-maps";

export type EditionFormat = "hardcover" | "paperback" | "ebook" | "audiobook";

export interface Edition {
  format: EditionFormat;
  publisher: string;
  /** ISO date (YYYY-MM-DD) or year (YYYY) when only the year is confirmed. */
  published: string;
  isbn13?: string;
  pages?: number;
  /** True for the edition we feature on the site (the one currently in print). */
  current?: boolean;
  status: ContentStatus;
  sources: SourceRef[];
}

export type RetailerId =
  | "bookshop"
  | "amazon"
  | "barnes-noble"
  | "indiebound"
  | "worldcat"
  | "publisher";

export interface PurchaseLink {
  retailer: RetailerId;
  url: string;
  /** Which edition this link points at. */
  isbn13?: string;
  format?: EditionFormat;
  /** Only verified links are rendered. Unverified ones stay in the data for review. */
  verified: boolean;
  note?: string;
}

export interface ReviewExcerpt {
  id: string;
  outlet: string;
  /** Keep pull quotes short (under ~15 words) and exact. */
  quote: string;
  /** Which book the review is of; omit for series-level praise. */
  book?: BookSlug;
  year?: number;
  url?: string;
  status: ContentStatus;
  source: SourceRef;
}

export interface Recognition {
  id: string;
  label: string;
  /** "shortlist" | "pick" etc. — kept as plain words so they read naturally. */
  kind: "shortlist" | "nomination" | "pick" | "winner";
  book: BookSlug;
  year?: string;
  status: ContentStatus;
  sources: SourceRef[];
  /**
   * How the honour is lettered on its ink stamp. Typographic only: these are
   * site-made stamps, never reproductions of an award's own seal or logo.
   */
  stamp: {
    shape: "seal" | "ring" | "box";
    ink: "rust" | "blue" | "sepia";
    /** Lettered around the top of the ring (or across the top of the box). */
    top: string;
    /** Lettered around the bottom of the ring (or across the bottom). */
    bottom: string;
    /** Large lettering in the centre, e.g. the year. */
    centre: string;
  };
}

export interface ImageAsset {
  id: string;
  /** Public path, e.g. /images/covers/book-1.jpg */
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Short visible credit line, e.g. "Cover art by Katherine Roy". */
  credit?: string;
  usage: string;
  source: SourceRef;
  /**
   * Rights / approval state:
   *  - "public-domain": free to use, provenance recorded.
   *  - "site-original": made for this site (diagrams, renders, textures).
   *  - "pending-approval": official series art that needs rights-holder sign-off before launch.
   */
  rights: "public-domain" | "site-original" | "pending-approval";
  notes?: string;
}

export interface BookPalette {
  /** Deep background tone sampled from the cover. */
  deep: string;
  /** Mid tone. */
  mid: string;
  /** Light tone for text on deep backgrounds. */
  light: string;
  /** Accent used sparingly (links, small rules). */
  accent: string;
  /** Spine colours for the 3D render. */
  spine: { background: string; ink: string; accent: string };
}

export interface Book {
  slug: BookSlug;
  number: 1 | 2 | 3;
  /** Short title used in running copy, e.g. "The Treasure of Drowned Man's Canyon". */
  title: string;
  /** Full title as printed. */
  fullTitle: string;
  /** One-sentence original hook for cards and the shelf. */
  hook: { text: string; status: ContentStatus };
  /** Synopsis paragraphs. Written for this site from the verified jacket facts. */
  synopsis: { paragraphs: string[]; status: ContentStatus; basedOn: SourceRef[] };
  /** Verified places, inventions and people named in official copy for this book. */
  elements: { label: string; detail: string; source: SourceRef }[];
  ageRange?: { label: string; status: ContentStatus; source: SourceRef };
  readingLevel?: { label: string; status: ContentStatus; source: SourceRef };
  editions: Edition[];
  cover: ImageAsset;
  /** Back-cover image, when we have one (used for the 3D render). */
  backCover?: ImageAsset;
  palette: BookPalette;
  purchase: PurchaseLink[];
  /** An approved reading sample. `null` until the family supplies one — no sample is shown. */
  sample: null | { title: string; paragraphs: string[]; approvedBy: string };
}

export interface Person {
  id: "author" | "illustrator";
  name: string;
  alsoKnownAs?: string[];
  role: string;
  bio: { paragraphs: string[]; status: ContentStatus; sources: SourceRef[] };
  links: { label: string; url: string }[];
  photo?: ImageAsset;
}

export interface JournalArticle {
  slug: string;
  title: string;
  description: string;
  published: string;
  updated?: string;
  /** Only `published: true` articles are routed, listed and put in the sitemap. */
  isPublished: boolean;
  status: ContentStatus;
  readingMinutes: number;
}
