import { Wordmark } from "@/components/ui/Wordmark";
import { HeroBook } from "@/components/home/HeroBook";
import { QuoteRotator } from "@/components/home/QuoteRotator";
import { BuyBook } from "@/components/purchase/BuyBook";
import { ArrowLink } from "@/components/ui/ButtonLink";
import { Engraving } from "@/components/ui/Engraving";
import { HonourStamps } from "@/components/ui/HonourStamp";
import { Scribble } from "@/components/ui/Scribble";
import { bookOne } from "@/content/books";
import { heroQuotes, recognitionFor } from "@/content/praise";
import { site } from "@/content/site";

/**
 * The homepage hero is drawn as a survey sheet: a faded 1865 world map with
 * whole regions gone blank, a graticule and rhumb lines, a neatline frame,
 * pencil notes — and Book One sitting on it as a physical object.
 */
export function Hero() {
  const recognition = recognitionFor(bookOne.slug);
  return (
    <section
      aria-labelledby="hero-title"
      className="paper-grain relative isolate overflow-hidden bg-paper text-ink"
      style={{ minHeight: "calc(100svh - var(--header-h))" }}
    >
      {/* the faded chart */}
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <picture>
          <source media="(max-width: 767px)" srcSet="/images/optimized/hero-map-640.webp 640w, /images/optimized/hero-map-960.webp 960w" sizes="100vw" />
          {/* Precompressed art avoids request-time encoding on the first visit. */}
          <img src="/images/optimized/hero-map-1440.webp" srcSet="/images/optimized/hero-map-960.webp 960w, /images/optimized/hero-map-1440.webp 1440w, /images/optimized/hero-map-1920.webp 1920w" sizes="100vw" alt="" width={1920} height={1313} loading="eager" fetchPriority="high" decoding="async" className="absolute inset-0 h-full w-full object-cover object-[50%_40%] opacity-[0.62] mix-blend-multiply" />
        </picture>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_32%_48%,rgba(236,227,209,0.92)_0%,rgba(236,227,209,0.55)_38%,rgba(236,227,209,0)_70%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,transparent_55%,rgba(74,55,38,0.22)_100%)]" />
      </div>

      <HeroChartLines />

      {/* neatline frame */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-3 z-0 border border-sepia/45 sm:inset-5">
        <div className="absolute inset-[5px] border border-sepia/25" />
        <ScaleBar className="absolute -top-px left-[8%] right-[8%]" />
        <ScaleBar className="absolute -bottom-px left-[8%] right-[8%]" />
        <span className="label absolute left-3 top-2 hidden text-sepia/70 sm:block">Sheet I — The known world</span>
        <span className="label absolute right-3 top-2 hidden text-sepia/70 sm:block">Survey incomplete</span>
        <span className="label absolute bottom-2 left-3 hidden text-sepia/70 sm:block">Chart after A. J. Johnson, 1865</span>
        
      </div>

      {/* drifting airship & scale figures */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0">
        <div className="drift absolute left-0 top-5 md:top-[5%] w-[min(30vw,15rem)] text-sepia/75 md:block">
          <Engraving name="airship" />
        </div>
        <Engraving
          name="surveyor"
          className="absolute bottom-[1.6rem] left-[5%] hidden w-[3.4rem] text-sepia/80 sm:block lg:w-[4.2rem]"
        />
        <Engraving
          name="compass-rose"
          className="absolute -bottom-[9rem] -right-[8rem] w-[26rem] text-sepia/10 lg:-right-[5rem] lg:w-[30rem]"
        />
        <Scribble className="left-[44%] top-[11%] text-sepia" rotate={-6}>
          uncharted?
        </Scribble>
        <Scribble className="bottom-[13%] left-[12%] hidden text-sepia md:block" rotate={3}>
          ½ a map — where is the rest?
        </Scribble>
      </div>

      <div className="container-x relative z-10 grid items-center gap-x-8 gap-y-12 pb-24 pt-10 sm:pt-14 lg:min-h-[calc(100svh-var(--header-h))] lg:grid-cols-12 lg:pb-20 lg:pt-6">
        {/* Title block */}
        <div className="min-w-0 lg:col-span-5">
          <p className="label-lg flex items-center gap-3 text-ink-2">
            <span className="inline-block h-px w-8 bg-current" aria-hidden="true" />
            An illustrated adventure trilogy
          </p>
          <h1 id="hero-title" className="mt-5">
            <span className="sr-only">The Expeditioners</span>
            <Wordmark className="w-full max-w-[35rem]" />
          </h1>
          <p className="mt-6 max-w-[26rem] font-serif text-[clamp(1.35rem,2.1vw,1.8rem)] leading-[1.18] text-ink text-balance">
            {site.tagline}
          </p>
          <p className="mt-5 text-lg leading-relaxed text-ink-2">
            By S. S. Taylor <span aria-hidden="true">·</span> Illustrated by Katherine Roy
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-x-7 gap-y-4">
            <BuyBook book={bookOne} location="hero" label="Start with Book One" primary />
            <ArrowLink href="/books">See all three books</ArrowLink>
          </div>
          <p className="label mt-4 text-ink-2">Book One · Paperback · Ages 10–14</p>
        </div>

        {/* Book One, drawn as Fig. 1 */}
        <div className="relative flex justify-center min-w-0 lg:col-span-4">
          <figure className="relative">
            <InstrumentBezel />
            <HeroBook
              front={bookOne.cover.src}
              back={bookOne.backCover?.src ?? bookOne.cover.src}
              title={bookOne.fullTitle}
              spineColor={bookOne.palette.spine.background}
            />

            <span
              aria-hidden="true"
              className="label absolute -bottom-14 left-1/2 hidden -translate-x-1/2 whitespace-nowrap text-sepia lg:block"
            >
              Cover art: Katherine Roy
            </span>
            <figcaption className="sr-only">Book One: {bookOne.fullTitle}</figcaption>
          </figure>
        </div>

        {/* Praise plate */}
        <div className="hero-praise lg:col-span-3">
          <QuoteRotator quotes={heroQuotes} />
          <HonourStamps honours={recognition} layout="list" className="honours-list mt-5" />
        </div>
      </div>

      <ScrollCue />
    </section>
  );
}

