import type { Metadata } from "next";
import Image from "next/image";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ArrowLink } from "@/components/ui/ButtonLink";
import { JsonLd } from "@/components/ui/JsonLd";
import { CreatorBookshelves } from "@/components/about/CreatorBookshelves";
import { author, illustrator } from "@/content/people";
import { sarahLibrary, katherineLibrary } from "@/content/bibliography";
import { pageMetadata } from "@/lib/seo";
import { personSchema } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({
  title: "About S. S. Taylor and Katherine Roy",
  description: "Meet Sarah Stewart Taylor and Katherine Roy, the author and illustrator of The Expeditioners, and explore their books.",
  path: "/about",
});

export default function AboutPage() {
  return <>
    <JsonLd data={[personSchema("author"), personSchema("illustrator")]} />
    <header className="paper-grain bg-paper">
      <div className="container-x pt-8 pb-12 md:pb-16">
        <Breadcrumbs items={[{ name: "About", path: "/about" }]} className="text-ink-2" />
        <h1 className="about-page-title">The author &amp; the illustrator</h1>
      </div>
    </header>

    <section id="author" aria-labelledby="author-title" className="creator-profile paper-grain">
      <div className="container-x creator-profile-layout">
        <div className="creator-portrait"><Image src="/images/people/sarah-stewart-taylor.webp" alt="Sarah Stewart Taylor" width={2316} height={3088} priority sizes="(min-width: 1024px) 36vw, (min-width: 700px) 40vw, 88vw" /></div>
        <div className="creator-biography">
          <h2 id="author-title">Sarah Stewart Taylor</h2>
          <div className="prose-field">{author.bio.paragraphs.map(p => <p key={p}>{p}</p>)}</div>
          <ul className="creator-links">{author.links.map(link => <li key={link.url}><a href={link.url} target="_blank" rel="noopener">{link.label} ↗<span className="sr-only"> (opens in a new tab)</span></a></li>)}</ul>
        </div>
      </div>
    </section>
    <CreatorBookshelves title="Books by Sarah Stewart Taylor" id="sarah-books" collections={sarahLibrary} />

    <section id="illustrator" aria-labelledby="illustrator-title" className="creator-profile paper-grain">
      <div className="container-x creator-profile-layout">
        <div className="creator-portrait"><Image src="/images/people/katherine-roy.webp" alt="Katherine Roy, photographed by Tim Stout" width={1500} height={2151} sizes="(min-width: 1024px) 36vw, (min-width: 700px) 40vw, 88vw" /></div>
        <div className="creator-biography"><h2 id="illustrator-title">Katherine Roy</h2>
          <div className="prose-field">{illustrator.bio.paragraphs.map(p => <p key={p}>{p}</p>)}</div>
          <div className="creator-links"><a href="https://www.katherineroy.com/" target="_blank" rel="noopener">katherineroy.com ↗</a><ArrowLink href="/explore#art">Her Expeditioners drawings</ArrowLink></div>
        </div>
      </div>
    </section>
    <CreatorBookshelves title="Books by Katherine Roy" id="katherine-books" collections={katherineLibrary} />
  </>;
}
