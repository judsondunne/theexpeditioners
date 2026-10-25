import { BuyBook } from "@/components/purchase/BuyBook";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ArrowLink } from "@/components/ui/ButtonLink";
import { Engraving } from "@/components/ui/Engraving";
import { JsonLd } from "@/components/ui/JsonLd";
import { books, bookPath, currentEdition, ordinal } from "@/content/books";
import { reviewsFor } from "@/content/praise";
import { pageMetadata } from "@/lib/seo";
import { seriesSchema, bookListSchema } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "The Expeditioners Books in Order | Official Trilogy Guide",
  absoluteTitle: true,
  description:
    "All three Expeditioners books by S. S. Taylor in reading order: The Treasure of Drowned Man's Canyon, The Secret of King Triton's Lair and The Lost City of Maps. Synopses, editions and where to buy.",
  path: "/books",
});

const faqs = [
  {
    q: "What order should I read The Expeditioners in?",
    a: "Start with The Treasure of Drowned Man's Canyon, then read The Secret of King Triton's Lair, then The Lost City of Maps. The story runs from one book into the next, so reading order matters.",
  },
  {
    q: "How many books are in the series?",
    a: "Three books have been published: the first in 2012, the second in 2014 and the third in 2019.",
  },
  {
    q: "What age is The Expeditioners for?",
    a: "Kirkus Reviews recommends the books for ages 10 to 14, and School Library Journal for grades 4 to 7. Book One has a Lexile measure of 880L.",
  },
  {
    q: "Which editions are in print?",
    a: "All three are available as paperbacks from Harlow Brook Books (2019), and as ebooks. The first two books were originally published in hardcover by McSweeney's McMullens.",
  },
];

export default function BooksPage() {
  return (
    <>
      <JsonLd data={[seriesSchema(), bookListSchema()]} />
      <header className="paper-grain relative overflow-hidden bg-paper">
        <div className="container-x relative z-10 pb-14 pt-8 md:pb-20">
          <Breadcrumbs items={[{ name: "The Books", path: "/books" }]} className="text-ink-2" />
          <div className="mt-12 grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="label text-ink-2">The Expeditioners · All three books in reading order</p>
              <h1 className="display mt-4 text-[clamp(3.6rem,10vw,9rem)]">Follow the maps.</h1>
            </div>
            <p className="max-w-md font-serif text-[1.2rem] leading-relaxed text-ink-2 lg:col-span-4">
              Begin in Drowned Man’s Canyon. Cross the Caribbean. Search for a city lost in the desert. The West siblings’ adventure starts here.
            </p>
          </div>
        </div>
        <Engraving size={480} name="field-glasses" className="absolute -right-24 -top-16 w-[26rem] text-sepia/10" />
      </header>

      <ol className="bg-paper">
        {books.map((b, i) => {
          const ed = currentEdition(b);
          const praise = reviewsFor(b.slug)[0];
          return (
            <li key={b.slug} className="border-t border-ink/20">
              <div className="container-x grid items-center gap-10 py-16 md:grid-cols-12 md:py-24">
                <Link
                  href={bookPath(b)}
                  className={`group relative mx-auto w-[min(62vw,17rem)] md:col-span-4 md:w-auto md:max-w-[20rem] ${i % 2 ? "md:order-2 md:col-start-9" : ""}`}
                >
                  <span
                    aria-hidden="true"
                    className="display absolute -left-[0.18em] -top-[0.42em] z-0 text-[clamp(7rem,14vw,12rem)] text-transparent [-webkit-text-stroke:1px_rgba(29,25,21,0.28)]"
                  >
                    {String(b.number).padStart(2, "0")}
                  </span>
                  <Image
                    src={b.cover.src}
                    alt={b.cover.alt}
                    width={880}
                    height={1360}
                    sizes="(min-width: 768px) 20rem, 62vw"
                    className="relative z-10 h-auto w-full shadow-[0_30px_50px_-22px_rgba(29,25,21,0.7)] transition-transform duration-500 group-hover:-translate-y-1.5 group-hover:-rotate-1"
                  />
                </Link>
                <div className={`md:col-span-7 ${i % 2 ? "md:order-1 md:col-start-1" : "md:col-start-6"}`}>
                  <p className="label text-rust">Book {ordinal(b.number)}</p>
                  <h2 className="mt-3 font-serif text-[clamp(2rem,3.6vw,3.2rem)] font-light leading-[1.06] tracking-[-0.01em]">
                    <Link href={bookPath(b)} className="hover:text-rust">
                      {b.fullTitle}
                    </Link>
                  </h2>
                  <p className="mt-5 max-w-xl font-serif text-[1.15rem] leading-relaxed text-ink-2">{b.synopsis.paragraphs[0]}</p>
                  {praise && (
                    <p className="mt-5 max-w-xl font-serif italic text-ink-2">
                      “{praise.quote}” <span className="label not-italic text-ink-3">— {praise.outlet}</span>
                    </p>
                  )}
                  <p className="label mt-6 text-ink-3">
                    {ed.publisher} · {ed.published.slice(0, 4)} · {ed.format}
                    {ed.pages ? ` · ${ed.pages} pages` : ""}
                  </p>
                  <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
                    <BuyBook book={b} location="books-list" />
                    <ArrowLink href={bookPath(b)}>About the book</ArrowLink>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>

      <section aria-labelledby="history-title" className="bg-paper-2 py-20 md:py-28">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="label text-ink-2">Publication history</p>
            <h2 id="history-title" className="mt-4 font-serif text-[clamp(1.9rem,3vw,2.8rem)] font-light leading-[1.08]">
              From the first hardcover to the complete trilogy
            </h2>
          </div>
          <ol className="relative border-l border-ink/30 pl-8 lg:col-span-7 lg:col-start-6">
            {[
              ["2012", "Book One, The Treasure of Drowned Man's Canyon, is published in hardcover by McSweeney's McMullens, its jacket unfolding into Katherine Roy's map."],
              ["2013–2015", "Book One is named to the Dorothy Canfield Fisher (2013–14) and Texas Bluebonnet (2014–15) award master lists."],
              ["2014", "Book Two, The Secret of King Triton's Lair, follows from McSweeney's McMullens."],
              ["2019", "Harlow Brook Books reissues the first two books in paperback and publishes Book Three, The Lost City of Maps."],
              ["2020", "Harlow Brook Books publishes ebook editions of all three books."],
            ].map(([year, text]) => (
              <li key={year} className="relative pb-10 last:pb-0">
                <span aria-hidden="true" className="absolute -left-[2.35rem] top-1.5 h-2.5 w-2.5 rounded-full border border-ink bg-paper-2" />
                <p className="label text-rust">{year}</p>
                <p className="mt-2 font-serif text-[1.1rem] leading-relaxed">{text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section aria-labelledby="faq-title" className="paper-grain relative bg-paper py-20 md:py-28">
        <div className="container-x relative z-10 grid gap-12 lg:grid-cols-12">
          <h2 id="faq-title" className="font-serif text-[clamp(1.9rem,3vw,2.8rem)] font-light leading-[1.08] lg:col-span-4">
            Questions readers ask
          </h2>
          <dl className="divide-y divide-ink/15 border-y border-ink/15 lg:col-span-7 lg:col-start-6">
            {faqs.map((f) => (
              <div key={f.q} className="py-6">
                <dt className="font-serif text-[1.25rem] leading-snug">{f.q}</dt>
                <dd className="mt-2 font-serif text-[1.08rem] leading-relaxed text-ink-2">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  );
}
