"use client";

import Image, { type ImageProps } from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { PurchaseButton } from "@/components/purchase/PurchaseButton";
import { purchaseBook } from "@/lib/purchase";
import { HeroBook } from "@/components/home/HeroBook";
import { Engraving } from "@/components/ui/Engraving";
import { bookOne } from "@/content/books";
import { plates } from "@/content/engravings";
import { track } from "@/lib/analytics";

type Props = {
  cover: { src: string; alt: string };
};

const smooth = (start: number, end: number, value: number) => {
  const t = Math.max(0, Math.min(1, (value - start) / (end - start)));
  return t * t * (3 - 2 * t);
};

/** The original machine/map choreography, followed by the revised story beats. */
export function HookStory({ cover }: Props) {
  const section = useRef<HTMLElement>(null);
  const year = useRef<HTMLSpanElement>(null);
  const completed = useRef(false);
  const [mediaReady, setMediaReady] = useState(false);
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const observer = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.isIntersecting)) { setMediaReady(true);observer.disconnect(); }
    }, { rootMargin: "200px" });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  useEffect(() => {
    const el = section.current;
    if (!el) return;
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const panels = Array.from(el.querySelectorAll<HTMLElement>("[data-story-beat]"));
    let frame = 0;
    const update = () => {
      frame = 0;
      if (motion.matches) return;
      const rect = el.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, -rect.top / (rect.height - window.innerHeight)));
      const position = progress * 4;
      const active = Math.min(3, Math.floor(position));
      panels.forEach((panel, i) => {
        const local = Math.max(0, Math.min(1, position - i));
        panel.style.setProperty("--local", String(local));
        if (i === 0) {
          panel.style.setProperty("--scan", String(smooth(.04, .5, local)));
          panel.style.setProperty("--fail", String(smooth(.56, .8, local)));
          // Scrub the power flicker with the scroll, so reversing is repeatable.
          const flicker = local > .52 && local < .78 ? .58 + .42 * Math.cos((local - .52) * Math.PI * 18) : 1;
          panel.style.setProperty("--flicker", String(flicker));
        }
        panel.style.setProperty("--visible", i === active ? "1" : "0");
        panel.inert = i !== active;
        panel.setAttribute("aria-hidden", String(i !== active));
      });
      if (year.current) year.current.textContent = String(Math.round(1880 + 100 * smooth(.08, .66, position)));
      if (!completed.current && progress > 0.94) { completed.current = true; track("story_complete"); }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    const changeMotion = () => {
      panels.forEach(panel => { panel.inert = false; panel.removeAttribute("aria-hidden"); });
      update();
    };
    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    motion.addEventListener("change", changeMotion);
    return () => {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
      motion.removeEventListener("change", changeMotion);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section ref={section} id="the-premise" aria-label="The story so far" className="hook-story on-night bg-night text-cream">
      <div className="hook-stage">
        <div data-story-beat className="hook-panel hook-machines" style={{ ["--visible" as string]: 1 }}>
          <div aria-hidden="true" className="absolute inset-0 overflow-hidden">
            <div className="story-machine-map">
              <StoryImage enabled={mediaReady} src="/images/maps/world-1865-full.webp" alt="" fill sizes="100vw" quality={45} className="object-cover invert sepia-[.35]" style={{ opacity: "calc(1 - var(--fail, 0))" }} />
              <StoryImage enabled={mediaReady} src="/images/maps/world-1865.webp" alt="" fill sizes="100vw" quality={45} className="object-cover invert sepia-[.35]" style={{ opacity: "var(--fail, 0)" }} />
            </div>
            <div className="story-machine-scan" />
            <div className="story-counting-machine">
              <div className="border border-cream/25 p-1.5">
                <div className="relative overflow-hidden border border-cream/15">
                  <StoryImage enabled={mediaReady} src="/images/engravings/tabulating-machine-1890.webp" alt="" width={plates["tabulating-machine-1890"].w} height={plates["tabulating-machine-1890"].h} sizes="(min-width: 768px) 30rem, 78vw" className="h-auto w-full invert sepia-[.3] mix-blend-screen" />
                  <div className="absolute inset-0 bg-signal mix-blend-color" style={{ opacity: "calc((1 - var(--fail, 0)) * var(--flicker, 1) * .55)" }} />
                </div>
                <p className="label mt-2 px-1 pb-0.5 text-cream/45">Counting machines, 1890 · Scientific American</p>
              </div>
            </div>
            <div className="story-machine-shade" />
            <span ref={year} className="story-year">1880</span>
          </div>
          <div className="story-center relative z-10">
            <p className="label text-cream/60">A different history</p>
            <h2 className="mt-6 font-serif text-[clamp(2rem,4.8vw,4.6rem)] leading-[1.05] text-balance">In 1880, the world<br />built its first computers.</h2>
            <p className="mt-5 text-xl text-cream/65">One hundred years later.</p>
            <p className="story-failure">And then<br /><em>they failed.</em></p>
          </div>
        </div>

        <div data-story-beat className="hook-panel">
          {mediaReady && <Engraving name="gear" className="absolute -left-20 top-10 w-[32rem] text-cream/10" />}
          {mediaReady && <Engraving name="compass" className="absolute bottom-8 right-[4%] w-48 text-cream/15" />}
          <div className="container-x story-newspaper-grid">
            <div>
              <p className="label text-cream/60">A father vanishes. A map survives.</p>
              <h2 className="mt-6 font-serif text-[clamp(2.3rem,4.5vw,4.8rem)] leading-[1.04] text-balance">Their father left<br />a trail.</h2>
              <p className="mt-6 max-w-md text-[clamp(1.2rem,2vw,1.65rem)] leading-snug text-cream/80">A man with a clockwork hand.<br />Half of a strange map.<br />And a secret worth chasing.</p>
            </div>
            <article className="story-newspaper text-ink" aria-label="An imagined newspaper from the world of the story">
              <p className="newspaper-masthead">The Realm Gazette</p>
              <p className="label border-y border-ink/50 py-2 text-center">Exploration · Reports from the Realm</p>
              <h3 className="mt-5 text-center font-serif text-[clamp(2rem,3.5vw,3.5rem)] font-bold leading-[0.95]">ALEXANDER WEST<br /><span className="text-rust">PRESUMED DEAD</span></h3>
              <p className="mt-4 border-y border-ink/40 py-3 text-center font-serif text-lg italic">Famed Explorer of the Realm missing in the Fazian rainforest</p>
              <div className="mt-5 grid grid-cols-[1fr_1.25fr] items-center gap-5">
                {mediaReady && <Engraving name="surveyor" className="mx-auto max-h-40 w-20 text-sepia" />}
                <p className="text-[1rem] leading-snug">Alexander West is presumed dead. His son Kit is about to discover that his father&rsquo;s story is far from over.</p>
              </div>
              <p className="label mt-5 border-t border-ink/40 pt-2 text-center">The West papers · a story from Book One</p>
            </article>
          </div>
        </div>

        <div data-story-beat className="hook-panel">
          <div className="story-canyon-art">
            <StoryImage enabled={mediaReady} src="/images/engravings/moran-grand-canon.webp" alt="An engraved view of towering canyon walls and a winding river" fill sizes="(min-width: 768px) 48vw, 85vw" className="object-contain" />
          </div>
          <div className="story-canyon-copy relative z-10 text-center">
            <p className="label text-cream/60">Government agents on their trail.</p>
            <h2 className="mt-5 font-serif text-[clamp(2rem,4.1vw,4rem)] leading-[1.06] text-balance">Three siblings follow the map<br />into the Arizona desert.</h2>
            <p className="mt-4 font-serif text-[clamp(1.4rem,2.8vw,2.7rem)] italic text-[#d8ae70]">And a fabled treasure in gold.</p>
          </div>
        </div>

        <div data-story-beat className="hook-panel">
          <div aria-hidden="true" className="absolute inset-0 opacity-[0.1]"><StoryImage enabled={mediaReady} src="/images/maps/rhumb-chart-1751.webp" alt="" fill sizes="100vw" quality={45} className="object-cover invert" /></div>
          <div className="container-x story-question">
            <div>
              <p className="label text-cream/60">Book One</p>
              <h2 className="mt-5 font-serif text-[clamp(2.2rem,5.4vw,5.2rem)] leading-[1.02] text-balance">But what is waiting at the bottom of Drowned Man&rsquo;s Canyon?</h2>
              <div className="mt-9 flex flex-wrap gap-6 items-center">
                <PurchaseButton book={purchaseBook(bookOne)} location="story-end" label="Find out in Book One" tone="paper" />
                <Link href="#trilogy" className="label text-cream/75 underline underline-offset-4">The whole trilogy</Link>
              </div>
            </div>
            {mediaReady && <HeroBook front={cover.src} back={bookOne.backCover!.src} title={bookOne.fullTitle} spineColor={bookOne.palette.spine.background} priority={false} imageSizes="(min-width: 768px) 22vw, 30vw" />}
          </div>
        </div>
      </div>
      <noscript><style>{`.hook-story{height:auto}.hook-stage{position:relative;top:auto;height:auto;overflow:visible}.hook-panel{position:relative;min-height:90svh;padding-block:3rem;opacity:1!important;visibility:visible!important}.story-center,.story-question,.story-newspaper-grid{min-height:85svh}.story-failure,.hook-machines .story-failure{opacity:1;transform:none}`}</style></noscript>
    </section>
  );
}

function StoryImage({enabled, alt, ...props}: ImageProps & {enabled: boolean}) {
  return enabled ? <Image {...props} alt={alt} fetchPriority="low" /> : null;
}
