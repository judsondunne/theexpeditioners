import { BuyBook } from "@/components/purchase/BuyBook";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookViewer } from "@/components/book/BookViewer";
import { RetailerLinks } from "@/components/book/RetailerLinks";
import { TrackView } from "@/components/book/TrackView";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ArrowLink } from "@/components/ui/ButtonLink";
import { HonourStamps } from "@/components/ui/HonourStamp";
import { JsonLd } from "@/components/ui/JsonLd";
import { books, bookPath, currentEdition, getBook, ordinal } from "@/content/books";
import { recognitionFor, reviewsFor, seriesReviews } from "@/content/praise";
import { pageMetadata } from "@/lib/seo";
import { bookSchema } from "@/lib/schema";
import { shelfEntries } from "@/lib/shelf";

export const dynamicParams = false;

export function generateStaticParams() {
  return books.map((b) => ({ slug: b.slug }));
}

export async function generateMetadata({ params }: PageProps<"/books/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) return {};
  return pageMetadata({
    title: `${book.title} | Book ${ordinal(book.number)}`,
    description: {
      1: "Three siblings. Half a strange map. Government agents in pursuit. Discover Book One of The Expeditioners by S. S. Taylor, with reviews and bookstore links.",
      2: "Follow Kit West to a stormbound Caribbean island in Book Two of The Expeditioners. Read the synopsis, explore editions and choose your bookstore.",
      3: "A secret mission across the Simerian Desert. Discover The Lost City of Maps, Book Three of The Expeditioners, and find a paperback at your bookstore.",
    }[book.number],
    path: bookPath(book),
    type: "book",
    image: { url: `${bookPath(book)}/opengraph-image`, width: 1200, height: 630, alt: book.fullTitle },
  });
}

const formatLabel = { hardcover: "Hardcover", paperback: "Paperback", ebook: "Ebook", audiobook: "Audiobook" } as const;

