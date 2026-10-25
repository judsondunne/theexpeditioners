import { existsSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";
import { books } from "../../src/content/books";
import { spots } from "../../src/content/engravings";
import { activities } from "../../src/content/educators";
import { publishedArticles } from "../../src/content/journal";
import { author, illustrator } from "../../src/content/people";
import { recognition, reviews } from "../../src/content/praise";
import { storyBeats } from "../../src/content/story";
import { characters, marvels, places } from "../../src/content/world";

const publicFile = (p: string) => existsSync(join(process.cwd(), "public", p));

function validIsbn13(isbn: string) {
  if (!/^\d{13}$/.test(isbn)) return false;
  const sum = isbn
    .slice(0, 12)
    .split("")
    .reduce((s, d, i) => s + Number(d) * (i % 2 ? 3 : 1), 0);
  return (10 - (sum % 10)) % 10 === Number(isbn[12]);
}

test.describe("book data", () => {
  test("three books, numbered 1–3 in order, with unique slugs", () => {
    expect(books.map((b) => b.number)).toEqual([1, 2, 3]);
    expect(new Set(books.map((b) => b.slug)).size).toBe(3);
  });

  test("every ISBN-13 has a valid check digit", () => {
    for (const b of books) for (const e of b.editions) if (e.isbn13) expect(validIsbn13(e.isbn13), `${b.slug} ${e.isbn13}`).toBe(true);
  });

  test("each book has exactly one current edition, with sources", () => {
    for (const b of books) {
      expect(b.editions.filter((e) => e.current)).toHaveLength(1);
      for (const e of b.editions) expect(e.sources.length).toBeGreaterThan(0);
    }
  });

  test("purchase links are https and match an edition of the same book", () => {
    for (const b of books) {
      const isbns = new Set(b.editions.map((e) => e.isbn13));
      for (const l of b.purchase) {
        expect(l.url.startsWith("https://")).toBe(true);
        if (l.isbn13) expect(isbns.has(l.isbn13), `${b.slug} → ${l.url}`).toBe(true);
      }
    }
  });

  test("cover images exist and have descriptive alt text", () => {
    for (const b of books) {
      for (const img of [b.cover, b.backCover].filter(Boolean)) {
        expect(publicFile(img!.src), img!.src).toBe(true);
        expect(img!.alt.length).toBeGreaterThan(30);
      }
      expect(publicFile(`/images/textures/book-${b.number}-front.webp`)).toBe(true);
    }
  });

  test("no approved reading sample is published without sign-off", () => {
    for (const b of books) if (b.sample) expect(b.sample.approvedBy.length).toBeGreaterThan(0);
  });
});

test.describe("claims and sources", () => {
  test("review pull quotes stay short and carry a source", () => {
    for (const r of reviews) {
      expect(r.quote.split(/\s+/).length, r.id).toBeLessThanOrEqual(15);
      expect(r.source.label.length).toBeGreaterThan(0);
    }
  });

  test("recognition, story beats, characters, places and marvels are all sourced", () => {
    for (const r of recognition) expect(r.sources.length).toBeGreaterThan(0);
    for (const s of storyBeats) expect(s.sources.length).toBeGreaterThan(0);
    for (const c of characters) expect(c.sources.length).toBeGreaterThan(0);
    for (const p of places) expect(p.source.label.length).toBeGreaterThan(0);
    for (const m of marvels) expect(m.source.label.length).toBeGreaterThan(0);
    for (const p of [author, illustrator]) expect(p.bio.sources.length).toBeGreaterThan(0);
  });

  test("the site never promises a fourth book", () => {
    const text = JSON.stringify({ books, storyBeats, publishedArticles: publishedArticles.map((a) => a.description) });
    expect(text).not.toMatch(/book four|fourth book|book 4\b/i);
  });
});

test.describe("assets", () => {
  test("every spot engraving file exists", () => {
    for (const name of Object.keys(spots)) {
      expect(publicFile(`/images/engravings/${name}.webp`), name).toBe(true);
      for (const width of [96,192,240,480,720]) expect(publicFile(`/images/optimized/${name}-${width}.webp`), `${name} ${width}`).toBe(true);
    }
    for (const width of [640,960,1440,1920]) expect(publicFile(`/images/optimized/hero-map-${width}.webp`)).toBe(true);
  });

  test("every educator download exists", () => {
    for (const a of activities) if (a.download) expect(publicFile(a.download.href), a.download.href).toBe(true);
  });
});
