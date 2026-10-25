import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ArrowLink } from "@/components/ui/ButtonLink";
import { JsonLd } from "@/components/ui/JsonLd";
import { plates, maps } from "@/content/engravings";
import { author, illustrator } from "@/content/people";
import { pageMetadata } from "@/lib/seo";
import { personSchema } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "About S. S. Taylor and Katherine Roy",
  description:
    "S. S. Taylor is the name Sarah Stewart Taylor writes under for The Expeditioners. Meet the author and the illustrator, Katherine Roy, and see the credits for this site.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <JsonLd data={[personSchema("author"), personSchema("illustrator")]} />
      <header className="paper-grain relative overflow-hidden bg-paper">
        <div className="container-x relative z-10 pb-14 pt-8 md:pb-20">
          <Breadcrumbs items={[{ name: "About", path: "/about" }]} className="text-ink-2" />
          <h1 className="display mt-14 max-w-5xl text-[clamp(3.4rem,9vw,8rem)]">The author &amp; the illustrator</h1>
        </div>
      </header>

      <section id="author" aria-labelledby="author-title" className="scroll-mt-20 border-t border-ink/20 bg-paper py-16 md:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="label text-ink-2">The author</p>
            <h2 id="author-title" className="mt-4 font-serif text-[clamp(2.4rem,4vw,3.6rem)] font-light leading-none">
              S. S. Taylor
            </h2>
            <p className="mt-3 font-serif text-[1.3rem] italic text-ink-2">also known as Sarah Stewart Taylor</p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <div className="prose-field">
              {author.bio.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
              {author.links.map((l) => (
                <li key={l.url}>
                  <a href={l.url} target="_blank" rel="noopener" className="label-lg underline decoration-ink/30 underline-offset-[6px] hover:text-rust">
                    {l.label} ↗<span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="names-title" className="bg-paper-2 py-16 md:py-20">
        <div className="container-x grid gap-8 lg:grid-cols-12">
          <h2 id="names-title" className="font-serif text-[clamp(1.7rem,2.6vw,2.3rem)] leading-snug lg:col-span-4">
            One writer, two names
          </h2>
          <p className="font-serif text-[1.15rem] leading-relaxed text-ink-2 lg:col-span-7 lg:col-start-6">
            The Expeditioners is published under the name S. S. Taylor. Her mysteries for adults appear as Sarah Stewart
            Taylor. If you are looking for the Maggie D&rsquo;arcy novels or <em>Agony Hill</em>, you&rsquo;ll find them on{" "}
            <a href="https://www.sarahstewarttaylor.com/" target="_blank" rel="noopener" className="underline underline-offset-4 hover:text-rust">
              sarahstewarttaylor.com<span className="sr-only"> (opens in a new tab)</span>
            </a>
            . This site is just for the trilogy.
          </p>
        </div>
      </section>

      <section id="illustrator" aria-labelledby="illustrator-title" className="scroll-mt-20 bg-paper py-16 md:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="label text-ink-2">The illustrator</p>
            <h2 id="illustrator-title" className="mt-4 font-serif text-[clamp(2.4rem,4vw,3.6rem)] font-light leading-none">
              Katherine Roy
            </h2>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <div className="prose-field">
              {illustrator.bio.paragraphs.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-4">
              {illustrator.links.map((l) => (
                <a key={l.url} href={l.url} target="_blank" rel="noopener" className="label-lg underline decoration-ink/30 underline-offset-[6px] hover:text-rust">
                  {l.label} ↗<span className="sr-only"> (opens in a new tab)</span>
                </a>
              ))}
              <ArrowLink href="/explore#art">See her Expeditioners drawings</ArrowLink>
            </div>
          </div>
        </div>
      </section>

      <section id="credits" aria-labelledby="credits-title" className="on-night scroll-mt-20 bg-night py-16 text-cream md:py-24">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="label text-cream/60">Credits</p>
            <h2 id="credits-title" className="mt-4 font-serif text-[clamp(1.8rem,3vw,2.6rem)] font-light leading-[1.08]">
              Pictures on this site
            </h2>
          </div>
          <div className="space-y-10 lg:col-span-7 lg:col-start-6">
            <div>
              <h3 className="label text-signal">From the books</h3>
              <ul className="mt-4 space-y-2 font-serif text-[1.05rem] leading-relaxed text-cream/85">
                <li>Covers of Books One and Two, interior illustrations and the Drowned Man&rsquo;s Canyon map: Katherine Roy.</li>
                <li>Cover of Book Three: Harlow Brook Books (2019).</li>
                <li>Series lettering on the covers: designed for the original McSweeney&rsquo;s McMullens editions.</li>
              </ul>
            </div>
            <div>
              <h3 className="label text-signal">Public-domain engravings &amp; maps</h3>
              <p className="mt-3 font-serif text-[1.02rem] italic text-cream/65">
                Used as decoration and atmosphere. They are not illustrations from the books.
              </p>
              <ul className="mt-4 space-y-2 font-serif text-[1.02rem] leading-relaxed text-cream/85">
                {Object.values(maps).map((m) => (
                  <li key={m.src}>{m.credit}</li>
                ))}
                {Object.values(plates).map((p) => (
                  <li key={p.title}>
                    <em>{p.title}.</em> {p.credit}
                  </li>
                ))}
                <li>Small line drawings of instruments, vehicles and travellers: Pearson Scott Foresman, donated to the public domain via Wikimedia Commons.</li>
              </ul>
            </div>
            <div>
              <h3 className="label text-signal">Typefaces</h3>
              <p className="mt-3 font-serif text-[1.02rem] leading-relaxed text-cream/85">
                League Gothic, Newsreader, IBM Plex Mono and Reenie Beanie, all under the SIL Open Font License.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
