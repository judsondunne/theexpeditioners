"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

export function ShareButton({ title, path, url }: { title: string; path: string; url?: string }) {
  const [status, setStatus] = useState("");
  return <div className="flex flex-wrap items-center justify-center gap-3">
    <button type="button" className="label min-h-11 border border-sepia/35 px-4 text-ink-2 hover:border-rust hover:text-rust" onClick={async () => {
      const shareUrl = url ?? `${window.location.origin}${path}`;
      try {
        if (navigator.share) { await navigator.share({ title, url: shareUrl });track("share_click", { method: "native", article: path }); }
        else if (navigator.clipboard) { await navigator.clipboard.writeText(shareUrl);setStatus("Link copied.");track("share_click", { method: "copy", article: path }); }
        else setStatus(shareUrl);
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) setStatus(shareUrl);
      }
    }}>Share this guide ↗</button>
    <span role="status" className="break-all text-sm text-ink-2">{status}</span>
  </div>;
}
