"use client";

import { Fragment, useEffect, useRef } from "react";
import { Engraving } from "@/components/ui/Engraving";
import { observeMotionVisibility } from "@/lib/motion";
import type { SpotName } from "@/content/engravings";



export type InkToken = string | { spot: SpotName; w: string };

/**
 * A large editorial statement that inks in, word by word, as it scrolls
 * through the viewport — with small engravings set inline like printer's
 * ornaments. Used once on the homepage.
 */
export function InkStatement({ tokens }: { tokens: InkToken[] }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      el.style.setProperty("--lp", "1");
      return;
    }
    let raf = 0;
    let near = true;
    let last = -1;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.82 - r.top) / (r.height + vh * 0.2)));
      if (p !== last) { el.style.setProperty("--lp", p.toFixed(4)); last = p; }
    };
    const onScroll = () => {
      if (near && !raf) raf = requestAnimationFrame(update);
    };
    update();
    const stopVisibility = observeMotionVisibility(el, active => { near = active; if (active) onScroll(); else { cancelAnimationFrame(raf); raf = 0; } }, "100% 0px");
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      stopVisibility();
      cancelAnimationFrame(raf);
    };
  }, []);

  const words = tokens.filter((t) => typeof t === "string").length;
  let wi = 0;

  return (
    <div ref={ref} style={{ ["--lp" as string]: 0 }}>
      <p className="text-center font-serif text-[clamp(2rem,4.6vw,4.4rem)] font-light leading-[1.12] tracking-[-0.015em] text-ink">
        {tokens.map((t, i) => {
          if (typeof t === "string") {
            const th = (wi++ / words) * 0.86;
            return (
              <Fragment key={i}>
                <span style={{ opacity: `clamp(0.14, calc((var(--lp) - ${th.toFixed(4)}) * 14 + 0.14), 1)` }}>{t}</span>{" "}
              </Fragment>
            );
          }
          return (
            <Fragment key={i}>
              <Engraving
                name={t.spot}
                className={`mx-[0.12em] inline-block align-[-0.12em] text-ink ${t.w}`}
                style={{ display: "inline-block" }}
              />{" "}
            </Fragment>
          );
        })}
      </p>
    </div>
  );
}
