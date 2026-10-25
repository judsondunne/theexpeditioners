"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/** Records a book page view once per mount (no-op until analytics is configured). */
export function TrackView({ bookSlug }: { bookSlug: string }) {
  useEffect(() => {
    track("book_view", { book: bookSlug });
  }, [bookSlug]);
  return null;
}
