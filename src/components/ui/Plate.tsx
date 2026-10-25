import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * A framed plate in the manner of a naturalist's or naval architect's sheet:
 * a double hairline frame, an engraved small-caps header, optional figure
 * number and caption.
 */
export function Plate({
  title,
  figure,
  caption,
  children,
  className,
  tone = "paper",
  as: Tag = "figure",
}: {
  title?: ReactNode;
  figure?: string;
  caption?: ReactNode;
  children: ReactNode;
  className?: string;
  tone?: "paper" | "night";
  as?: "figure" | "div" | "section" | "article";
}) {
  const night = tone === "night";
  return (
    <Tag
      className={cn(
        "relative border p-1.5",
        night ? "border-cream/30 text-cream" : "border-ink/45 text-ink",
        className,
      )}
    >
      <div className={cn("relative h-full border", night ? "border-cream/20" : "border-ink/25")}>
        {(title || figure) && (
          <div
            className={cn(
              "flex items-baseline justify-between gap-4 border-b px-4 py-2.5",
              night ? "border-cream/20" : "border-ink/25",
            )}
          >
            {title && <span className="plate-caps text-[0.95rem]">{title}</span>}
            {figure && <span className="label opacity-70">{figure}</span>}
          </div>
        )}
        <div className="relative">{children}</div>
        {caption && (
          <figcaption
            className={cn(
              "border-t px-4 py-2.5 text-[0.9rem] italic leading-snug",
              night ? "border-cream/20 text-cream/75" : "border-ink/25 text-ink-2",
            )}
          >
            {caption}
          </figcaption>
        )}
      </div>
    </Tag>
  );
}
