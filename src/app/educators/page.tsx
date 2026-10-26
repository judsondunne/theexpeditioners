import type { Metadata } from "next";
import Link from "next/link";
import { DownloadLink } from "@/components/educators/DownloadLink";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ArrowLink } from "@/components/ui/ButtonLink";
import { Engraving } from "@/components/ui/Engraving";
import { books, bookPath, currentEdition, ordinal } from "@/content/books";
import { activities, discussion, themes } from "@/content/educators";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Resources for Educators and Librarians",
  description:
    "Teaching The Expeditioners: ages, grades, Lexile measures and ISBNs, classroom themes, spoiler-free discussion questions and printable map-making activities for the middle-grade adventure trilogy.",
  path: "/educators",
});

function isbn(i?: string) {
  return i ? `${i.slice(0, 3)}-${i.slice(3, 4)}-${i.slice(4, 11)}-${i.slice(11, 12)}-${i.slice(12)}` : "—";
}

export default function EducatorsPage() {
  return (
    <>
      <header className="paper-grain relative overflow-hidden bg-paper">
        <div className="container-x relative z-10 pb-16 pt-8 md:pb-24">
          <Breadcrumbs items={[{ name: "Educators", path: "/educators" }]} className="text-ink-2" />
          <div className="mt-14 grid items-end gap-10 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <p className="label text-ink-2">For teachers, librarians &amp; reading groups</p>
              <h1 className="display mt-4 text-[clamp(3.4rem,9vw,8rem)]">The Expeditioners in the classroom</h1>
            </div>
            <p className="font-serif text-[1.2rem] leading-relaxed text-ink-2 lg:col-span-4">
              Book details for ordering, themes worth discussing, questions that don&rsquo;t spoil the endings, and
              activities that get students making maps of their own.
            </p>
          </div>
          <nav aria-label="On this page" className="mt-12">
            <ul className="label flex flex-wrap gap-x-6 gap-y-3 text-ink-2">
              {[
                ["#details", "Book details"],
                ["#themes", "Themes"],
                ["#questions", "Discussion questions"],
                ["#activities", "Activities"],
                ["#contact", "Contact"],
              ].map(([href, label]) => (
                <li key={href}>
                  <a href={href} className="underline decoration-ink/30 underline-offset-[6px] hover:text-rust hover:decoration-rust">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <Engraving name="surveyor-2" className="absolute bottom-0 right-[6%] hidden w-28 text-ink/25 lg:block" />
      </header>

      {/* Bibliographic details */}
      <section id="details" aria-labelledby="details-title" className="scroll-mt-20 bg-paper-2 py-16 md:py-24">
        <div className="container-x">
          <h2 id="details-title" className="font-serif text-[clamp(1.9rem,3vw,2.8rem)] font-light leading-[1.08]">
            At a glance
          </h2>
          <p className="mt-3 max-w-2xl font-serif text-[1.08rem] text-ink-2">
            Recommended for ages 10–14 (Kirkus Reviews) and grades 4–7 (School Library Journal). Read in order; each book
            continues the story.
          </p>
          <div className="mt-10 overflow-x-auto border border-ink/30">
            <table className="w-full min-w-[44rem] text-left">
              <caption className="sr-only">The Expeditioners: current editions and reading levels</caption>
              <thead className="bg-paper">
                <tr className="label text-ink-3">
                  <th scope="col" className="px-5 py-4 font-medium">#</th>
                  <th scope="col" className="px-5 py-4 font-medium">Title</th>
                  <th scope="col" className="px-5 py-4 font-medium">Current edition</th>
                  <th scope="col" className="px-5 py-4 font-medium">ISBN</th>
                  <th scope="col" className="px-5 py-4 font-medium">Pages</th>
                  <th scope="col" className="px-5 py-4 font-medium">Lexile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/15 font-serif">
                {books.map((b) => {
                  const e = currentEdition(b);
                  return (
                    <tr key={b.slug} className="bg-paper/60">
                      <td className="px-5 py-4 align-top font-mono text-[0.9rem]">{b.number}</td>
                      <th scope="row" className="px-5 py-4 align-top font-normal">
                        <Link href={bookPath(b)} className="underline decoration-ink/25 underline-offset-4 hover:text-rust">
                          {b.fullTitle}
                        </Link>
                      </th>
                      <td className="px-5 py-4 align-top">
                        Paperback, {e.publisher}, {e.published.slice(0, 4)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 align-top font-mono text-[0.88rem]">{isbn(e.isbn13)}</td>
                      <td className="px-5 py-4 align-top">{e.pages ?? "—"}</td>
                      <td className="px-5 py-4 align-top">{b.readingLevel?.label.replace("Lexile ", "") ?? "Not yet listed"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[0.92rem] italic text-ink-3">
            Ebook editions of all three books are available to libraries through OverDrive.
          </p>
        </div>
      </section>

      {/* Themes */}
      <section id="themes" aria-labelledby="themes-title" className="paper-grain relative scroll-mt-20 bg-paper py-20 md:py-28">
        <div className="container-x relative z-10 grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="label text-ink-2">Why it works in class</p>
            <h2 id="themes-title" className="mt-4 font-serif text-[clamp(1.9rem,3vw,2.8rem)] font-light leading-[1.08]">
              Five themes to explore
            </h2>
          </div>
          <ol className="divide-y divide-ink/15 border-y border-ink/15 lg:col-span-8">
            {themes.map((t, i) => (
              <li key={t.title} className="grid gap-3 py-7 sm:grid-cols-[3rem_1fr]">
                <span className="label pt-1.5 text-rust">{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <h3 className="font-serif text-[1.45rem] leading-snug">{t.title}</h3>
                  <p className="mt-2 font-serif text-[1.08rem] leading-relaxed text-ink-2">{t.text}</p>

                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Questions */}
      <section id="questions" aria-labelledby="questions-title" className="on-night scroll-mt-20 bg-night py-20 text-cream md:py-28">
        <div className="container-x">
          <p className="label text-cream/60">For book groups &amp; classrooms</p>
          <h2 id="questions-title" className="mt-4 font-serif text-[clamp(1.9rem,3vw,2.8rem)] font-light leading-[1.08]">
            Discussion questions
          </h2>
          <p className="mt-3 max-w-2xl font-serif text-[1.05rem] text-cream/70">
            Spoiler-free questions to get readers talking, before, during or after reading.
          </p>
          <div className="mt-12 grid gap-12 lg:grid-cols-3">
            {discussion.map((d) => {
              const b = books.find((x) => x.slug === d.book)!;
              return (
                <div key={d.book}>
                  <p className="label text-signal">Book {ordinal(b.number)}</p>
                  <h3 className="mt-2 font-serif text-[1.4rem] leading-snug">{b.title}</h3>
                  <ol className="mt-6 space-y-5 border-t border-cream/20 pt-6">
                    {d.questions.map((q, i) => (
                      <li key={q} className="grid grid-cols-[1.8rem_1fr] gap-2 font-serif text-[1.05rem] leading-relaxed text-cream/85">
                        <span className="label pt-1 text-cream/50">{i + 1}.</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Activities */}
      <section id="activities" aria-labelledby="activities-title" className="paper-grain relative scroll-mt-20 bg-paper py-20 md:py-28">
        <div className="container-x relative z-10">
          <p className="label text-ink-2">Hands-on</p>
          <h2 id="activities-title" className="mt-4 font-serif text-[clamp(1.9rem,3vw,2.8rem)] font-light leading-[1.08]">
            Activities for young explorers
          </h2>
          <div className="mt-12 grid gap-px border border-ink/30 bg-ink/30 md:grid-cols-2">
            {activities.map((a, i) => (
              <article key={a.id} id={a.id} className="flex flex-col bg-paper p-8 md:p-10">
                <div className="flex items-baseline justify-between gap-4">
                  <p className="label text-rust">Activity {String(i + 1).padStart(2, "0")}</p>
                  <p className="label text-ink-3">{a.time}</p>
                </div>
                <h3 className="mt-4 font-serif text-[1.7rem] leading-tight">{a.title}</h3>
                <p className="mt-3 font-serif text-[1.06rem] leading-relaxed text-ink-2">{a.summary}</p>
                <ol className="mt-6 list-decimal space-y-2.5 pl-5 font-serif text-[1.02rem] leading-relaxed marker:text-rust">
                  {a.steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ol>
                <div className="mt-auto pt-8">
                  {a.download && <DownloadLink href={a.download.href} label={a.download.label} meta={a.download.size} id={a.id} />}
                  <p className="mt-4 text-[0.88rem] italic text-ink-3">{a.origin}</p>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-6 max-w-3xl text-[0.92rem] italic text-ink-3">
            These activities are offered freely for classroom use. We don&rsquo;t claim alignment with any particular curriculum
            standards; adapt them to suit your students.
          </p>
        </div>
      </section>

      <section id="contact" aria-labelledby="contact-title" className="scroll-mt-20 bg-paper-2 py-16 md:py-20">
        <div className="container-x flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="max-w-2xl">
            <h2 id="contact-title" className="font-serif text-[clamp(1.6rem,2.6vw,2.2rem)] leading-snug">
              Questions about the books, or about school visits?
            </h2>
            <p className="mt-3 font-serif text-[1.08rem] text-ink-2">
              Get in touch with Sarah Stewart Taylor through her author website.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-7 gap-y-4">
            <a
              href="https://www.sarahstewarttaylor.com/contact"
              target="_blank"
              rel="noopener"
              className="label-lg inline-flex min-h-12 items-center gap-3 bg-ink px-6 text-cream hover:bg-rust"
            >
              Contact the author ↗<span className="sr-only"> (opens in a new tab)</span>
            </a>
            <ArrowLink href="/books">See all three books</ArrowLink>
          </div>
        </div>
      </section>
    </>
  );
}
