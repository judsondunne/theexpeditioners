"use client";

import { useEffect, useRef, useState } from "react";
import type { ReviewExcerpt } from "@/content/types";
import { cn } from "@/lib/cn";

/** Overlapping, gently staggered review transitions; pause for reading or focus. */
export function QuoteRotator({ quotes, tone = "paper" }: { quotes: ReviewExcerpt[]; tone?: "paper" | "night" }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useRef(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => { reduce.current = mq.matches; };
    update(); mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    if (paused || reduce.current || quotes.length < 2) return;
    const id = window.setTimeout(() => setIndex(i => (i + 1) % quotes.length), 8500);
    return () => window.clearTimeout(id);
  }, [index, paused, quotes.length]);
  return (
    <figure className={cn("review-carousel", tone === "night" && "review-carousel--night")}
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)} onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false); }}>
      <span className="review-carousel-mark" aria-hidden="true">“</span>
      <div className="review-carousel-slides">
        {quotes.map((quote, i) => <blockquote key={quote.id} aria-hidden={i !== index} data-active={i === index} className="review-carousel-slide">
          <p>“{quote.quote}”</p>
          <footer><a href={quote.url} target="_blank" rel="noopener" tabIndex={i === index ? 0 : -1}>— {quote.outlet}<span className="sr-only"> (read the review in a new tab)</span></a></footer>
        </blockquote>)}
      </div>
      <div className="review-carousel-pagination" role="group" aria-label="Choose a review">
        {quotes.map((quote, i) => <button key={quote.id} type="button" onClick={() => setIndex(i)} aria-label={`Show review ${i + 1} of ${quotes.length}: ${quote.outlet}`} aria-pressed={i === index}><span /></button>)}
      </div>
    </figure>
  );
}
