import type { CSSProperties } from "react";
import { spots, type SpotName } from "@/content/engravings";
import { cn } from "@/lib/cn";

/**
 * A public-domain line drawing printed in the current text colour.
 * The drawing is used as a CSS mask, so `text-ink`, `text-cream`, `text-rust`
 * etc. recolour it. Always decorative (hidden from assistive tech).
 */
export function Engraving({
  name,
  className,
  style,
  flip = false,
  size,
}: {
  name: SpotName;
  className?: string;
  style?: CSSProperties;
  flip?: boolean;
  size?: number;
}) {
  const s = spots[name];
  const requested = size ?? (name === "compass-rose" || name === "gear" ? 480 : name === "airship" ? 240 : 96);
  const widths = [96, 192, 240, 480, 720];
  const width = widths.find(width => width >= requested) ?? 720;
  const retina = widths.find(candidate => candidate >= width * 2) ?? 720;
  const src = `/images/optimized/${name}-${retina}.webp`;
  const url = `image-set(url("/images/optimized/${name}-${width}.webp") 1x, url("${src}") 2x)`;
  return (
    <span
      aria-hidden="true"
      className={cn("pointer-events-none block select-none", className)}
      style={{
        aspectRatio: `${s.w} / ${s.h}`,
        backgroundColor: "currentColor",
        WebkitMaskImage: `url("${src}")`,
        maskImage: url,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
        transform: flip ? "scaleX(-1)" : undefined,
        ...style,
      }}
    />
  );
}
