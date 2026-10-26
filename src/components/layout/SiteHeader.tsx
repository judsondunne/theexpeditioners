"use client";

import Link from "next/link";
import { Wordmark } from "@/components/ui/Wordmark";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { navigation } from "@/content/site";
import { cn } from "@/lib/cn";
import { PurchaseButton } from "@/components/purchase/PurchaseButton";
import type { PurchaseBook } from "@/lib/purchase";

export function SiteHeader({ purchases }: { purchases: PurchaseBook[] }) {
  const pathname = usePathname();
  const purchase = purchases.find(book => pathname === book.href) ?? purchases[0];
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const menuButton = useRef<HTMLButtonElement>(null);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close the menu on navigation (adjusting state when a prop changes, per the React docs)
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setOpen(false);
  }

  // simple, robust dialog behaviour: lock scroll, Escape closes, focus moves in and back
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = panel.current?.querySelector<HTMLElement>("a, button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab" && panel.current) {
        const items = Array.from(panel.current.querySelectorAll<HTMLElement>("a, button"));
        const firstEl = items[0];
        const lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    const button = menuButton.current;
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      button?.focus();
    };
  }, [open]);

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,box-shadow] duration-300",
        scrolled ? "bg-paper shadow-[0_1px_0_rgba(29,25,21,0.14)]" : "bg-paper",
      )}
    >
      <a
        href="#main"
        className="label-lg absolute left-3 top-3 z-[60] -translate-y-20 bg-ink px-4 py-3 text-cream focus:translate-y-0"
      >
        Skip to content
      </a>
      <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
        <Link href="/" className="group flex items-baseline gap-2.5" aria-label="The Expeditioners — home">
          <Wordmark compact className="w-[10rem] sm:w-[12rem]" />
        </Link>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {navigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  className={cn(
                    "label-lg relative py-2 transition-colors hover:text-rust",
                    isCurrent(item.href) &&
                      "after:absolute after:inset-x-0 after:-bottom-0.5 after:h-px after:bg-current",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden sm:block"><PurchaseButton book={purchase} location="header" label={`Buy Book ${purchase.ordinal}`} /></div>
          <button
            ref={menuButton}
            type="button"
            className="label-lg inline-flex min-h-11 items-center gap-2 border border-ink/60 px-4 lg:hidden"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span aria-hidden="true" className="relative block h-2.5 w-4">
              <span
                className={cn(
                  "absolute left-0 top-0 h-px w-4 bg-current transition-transform",
                  open && "translate-y-[5px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute bottom-0 left-0 h-px w-4 bg-current transition-transform",
                  open && "-translate-y-[4px] -rotate-45",
                )}
              />
            </span>
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>

      <div
        id="site-menu"
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        hidden={!open}
        className="paper-grain fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 overflow-y-auto bg-paper lg:hidden"
      >
        <nav aria-label="Mobile" className="container-x relative z-10 flex min-h-full flex-col pb-10 pt-6">
          <ul className="border-t border-ink/20">
            <li className="border-b border-ink/20">
              <Link href="/" className="flex items-baseline justify-between py-5">
                <span className="font-serif text-[2rem] leading-none">Home</span>
                <span className="label opacity-60">00</span>
              </Link>
            </li>
            {navigation.map((item, i) => (
              <li key={item.href} className="border-b border-ink/20">
                <Link
                  href={item.href}
                  aria-current={isCurrent(item.href) ? "page" : undefined}
                  className="flex items-baseline justify-between py-5"
                >
                  <span className="font-serif text-[2rem] leading-none">{item.label}</span>
                  <span className="label opacity-60">{String(i + 1).padStart(2, "0")}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href={`${purchase.href}#buy`}
            className="label-lg mt-8 inline-flex min-h-13 items-center justify-center bg-ink px-6 py-4 text-cream"
          >
            Buy Book {purchase.ordinal} →
          </Link>
        </nav>
      </div>
    </header>
  );
}
