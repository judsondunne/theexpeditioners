"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { RetailerLinks } from "@/components/book/RetailerLinks";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import type { PurchaseBook } from "@/lib/purchase";

export function PurchaseButton({ book, location, label, tone = "ink", className, primary = false }: {
  book: PurchaseBook;
  location: string;
  label?: string;
  tone?: "ink" | "paper" | "rust";
  className?: string;
  primary?: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const previousOverflow = useRef<string | null>(null);
  const [open, setOpen] = useState(false);
  const id = useId();
  const restoreScroll = () => {
    if (previousOverflow.current !== null) {
      document.body.style.overflow = previousOverflow.current;
      previousOverflow.current = null;
    }
  };
  const closeDialog = () => { restoreScroll();setOpen(false);dialog.current?.close(); };
  useEffect(() => () => {
    if (previousOverflow.current !== null) document.body.style.overflow = previousOverflow.current;
  }, []);
  const shops = book.links.filter(link => link.retailer !== "worldcat");
  const libraries = book.links.filter(link => link.retailer === "worldcat");

  return (
    <>
      <a href={`${book.href}#buy`} aria-haspopup="dialog" aria-controls={id} aria-expanded={open}
        data-purchase-primary={primary || undefined}
        data-purchase-location={location}
        className={cn("purchase-button group label-lg inline-flex min-h-12 items-center justify-center gap-3 px-6 transition-colors", tone === "paper" ? "bg-cream text-ink hover:bg-white" : tone === "rust" ? "bg-rust text-cream hover:bg-rust-2" : "bg-ink text-cream hover:bg-rust", className)}
        onClick={event => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !dialog.current?.showModal) return;
          event.preventDefault();
          dialog.current.showModal();
          previousOverflow.current = document.body.style.overflow;
          document.body.style.overflow = "hidden";
          setOpen(true);
          track("purchase_open", { book: book.slug, location });
        }}>
        {label ?? `Buy Book ${book.ordinal}`}<span aria-hidden="true" className="transition-transform group-hover:translate-x-1">→</span>
      </a>
      <dialog data-nosnippet ref={dialog} id={id} aria-labelledby={`${id}-title`} className="purchase-dialog bg-paper text-ink"
        onCancel={event => { event.preventDefault();closeDialog(); }}
        onClose={() => { if (!dialog.current?.open) { restoreScroll();setOpen(false); } }}
        onClick={event => {
          if (event.target !== dialog.current) return;
          const rect = dialog.current.getBoundingClientRect();
          if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) closeDialog();
        }}>
        <button type="button" className="purchase-dialog-close label" aria-label="Close bookstore chooser" onClick={closeDialog}>Close <span aria-hidden="true">×</span></button>
        <div className="purchase-dialog-heading">
          <Image src={book.cover.src} alt={book.cover.alt} width={880} height={1360} sizes="5rem" className="h-auto w-20 shadow-lg" />
          <div><p className="label text-rust">Book {book.ordinal} · {book.format}</p><h2 id={`${id}-title`} className="mt-2 font-serif text-[clamp(1.6rem,4vw,2.1rem)] leading-tight">{book.title}</h2></div>
        </div>
        <p className="mt-6 mb-4 text-xl">Choose your bookstore.</p>
        <RetailerLinks links={shops} bookSlug={book.slug} location={location} featured />
        {libraries.length > 0 && <details className="mt-5"><summary className="label cursor-pointer py-3 text-ink-2">Find it at a library</summary><RetailerLinks links={libraries} bookSlug={book.slug} location={location} /></details>}
        <div className="purchase-dialog-footer">
          <Link href={book.href} onClick={closeDialog} className="underline underline-offset-4">About this book</Link>
          <Link href="/buy" onClick={closeDialog} className="underline underline-offset-4">All three books</Link>
        </div>
        <p className="mt-4 text-sm leading-snug text-ink-3">Your purchase takes place at the bookstore. Prices and delivery options are shown there.</p>
      </dialog>
    </>
  );
}
