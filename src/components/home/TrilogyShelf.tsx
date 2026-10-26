"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PurchaseButton } from "@/components/purchase/PurchaseButton";
import type { PurchaseBook } from "@/lib/purchase";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import type { ShelfBook, ShelfHandle } from "@/components/three/shelf-scene";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

export interface ShelfEntry {
  slug: string;
  number: 1 | 2 | 3;
  ordinal: string;
  title: string;
  fullTitle: string;
  hook: string;
  summary: string;
  href: string;
  edition: string;
  praise?: { quote: string; outlet: string };
  secondPraise?: { quote: string; outlet: string };
  cover: { src: string; alt: string };
  palette: { deep: string; mid: string; light: string; accent: string };
  shelf: ShelfBook;
  purchase: PurchaseBook;
}

/**
 * The trilogy as three real paperbacks. Select a spine (or use the tabs) and
 * that book slides off the stack and turns to face you; drag it to see the
 * back cover. The tabs and panels are plain HTML, so the section works — and
 * reads — without WebGL or JavaScript.
 */
export function TrilogyShelf({ entries }: { entries: ShelfEntry[] }) {
  const router = useRouter();
  const [active, setActive] = useState(0);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "failed">("idle");
  const stageRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const handle = useRef<ShelfHandle | null>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const interacted = useRef(false);

  const choose = useCallback((i: number, via: string) => {
    setActive(i);
    if (!interacted.current) {
      interacted.current = true;
      track("shelf_interact", { via });
    }
  }, []);

  // Load three.js only when the shelf approaches the viewport.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let cancelled = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = async () => {
      setStatus("loading");
      try {
        const probe = document.createElement("canvas");
        const gl = probe.getContext("webgl2") || probe.getContext("webgl");
        if (!gl) throw new Error("WebGL unavailable");
        const { createShelf } = await import("@/components/three/shelf-scene");
        if (cancelled) return;
        const css = getComputedStyle(document.documentElement);
        const font = (v: string, f: string) => css.getPropertyValue(v).trim() || f;
        handle.current = await createShelf({
          container: stage,
          books: entries.map((e) => e.shelf),
          active: 0,
          reducedMotion: reduce,
          fonts: {
            display: font("--font-league", "Impact, sans-serif"),
            serif: font("--font-newsreader", "Georgia, serif"),
            mono: font("--font-newsreader", "Georgia, serif"),
          },
          onActivateBook: (i) => choose(i, "canvas"),
          onSelect: (i) => {
            track("cta_click", { location: "shelf", target: entries[i].slug });
            router.push(entries[i].href);
          },
          onReady: () => !cancelled && setStatus("ready"),
        });
        if (cancelled) handle.current?.destroy();
      } catch {
        if (!cancelled) setStatus("failed");
      }
    };
    const io = new IntersectionObserver(
      (items) => {
        if (items.some((i) => i.isIntersecting)) {
          io.disconnect();
          void start();
        }
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(stage);
    return () => {
      cancelled = true;
      io.disconnect();
      handle.current?.destroy();
      handle.current = null;
    };
  }, [entries, router, choose]);

  // Pause rendering when the section is off-screen.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver((items) => handle.current?.setVisible(items[0]?.isIntersecting ?? false), {
      rootMargin: "100px 0px",
    });
    io.observe(el);
    return () => io.disconnect();
  }, [status]);

  useEffect(() => {
    handle.current?.setActive(active);
  }, [active, status]);

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = entries.length;
    let next = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") next = (i + 1) % n;
    if (e.key === "ArrowLeft" || e.key === "ArrowUp") next = (i - 1 + n) % n;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = n - 1;
    if (next >= 0) {
      e.preventDefault();
      choose(next, "keyboard");
      tabRefs.current[next]?.focus();
    }
  };

  const book = entries[active];

  return (
    <section
      ref={sectionRef}
      id="trilogy"
      aria-labelledby="trilogy-title"
      className="on-night relative isolate overflow-hidden text-cream transition-[background-color] duration-[1100ms] ease-out"
      style={{ backgroundColor: book.palette.deep }}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <Image
          src="/images/maps/rhumb-chart-1751.webp"
          alt=""
          fill
          sizes="100vw"
          quality={45}
          className="object-cover opacity-[0.07] invert"
        />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_62%_55%,rgba(255,240,220,0.09),transparent_60%)]" />
        <div className="paper-grain on-night absolute inset-0" />
      </div>

      <div className="container-x pb-20 pt-20 md:pb-24 md:pt-24">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="label flex items-center gap-3 text-cream/60">
              <span aria-hidden="true" className="inline-block h-px w-6 bg-current" />
              The trilogy · read in order
            </p>
            <h2 id="trilogy-title" className="mt-4 font-serif text-[clamp(2.2rem,4.2vw,3.9rem)] font-light leading-[1.02] tracking-[-0.015em]">
              The Expeditioners trilogy
            </h2>
          </div>
        </div>

        <div className="mt-8 grid gap-10 lg:mt-10 lg:grid-cols-12 lg:gap-12">
          {/* The stage */}
          <div className="relative lg:col-span-8">
            <div
              ref={stageRef}
              className={cn(
                "relative h-[min(72svh,36rem)] w-full transition-opacity duration-700 lg:h-[min(66vh,40rem)]",
                status === "ready" ? "opacity-100" : "opacity-0",
              )}
            />
            {/* Static stand-in until (or instead of) WebGL */}
            {status !== "ready" && (
              <div className="absolute inset-0 flex items-center justify-center gap-[4%] px-[4%]">
                {entries.map((e, i) => (
                  <button
                    key={e.slug}
                    type="button"
                    tabIndex={-1}
                    aria-hidden="true"
                    onClick={() => choose(i, "fallback")}
                    className={cn(
                      "relative w-[28%] max-w-[13rem] transition-[transform,opacity] duration-500",
                      i === active ? "-translate-y-3 opacity-100" : "opacity-55 hover:opacity-90 hover:scale-[1.035]",
                    )}
                  >
                    <Image
                      src={e.cover.src}
                      alt=""
                      width={880}
                      height={1360}
                      sizes="(min-width: 1024px) 13rem, 28vw"
                      className="h-auto w-full shadow-[0_30px_50px_-20px_rgba(0,0,0,0.8)]"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Index + details */}
          <div className="lg:col-span-4 lg:pt-4">


            <div className="relative mt-8 grid">
              {entries.map((e, i) => (
                <div
                  key={e.slug}
                  role="tabpanel"
                  id={`shelf-panel-${e.slug}`}
                  aria-labelledby={`shelf-tab-${e.slug}`}
                  hidden={i !== active}
                  className="col-start-1 row-start-1"
                >
                  <p className="label" style={{ color: e.palette.accent }}>
                    Book {e.ordinal} of three
                  </p>
                  <h3 className="mt-3 font-serif text-[clamp(1.7rem,2.4vw,2.2rem)] leading-[1.1]">{e.fullTitle}</h3>
                  <p className="mt-4 font-serif text-[1.12rem] leading-relaxed text-cream/85">{e.hook}</p>
                  {e.praise && (
                    <blockquote className="mt-6 border-y border-cream/20 py-5">
                      <p className="font-serif text-[1.05rem] italic text-cream/85">“{e.praise.quote}”</p>
                      <footer className="label mt-2 text-cream/55">— {e.praise.outlet}</footer>
                    </blockquote>
                  )}
                  {e.secondPraise && <blockquote className="mt-5"><p className="font-serif text-lg leading-snug text-cream/85">“{e.secondPraise.quote}”</p><footer className="label mt-2 text-cream/55">— {e.secondPraise.outlet}</footer></blockquote>}
                  <p className="label mt-6 text-cream/50">{e.edition}</p>
                  <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
                    <PurchaseButton book={e.purchase} location="trilogy-shelf" tone="paper" />
                    <Link
                      href={e.href}
                      className="label-lg text-cream/80 underline decoration-cream/30 underline-offset-[6px] hover:text-cream"
                    >
                      About the book
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <div role="tablist" aria-label="The Expeditioners books" aria-orientation="vertical" className="mt-10 border-t border-cream/20">
              {entries.map((e, i) => (
                <button
                  key={e.slug}
                  ref={(n) => {
                    tabRefs.current[i] = n;
                  }}
                  role="tab"
                  id={`shelf-tab-${e.slug}`}
                  aria-selected={i === active}
                  aria-controls={`shelf-panel-${e.slug}`}
                  tabIndex={i === active ? 0 : -1}
                  onClick={() => choose(i, "tab")}
                  onKeyDown={(ev) => onTabKey(ev, i)}
                  className={cn(
                    "group flex w-full items-baseline gap-4 border-b border-cream/20 py-4 text-left transition-colors",
                    i === active ? "text-cream" : "text-cream/50 hover:text-cream/85",
                  )}
                >
                  <span className="label w-16 shrink-0">Book {e.ordinal}</span>
                  <span className="font-serif text-[1.15rem] leading-snug">{e.title}</span>
                  <span
                    aria-hidden="true"
                    className={cn("ml-auto transition-opacity", i === active ? "opacity-100" : "opacity-0")}
                    style={{ color: e.palette.accent }}
                  >
                    ●
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
