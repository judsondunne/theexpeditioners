import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ArrowLink } from "@/components/ui/ButtonLink";
import { JsonLd } from "@/components/ui/JsonLd";
import { author, illustrator, authorBibliography, illustratorBibliography } from "@/content/people";
import { pageMetadata } from "@/lib/seo";
import { personSchema } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "About S. S. Taylor and Katherine Roy",
  description: "Meet Sarah Stewart Taylor and Katherine Roy, the author and illustrator of The Expeditioners, with biographies, portraits and a guide to their books.",
  path: "/about",
});

export default function AboutPage() {
  return <>
    <JsonLd data={[personSchema("author"), personSchema("illustrator")]} />
    <header className="paper-grain bg-paper">
      <div className="container-x pb-14 pt-8 md:pb-20">
        <Breadcrumbs items={[{ name: "About", path: "/about" }]} className="text-ink-2" />
        <h1 className="display mt-14 max-w-5xl text-[clamp(3.4rem,9vw,8rem)]">The author &amp; the illustrator</h1>
      </div>
    </header>

    <section id="author" aria-labelledby="author-title" className="scroll-mt-20 bg-paper pb-20 md:pb-28">
      <div className="container-x grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-4"><figure>
          <Image src="/images/people/sarah-stewart-taylor.webp" alt="Sarah Stewart Taylor in front of her bookshelves" width={2316} height={3088} priority sizes="(min-width: 1024px) 32vw, 90vw" className="h-auto w-full max-w-lg" />
          <figcaption className="mt-3 text-sm text-ink-2">Portrait from <a href="https://www.sarahstewarttaylor.com/about" target="_blank" rel="noopener" className="underline underline-offset-4">Sarah’s official website ↗</a></figcaption>
        </figure>
        <figure>
          <Image src="/images/people/sarah-portrait.webp" alt="A professional portrait of Sarah Stewart Taylor outdoors" width={1190} height={790} sizes="(min-width: 1024px) 32vw, 90vw" className="mt-8 h-auto w-full max-w-lg" />
          <figcaption className="mt-3 text-sm text-ink-2">Portrait from <a href="https://www.sarahstewarttaylor.com/" target="_blank" rel="noopener" className="underline underline-offset-4">Sarah’s website ↗</a></figcaption>
        </figure></div>
        <div className="lg:col-span-8">
          <h2 id="author-title" className="font-serif text-[clamp(2.2rem,4vw,3.6rem)] leading-tight">Sarah Stewart Taylor</h2>
          <div className="prose-field mt-7">{author.bio.paragraphs.map(p => <p key={p}>{p}</p>)}</div>
          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">{author.links.map(link => <li key={link.url}><a href={link.url} target="_blank" rel="noopener" className="underline underline-offset-4 hover:text-rust">{link.label} ↗<span className="sr-only"> (opens in a new tab)</span></a></li>)}</ul>
          <p className="mt-6 text-sm text-ink-2">Biography based on <a href="https://www.sarahstewarttaylor.com/about" className="underline underline-offset-4">Sarah’s own introduction</a> and her <a href="https://www.neh.gov/humanities/author/sarah-stewart-taylor" className="underline underline-offset-4">NEH contributor biography</a>.</p>
        </div>
      </div>
    </section>

    <section aria-labelledby="sarah-books" className="bg-paper-2 py-20 md:py-28">
      <div className="container-x"><h2 id="sarah-books" className="font-serif text-[clamp(2rem,4vw,3.4rem)]">Books by Sarah Stewart Taylor</h2>
        <div className="bibliography mt-12">{authorBibliography.map(group => <div key={group.title}><h3 className="font-serif text-2xl"><Link href={group.href} className="underline decoration-ink/25 underline-offset-4 hover:text-rust">{group.title}</Link></h3><ul className="mt-5 space-y-3">{group.books.map(title => <li key={title}><em>{title}</em></li>)}</ul></div>)}</div>
      </div>
    </section>

    <section id="illustrator" aria-labelledby="illustrator-title" className="scroll-mt-20 bg-paper py-20 md:py-28">
      <div className="container-x grid items-start gap-10 lg:grid-cols-12 lg:gap-16">
        <figure className="lg:col-span-4"><Image src="/images/people/katherine-roy.webp" alt="Katherine Roy, photographed by Tim Stout" width={1500} height={2151} sizes="(min-width: 1024px) 32vw, 90vw" className="h-auto w-full max-w-lg" /><figcaption className="mt-3 text-sm text-ink-2">Photograph by Tim Stout · <a href="https://www.katherineroy.com/about" target="_blank" rel="noopener" className="underline underline-offset-4">Katherine’s website ↗</a></figcaption></figure>
        <div className="lg:col-span-8"><h2 id="illustrator-title" className="font-serif text-[clamp(2.2rem,4vw,3.6rem)] leading-tight">Katherine Roy</h2>
          <div className="prose-field mt-7">{illustrator.bio.paragraphs.map(p => <p key={p}>{p}</p>)}</div>
          <div className="mt-8 flex flex-wrap gap-x-7 gap-y-4"><a href="https://www.katherineroy.com/" target="_blank" rel="noopener" className="underline underline-offset-4 hover:text-rust">katherineroy.com ↗</a><ArrowLink href="/explore#art">See her Expeditioners drawings</ArrowLink></div>
          <p className="mt-6 text-sm text-ink-2">Biography adapted from <a href="https://www.katherineroy.com/about" className="underline underline-offset-4">Katherine’s official biography</a>.</p>
        </div>
      </div>
      <div className="container-x mt-20"><h2 className="font-serif text-[clamp(2rem,4vw,3.4rem)]">Books by Katherine Roy</h2>
        <div className="bibliography mt-12">{illustratorBibliography.map(group => <div key={group.title}><h3 className="font-serif text-2xl">{group.title}</h3><ul className="mt-5 space-y-3">{group.books.map(title => <li key={title}><em>{title}</em></li>)}</ul></div>)}</div>
        <p className="mt-10 text-sm text-ink-2">Book lists checked against the creators’ official websites. <Link href="/credits" className="underline underline-offset-4">Pictures and credits</Link>.</p>
      </div>
    </section>
  </>;
}
