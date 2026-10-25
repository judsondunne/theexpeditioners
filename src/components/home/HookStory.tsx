"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Engraving } from "@/components/ui/Engraving";
import { maps, plates } from "@/content/engravings";
import { dispatchText, storyBeats, storyQuestion } from "@/content/story";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

/**
 * "The story so far" — a pinned, scroll-driven sequence under the hero.
 *
 * Scrolling advances five short beats and a closing question; nothing moves on
 * its own and nothing hijacks the scroll. Each frame we only write a few CSS
 * custom properties, so React never re-renders while scrolling.
 *
 * Server render / reduced motion: the same story as a plain, readable list.
 */

type Props = {
  bookHref: string;
  cover: { src: string; alt: string };
  explorersArt: { src: string; alt: string; credit: string };
};

const PANELS = storyBeats.length + 1; // + the closing question
const WEIGHTS = [1.15, 1, 1.05, 0.95, 1, 1.25];

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smooth = (a: number, b: number, v: number) => {
  const t = clamp01((v - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export function HookStory(props: Props) {
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => setPinned(!mq.matches);
    decide();
    mq.addEventListener("change", decide);
    return () => mq.removeEventListener("change", decide);
  }, []);

  return pinned ? <PinnedStory {...props} /> : <StackedStory {...props} />;
}

/* ------------------------------------------------------------ pinned */

function PinnedStory({ bookHref, cover, explorersArt }: Props) {
  const section = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const year = useRef<HTMLSpanElement>(null);
  const typed = useRef<HTMLSpanElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const completed = useRef(false);

  useEffect(() => {
    const total = WEIGHTS.reduce((a, b) => a + b, 0);
    const bounds = WEIGHTS.map((w, i) => {
      const start = WEIGHTS.slice(0, i).reduce((a, b) => a + b, 0) / total;
      return [start, start + w / total] as const;
    });
    let raf = 0;
    let lastActive = -1;
    const panels = Array.from(stage.current?.querySelectorAll<HTMLDivElement>("[data-panel]") ?? []);

    const update = () => {
      raf = 0;
      const el = section.current;
      const st = stage.current;
      if (!el || !st) return;
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = clamp01(-rect.top / Math.max(1, rect.height - vh));
      st.style.setProperty("--p", p.toFixed(4));

      let active = 0;
      bounds.forEach(([s, e], i) => {
        const node = panels[i];
        if (!node) return;
        const lp = clamp01((p - s) / (e - s));
        const span = e - s;
        const fadeIn = i === 0 ? 1 : smooth(s - span * 0.08, s + span * 0.1, p);
        const fadeOut = i === PANELS - 1 ? 1 : 1 - smooth(e - span * 0.1, e + span * 0.08, p);
        const vis = Math.min(fadeIn, fadeOut);
        node.style.setProperty("--lp", lp.toFixed(4));
        node.style.setProperty("--vis", vis.toFixed(3));
        node.style.visibility = vis < 0.002 ? "hidden" : "visible";
        if (p >= s) active = i;

        // beat-specific choreography
        if (i === 0) {
          const scan = smooth(0.04, 0.5, lp);
          const fail = smooth(0.56, 0.8, lp);
          node.style.setProperty("--scan", scan.toFixed(4));
          node.style.setProperty("--fail", fail.toFixed(4));
          const flicker = lp > 0.52 && lp < 0.78 ? (Math.random() > 0.5 ? 1 : 0.15) : 1;
          node.style.setProperty("--flicker", String(flicker));
          if (year.current) year.current.textContent = String(Math.round(1880 + 100 * smooth(0.08, 0.66, lp)));
        }
        if (i === 2 && typed.current) {
          const n = Math.round(dispatchText.length * smooth(0.04, 0.5, lp));
          typed.current.textContent = dispatchText.slice(0, n);
          node.style.setProperty("--tear", smooth(0.5, 0.78, lp).toFixed(4));
        }
        if (i === 4) node.style.setProperty("--route", smooth(0.1, 0.8, lp).toFixed(4));
        if (i === 5) node.style.setProperty("--rise", smooth(0.28, 0.72, lp).toFixed(4));
      });

      if (counter.current && active !== lastActive) {
        counter.current.textContent = `${String(active + 1).padStart(2, "0")} / ${String(PANELS).padStart(2, "0")}`;
        lastActive = active;
      }
      if (!completed.current && p > 0.94) {
        completed.current = true;
        track("story_complete");
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(raf);
    };
  }, []);

  const panelStyle: CSSProperties = { opacity: "var(--vis, 0)" };

  return (
    <section
      ref={section}
      id="the-premise"
      aria-label="The story so far"
      className="on-night relative bg-night text-cream"
      style={{ height: `${Math.round(WEIGHTS.reduce((a, b) => a + b, 0) * 92 + 30)}svh` }}
    >
      <div ref={stage} className="sticky top-0 h-[100svh] overflow-hidden">
        {/* constant chrome */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_45%,#2a211b_0%,#15110e_62%)]" />
          <div className="paper-grain on-night absolute inset-0" />
        </div>

        <a
          href="#trilogy"
          className="label absolute left-[var(--gutter)] top-6 z-30 text-cream/60 underline-offset-4 hover:text-cream hover:underline"
        >
          Skip the story ↓
        </a>
        <span ref={counter} aria-hidden="true" className="label absolute right-[var(--gutter)] top-6 z-30 text-cream/60">
          01 / {String(PANELS).padStart(2, "0")}
        </span>
        <ProgressRail />

        {/* 1 — 1880 to 1980 */}
        <div data-panel="0" style={panelStyle} className="absolute inset-0">
          <div aria-hidden="true" className="absolute inset-0">
            <div
              className="absolute inset-[-4%] opacity-[0.42]"
              style={{
                transform: "scale(calc(1.04 + var(--lp) * 0.06))",
                maskImage:
                  "linear-gradient(to bottom, #000 calc(var(--scan) * 100%), transparent calc(var(--scan) * 100% + 5%))",
                WebkitMaskImage:
                  "linear-gradient(to bottom, #000 calc(var(--scan) * 100%), transparent calc(var(--scan) * 100% + 5%))",
              }}
            >
              <Image
                src={maps["world-1865"].src.replace("world-1865", "world-1865-full")}
                alt=""
                fill
                sizes="100vw"
                className="object-cover invert sepia-[0.35]"
                style={{ opacity: "calc(1 - var(--fail))" }}
              />
              <Image
                src={maps["world-1865"].src}
                alt=""
                fill
                sizes="100vw"
                className="object-cover invert sepia-[0.35]"
                style={{ opacity: "var(--fail)" }}
              />
            </div>
            {/* the scanning beam of the machines */}
            <div
              className="absolute inset-x-0 h-px bg-signal shadow-[0_0_18px_4px_rgba(57,198,214,0.55)]"
              style={{
                top: "calc(var(--scan) * 100%)",
                opacity: "calc((1 - var(--fail)) * var(--flicker) * 0.9)",
              }}
            />
            {/* an 1890 counting machine, glowing, then dark */}
            <div className="absolute right-[6%] top-[14%] w-[min(40vw,30rem)] max-md:left-1/2 max-md:right-auto max-md:top-[9%] max-md:w-[78vw] max-md:-translate-x-1/2">
              <div className="relative border border-cream/25 p-1.5">
                <div className="relative overflow-hidden border border-cream/15">
                  <Image
                    src={`/images/engravings/tabulating-machine-1890.webp`}
                    alt=""
                    width={plates["tabulating-machine-1890"].w}
                    height={plates["tabulating-machine-1890"].h}
                    sizes="(min-width: 768px) 30rem, 78vw"
                    className="h-auto w-full invert sepia-[0.3] mix-blend-screen"
                  />
                  <div
                    className="absolute inset-0 bg-signal mix-blend-color"
                    style={{ opacity: "calc((1 - var(--fail)) * var(--flicker) * 0.55)" }}
                  />
                </div>
                <p className="label mt-2 px-1 pb-0.5 text-cream/45">Counting machines, 1890 · Scientific American</p>
              </div>
            </div>
            <span
              ref={year}
              className="display absolute bottom-[8%] right-[5%] text-[clamp(6rem,22vw,20rem)] text-transparent [-webkit-text-stroke:1px_rgba(239,230,212,0.4)] max-md:bottom-[34%] max-md:right-[4%]"
            >
              1880
            </span>
          </div>
          <StoryText beat={0} />
        </div>

        {/* 2 — the edge of the map */}
        <div data-panel="1" style={panelStyle} className="absolute inset-0">
          <div aria-hidden="true" className="absolute inset-0">
            <div
              className="absolute inset-0 opacity-30"
              style={{ transform: "rotate(calc(var(--lp) * 8deg)) scale(1.25)" }}
            >
              <Image
                src="/images/engravings/unknown-polar-map.webp"
                alt=""
                fill
                sizes="100vw"
                className="object-contain mix-blend-screen [filter:invert(1)_contrast(1.6)_brightness(0.9)]"
              />
            </div>
            <div className="absolute right-[5%] top-[10%] w-[min(46vw,40rem)] max-md:left-1/2 max-md:right-auto max-md:top-[8%] max-md:w-[86vw] max-md:-translate-x-1/2">
              <div className="overflow-hidden border border-cream/25 p-1.5">
                <div className="overflow-hidden">
                  <Image
                    src="/images/engravings/flammarion.webp"
                    alt=""
                    width={plates.flammarion.w}
                    height={plates.flammarion.h}
                    sizes="(min-width: 768px) 40rem, 86vw"
                    className="h-auto w-full origin-[22%_78%] mix-blend-screen [filter:invert(1)_sepia(0.3)_contrast(1.3)]"
                    style={{ transform: "scale(calc(1.02 + var(--lp) * 0.16))" }}
                  />
                </div>
              </div>
              <p className="label mt-2 text-cream/45">Wood engraving, 1888 · Public domain</p>
            </div>
          </div>
          <StoryText beat={1} />
        </div>

        {/* 3 — the dispatch */}
        <div data-panel="2" style={panelStyle} className="absolute inset-0">
          <div aria-hidden="true" className="absolute inset-0">
            <Engraving
              name="gear"
              className="absolute -left-[6%] top-[4%] w-[min(42vw,30rem)] text-cream/10"
              style={{ transform: "rotate(calc(var(--lp) * 90deg))" }}
            />
            <Engraving
              name="pocketwatch"
              className="absolute bottom-[6%] right-[38%] hidden w-[9rem] text-cream/20 lg:block"
              style={{ transform: "rotate(calc(-12deg + var(--lp) * 24deg))" }}
            />
            {/* half of a strange map */}
            <div
              className="absolute right-[-4%] top-[8%] h-[70%] w-[min(44vw,36rem)] max-md:top-[6%] max-md:h-[40%] max-md:w-[70vw]"
              style={{
                transform: "translateX(calc((1 - var(--tear)) * 60%)) rotate(3deg)",
                opacity: "var(--tear)",
                clipPath:
                  "polygon(6% 0, 100% 0, 100% 100%, 9% 100%, 4% 92%, 8% 84%, 3% 76%, 7% 69%, 2% 60%, 6% 52%, 1% 44%, 5% 37%, 2% 28%, 7% 20%, 3% 11%)",
              }}
            >
              <div className="absolute inset-0 bg-[#e7dcc5]" />
              <Image
                src={maps["rhumb-chart-1751"].src}
                alt=""
                fill
                sizes="40vw"
                className="object-cover object-left"
              />
            </div>
            {/* the dispatch slip */}
            <div
              className="absolute left-[50%] top-[16%] w-[min(42vw,30rem)] bg-[#efe6d2] p-5 text-ink shadow-[0_30px_60px_-20px_rgba(0,0,0,0.7)] max-md:top-[12%] max-md:w-[84vw] md:left-[36%]"
              style={{ transform: "translate(-50%, calc((1 - min(1, var(--lp) * 4)) * 20px)) rotate(-2deg)" }}
            >
              <div className="flex items-center justify-between border-b border-ink/30 pb-2">
                <span className="label">Dispatch</span>
                <span className="label text-ink-3">Via telegraph</span>
              </div>
              <p className="mt-4 min-h-[6.5em] font-mono text-[0.95rem] leading-relaxed tracking-wide">
                <span ref={typed} />
                <span className="ml-0.5 inline-block h-[1.1em] w-[0.55em] translate-y-[0.15em] animate-pulse bg-ink/70" />
              </p>
            </div>
          </div>
          <StoryText beat={2} />
        </div>

        {/* 4 — the siblings */}
        <div data-panel="3" style={panelStyle} className="absolute inset-0">
          <div aria-hidden="true" className="absolute inset-0">
            <div className="absolute right-[6%] top-[10%] w-[min(44vw,40rem)] max-md:left-1/2 max-md:right-auto max-md:top-[7%] max-md:w-[90vw] max-md:-translate-x-1/2">
              <div className="border border-cream/25 p-1.5">
                <div className="relative aspect-[1400/1177] overflow-hidden">
                  <Image
                    src={explorersArt.src}
                    alt=""
                    fill
                    sizes="(min-width: 768px) 46rem, 90vw"
                    className="object-cover"
                    style={{ transform: "scale(calc(1.02 + var(--lp) * 0.1)) translateY(calc(var(--lp) * -2%))" }}
                  />
                </div>
              </div>
              <p className="label mt-2 text-cream/50">{explorersArt.credit}</p>
            </div>
          </div>
          <StoryText beat={3} big />
        </div>

        {/* 5 — the canyon */}
        <div data-panel="4" style={panelStyle} className="absolute inset-0">
          <div aria-hidden="true" className="absolute inset-0">
            <Engraving
              name="airship"
              className="absolute top-[7%] w-[min(26vw,16rem)] text-cream/45"
              style={{ left: "calc(8% + var(--lp) * 40%)" }}
            />
            <div className="absolute right-[7%] top-[9%] w-[min(30vw,25rem)] max-md:left-1/2 max-md:right-auto max-md:top-[6%] max-md:w-[58vw] max-md:-translate-x-1/2">
              <div className="border border-cream/25 bg-[#e9dfca] p-1.5">
                <div className="relative overflow-hidden">
                  <Image
                    src="/images/engravings/moran-grand-canon.webp"
                    alt=""
                    width={plates["moran-grand-canon"].w}
                    height={plates["moran-grand-canon"].h}
                    sizes="(min-width: 768px) 25rem, 58vw"
                    className="h-auto w-full mix-blend-multiply"
                    style={{ transform: "scale(calc(1.03 + var(--lp) * 0.08))" }}
                  />
                  <svg viewBox="0 0 100 147" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                    <path
                      d="M8 6 C 30 20, 18 40, 40 52 S 70 70, 52 92 S 40 120, 62 132"
                      fill="none"
                      stroke="#a33c26"
                      strokeWidth="2"
                      strokeDasharray="2.6 2.4"
                      pathLength={100}
                      style={{ strokeDashoffset: "calc(100 - var(--route) * 100)" }}
                      vectorEffect="non-scaling-stroke"
                    />
                    <g
                      style={{ opacity: "clamp(0, calc((var(--route) - 0.92) * 14), 1)" }}
                      stroke="#a33c26"
                      strokeWidth="1.6"
                    >
                      <line x1="58" y1="128" x2="66" y2="136" />
                      <line x1="66" y1="128" x2="58" y2="136" />
                    </g>
                  </svg>
                </div>
              </div>
              <p className="label mt-2 text-cream/45">Thomas Moran, 1875 · Public domain</p>
            </div>
          </div>
          <StoryText beat={4} />
        </div>

        {/* 6 — the question */}
        <div data-panel="5" style={panelStyle} className="absolute inset-0">
          <div aria-hidden="true" className="absolute inset-0 opacity-[0.16]">
            <Image src={maps["rhumb-chart-1751"].src} alt="" fill sizes="100vw" className="object-cover invert" />
          </div>
          <div className="container-x relative flex h-full flex-col items-center justify-center gap-10 pb-10 pt-20 text-center md:flex-row md:justify-between md:gap-16 md:text-left">
            <div className="max-w-[44rem]">
              <p className="label text-cream/60">{storyQuestion.kicker}</p>
              <h2 className="mt-5 font-serif text-[clamp(2.3rem,5.6vw,5.2rem)] font-light leading-[1.02] tracking-[-0.015em] text-balance">
                <Words text={storyQuestion.text} from={0} to={0.3} />
              </h2>
              <div
                className="mt-10 flex flex-wrap items-center justify-center gap-x-7 gap-y-4 md:justify-start"
                style={{ opacity: "var(--rise)" }}
              >
                <Link
                  href={bookHref}
                  onClick={() => track("cta_click", { location: "story", target: "book-one" })}
                  className="group label-lg inline-flex min-h-12 items-center gap-3 bg-cream px-6 text-ink transition-colors hover:bg-white"
                >
                  Find out in Book One
                  <span aria-hidden="true" className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
                <Link href="#trilogy" className="label-lg text-cream/80 underline decoration-cream/30 underline-offset-[6px] hover:text-cream">
                  Meet the whole trilogy
                </Link>
              </div>
            </div>
            <div
              className="relative w-[min(46vw,15rem)] shrink-0 md:mr-16 md:w-[min(24vw,20rem)]"
              style={{
                transform:
                  "translateY(calc((1 - var(--rise)) * 60px)) perspective(1200px) rotateY(calc(-18deg + var(--rise) * 8deg)) rotateX(4deg)",
                opacity: "var(--rise)",
              }}
            >
              <Image
                src={cover.src}
                alt={cover.alt}
                width={880}
                height={1360}
                sizes="(min-width: 768px) 20rem, 46vw"
                className="h-auto w-full shadow-[0_40px_80px_-24px_rgba(0,0,0,0.85)]"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/** The narration for a beat: kicker plus lines that ink in word by word. */
function StoryText({ beat, big = false }: { beat: number; big?: boolean }) {
  const b = storyBeats[beat];
  const n = b.lines.length;
  return (
    <div className="container-x pointer-events-none absolute inset-x-0 bottom-[9vh] z-10 max-md:bottom-[7vh]">
      <div
        aria-hidden="true"
        className="absolute -inset-x-0 -bottom-[9vh] top-[-6vh] -z-10 bg-[linear-gradient(to_top,rgba(21,17,14,0.92),rgba(21,17,14,0.6)_55%,transparent)] md:right-[35%] md:bg-[radial-gradient(ellipse_at_10%_80%,rgba(21,17,14,0.9),rgba(21,17,14,0.55)_50%,transparent_75%)]"
      />
      <div className="max-w-[min(40rem,92vw)] md:max-w-[38rem] lg:max-w-[44rem]">
        <p className="label flex items-center gap-3 text-cream/60">
          <span className="inline-block h-px w-6 bg-current" aria-hidden="true" />
          {b.kicker}
        </p>
        <div className="mt-5 space-y-3">
          {b.lines.map((line, j) => (
            <p
              key={j}
              className={cn(
                "font-serif font-light leading-[1.08] tracking-[-0.01em] text-balance",
                big ? "text-[clamp(2.4rem,5.2vw,4.6rem)]" : "text-[clamp(1.75rem,3.7vw,3.4rem)]",
              )}
            >
              <Words text={line} from={(j / n) * 0.78} to={((j + 1) / n) * 0.78} />
            </p>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Words that darken from faint to full as --lp moves from `from` to `to`. */
function Words({ text, from, to }: { text: string; from: number; to: number }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((w, i) => {
        const t = from + ((to - from) * i) / words.length;
        return (
          <span
            key={i}
            className="inline-block whitespace-pre"
            style={{
              opacity: `clamp(0.12, calc((var(--lp) - ${t.toFixed(4)}) * 16 + 0.12), 1)`,
            }}
          >
            {w}
            {i < words.length - 1 ? " " : ""}
          </span>
        );
      })}
    </>
  );
}

/** A compass-needle progress rail on the right edge: N at the top, S at the foot. */
function ProgressRail() {
  return (
    <div aria-hidden="true" className="absolute bottom-[12vh] right-[var(--gutter)] top-[12vh] z-20 hidden w-4 flex-col items-center md:flex">
      <span className="label text-cream/60">N</span>
      <div className="relative my-3 w-px flex-1 bg-cream/20">
        <div
          className="absolute inset-x-0 top-0 origin-top bg-signal shadow-[0_0_10px_rgba(57,198,214,0.6)]"
          style={{ height: "100%", transform: "scaleY(var(--p, 0))" }}
        />
        {Array.from({ length: PANELS - 1 }, (_, i) => (
          <span key={i} className="absolute -left-1 h-px w-2.5 bg-cream/40" style={{ top: `${((i + 1) / PANELS) * 100}%` }} />
        ))}
      </div>
      <span className="label text-cream/60">S</span>
    </div>
  );
}

/* ----------------------------------------------------------- stacked */

function StackedStory({ bookHref, cover, explorersArt }: Props) {
  return (
    <section id="the-premise" aria-label="The story so far" className="on-night relative bg-night py-24 text-cream md:py-32">
      <div className="container-x">
        <p className="label text-cream/60">The story so far</p>
        <ol className="mt-12 space-y-20">
          {storyBeats.map((b, i) => (
            <li key={b.id} className="grid gap-8 md:grid-cols-12 md:items-center">
              <div className="md:col-span-7">
                <p className="label text-cream/60">
                  {String(i + 1).padStart(2, "0")} — {b.kicker}
                </p>
                {b.lines.map((l, j) => (
                  <p key={j} className="mt-4 font-serif text-[clamp(1.6rem,3.2vw,2.8rem)] font-light leading-[1.1]">
                    {l}
                  </p>
                ))}
              </div>
              {b.id === "siblings" && (
                <figure className="md:col-span-5">
                  <Image
                    src={explorersArt.src}
                    alt={explorersArt.alt}
                    width={1400}
                    height={1177}
                    sizes="(min-width: 768px) 40vw, 100vw"
                    className="h-auto w-full"
                  />
                  <figcaption className="label mt-2 text-cream/50">{explorersArt.credit}</figcaption>
                </figure>
              )}
            </li>
          ))}
        </ol>
        <div className="mt-24 grid items-center gap-10 border-t border-cream/20 pt-16 md:grid-cols-12">
          <div className="md:col-span-8">
            <h2 className="font-serif text-[clamp(2.2rem,5vw,4.6rem)] font-light leading-[1.04]">{storyQuestion.text}</h2>
            <Link
              href={bookHref}
              className="label-lg mt-10 inline-flex min-h-12 items-center gap-3 bg-cream px-6 text-ink hover:bg-white"
            >
              Find out in Book One <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="w-48 md:col-span-4 md:w-auto md:max-w-xs">
            <Image src={cover.src} alt={cover.alt} width={880} height={1360} sizes="20rem" className="h-auto w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
