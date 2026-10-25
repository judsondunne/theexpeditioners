/** Optional cookieless measurement. A retailer click is never reported as a sale. */
export type AnalyticsEvent =
  | "cta_click"
  | "retailer_click"
  | "book_view"
  | "sample_open"
  | "educator_download"
  | "newsletter_signup"
  | "newsletter_submit"
  | "newsletter_open"
  | "shelf_interact"
  | "story_complete"
  | "purchase_open"
  | "share_click"
  | "activity_copy"
  | "web_vital";

type Props = Record<string, string | number | boolean>;
declare global {
  interface Window { plausible?: (event: string, options?: { props?: Props }) => void }
}
export const analyticsConfig = {
  plausibleDomain: process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN?.trim() || null,
  plausibleSrc: process.env.NEXT_PUBLIC_PLAUSIBLE_SRC?.trim() || "https://plausible.io/js/script.outbound-links.js",
};
const pending: { event: AnalyticsEvent; props: Props }[] = [];

export function track(event: AnalyticsEvent, props?: Props): void {
  if (typeof window === "undefined") return;
  const context = { ...props, page: window.location.pathname };
  try {
    if (typeof window.plausible === "function") window.plausible(event, { props: context });
    else if (analyticsConfig.plausibleDomain) {
      if (pending.length < 50) pending.push({ event, props: context });
    } else if (process.env.NEXT_PUBLIC_ANALYTICS_DEBUG === "true") console.debug("[analytics]", event, context);
  } catch { /* Measurement must never block buying or navigation. */ }
}

export function flushAnalytics(): void {
  if (typeof window === "undefined" || typeof window.plausible !== "function") return;
  for (const item of pending.splice(0)) {
    try { window.plausible(item.event, { props: item.props }); } catch { /* optional provider */ }
  }
}
