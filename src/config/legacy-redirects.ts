/**
 * Permanent redirects from the original series site (sstaylorbooks.com, a
 * Tumblr blog) to their closest equivalents here. Inventory and reasoning:
 * docs/DOMAIN_MIGRATION.md and docs/old-site-url-inventory.tsv.
 *
 * OFF by default. They only matter once the old domain points at this
 * deployment, so enable with LEGACY_REDIRECTS=true after the family confirms
 * ownership of the domain. When LEGACY_HOST is set, rules apply only to
 * requests for that host.
 */
type Redirect = { source: string; destination: string; permanent: true; has?: { type: "host"; value: string }[] };

const map: [string, string][] = [
  ["/AboutTheBook", "/books"],
  ["/BuyTheBook", "/books"],
  ["/BuyTheBooks", "/books"],
  ["/Author", "/about#author"],
  ["/TheIllustrator", "/about#illustrator"],
  ["/Contact", "/about#author"],
  ["/ChapterOne", "/books/the-treasure-of-drowned-mans-canyon"],
  ["/Trailer", "/books"],
  ["/NewsandReviews", "/books"],
  ["/SigningsandAppearances", "/about"],
  ["/signingsandappearances", "/about"],
  ["/DesignYourOwnExplorersVest", "/educators#explorers-vest"],
  ["/DesignYourOwnMapoftheWorld", "/educators#map-the-mistake"],
  ["/post/:id/:slug*", "/journal"],
  ["/post/:id", "/journal"],
  ["/archive/:path*", "/journal"],
  ["/page/:n", "/journal"],
  ["/tagged/:tag*", "/journal"],
  ["/image/:id", "/explore#art"],
  ["/rss", "/journal"],
  ["/random", "/"],
  ["/day", "/"],
];

export function legacyRedirects(): Redirect[] {
  if (process.env.LEGACY_REDIRECTS !== "true") return [];
  const host = process.env.LEGACY_HOST?.trim();
  return map.map(([source, destination]) => ({
    source,
    destination,
    permanent: true,
    ...(host ? { has: [{ type: "host" as const, value: host }] } : {}),
  }));
}
