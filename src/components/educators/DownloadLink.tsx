"use client";

import { track } from "@/lib/analytics";

/** A clearly labelled file download that records an educator_download event. */
export function DownloadLink({ href, label, meta, id }: { href: string; label: string; meta?: string; id: string }) {
  return (
    <a
      href={href}
      download
      onClick={() => track("educator_download", { resource: id })}
      className="group inline-flex min-h-12 items-center gap-4 border border-ink/50 px-5 transition-colors hover:bg-ink hover:text-cream"
    >
      <span aria-hidden="true" className="label-lg">↓</span>
      <span className="label-lg">{label}</span>
      {meta && <span className="label text-ink-3 group-hover:text-cream/70">{meta}</span>}
    </a>
  );
}
