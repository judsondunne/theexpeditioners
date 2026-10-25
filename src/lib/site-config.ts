export function resolveSiteConfig({ origin, indexable, deployment }: { origin?: string; indexable?: string; deployment?: string }) {
  const raw = origin?.trim();
  const requested = indexable === "true";
  if (!raw) {
    if (requested) throw new Error("SITE_INDEXABLE=true requires NEXT_PUBLIC_SITE_URL to be the production HTTPS origin.");
    return { url: "http://localhost:3000", indexable: false };
  }
  const url = new URL(raw);
  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || url.search || url.hash || url.pathname !== "/") {
    throw new Error("NEXT_PUBLIC_SITE_URL must be an HTTP(S) origin, without credentials, a path, query or fragment.");
  }
  const host = url.hostname;
  const local = host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local") || host.endsWith(".test") || host === "[::1]" || /^(127\.|0\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)\d/.test(host);
  if (requested && (url.protocol !== "https:" || local)) throw new Error("Search indexing requires a public HTTPS production origin.");
  return { url: url.origin, indexable: requested && deployment !== "preview" && !local };
}
