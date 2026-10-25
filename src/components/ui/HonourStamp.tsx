import { useId } from "react";
import type { Recognition } from "@/content/types";
import { cn } from "@/lib/cn";

/**
 * An honour drawn as a rubber ink stamp pressed onto the page: lettering set
 * around a ring (or across a box), the year in the centre, uneven ink pressure
 * and worn speckle, printed with `multiply` so the paper shows through.
 *
 * Purely typographic and site-made — never a copy of an award's own seal.
 * The SVG is decorative; the honour is always given as text alongside.
 */

const INKS = { rust: "#9b3a22", blue: "#2c4a6e", sepia: "#5f4124" } as const;

/** Small, deterministic tilt per honour so every stamp lands a little differently. */
function tiltFor(id: string) {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) | 0;
  return ((Math.abs(h) % 15) - 7) * 1.1;
}

export function HonourStamp({ honour, className }: { honour: Recognition; className?: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  const { shape, ink, top, bottom, centre } = honour.stamp;
  const colour = INKS[ink];
  const seed = (Math.abs(uid.split("").reduce((a, c) => a + c.charCodeAt(0), 0)) % 90) + 3;
  const ids = { ink: `ink-${uid}`, top: `top-${uid}`, bottom: `bottom-${uid}` };

  return (
    <svg
      viewBox="0 0 200 200"
      aria-hidden="true"
      className={cn("honour-stamp block shrink-0", className)}
      style={{ transform: `rotate(${tiltFor(honour.id)}deg)`, color: colour }}
    >
      <defs>
        {/* worn rubber: wobbly edges, speckled gaps, uneven pressure */}
        <filter id={ids.ink} x="-8%" y="-8%" width="116%" height="116%" colorInterpolationFilters="sRGB">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed={seed} result="warp" />
          <feDisplacementMap in="SourceGraphic" in2="warp" scale="2.6" xChannelSelector="R" yChannelSelector="G" result="wobble" />
          <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="2" seed={seed + 5} result="grain" />
          <feColorMatrix in="grain" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -3.4 2.65" result="speck" />
          <feTurbulence type="fractalNoise" baseFrequency="0.016" numOctaves="1" seed={seed + 11} result="press" />
          <feColorMatrix in="press" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.5 0.12" result="pressure" />
          <feComposite in="speck" in2="pressure" operator="arithmetic" k1="1" result="mask" />
          <feComposite in="wobble" in2="mask" operator="in" />
        </filter>
        <path id={ids.top} d="M 28 100 A 72 72 0 0 1 172 100" />
        <path id={ids.bottom} d="M 18 100 A 82 82 0 0 0 182 100" />
      </defs>

      <g filter={`url(#${ids.ink})`} fill="currentColor" stroke="currentColor">
        {shape === "box" ? (
          <BoxStamp top={top} bottom={bottom} centre={centre} />
        ) : (
          <>
            {/* outer edge */}
            <circle cx="100" cy="100" r="95" fill="none" strokeWidth={shape === "seal" ? 4.5 : 3} />
            {shape === "seal" ? (
              Array.from({ length: 72 }, (_, i) => {
                const a = (i / 72) * Math.PI * 2;
                return (
                  <line
                    key={i}
                    x1={100 + Math.cos(a) * 87.5}
                    y1={100 + Math.sin(a) * 87.5}
                    x2={100 + Math.cos(a) * 92}
                    y2={100 + Math.sin(a) * 92}
                    strokeWidth="1.6"
                  />
                );
              })
            ) : (
              <circle cx="100" cy="100" r="89.5" fill="none" strokeWidth="1.2" />
            )}
            {/* inner band */}
            <circle cx="100" cy="100" r="64" fill="none" strokeWidth={shape === "seal" ? 2.2 : 1.4} />
            {shape === "ring" && (
              <circle cx="100" cy="100" r="59" fill="none" strokeWidth="2.4" strokeDasharray="0.1 5.2" strokeLinecap="round" />
            )}

            {/* lettering around the ring */}
            <text
              stroke="none"
              fontSize={top.length > 24 ? 15.5 : 18}
              letterSpacing={top.length > 24 ? 0.9 : 1.6}
              textAnchor="middle"
              style={{ fontFamily: "var(--font-display)", textTransform: "uppercase" }}
            >
              <textPath href={`#${ids.top}`} startOffset="50%">
                {top}
              </textPath>
            </text>
            <text
              stroke="none"
              fontSize="15.5"
              letterSpacing="2.4"
              textAnchor="middle"
              style={{ fontFamily: "var(--font-display)", textTransform: "uppercase" }}
            >
              <textPath href={`#${ids.bottom}`} startOffset="50%">
                {bottom}
              </textPath>
            </text>
            {/* side stars */}
            <Star x={22.5} y={100} r={4.4} />
            <Star x={177.5} y={100} r={4.4} />

            {/* centre */}
            <line x1="62" y1="80" x2="138" y2="80" strokeWidth="1" />
            <line x1="62" y1="124" x2="138" y2="124" strokeWidth="1" />
            <text
              x="100"
              y="73"
              stroke="none"
              fontSize="8.5"
              letterSpacing="2.4"
              textAnchor="middle"
              style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}
            >
              Book One
            </text>
            <text
              x="100"
              y="117"
              stroke="none"
              fontSize={centre.length > 6 ? 36 : 44}
              textAnchor="middle"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {centre}
            </text>
            <Star x={88} y={137} r={2.8} />
            <Star x={100} y={137} r={2.8} />
            <Star x={112} y={137} r={2.8} />
          </>
        )}
      </g>
    </svg>
  );
}