/** A sextant-style bezel behind the book: degree ticks, numerals and crosshairs. */
function InstrumentBezel() {
  const ticks = Array.from({ length: 72 }, (_, i) => i * 5);
  return (
    <svg
      aria-hidden="true"
      viewBox="-200 -200 400 400"
      className="pointer-events-none absolute left-1/2 top-1/2 -z-10 w-[170%] max-w-none -translate-x-1/2 -translate-y-1/2 text-sepia"
    >
      <g fill="none" stroke="currentColor">
        <circle r="186" strokeWidth="0.6" opacity="0.45" />
        <circle r="172" strokeWidth="0.4" opacity="0.35" strokeDasharray="1 3" />
        <circle r="120" strokeWidth="0.4" opacity="0.25" />
        <line x1="-198" y1="0" x2="198" y2="0" strokeWidth="0.4" opacity="0.3" strokeDasharray="6 4" />
        <line x1="0" y1="-198" x2="0" y2="198" strokeWidth="0.4" opacity="0.3" strokeDasharray="6 4" />
        {ticks.map((a) => {
          const long = a % 30 === 0;
          const r1 = long ? 176 : 181;
          const rad = (a * Math.PI) / 180;
          return (
            <line
              key={a}
              x1={Math.cos(rad) * r1}
              y1={Math.sin(rad) * r1}
              x2={Math.cos(rad) * 186}
              y2={Math.sin(rad) * 186}
              strokeWidth={long ? 0.9 : 0.5}
              opacity={long ? 0.6 : 0.4}
            />
          );
        })}
      </g>
      <g fill="currentColor" opacity="0.55" fontFamily="var(--font-mono)" fontSize="7" textAnchor="middle">
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((a) => {
          const rad = ((a - 90) * Math.PI) / 180;
          return (
            <text key={a} x={Math.cos(rad) * 194} y={Math.sin(rad) * 194 + 2.4}>
              {a}
            </text>
          );
        })}
      </g>
    </svg>
  );
}

function ScaleBar({ className }: { className?: string }) {
  return (
    <span
      className={`block h-[5px] ${className ?? ""}`}
      style={{
        background:
          "repeating-linear-gradient(90deg, rgba(74,55,38,0.55) 0 48px, transparent 48px 96px)",
      }}
    />
  );
}

/** Graticule and rhumb lines, drawn once as a single lightweight SVG. */
function HeroChartLines() {
  const cx = 1180;
  const cy = 700;
  const rays = Array.from({ length: 32 }, (_, i) => (i * Math.PI * 2) / 32);
  return (
    <svg
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-[5] h-full w-full text-sepia"
      viewBox="0 0 1440 900"
      preserveAspectRatio="xMidYMid slice"
    >
      <g stroke="currentColor" strokeWidth="0.6" opacity="0.18">
        {Array.from({ length: 13 }, (_, i) => (
          <line key={`v${i}`} x1={i * 120} y1="0" x2={i * 120} y2="900" />
        ))}
        {Array.from({ length: 8 }, (_, i) => (
          <line key={`h${i}`} x1="0" y1={i * 120 + 60} x2="1440" y2={i * 120 + 60} />
        ))}
      </g>
      <g stroke="currentColor" strokeWidth="0.5" opacity="0.13">
        {rays.map((a, i) => (
          <line
            key={i}
            x1={cx}
            y1={cy}
            x2={cx + Math.cos(a) * 1900}
            y2={cy + Math.sin(a) * 1900}
            strokeDasharray={i % 2 ? "5 6" : undefined}
          />
        ))}
      </g>
    </svg>
  );
}

function ScrollCue() {
  return (
    <a href="#the-premise" className="scroll-mouse absolute bottom-7 left-1/2 z-10 -translate-x-1/2 text-ink-2" aria-label="Scroll to the story">
      <span aria-hidden="true" />
    </a>
  );
}
