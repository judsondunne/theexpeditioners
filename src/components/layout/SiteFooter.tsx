import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";
import { NewsletterSignup } from "@/components/layout/NewsletterSignup";
import { Engraving } from "@/components/ui/Engraving";
import { books, bookPath, ordinal } from "@/content/books";
import type { SpotName } from "@/content/engravings";
import { site } from "@/content/site";

const lineup: { name: SpotName; w: string }[] = [
  { name: "compass", w: "w-[3.2rem] sm:w-[4rem]" },
  { name: "pocketwatch", w: "w-[2.6rem] sm:w-[3.4rem]" },
  { name: "gear", w: "w-[3.8rem] sm:w-[5rem]" },
  { name: "airship", w: "w-[6rem] sm:w-[8rem]" },
  { name: "field-glasses", w: "w-[3.3rem] sm:w-[4.5rem]" },
  { name: "globe", w: "w-[3rem] sm:w-[3.8rem]" },
  { name: "canoe", w: "w-[4.5rem] sm:w-[6rem]" },
  { name: "hourglass", w: "w-[2.5rem] sm:w-[3.2rem]" },
  { name: "typewriter", w: "w-[3.5rem] sm:w-[4.5rem]" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer data-site-footer className="paper-grain relative mt-0 bg-paper text-ink">
      {/* the expedition, lined up on the baseline */}
      <div aria-hidden="true" className="container-x relative z-10 overflow-hidden">
        <div className="footer-engraving-lineup">
          {lineup.map((f) => (
            <Engraving
              key={f.name}
              name={f.name}
              className={`${f.w} shrink-0`}
            />
          ))}
        </div>
        <div className="h-px bg-ink/60" />
        <div className="mt-[3px] h-px bg-ink/25" />
      </div>

      <div className="container-x relative z-10 grid gap-12 pb-10 pt-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <Link href="/" className="block max-w-[24rem]" aria-label="The Expeditioners — home"><Wordmark className="w-full" /></Link>
          <p className="mt-4 max-w-sm font-serif text-[1.15rem] italic leading-snug text-ink-2">{site.tagline}</p>
          <p className="label mt-5 text-ink-2">
            By S. S. Taylor · Illustrated by Katherine Roy
          </p>
          <div className="mt-8 max-w-sm">
            <NewsletterSignup />
          </div>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-7">
          <div>
            <h2 className="label text-ink-3">The trilogy</h2>
            <ul className="mt-4 space-y-3">
              {books.map((b) => (
                <li key={b.slug}>
                  <Link href={bookPath(b)} className="group block leading-snug hover:text-rust">
                    <span className="label block text-ink-3 group-hover:text-rust">Book {ordinal(b.number)}</span>
                    <span className="font-serif text-[1.02rem]">{b.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="label text-ink-3">The site</h2>
            <ul className="mt-4 space-y-2.5 font-serif text-[1.05rem]">
              <li><Link className="hover:text-rust" href="/buy">Buy the books</Link></li>
              <li><Link className="hover:text-rust" href="/books">The books in order</Link></li>
              <li><Link className="hover:text-rust" href="/explore">Explore the world</Link></li>
              <li><Link className="hover:text-rust" href="/educators">For educators</Link></li>
              <li><Link className="hover:text-rust" href="/about">About the author</Link></li>
              <li><Link className="hover:text-rust" href="/journal">Journal</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="label text-ink-3">Elsewhere</h2>
            <ul className="mt-4 space-y-2.5 font-serif text-[1.05rem]">
              <li>
                <a className="hover:text-rust" href="https://www.sarahstewarttaylor.com/" rel="noopener" target="_blank">
                  Sarah Stewart Taylor<span className="sr-only"> (opens in a new tab)</span> ↗
                </a>
              </li>
              <li><Link className="hover:text-rust" href="/privacy">Privacy</Link></li>
              <li><Link className="hover:text-rust" href="/credits">Image credits</Link></li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="container-x relative z-10 flex flex-col gap-3 border-t border-ink/20 py-6 text-ink-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="label">© {year} S. S. Taylor. All rights reserved.</p>
        <p className="label">Cover art by Katherine Roy · Engravings &amp; maps: public domain</p>
      </div>
    </footer>
  );
}
