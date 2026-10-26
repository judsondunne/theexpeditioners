import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapRoom } from "@/components/explore/MapRoom";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { BuyBook } from "@/components/purchase/BuyBook";
import { ArrowLink } from "@/components/ui/ButtonLink";
import { Engraving } from "@/components/ui/Engraving";

import { bookOne, bookPath, books, ordinal } from "@/content/books";

import { jacketMapPlaces, places } from "@/content/world";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Drowned Man’s Canyon | Interactive 3D Map Room",
  description:
    "A field guide to The Expeditioners: the West siblings, the places they travel, the steam-and-clockwork machines of their world, and Katherine Roy's map of Drowned Man's Canyon.",
  path: "/explore",
});

export default function ExplorePage() {
  return (
    <>
      <header className="paper-grain relative bg-paper">
        <div className="container-x pt-8 pb-14 md:pb-20">
          <Breadcrumbs items={[{ name: "The Map Room", path: "/explore" }]} className="text-ink-2" />
          <div className="mt-12 grid gap-8 items-end lg:grid-cols-[1.4fr_1fr]">
            <div><p className="label text-rust">Beyond the edge of the map</p><h1 className="mt-4 font-serif text-[clamp(3rem,7vw,7rem)] leading-[.98]">The canyon<br /><em>is calling.</em></h1></div>
            <p className="max-w-md text-xl leading-relaxed text-ink-2">Trace the river through Drowned Man&rsquo;s Canyon. Circle the peaks, find Azure City, and see where the West siblings&rsquo; first adventure leads.</p>
          </div>
          <nav className="label mt-10 flex flex-wrap gap-7 text-ink-2" aria-label="On this page"><a href="#map-room">Explore the canyon ↓</a><a href="#places">Where the trail leads</a><a href="#art">Katherine Roy&rsquo;s drawings</a></nav>
        </div>
      </header>

      {/* The Map Room */}
      <section aria-labelledby="map-title" className="on-night scroll-mt-20 bg-night py-20 text-cream md:py-28">
        <div className="container-x">
          <div className="max-w-3xl">
            <p className="label text-cream/60">The Map Room</p>
            <h2 id="map-title" className="mt-4 font-serif text-[clamp(2rem,3.8vw,3.4rem)] font-light leading-[1.06]">
              Explore Drowned Man&rsquo;s Canyon
            </h2>
          </div>
          <div id="map-room" className="mt-12">
            <MapRoom
              src="/images/art/book1-jacket-map.webp"
              width={1600}
              height={1238}
              crop={0.62}
              places={jacketMapPlaces}
              alt="Katherine Roy's hand-drawn contour map of Drowned Man's Canyon and Azure Canyon"
              credit="Map by Katherine Roy · reverse of the 2012 Book One jacket"
            />
          </div>
        </div>
      </section>

      {/* Places */}
      <section id="places" aria-labelledby="places-title" className="paper-grain relative scroll-mt-20 bg-paper py-20 md:py-28">
        <div className="container-x relative z-10 grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="label text-ink-2">A gazetteer</p>
            <h2 id="places-title" className="mt-4 font-serif text-[clamp(2rem,3.6vw,3.2rem)] font-light leading-[1.06]">
              Where the trail leads
            </h2>
            <Engraving name="globe" className="mt-10 hidden w-40 text-ink/70 lg:block" />
          </div>
          <div className="lg:col-span-8">
            {books.map((b) => {
              const list = places.filter((pl) => pl.book === b.slug);
              return (
                <div key={b.slug} className="border-t border-ink/25 py-8 first:pt-0 first:border-t-0">
                  <p className="label text-rust">
                    Book {ordinal(b.number)} ·{" "}
                    <Link href={bookPath(b)} className="underline-offset-4 hover:underline">
                      {b.title}
                    </Link>
                  </p>
                  <dl className="mt-4 grid gap-6 sm:grid-cols-2">
                    {list.map((pl) => (
                      <div key={pl.name}>
                        <dt className="font-serif text-[1.3rem] leading-snug">{pl.name}</dt>
                        <dd className="mt-1 font-serif text-[1.02rem] leading-relaxed text-ink-2">{pl.detail}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Art */}
      <section id="art" aria-labelledby="art-title" className="paper-grain relative scroll-mt-20 bg-paper py-20 md:py-28">
        <div className="container-x relative z-10">
          <p className="label text-ink-2">From the illustrator</p>
          <h2 id="art-title" className="mt-4 max-w-3xl font-serif text-[clamp(2rem,3.6vw,3.2rem)] font-light leading-[1.06]">
            Katherine Roy&rsquo;s drawings for the trilogy
          </h2>
          <div className="mt-12 grid items-start gap-10 md:grid-cols-12">
            <figure className="md:col-span-5">
              <div className="border border-ink/45 bg-paper-2 p-1.5">
                <Image
                  src="/images/art/book1-interior-explorer-and-kit.webp"
                  alt="Ink illustration of the Explorer with the Clockwork Hand, in goggles and a long coat, beside Kit, who wears glasses."
                  width={500}
                  height={682}
                  sizes="(min-width: 768px) 30rem, 100vw"
                  className="h-auto w-full mix-blend-multiply"
                />
              </div>
              <figcaption className="mt-3 text-[0.92rem] italic text-ink-2">Interior illustration, Book One.</figcaption>
            </figure>
            <figure className="md:col-span-4 md:col-start-7 md:mt-24">
              <div className="border border-ink/45 bg-paper-2 p-1.5">
                <Image
                  src="/images/art/book1-kit-explorers-vest.webp"
                  alt="Ink drawing of Kit's Explorer's vest, its pockets holding a spyglass, compass, sextant and first-aid kit."
                  width={432}
                  height={576}
                  sizes="(min-width: 768px) 24rem, 100vw"
                  className="h-auto w-full mix-blend-multiply"
                />
              </div>
              <figcaption className="mt-3 text-[0.92rem] italic text-ink-2">Kit&rsquo;s Explorer&rsquo;s vest, by Katherine Roy.</figcaption>
            </figure>
          </div>
          <div className="mt-20 flex flex-col items-start justify-between gap-8 border-t border-ink/25 pt-10 md:flex-row md:items-center">
            <p className="max-w-xl font-serif text-[1.4rem] leading-snug">
              The best way into this world is through the first book.
            </p>
            <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
              <BuyBook book={bookOne} location="map-room-end" label="Start with Book One" />
              <ArrowLink href="/educators">Classroom activities</ArrowLink>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
