"use client";

import { useEffect, useRef, useState } from "react";
import type { ReviewExcerpt } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * Review quotes in a framed plate, with dash pagination. Auto-advances slowly,
 * pauses on hover or keyboard focus, and doesn't move at all for people who
 * prefer reduced motion. All quotes are in the HTML for crawlers.
 */
export function QuoteRotator({ quotes, tone = "paper" }: { quotes: ReviewExcerpt[]; tone?: "paper" | "night" }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useRef(false);

  useEffect(() => {
    reduce.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  useEffect(() => {
    if (paused || reduce.current || quotes.length < 2) return;
    const id = window.setTimeout(() => setIndex((i) => (i + 1) % quotes.length), 6500);
    return () => window.clearTimeout(id);
  }, [index, paused, quotes.length]);

  const night = tone === "night";

  return (
    <figure
      className={cn("review-plate relative border p-1.5", night ? "border-cream/30" : "border-sepia/50 bg-[#352026] text-cream")}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className={cn("border px-5 pb-5 pt-4", night ? "border-cream/20" : "border-cream/25")}>
        <div className="flex items-center justify-between gap-3">
          <span className="plate-caps text-[0.9rem] opacity-80">Critical acclaim</span>
          <div className="flex items-center gap-1.5" role="group" aria-label="Choose a review">
            {quotes.map((q, i) => (
              <button
                key={q.id}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show review ${i + 1} of ${quotes.length}: ${q.outlet}`}
                aria-pressed={i === index}
                className="group flex h-6 items-center"
              >
                <span
                  className={cn(
                    "block h-[2px] w-6 transition-colors duration-300",
                    i === index
                      ? night
                        ? "bg-cream"
                        : "bg-cream"
                      : night
                        ? "bg-cream/30 group-hover:bg-cream/60"
                        : "bg-cream/25 group-hover:bg-cream/50",
                  )}
                />
              </button>
            ))}
          </div>
        </div>
        <div className="relative mt-4 grid">
          {quotes.map((q, i) => (
            <blockquote
              key={q.id}
              aria-hidden={i !== index}
              className={cn(
                "col-start-1 row-start-1 transition-[opacity,transform] duration-700 ease-out",
                i === index ? "opacity-100" : "pointer-events-none translate-y-1 opacity-0",
              )}
            >
              <p className="font-serif text-[clamp(1.4rem,1.8vw,1.8rem)] leading-[1.16] text-pretty">
                <span aria-hidden="true">“</span>
                {q.quote}
                <span aria-hidden="true">”</span>
              </p>
              <footer className="label mt-4 opacity-75">— {q.outlet}</footer>
            </blockquote>
          ))}
        </div>
      </div>
    </figure>
  );
}