function formatDate(d: string) {
  if (/^\d{4}$/.test(d)) return d;
  if (/^\d{4}-\d{2}$/.test(d)) {
    const [y, m] = d.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });
  }
  return new Date(`${d}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" });
}

function formatIsbn(isbn: string) {
  return isbn.length === 13 ? `${isbn.slice(0, 3)}-${isbn.slice(3, 4)}-${isbn.slice(4, 11)}-${isbn.slice(11, 12)}-${isbn.slice(12)}` : isbn;
}

export default async function BookPage({ params }: PageProps<"/books/[slug]">) {
  const { slug } = await params;
  const book = getBook(slug);
  if (!book) notFound();

  const entry = shelfEntries().find((e) => e.slug === book.slug)!;
  const edition = currentEdition(book);
  const reviews = reviewsFor(book.slug);
  const praise = reviews.length ? reviews : seriesReviews();
  const honours = recognitionFor(book.slug);
  const prev = books.find((b) => b.number === book.number - 1);
  const next = books.find((b) => b.number === book.number + 1);
  const p = book.palette;

  return (
    <article>
      <TrackView bookSlug={book.slug} />
      <JsonLd data={bookSchema(book)} />

      {/* Hero, in the book's own colours */}
      <header className="on-night relative isolate overflow-hidden text-cream" style={{ backgroundColor: p.deep }}>
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <Image src="/images/maps/rhumb-chart-1751.webp" alt="" fill sizes="100vw" className="object-cover opacity-[0.07] invert" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_70%_45%,rgba(255,240,220,0.1),transparent_60%)]" />
          <div className="paper-grain on-night absolute inset-0" />
        </div>
        <div className="container-x grid items-center gap-8 pb-16 pt-8 lg:grid-cols-12 lg:pb-20">
          <div className="lg:col-span-6 lg:py-16">
            <Breadcrumbs items={[{ name: "The Books", path: "/books" }, { name: `Book ${ordinal(book.number)}`, path: bookPath(book) }]} className="text-cream/70" />
            <p className="label mt-10" style={{ color: p.accent }}>
              Book {ordinal(book.number)} of three
            </p>
            <h1 className="mt-4 font-serif text-[clamp(2.4rem,5vw,4.4rem)] font-light leading-[1.02] tracking-[-0.015em] text-balance">
              <span className="block text-[0.5em] italic leading-tight text-cream/75">The Expeditioners and</span>
              {book.title.replace(/^The /, "the ")}
            </h1>
            <p className="mt-6 max-w-xl font-serif text-[1.2rem] leading-relaxed text-cream/85">{book.hook.text}</p>
            <p className="label mt-6 text-cream/60">By S. S. Taylor · Illustrated by Katherine Roy</p>
            <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
              <BuyBook book={book} location="book-hero" tone="paper" primary />
              <ArrowLink href="/books" className="text-cream">
                The series in order
              </ArrowLink>
            </div>
          </div>
          <div className="mx-auto w-full max-w-[34rem] lg:col-span-6">
            <BookViewer book={entry.shelf} cover={{ src: book.cover.src, alt: book.cover.alt, priority: true }} />
          </div>
        </div>
      </header>

      {/* Story + facts */}
      <section aria-labelledby="about-book" className="paper-grain relative bg-paper py-20 md:py-28">
        <div className="container-x relative z-10 grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="label text-ink-2">The story</p>
            <h2 id="about-book" className="mt-4 font-serif text-[clamp(2rem,3.6vw,3.2rem)] font-light leading-[1.06] tracking-[-0.01em]">
              What happens in Book {ordinal(book.number)}
            </h2>
            <div className="prose-field mt-8">
              {book.synopsis.paragraphs.map((para) => (
                <p key={para}>{para}</p>
              ))}
            </div>
            {book.number > 1 && (
              <p className="mt-8 max-w-[34rem] border-l-2 border-rust pl-4 font-serif text-[1.02rem] italic text-ink-2">
                This is Book {ordinal(book.number)}. The story follows on from{" "}
                <Link className="underline underline-offset-4 hover:text-rust" href={bookPath(books[book.number - 2])}>
                  {books[book.number - 2].title}
                </Link>
                , so start with Book One if you&rsquo;re new to the series.
              </p>
            )}
          </div>

          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="border border-ink/45 p-1.5">
              <div className="border border-ink/25">
                <p className="plate-caps border-b border-ink/25 px-5 py-3 text-[0.95rem]">In this book</p>
                <ul className="divide-y divide-ink/15 px-5">
                  {book.elements.map((el) => (
                    <li key={el.label} className="py-4">
                      <p className="font-serif text-[1.1rem] leading-snug">{el.label}</p>
                      <p className="mt-1 text-[0.95rem] leading-snug text-ink-2">{el.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <dl className="mt-10 divide-y divide-ink/15 border-y border-ink/15">
              {[
                ["Series", `The Expeditioners, Book ${ordinal(book.number)}`],
                ["Author", "S. S. Taylor (Sarah Stewart Taylor)"],
                ["Illustrator", "Katherine Roy"],
                book.ageRange ? ["Ages", book.ageRange.label.replace("Ages ", "")] : null,
                book.readingLevel ? ["Reading level", book.readingLevel.label] : null,
                ["Current edition", `${formatLabel[edition.format]}, ${edition.publisher}`],
                edition.pages ? ["Pages", String(edition.pages)] : null,
                edition.isbn13 ? ["ISBN", formatIsbn(edition.isbn13)] : null,
              ]
                .filter((r): r is string[] => Boolean(r))
                .map(([k, v]) => (
                  <div key={k} className="grid grid-cols-[8.5rem_1fr] gap-4 py-3">
                    <dt className="label pt-1 text-ink-3">{k}</dt>
                    <dd className="font-serif text-[1.02rem] leading-snug">{v}</dd>
                  </div>
                ))}
            </dl>
          </aside>
        </div>
      </section>

      {/* Praise */}
      {praise.length > 0 && (
        <section aria-labelledby="praise-title" className="bg-paper-2 py-20 md:py-24">
          <div className="container-x">
            <h2 id="praise-title" className="label text-ink-2">
              {reviews.length ? `Praise for Book ${ordinal(book.number)}` : "Praise for the series"}
            </h2>
            <ul className="mt-10 grid gap-x-16 gap-y-12 md:grid-cols-2">
              {praise.map((r) => (
                <li key={r.id}>
                  <blockquote>
                    <p className="font-serif text-[clamp(1.45rem,2.4vw,2rem)] leading-[1.2] text-pretty">
                      <span aria-hidden="true" className="text-rust">“</span>
                      {r.quote}
                      <span aria-hidden="true" className="text-rust">”</span>
                    </p>
                    <footer className="label mt-3 text-ink-2">
                      — {r.outlet}
                      {r.year ? `, ${r.year}` : ""}
                      {r.url && (
                        <>
                          {" · "}
                          <a href={r.url} target="_blank" rel="noopener" className="underline underline-offset-4 hover:text-rust">
                            Read the review<span className="sr-only"> (opens in a new tab)</span>
                          </a>
                        </>
                      )}
                    </footer>
                  </blockquote>
                </li>
              ))}
            </ul>
            {honours.length > 0 && (
              <div className="mt-16 border-t border-ink/20 pt-10">
                <h3 className="label text-ink-2">Honours</h3>
                <HonourStamps honours={honours} layout="gallery" className="mt-8" />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Where to buy */}
      <section id="buy" data-purchase-destination aria-labelledby="buy-title" className="paper-grain relative scroll-mt-24 bg-paper py-20 md:py-28">
        <div className="container-x relative z-10 grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="label text-ink-2">Where to buy</p>
            <h2 id="buy-title" className="mt-4 font-serif text-[clamp(2rem,3.6vw,3.2rem)] font-light leading-[1.06] tracking-[-0.01em]">
              Get a copy of Book {ordinal(book.number)}
            </h2>
            <p className="mt-5 max-w-md font-serif text-[1.1rem] leading-relaxed text-ink-2">
              The current edition is the {formatLabel[edition.format].toLowerCase()} from {edition.publisher}. Any bookshop
              can order it with the ISBN below.
            </p>
            {edition.isbn13 && (
              <p className="label mt-5 text-ink">
                ISBN {formatIsbn(edition.isbn13)}
              </p>
            )}
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <RetailerLinks links={book.purchase} bookSlug={book.slug} featured />
            <details className="group mt-10 border-b border-ink/15 pb-4">
              <summary className="label-lg flex cursor-pointer list-none items-center justify-between py-2 text-ink-2 hover:text-ink">
                All editions &amp; ISBNs
                <span aria-hidden="true" className="transition-transform group-open:rotate-45">+</span>
              </summary>
              <table className="mt-4 w-full text-left text-[0.95rem]">
                <caption className="sr-only">Editions of {book.fullTitle}</caption>
                <thead>
                  <tr className="label text-ink-3">
                    <th scope="col" className="py-2 pr-4 font-medium">Format</th>
                    <th scope="col" className="py-2 pr-4 font-medium">Publisher</th>
                    <th scope="col" className="py-2 pr-4 font-medium">Published</th>
                    <th scope="col" className="py-2 font-medium">ISBN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink/10 font-serif">
                  {book.editions.map((e) => (
                    <tr key={`${e.format}-${e.isbn13}`}>
                      <td className="py-2.5 pr-4">
                        {formatLabel[e.format]}
                        {e.current && <span className="label ml-2 text-rust">Current</span>}
                      </td>
                      <td className="py-2.5 pr-4">{e.publisher}</td>
                      <td className="py-2.5 pr-4">{formatDate(e.published)}</td>
                      <td className="py-2.5 font-mono text-[0.85rem]">{e.isbn13 ? formatIsbn(e.isbn13) : "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="mt-4 text-[0.9rem] italic text-ink-3">
                Earlier McSweeney&rsquo;s editions may still turn up secondhand and in libraries.
              </p>
            </details>
          </div>
        </div>
      </section>

      {/* Series navigation */}
      <nav aria-label="More books in the series" className="on-night bg-night py-16 text-cream md:py-20">
        <div className="container-x grid gap-10 md:grid-cols-2">
          {[prev, next].map((b, i) =>
            b ? (
              <Link
                key={b.slug}
                href={bookPath(b)}
                className={`group flex items-center gap-6 ${i === 1 ? "md:flex-row-reverse md:text-right" : ""}`}
              >
                <Image
                  src={b.cover.src}
                  alt=""
                  width={880}
                  height={1360}
                  sizes="7rem"
                  className="h-auto w-24 shrink-0 shadow-[0_20px_30px_-12px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:-translate-y-1 md:w-28"
                />
                <span>
                  <span className="label block text-cream/60">{i === 0 ? "← Previous" : "Read next →"} · Book {ordinal(b.number)}</span>
                  <span className="mt-2 block font-serif text-[clamp(1.4rem,2.4vw,2rem)] leading-tight group-hover:underline group-hover:underline-offset-4">
                    {b.title}
                  </span>
                </span>
              </Link>
            ) : (
              <div key={i} className={`flex flex-col justify-center ${i === 1 ? "md:items-end md:text-right" : ""}`}>
                <span className="label text-cream/60">{i === 0 ? "This is where it begins" : "The trilogy ends here"}</span>
                <Link href="/books" className="mt-2 font-serif text-[clamp(1.4rem,2.4vw,2rem)] leading-tight underline-offset-4 hover:underline">
                  See all three books
                </Link>
              </div>
            ),
          )}
        </div>
      </nav>
    </article>
  );
}
