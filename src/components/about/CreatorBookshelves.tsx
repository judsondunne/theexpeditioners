import Image from "next/image";
import Link from "next/link";
import type { BibliographyCollection } from "@/content/bibliography";

/** Real covers on a shared shelf, with the same gentle lift and turn as the hero book. */
export function CreatorBookshelves({ title, id, collections }: { title: string; id: string; collections: BibliographyCollection[] }) {
  return <section aria-labelledby={id} className="creator-library paper-grain">
    <div className="container-x">
      <h2 id={id}>{title}</h2>
      {collections.map(collection => <section key={collection.title} aria-label={collection.title} className="creator-collection">
        <div className="creator-collection-heading"><h3>{collection.title}</h3></div>
        <div className="creator-bookcase">
          <ul className={`creator-shelf creator-shelf--${collection.books.length}`}>
            {collection.books.map(book => <li key={book.title}>
              <Link href={book.href} className="creator-book-link" aria-label={`Read about ${book.title}`}>
                <span className={`creator-book ${book.rendered ? "creator-book--rendered" : ""}`}>
                  <Image src={book.cover} alt={`${book.title} book cover`} width={book.width} height={book.height} sizes="(max-width: 600px) 40vw, (max-width: 1000px) 24vw, 220px" />
                </span>
                <span className="creator-book-label"><span>{book.title}</span>{book.credit && <span className="creator-book-credit">{book.credit}</span>}</span>
              </Link>
            </li>)}
          </ul>
        </div>
      </section>)}
    </div>
  </section>;
}
