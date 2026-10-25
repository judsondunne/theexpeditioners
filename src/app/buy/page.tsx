import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { RetailerLinks } from "@/components/book/RetailerLinks";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { JsonLd } from "@/components/ui/JsonLd";
import { books, bookPath, currentEdition, ordinal } from "@/content/books";
import { pageMetadata } from "@/lib/seo";
import { bookListSchema } from "@/lib/schema";

export const metadata: Metadata = pageMetadata({ title: "Buy The Expeditioners Books | Official Bookstore Links", absoluteTitle: true, description: "Buy The Expeditioners trilogy by S. S. Taylor. Choose Bookshop.org, Barnes & Noble or Amazon for each paperback, find ISBNs, or locate a library copy.", path: "/buy" });

export default function BuyPage() {
  return <div className="paper-grain relative bg-paper">
    <JsonLd data={bookListSchema("/buy")} />
    <div className="container-x relative z-10 pt-8 pb-24">
      <Breadcrumbs items={[{name:"Buy the books",path:"/buy"}]} className="text-ink-2" />
      <header className="mt-8 max-w-3xl"><p className="label text-rust">The Expeditioners · S. S. Taylor</p><h1 className="mt-4 font-serif text-[clamp(2.6rem,6vw,5rem)] leading-[1.02]">Buy the books.</h1><p className="mt-4 max-w-xl text-xl leading-relaxed text-ink-2">Start with Book One, or choose your next adventure below.</p></header>
      <nav aria-label="Choose a book to buy" className="label mt-6 flex flex-wrap gap-5 text-ink-2">{books.map(book=><a key={book.slug} href={`#book-${book.number}`} className="underline underline-offset-4">Book {ordinal(book.number)}{book.number===1?" · Start here":""}</a>)}</nav>
      <ol className="mt-8 grid gap-8 lg:grid-cols-3">{books.map(book=>{
        const edition=currentEdition(book);
        return <li id={`book-${book.number}`} key={book.slug} className="border border-sepia/30 bg-paper/75 p-6 md:p-8">
          <div className="buy-card-heading flex items-center gap-5 min-h-36">
            <Link href={bookPath(book)} className="block w-20 shrink-0"><Image src={book.cover.src} alt={book.cover.alt} width={880} height={1360} sizes="5rem" className="w-full h-auto shadow-xl" /></Link>
            <div><p className="label text-rust">Book {ordinal(book.number)}{book.number===1?" · Begin here":""}</p><h2 className="mt-3 font-serif text-[1.65rem] leading-tight"><Link href={bookPath(book)}>{book.title}</Link></h2></div>
          </div>
          <p className="label mt-5 mb-5 text-ink-3">{edition.format} · {edition.pages} pages</p>
          <RetailerLinks links={book.purchase} bookSlug={book.slug} location="buy-page" featured />
          <p className="mt-6 text-sm leading-relaxed text-ink-2">Ask any bookshop to order it:<br /><span className="font-mono text-xs">ISBN {edition.isbn13}</span></p>
          <Link href={bookPath(book)} className="label mt-5 inline-block underline underline-offset-4 text-ink-2">Read about Book {ordinal(book.number)} →</Link>
        </li>;
      })}</ol>
      <div className="mt-8 grid gap-8 border-y border-sepia/25 py-8 md:grid-cols-3">
        <div><h2 className="font-serif text-2xl">One story. Three books.</h2><p className="mt-2 text-ink-2">Read in order: Drowned Man&rsquo;s Canyon, King Triton&rsquo;s Lair, then The Lost City of Maps.</p></div>
        <div><h2 className="font-serif text-2xl">Buying for a young reader?</h2><p className="mt-2 text-ink-2">Recommended for ages 10–14. <Link href="/journal/is-the-expeditioners-right-for-my-reader" className="underline underline-offset-4">Find out if the trilogy fits your reader.</Link></p></div>
        <div><h2 className="font-serif text-2xl">Ordering for a class?</h2><p className="mt-2 text-ink-2"><Link href="/educators#details" className="underline underline-offset-4">Find all three ISBNs and reading levels</Link>, plus discussion questions and printable activities.</p></div>
      </div>
      <p className="mt-6 text-sm text-ink-3">Orders, prices, stock and delivery are handled by each bookstore. The library links help you find a copy to borrow.</p>
    </div>
  </div>;
}
