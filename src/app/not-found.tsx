import Image from "next/image";
import Link from "next/link";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { plates } from "@/content/engravings";
import { books, bookPath, ordinal } from "@/content/books";

export default function NotFound() {
  return (
    <section className="paper-grain relative overflow-hidden bg-paper">
      <div className="container-x relative z-10 grid items-center gap-14 py-20 md:py-28 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="label text-rust">Error 404 · Uncharted territory</p>
          <h1 className="display mt-5 text-[clamp(3.6rem,10vw,8.5rem)]">This page isn&rsquo;t on any map</h1>
          <p className="mt-6 max-w-md font-serif text-[1.2rem] leading-relaxed text-ink-2">
            The link may be old, or the page may have moved. Here are some well-charted places to start from instead.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <ButtonLink href="/">Back to the homepage</ButtonLink>
            <ButtonLink href="/books" variant="outline">
              The books in order
            </ButtonLink>
          </div>
          <ul className="mt-12 divide-y divide-ink/15 border-y border-ink/15">
            {books.map((b) => (
              <li key={b.slug}>
                <Link href={bookPath(b)} className="flex items-baseline justify-between gap-6 py-3.5 hover:text-rust">
                  <span className="font-serif text-[1.1rem]">{b.title}</span>
                  <span className="label text-ink-3">Book {ordinal(b.number)}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <figure className="lg:col-span-5 lg:col-start-8">
          <div className="border border-ink/45 bg-paper-2 p-1.5">
            <Image
              src="/images/engravings/flammarion.webp"
              alt="Nineteenth-century wood engraving of a traveller putting his head through the edge of the sky to see the machinery beyond."
              width={plates.flammarion.w}
              height={plates.flammarion.h}
              sizes="(min-width: 1024px) 34rem, 100vw"
              className="h-auto w-full mix-blend-multiply"
            />
          </div>
          <figcaption className="mt-3 text-[0.9rem] italic text-ink-2">{plates.flammarion.credit}</figcaption>
        </figure>
      </div>
    </section>
  );
}