function BoxStamp({ top, bottom, centre }: { top: string; bottom: string; centre: string }) {
  return (
    <>
      <rect x="9" y="44" width="182" height="112" rx="7" fill="none" strokeWidth="4" />
      <rect x="17" y="52" width="166" height="96" rx="3" fill="none" strokeWidth="1.3" />
      <text
        x="100"
        y="76"
        stroke="none"
        fontSize="17"
        letterSpacing="2.2"
        textAnchor="middle"
        style={{ fontFamily: "var(--font-display)", textTransform: "uppercase" }}
      >
        {top}
      </text>
      <line x1="34" y1="84" x2="166" y2="84" strokeWidth="1" />
      <text
        x="100"
        y="122"
        stroke="none"
        fontSize="40"
        letterSpacing="4"
        textAnchor="middle"
        style={{ fontFamily: "var(--font-display)", textTransform: "uppercase" }}
      >
        {centre}
      </text>
      <Star x={44} y={108} r={5} />
      <Star x={156} y={108} r={5} />
      <line x1="34" y1="128" x2="166" y2="128" strokeWidth="1" />
      <text
        x="100"
        y="142"
        stroke="none"
        fontSize="9.5"
        letterSpacing="2.2"
        textAnchor="middle"
        style={{ fontFamily: "var(--font-mono)", textTransform: "uppercase" }}
      >
        {bottom}
      </text>
    </>
  );
}

function Star({ x, y, r }: { x: number; y: number; r: number }) {
  const pts = Array.from({ length: 10 }, (_, i) => {
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const rr = i % 2 ? r * 0.45 : r;
    return `${(x + Math.cos(a) * rr).toFixed(2)},${(y + Math.sin(a) * rr).toFixed(2)}`;
  }).join(" ");
  return <polygon points={pts} stroke="none" />;
}

/**
 * Honours as a set of stamps.
 *  - "list": a compact stamp beside each honour's name (hero, narrow columns)
 *  - "gallery": larger stamps pressed in a row, captions beneath (acclaim, book pages)
 */
export function HonourStamps({
  honours,
  layout = "list",
  className,
}: {
  honours: Recognition[];
  layout?: "list" | "gallery";
  className?: string;
}) {
  if (honours.length === 0) return null;
  if (layout === "list") {
    return (
      <ul className={cn("space-y-1", className)}>
        {honours.map((h) => (
          <li key={h.id} className="flex items-center gap-3.5">
            <HonourStamp honour={h} className="h-[4.25rem] w-[4.25rem]" />
            <span className="label leading-relaxed text-ink-2">
              {h.label.replace(/,\s*\d{4}.*$/, "")}
              {h.year && <span className="block text-ink-3">{h.kind === "pick" ? h.year : h.year.replace(/–20(\d\d)$/, "–$1")}</span>}
            </span>
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className={cn("grid max-w-[34rem] grid-cols-2 items-start gap-x-5 gap-y-10 sm:grid-cols-3", className)}>
      {honours.map((h) => (
        <li key={h.id} className="flex flex-col items-center text-center">
          <HonourStamp honour={h} className="aspect-square w-full max-w-[9rem]" />
          <span className="mt-3 font-serif text-[0.98rem] leading-snug">{h.label.replace(/,\s*\d{4}.*$/, "")}</span>
          {h.year && <span className="label mt-1 text-ink-3">{h.year}</span>}
        </li>
      ))}
    </ul>
  );
}
