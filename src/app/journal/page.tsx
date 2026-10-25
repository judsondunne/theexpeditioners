import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { publishedArticles } from "@/content/journal";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Reader Guides & Code-Breaking Activities",
  description: "Guides and behind-the-scenes notes on The Expeditioners trilogy, for readers, parents and teachers.",
  path: "/journal",
});

export default function JournalPage() {
  return (
    <div className="paper-grain relative bg-paper">
      <div className="container-x relative z-10 pb-24 pt-8 md:pb-32">
        <Breadcrumbs items={[{ name: "Journal", path: "/journal" }]} className="text-ink-2" />
        <header className="mt-14 grid items-end gap-8 lg:grid-cols-12">
          <h1 className="display text-[clamp(3.6rem,10vw,9rem)] lg:col-span-7">Journal</h1>
          <p className="max-w-md font-serif text-[1.2rem] leading-relaxed text-ink-2 lg:col-span-5">
            Notes from the expedition: guides for parents and teachers, and the story behind the books.
          </p>
        </header>
        <ol className="mt-16 border-t border-ink/30">
          {publishedArticles.map((a, i) => (
            <li key={a.slug} className="border-b border-ink/20">
              <Link href={`/journal/${a.slug}`} className="group grid gap-4 py-10 md:grid-cols-12 md:items-baseline">
                <span className="label text-ink-3 md:col-span-2">No. {String(i + 1).padStart(2, "0")}</span>
                <span className="md:col-span-7">
                  <span className="label block text-rust">{a.kicker}</span>
                  <span className="mt-2 block font-serif text-[clamp(1.7rem,3vw,2.6rem)] font-light leading-[1.1] group-hover:underline group-hover:decoration-1 group-hover:underline-offset-[6px]">
                    {a.title}
                  </span>
                  <span className="mt-3 block font-serif text-[1.05rem] leading-relaxed text-ink-2">{a.description}</span>
                </span>
                <span className="label text-ink-3 md:col-span-3 md:text-right">{a.readingMinutes} min read →</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
