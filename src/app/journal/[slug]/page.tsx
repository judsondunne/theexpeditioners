import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { BuyBook } from "@/components/purchase/BuyBook";
import { ShareButton } from "@/components/ui/ShareButton";
import { site, absoluteUrl } from "@/content/site";
import { ArrowLink } from "@/components/ui/ButtonLink";
import { JsonLd } from "@/components/ui/JsonLd";
import { bookOne } from "@/content/books";
import { getArticle, publishedArticles } from "@/content/journal";
import { pageMetadata } from "@/lib/seo";
import { articleSchema } from "@/lib/schema";

export const dynamicParams = false;

export function generateStaticParams() {
  return publishedArticles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/journal/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) return {};
  return pageMetadata({ title: a.title, description: a.description, path: `/journal/${a.slug}`, type: "article", published: a.published, modified: a.updated, image: { url: `/journal/${a.slug}/opengraph-image`, width: 1200, height: 630, alt: a.title } });
}

export default async function ArticlePage({ params }: PageProps<"/journal/[slug]">) {
  const { slug } = await params;
  const a = getArticle(slug);
  if (!a) notFound();
  const path = `/journal/${a.slug}`;
  return (
    <article className="paper-grain relative bg-paper">
      <JsonLd data={articleSchema({ title: a.title, description: a.description, path, published: a.published, updated: a.updated })} />
      <div className="container-x relative z-10 pb-24 pt-8 md:pb-32">
        <Breadcrumbs items={[{ name: "Journal", path: "/journal" }, { name: a.title, path }]} className="text-ink-2" />
        <header className="mx-auto mt-14 max-w-3xl text-center">
          <p className="label text-rust">{a.kicker}</p>
          <h1 className="mt-5 font-serif text-[clamp(2.4rem,5vw,4.4rem)] font-light leading-[1.04] tracking-[-0.015em] text-balance">
            {a.title}
          </h1>
          <p className="label mt-6 text-ink-3">
            <time dateTime={a.published}>
              {new Date(`${a.published}T12:00:00Z`).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", timeZone: "UTC" })}
            </time>{" "}
            · {a.readingMinutes} min read
          </p>
          <div className="mt-6"><ShareButton title={a.title} path={path} url={site.url.startsWith("http://localhost") ? undefined : absoluteUrl(path)} /></div>
        </header>
        <div className="prose-field mx-auto mt-14">{a.body()}</div>
        <aside className="mx-auto mt-20 flex max-w-[var(--measure)] flex-col gap-6 border-t border-ink/25 pt-10">
          <p className="font-serif text-[1.3rem] leading-snug">Ready to begin the expedition?</p>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
            <BuyBook book={bookOne} location="guide-end" label="Start with Book One" />
            <ArrowLink href="/journal">More from the journal</ArrowLink>
          </div>
        </aside>
        <nav aria-label="More reader guides" className="mx-auto mt-12 max-w-[var(--measure)] border-t border-ink/20 pt-7"><p className="label text-ink-3">Keep exploring</p><ul className="mt-4 space-y-4">{publishedArticles.filter(article=>article.slug !== a.slug).slice(0,3).map(article=><li key={article.slug}><Link href={`/journal/${article.slug}`} className="font-serif text-xl underline decoration-sepia/25 underline-offset-4 hover:text-rust">{article.title} →</Link></li>)}</ul></nav>
      </div>
    </article>
  );
}
