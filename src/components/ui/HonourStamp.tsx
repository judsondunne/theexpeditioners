import Image from "next/image";
import type { Recognition } from "@/content/types";
import { cn } from "@/lib/cn";

/** The award organisations’ actual artwork, with selection status in live text. */
const marks: Record<string, { src: string; width: number; height: number; href: string }> = {
  bluebonnet: { src: "/images/awards/texas-bluebonnet.jpg", width: 1500, height: 1234, href: "https://txla.org/tools-resources/reading-lists/texas-bluebonnet-award/" },
  dcf: { src: "/images/awards/dorothy-canfield-fisher.jpg", width: 150, height: 116, href: "https://talibrary.org/the-dcf-award/" },
  "indie-next": { src: "/images/awards/indie-next.png", width: 1353, height: 1224, href: "https://www.bookweb.org/marketing/indie-next-list-logos-and-style-guide" },
};
/** Decorative ribbons are distinct from the organisations’ official artwork. */
function AwardRibbon({ id }: { id: string }) {
  return <svg viewBox="0 0 72 88" aria-hidden="true" className="award-ribbon" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
    <path d="M20 49 13 82 28 73 36 85 43 52M38 52 49 84 54 71 67 76 55 45" fill="currentColor" fillOpacity=".09" />
    <path d="m36 4 7 5 9 1 4 8 7 6-1 9 2 9-7 6-4 9-10 1-7 5-8-5-9-1-4-9-7-6 2-9-1-9 7-6 4-8 9-1Z" fill="var(--color-paper)" />
    <circle cx="36" cy="33" r="21" />
    {id === "bluebonnet" ? <><path d="M22 25q8-3 14 2 6-5 14-2v18q-8-3-14 2-6-5-14-2Zm14 2v18M25 30l7 1m8 0 7-1m-22 7 7 1m8 0 7-1" /></> : id === "dcf" ? <><path d="M26 44c5-11 9-21 22-26-1 13-8 21-20 23m0 0 14-17M29 43l-4 6M29 30l4 7m3-13 4 6" /></> : <><path d="M23 43c0-13 5-23 13-23s13 10 13 23M25 42h22M31 43v5m10-5v5M31 28l4 5 8-9" /></>}
  </svg>;
}
export function HonourStamp({ honour, className, appearance = "art" }: { honour: Recognition; className?: string; appearance?: "art" | "ribbon" }) {
  const mark = marks[honour.id];
  if (!mark) return null;
  return <span className={cn("award-art", appearance === "ribbon" && `award-art--ribbon award-art--${honour.id}`, className)}>
    {appearance === "ribbon" ? <AwardRibbon id={honour.id} /> : <Image src={mark.src} alt="" aria-hidden="true" width={mark.width} height={mark.height} sizes="160px" className="h-full w-full object-contain" />}
  </span>;
}
export function HonourStamps({ honours, layout = "list", appearance = "art", className }: { honours: Recognition[]; layout?: "list" | "gallery"; appearance?: "art" | "ribbon"; className?: string }) {
  if (!honours.length) return null;
  return <ul className={cn(layout === "list" ? "award-list" : "award-gallery", className)}>
    {honours.map(honour => <li key={honour.id}>
      <a href={marks[honour.id]?.href} target="_blank" rel="noopener" className="award-link">
        <HonourStamp honour={honour} appearance={appearance} />
        <span className="award-description"><span>{honour.id === "bluebonnet" ? "Texas Bluebonnet Award" : honour.id === "dcf" ? "Dorothy Canfield Fisher Award" : "Indie Next List"}</span><span className="award-status">{honour.kind === "pick" ? "Winter pick" : "Master List nominee"} · {honour.year}</span></span>
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </li>)}
  </ul>;
}
