import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/cn";

/**
 * Pencil marginalia: coordinates, bearings, question marks. Purely decorative,
 * so it is hidden from screen readers and never carries information.
 */
export function Scribble({
  children,
  className,
  rotate = -4,
  style,
}: {
  children: ReactNode;
  className?: string;
  rotate?: number;
  style?: CSSProperties;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("hand pointer-events-none absolute select-none whitespace-nowrap text-[1.35rem] opacity-60", className)}
      style={{ transform: `rotate(${rotate}deg)`, ...style }}
    >
      {children}
    </span>
  );
}
