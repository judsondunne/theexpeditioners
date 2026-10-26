import { useId } from "react";
import Image from "next/image";
import type { Recognition } from "@/content/types";
import { cn } from "@/lib/cn";

/** The award organisations’ actual artwork, with selection status in live text. */
const marks: Record<string, { src: string; width: number; height: number; href: string }> = {
  bluebonnet: { src: "/images/awards/texas-bluebonnet.jpg", width: 1500, height: 1234, href: "https://txla.org/tools-resources/reading-lists/texas-bluebonnet-award/" },
  dcf: { src: "/images/awards/dorothy-canfield-fisher.jpg", width: 150, height: 116, href: "https://talibrary.org/the-dcf-award/" },
  "indie-next": { src: "/images/awards/indie-next.png", width: 1353, height: 1224, href: "https://www.bookweb.org/marketing/indie-next-list-logos-and-style-guide" },
};
/** Engraved brass seals, pleated fabric and folded satin ribbon tails. */
function AwardRibbon({ id }: { id: string }) {
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const variant = id === "bluebonnet" ? "blue" : id === "dcf" ? "wine" : "gold";
  const fabric = variant === "blue"
    ? ["#a2b1b7", "#526b79", "#304854"]
    : variant === "wine" ? ["#b28879", "#82554b", "#55382f"] : ["#dfc58c", "#b18b4a", "#80602f"];
  const metal = `${uid}metal`, rim = `${uid}rim`, cloth = `${uid}cloth`, tail = `${uid}tail`, face = `${uid}face`;
  const polar = (radius: number, angle: number) => `${(88 + Math.cos(angle) * radius).toFixed(2)},${(70 + Math.sin(angle) * radius).toFixed(2)}`;
  const points = Array.from({ length: 96 }, (_, i) => polar(i % 2 ? 58 : 64, i * Math.PI / 48 - Math.PI / 2)).join(" ");
  return <svg viewBox="0 0 176 208" aria-hidden="true" className="award-ribbon" fill="none">
    <defs>
      <linearGradient id={cloth} x1="35" y1="10" x2="135" y2="135" gradientUnits="userSpaceOnUse"><stop stopColor={fabric[0]} /><stop offset=".32" stopColor={fabric[1]} /><stop offset=".64" stopColor={fabric[0]} /><stop offset="1" stopColor={fabric[2]} /></linearGradient>
      <linearGradient id={tail} x1="55" y1="110" x2="108" y2="185" gradientUnits="userSpaceOnUse"><stop stopColor={fabric[2]} /><stop offset=".3" stopColor={fabric[1]} /><stop offset=".6" stopColor={fabric[0]} /><stop offset=".8" stopColor={fabric[1]} /><stop offset="1" stopColor={fabric[2]} /></linearGradient>
      <linearGradient id={metal} x1="49" y1="26" x2="125" y2="119" gradientUnits="userSpaceOnUse"><stop stopColor="#f2dfad" /><stop offset=".24" stopColor="#c5a362" /><stop offset=".48" stopColor="#ead396" /><stop offset=".7" stopColor="#a58040" /><stop offset="1" stopColor="#dfc181" /></linearGradient>
      <linearGradient id={rim} x1="49" y1="25" x2="125" y2="116" gradientUnits="userSpaceOnUse"><stop stopColor="#f8eac4" /><stop offset=".45" stopColor="#a38147" /><stop offset=".65" stopColor="#f3dca1" /><stop offset="1" stopColor="#72552c" /></linearGradient>
      <radialGradient id={face} cx=".38" cy=".3" r=".75"><stop stopColor="#e8ce92" /><stop offset="1" stopColor="#b58f4d" /></radialGradient>
    </defs>
    {/* Satin tails: their folded tops sit behind the rosette. */}
    <path d="m48 102-15 83 24-10 17 22 16-83Z" fill={`url(#${tail})`} stroke={fabric[2]} strokeWidth="1" />
    <path d="m87 113 18 83 16-23 24 9-19-82Z" fill={`url(#${tail})`} stroke={fabric[2]} strokeWidth="1" />
    <path d="m52 116-11 58m23-52-11 47m61-52 13 50m-25-43 10 47" stroke={fabric[0]} strokeWidth="1.1" opacity=".75" />
    <path d="m47 111 10 63 17 23 13-77m28-12 6 65 24 9-19-82" fill={fabric[2]} opacity=".13" />
    {/* Forty-eight separately shaded folds give the rosette a fabric edge. */}
    <polygon points={points} fill={`url(#${cloth})`} stroke={fabric[2]} strokeWidth=".9" />
    {Array.from({ length: 48 }, (_, i) => {
      const angle = i * Math.PI / 24 - Math.PI / 2;
      return <path key={i} d={`M${polar(44, angle)} L${polar(64, angle)} L${polar(57, angle + Math.PI / 48)} Z`} fill={i % 2 ? fabric[0] : fabric[2]} opacity={i % 2 ? ".42" : ".48"} />;
    })}
    <circle cx="88" cy="70" r="47" fill={`url(#${rim})`} stroke="#74582e" strokeWidth="1" />
    <circle cx="88" cy="69" r="42.5" fill={`url(#${metal})`} stroke="#f0dca8" strokeWidth="1.5" />
    <circle cx="88" cy="69" r="37" fill={`url(#${face})`} stroke="#99733b" strokeWidth="1" />
    <circle cx="88" cy="69" r="33.5" stroke="#f6e2ad" strokeWidth=".8" />
    {Array.from({ length: 60 }, (_, i) => {
      const a = i * Math.PI / 30;
      return <circle key={i} cx={88 + Math.cos(a) * 40} cy={69 + Math.sin(a) * 40} r=".65" fill="#7e5e2d" opacity=".75" />;
    })}
    {/* An engraved laurel, rather than a modern pictogram. */}
    <g stroke="#85612f" strokeWidth="1.2" strokeLinecap="round">
      <path d="M86 95C59 85 57 58 73 44M90 95c27-10 29-37 13-51" />
      {Array.from({ length: 6 }, (_, i) => {
        const y = 49 + i * 7;
        const x = 65 - Math.sin(i / 5 * Math.PI) * 5 + i * 1.5;
        return <g key={i}>
          <path d={`M${x + 5} ${y + 4}q-13-2-12-12 10 2 12 12Z`} fill="#a48042" fillOpacity=".42" />
          <path d={`M${176 - x - 5} ${y + 4}q13-2 12-12-10 2-12 12Z`} fill="#a48042" fillOpacity=".42" />
        </g>;
      })}
      <path d="m81 98 7-6 7 6M78 99h20" />
    </g>
    <path d="m88 48 5 15 15 5-15 5-5 15-5-15-15-5 15-5Z" fill="#b48b46" opacity=".48" />
    <path d="m88 49 4 15 15 4-15 4-4 15-4-15-15-4 15-4Z" stroke="#f1d89c" strokeWidth="1" />
    <path d="M56 42c16-17 43-20 63-1" stroke="#fff0c8" strokeWidth="1.4" opacity=".7" />
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
