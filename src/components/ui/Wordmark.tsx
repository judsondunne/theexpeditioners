import { cn } from "@/lib/cn";

/** Original cover lettering, traced into a scalable ink silhouette. */
export function Wordmark({ className }: { className?: string }) {
  return <span aria-hidden="true" className={cn("series-wordmark", className)} />;
}
