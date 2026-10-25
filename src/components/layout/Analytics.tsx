"use client";

import Script from "next/script";
import { useReportWebVitals } from "next/web-vitals";
import { analyticsConfig, flushAnalytics, track } from "@/lib/analytics";

type Metric = Parameters<Parameters<typeof useReportWebVitals>[0]>[0];
const reportVitals = (metric: Metric) => {
  if (!["LCP", "INP", "CLS"].includes(metric.name)) return;
  track("web_vital", { metric: metric.name, value: Number(metric.value.toFixed(metric.name === "CLS" ? 4 : 1)), rating: metric.rating });
};

export function Analytics() {
  useReportWebVitals(reportVitals);
  if (!analyticsConfig.plausibleDomain) return null;
  return <Script src={analyticsConfig.plausibleSrc} data-domain={analyticsConfig.plausibleDomain} strategy="afterInteractive" onReady={flushAnalytics} />;
}
