"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ShelfBook, ShelfHandle } from "@/components/three/shelf-scene";
import { cn } from "@/lib/cn";

/**
 * A single book in WebGL that the reader can turn over by dragging. Until the
 * scene is ready (or if WebGL is unavailable) the real cover image is shown,
 * so the largest image on the page paints immediately.
 */
export function BookViewer({
  book,
  cover,
}: {
  book: ShelfBook;
  cover: { src: string; alt: string; priority?: boolean };
}) {
  const stageRef = useRef<HTMLDivElement>(null);
  const handle = useRef<ShelfHandle | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    let cancelled = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const start = async () => {
      try {
        const probe = document.createElement("canvas");
        if (!(probe.getContext("webgl2") || probe.getContext("webgl"))) return;
        const { createShelf } = await import("@/components/three/shelf-scene");
        if (cancelled) return;
        const css = getComputedStyle(document.documentElement);
        const font = (v: string, f: string) => css.getPropertyValue(v).trim() || f;
        handle.current = await createShelf({
          container: stage,
          books: [book],
          active: 0,
          single: true,
          reducedMotion: reduce,
          fonts: {
            display: font("--font-league", "Impact, sans-serif"),
            serif: font("--font-newsreader", "Georgia, serif"),
            mono: font("--font-plex-mono", "monospace"),
          },
          onReady: () => !cancelled && setReady(true),
        });
        if (cancelled) handle.current?.destroy();
      } catch {
        /* keep the static cover */
      }
    };
    // Defer until the browser is idle so the cover and text paint first.
    const idle = (cb: () => void) => {
      if (typeof window.requestIdleCallback === "function") window.requestIdleCallback(cb, { timeout: 1500 });
      else setTimeout(cb, 600);
    };
    idle(() => void start());
    return () => {
      cancelled = true;
      handle.current?.destroy();
      handle.current = null;
    };
  }, [book]);

  return (
    <div className="relative aspect-[4/5] w-full">
      <div
        className={cn(
          "absolute inset-[12%_18%] transition-opacity duration-700",
          ready ? "pointer-events-none opacity-0" : "opacity-100",
        )}
      >
        <Image
          src={cover.src}
          alt={cover.alt}
          fill
          loading={cover.priority ? "eager" : "lazy"}
          fetchPriority={cover.priority ? "high" : undefined}
          sizes="(min-width: 1024px) 26rem, 64vw"
          className="object-contain drop-shadow-[0_30px_40px_rgba(0,0,0,0.55)]"
        />
      </div>
      <div
        ref={stageRef}
        aria-hidden="true"
        className={cn("absolute inset-0 transition-opacity duration-700", ready ? "opacity-100" : "opacity-0")}
      />
      {ready && (
        <p className="label pointer-events-none absolute inset-x-0 bottom-1 text-center opacity-60">Drag to turn the book over</p>
      )}
    </div>
  );
}
