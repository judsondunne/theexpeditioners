import Image from "next/image";
import Link from "next/link";
import { MapRoom } from "@/components/explore/MapRoom";
import { jacketMapPlaces } from "@/content/world";
import { RetailerLinks } from "@/components/book/RetailerLinks";
import { InkStatement } from "@/components/home/InkStatement";
import { ArrowLink, ButtonLink } from "@/components/ui/ButtonLink";
import { Engraving } from "@/components/ui/Engraving";
import { HonourStamps } from "@/components/ui/HonourStamp";

import { bookOne, bookPath, books, ordinal } from "@/content/books";
import { recognition, review } from "@/content/praise";


/* ---------------------------------------------------- the Expeditioners */

export function SiblingsSection() {
  return (
    <section aria-label="Three siblings, half a map" className="paper-grain relative overflow-hidden bg-paper py-24 md:py-32">
      <div className="container-x relative z-10">
        <InkStatement
          tokens={[
            "Three",
            "siblings,",
            { spot: "compass", w: "w-[0.9em]" },
            "one",
            "half",
            "of",
            "a",
            "strange",
            "map,",
            { spot: "gear", w: "w-[1.3em]" },
            "and",
            "a",
            "world",
            "where",
            "the",
            "machines",
            "have",
            "failed",
            "and",
            "the",
            "blank",
            "spaces",
            "on",
            "the",
            "map",
            "have",
            "come",
            "back.",
            { spot: "airship", w: "w-[2.4em]" },
            "Somewhere",
            "out",
            "there,",
            "their",
            "father's",
            "trail",
            "is",
            "waiting.",
            { spot: "field-glasses", w: "w-[1.1em]" },
          ]}
        />

        <p className="mt-12 text-center font-hand text-4xl text-rust">K · M.K. · Z</p>
      </div>

    </section>
  );
}

/* ----------------------------------------------------- notices & honours */

