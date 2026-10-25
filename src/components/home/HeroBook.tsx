"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

/**
 * Book One as a physical object: a CSS 3D paperback (front, back, spine and
 * page block) that leans toward the pointer. CSS rather than WebGL so the
 * hero paints instantly — the cover is the page's largest image.
 */
export function HeroBook({
  front,
  back,
  title,
  spineColor,
  priority = true,
  imageSizes = "(min-width: 1491px) 328px, (min-width: 910px) 22vw, 200px",
}: {
  front: string;
  back: string;
  title: string;
  spineColor: string;
  priority?: boolean;
  imageSizes?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    if (reduce || !finePointer) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let x = 0;
    let y = 0;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth) * 2 - 1;
      ty = (e.clientY / window.innerHeight) * 2 - 1;
      if (!raf) raf = requestAnimationFrame(step);
    };
    const step = () => {
      x += (tx - x) * 0.08;
      y += (ty - y) * 0.08;
      el.style.setProperty("--tilt-y", `${x * 9}deg`);
      el.style.setProperty("--tilt-x", `${-y * 6}deg`);
      raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.001 ? requestAnimationFrame(step) : 0;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className="hero-book" style={{ ["--spine" as string]: spineColor }}>
      <div className="hero-book__float">
        <div className="hero-book__body">
          <div className="hero-book__face hero-book__front">
            <Image
              src={front}
              alt={`Front cover of ${title}`}
              fill
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : undefined}
              sizes={imageSizes}
              className="object-cover"
            />
            <span className="hero-book__sheen" aria-hidden="true" />
          </div>
          <div className="hero-book__face hero-book__back" aria-hidden="true">
            <Image src={back} alt="" fill fetchPriority="low" sizes={imageSizes} className="object-cover" />
          </div>
          <div className="hero-book__face hero-book__spine" aria-hidden="true" />
          <div className="hero-book__face hero-book__fore" aria-hidden="true" />
          <div className="hero-book__face hero-book__head" aria-hidden="true" />
          <div className="hero-book__face hero-book__tail" aria-hidden="true" />
        </div>
      </div>
      <div className="hero-book__shadow" aria-hidden="true" />
    </div>
  );
}
