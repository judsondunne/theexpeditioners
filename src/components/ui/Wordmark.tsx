import { cn } from "@/lib/cn";

/** Original cover lettering, traced into a scalable ink silhouette. */
export function Wordmark({ className, compact = false }: { className?: string; compact?: boolean }) {
  return <span aria-hidden="true" className={cn("series-wordmark", compact && "series-wordmark--compact", className)} />;
}
