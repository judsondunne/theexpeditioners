"use client";

import type { PurchaseLink, RetailerId } from "@/content/types";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";

const retailerNames: Record<RetailerId, { name: string; note?: string }> = {
  bookshop: { name: "Bookshop.org", note: "Supports independent bookstores" },
  "barnes-noble": { name: "Barnes & Noble" },
  amazon: { name: "Amazon" },
  indiebound: { name: "IndieBound" },
  worldcat: { name: "Your local library", note: "Find a copy via WorldCat" },
  publisher: { name: "The publisher" },
};

/**
 * Verified retailer links only. Each is a plain outbound link, clearly
 * labelled; we record the click (never a "purchase").
 */
export function RetailerLinks({
  links,
  bookSlug,
  tone = "paper",
  layout = "list",
  location = "book-buy-section",
  featured = false,
}: {
  links: PurchaseLink[];
  bookSlug: string;
  tone?: "paper" | "night";
  layout?: "list" | "row";
  location?: string;
  featured?: boolean;
}) {
  const verified = links.filter((l) => l.verified);
  if (verified.length === 0) {
    return (
      <p className={cn("font-serif italic", tone === "night" ? "text-cream/70" : "text-ink-2")}>
        Retailer links are being confirmed. In the meantime, ask any bookshop or library for the title by name.
      </p>
    );
  }
  const night = tone === "night";
  return (
    <ul className={cn(layout === "row" ? "flex flex-wrap gap-3" : "divide-y border-y", night ? "divide-cream/20 border-cream/20" : "divide-ink/15 border-ink/15")}>
      {verified.map((l, index) => {
        const r = retailerNames[l.retailer];
        const library = l.retailer === "worldcat";
        return (
          <li key={l.url} className={layout === "row" ? "" : ""}>
            <a
              href={l.url}
              target="_blank"
              rel="noopener"
              onClick={() =>
                track("retailer_click", {
                  retailer: l.retailer,
                  book: bookSlug,
                  format: l.format ?? "unknown",
                  location,
                })
              }
              className={cn(
                "group flex items-center justify-between gap-6 transition-colors",
                featured && index === 0 && !library && (night ? "purchase-retailer-primary purchase-retailer-primary--night" : "purchase-retailer-primary"),
                layout === "row"
                  ? cn(
                      "min-h-12 border px-5",
                      night ? "border-cream/40 hover:bg-cream hover:text-ink" : "border-ink/40 hover:bg-ink hover:text-cream",
                    )
                  : cn("py-4", night ? "hover:text-white" : "hover:text-rust"),
              )}
            >
              <span className="flex flex-col">
                <span className={cn(layout === "row" ? "label-lg" : "font-serif text-[1.2rem] leading-tight")}>
                  {library ? r.name : `Buy at ${r.name}`}
                </span>
                {layout === "list" && (r.note || l.format) && (
                  <span className={cn("label mt-1", night ? "text-cream/55" : "text-ink-3")}>
                    {[l.format && !library ? `${l.format}` : null, l.note ?? r.note].filter(Boolean).join(" · ")}
                  </span>
                )}
              </span>
              <span aria-hidden="true" className="label-lg transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                ↗
              </span>
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