export function RecognitionSection() {
  const quotes = [review("kirkus-book-one"), review("slj-book-one"), review("sf-chronicle-series"), review("boingboing-book-two")];
  return (
    <section aria-labelledby="notices-title" className="relative bg-paper-2 py-24 md:py-32">
      <div className="container-x">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="label text-ink-2">Acclaim &amp; honours</p>
            <h2 id="notices-title" className="mt-4 font-serif text-[clamp(2.2rem,4vw,3.6rem)] font-light leading-[1.04] tracking-[-0.015em]">
              Selected by librarians.<br />Celebrated by critics.
            </h2>
            <HonourStamps honours={recognition} layout="gallery" className="mt-12" />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <ul className="space-y-10">
              {quotes.map((q, i) => (
                <li key={q.id} className={i % 2 ? "md:pl-16" : ""}>
                  <blockquote>
                    <p className="font-serif text-[clamp(1.5rem,2.6vw,2.15rem)] leading-[1.18] text-pretty">
                      <span aria-hidden="true" className="text-rust">
                        “
                      </span>
                      {q.quote}
                      <span aria-hidden="true" className="text-rust">
                        ”
                      </span>
                    </p>
                    <footer className="label mt-3 text-ink-2">
                      — {q.outlet}
                      {q.book && <span className="text-ink-3"> · on Book {ordinal(books.find((b) => b.slug === q.book)!.number)}</span>}
                    </footer>
                  </blockquote>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- the map room */

export function MapRoomTeaser() {
  return (
    <section aria-labelledby="maproom-title" className="on-night relative overflow-hidden bg-night py-24 text-cream md:py-32">
      <div className="container-x grid items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="label text-cream/60">The Map Room</p>
          <h2 id="maproom-title" className="mt-4 font-serif text-[clamp(2.2rem,4.2vw,3.8rem)] font-light leading-[1.04] tracking-[-0.015em]">
            Explore Drowned Man&rsquo;s Canyon
          </h2>
          <div className="mt-9">
            <ButtonLink href="/explore#map-room" variant="paper">
              Explore the canyon
            </ButtonLink>
            <div className="mt-6"><ArrowLink href="/journal/what-is-steampunk-for-young-readers" className="text-cream/70">New to steampunk?</ArrowLink></div>
          </div>
        </div>
        <div className="min-w-0 lg:col-span-7">
          <MapRoom compact src="/images/art/book1-jacket-map.webp" width={1600} height={1238} crop={0.62} places={jacketMapPlaces} alt="Katherine Roy's map of Drowned Man's Canyon" credit="Inspired by Katherine Roy’s Book One jacket map · imagined terrain" />
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- educators */

export function EducatorsTeaser() {
  return (
    <section aria-labelledby="edu-title" className="paper-grain relative overflow-hidden bg-paper py-24 md:py-32">
      <div className="container-x relative z-10 grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="label text-ink-2">For classrooms &amp; libraries</p>
          <h2 id="edu-title" className="mt-4 font-serif text-[clamp(2.2rem,4vw,3.6rem)] font-light leading-[1.04] tracking-[-0.015em]">
            Bring the adventure<br /> into your classroom.
          </h2>
          <p className="mt-6 max-w-md text-xl leading-relaxed text-ink-2">Unfold a map. Crack a code. Give curious readers somewhere to go next, with discussion questions and printable activities.</p>
          <div className="mt-9">
            <ButtonLink href="/educators" variant="ink">
              Resources for educators
            </ButtonLink>
          </div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7">
          <p className="label mb-5 text-rust">Ages 10–14 · Grades 4–7</p>
          <div className="border-y border-sepia/30">
            {([
              ["compass", "Make a map", "Draw what you know. Find what you missed.", "/educators/field-sheet", "Printable field sheet"],
              ["gear", "Break a code", "Build a book cipher and challenge a friend.", "/journal/how-to-make-a-book-cipher", "Try the interactive cipher"],
              ["field-glasses", "Start a conversation", "Who owns a discovery? What makes an explorer?", "/educators#questions", "Questions for all three books"],
            ] as const).map(([spot,title,text,href,note]) => <Link key={title} href={href} className="group flex gap-5 items-center border-b border-sepia/20 last:border-b-0 py-6">
              <Engraving name={spot} className="w-14 shrink-0 text-sepia/80 transition-transform group-hover:-rotate-6" />
              <div><p className="font-serif text-2xl leading-tight group-hover:text-rust">{title}</p><p className="mt-1 leading-snug text-ink-2">{text}</p><p className="label mt-2 text-ink-3">{note}</p></div>
              <span aria-hidden="true" className="ml-auto text-rust">↗</span>
            </Link>)}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------- closing CTA */

export function FinalCta() {
  return (
    <section
      data-purchase-destination
      aria-labelledby="final-title"
      className="on-night relative overflow-hidden py-24 text-cream md:py-32"
      style={{ backgroundColor: bookOne.palette.deep }}
    >
      <div aria-hidden="true" className="absolute inset-0 opacity-[0.08]">
        <Image src="/images/maps/rhumb-chart-1751.webp" alt="" fill sizes="100vw" className="object-cover invert" />
      </div>
      <div className="container-x relative grid items-center gap-14 md:grid-cols-12">
        <div className="mx-auto w-[min(60vw,16rem)] md:col-span-4 md:w-auto md:max-w-[19rem]">
          <Image
            src={bookOne.cover.src}
            alt={bookOne.cover.alt}
            width={880}
            height={1360}
            sizes="(min-width: 768px) 19rem, 60vw"
            className="h-auto w-full -rotate-2 shadow-[0_40px_80px_-24px_rgba(0,0,0,0.85)]"
          />
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <h2 id="final-title" className="mt-4 font-serif text-[clamp(2.4rem,5vw,4.6rem)] font-light leading-[1.02] tracking-[-0.015em]">
            The expedition starts with Book One.
          </h2>
          <p className="mt-5 max-w-lg font-serif text-[1.15rem] leading-relaxed text-cream/80">{bookOne.hook.text}</p>
          <div className="mt-9 max-w-lg">
            <RetailerLinks links={bookOne.purchase} bookSlug={bookOne.slug} tone="night" location="homepage-final" featured />
          </div>
          <div className="mt-8">
            <ArrowLink href={bookPath(bookOne)} className="text-cream">
              More about Book One
            </ArrowLink>
          </div>
        </div>
      </div>
    </section>
  );
}
