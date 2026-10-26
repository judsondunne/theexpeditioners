import Image from "next/image";
import type { Recognition } from "@/content/types";
import { cn } from "@/lib/cn";

/** The award organisations’ actual artwork, with selection status in live text. */
const marks: Record<string, { src: string; width: number; height: number; href: string }> = {
  bluebonnet: { src: "/images/awards/texas-bluebonnet.jpg", width: 1500, height: 1234, href: "https://txla.org/tools-resources/reading-lists/texas-bluebonnet-award/" },
  dcf: { src: "/images/awards/dorothy-canfield-fisher.jpg", width: 150, height: 116, href: "https://talibrary.org/the-dcf-award/" },
  "indie-next": { src: "/images/awards/indie-next.png", width: 1353, height: 1224, href: "https://www.bookweb.org/marketing/indie-next-list-logos-and-style-guide" },
};
export function HonourStamp({ honour, className }: { honour: Recognition; className?: string }) {
  const mark = marks[honour.id];
  if (!mark) return null;
  return <span className={cn("award-art", className)}><Image src={mark.src} alt="" aria-hidden="true" width={mark.width} height={mark.height} sizes="160px" className="h-full w-full object-contain" /></span>;
}
export function HonourStamps({ honours, layout = "list", className }: { honours: Recognition[]; layout?: "list" | "gallery"; className?: string }) {
  if (!honours.length) return null;
  return <ul className={cn(layout === "list" ? "award-list" : "award-gallery", className)}>
    {honours.map(honour => <li key={honour.id}>
      <a href={marks[honour.id]?.href} target="_blank" rel="noopener" className="award-link">
        <HonourStamp honour={honour} />
        <span className="award-description"><span>{honour.id === "bluebonnet" ? "Texas Bluebonnet Award" : honour.id === "dcf" ? "Dorothy Canfield Fisher Award" : "Indie Next List"}</span><span className="award-status">{honour.kind === "pick" ? "Winter pick" : "Master List nominee"} · {honour.year}</span></span>
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </li>)}
  </ul>;
}
