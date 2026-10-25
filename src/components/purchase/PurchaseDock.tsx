"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { PurchaseButton } from "@/components/purchase/PurchaseButton";
import type { PurchaseBook } from "@/lib/purchase";

/** Reappears only after the main purchase action leaves view; yields at the buying section and footer. */
export function PurchaseDock({ books }: { books: PurchaseBook[] }) {
  const pathname = usePathname();
  const book = books.find(book => pathname === book.href) ?? (pathname === "/" ? books[0] : null);
  return book ? <Dock key={pathname} book={book} home={pathname === "/"} /> : null;
}

function Dock({ book, home }: { book: PurchaseBook; home: boolean }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const primary = document.querySelector<HTMLElement>("[data-purchase-primary]");
    if (!primary) return;
    let primaryPassed = false;
    const blockers = new Set<Element>();
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.target === primary) primaryPassed = !entry.isIntersecting && entry.boundingClientRect.bottom < 0;
        else if (entry.isIntersecting) blockers.add(entry.target);
        else blockers.delete(entry.target);
      }
      setVisible(primaryPassed && blockers.size === 0);
    });
    observer.observe(primary);
    document.querySelectorAll("[data-purchase-destination], [data-site-footer]").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);
  return (
    <aside data-nosnippet className={`purchase-dock ${home ? "purchase-dock--home" : ""}`} aria-label={`Get Book ${book.ordinal}`} hidden={!visible}>
      <Image src={book.cover.src} alt="" width={880} height={1360} sizes="2rem" className="h-11 w-auto" />
      <div className="min-w-0 flex-1"><p className="label text-cream/55">Book {book.ordinal} · {book.format}</p><p className="truncate font-serif text-lg leading-tight">{book.title}</p></div>
      <PurchaseButton book={book} location="purchase-dock" tone="paper" label={home ? "Get Book One" : "Choose bookstore"} className="shrink-0" />
    </aside>
  );
}
