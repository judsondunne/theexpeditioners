"use client";

import { useState } from "react";
import { track } from "@/lib/analytics";

/**
 * Adult-directed updates. If no newsletter provider is configured, we do not
 * pretend to collect anything: we link to the author's existing newsletter.
 *
 * To connect a provider, set NEXT_PUBLIC_NEWSLETTER_ACTION to the provider's
 * form endpoint (it must accept a POST with an `email` field and allow CORS),
 * e.g. a Buttondown or Mailchimp embed action URL. See docs/LAUNCH_CHECKLIST.md.
 */
const ACTION = process.env.NEXT_PUBLIC_NEWSLETTER_ACTION?.trim() || "";
const AUTHOR_NEWSLETTER = "https://www.sarahstewarttaylor.com/newsletters";

export function NewsletterSignup() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");

  if (!ACTION) {
    return (
      <div className="border-t border-ink/20 pt-5">
        <p className="label text-ink-3">For parents, teachers &amp; grown-up readers</p>
        <p className="mt-2 font-serif text-[1.02rem] leading-snug text-ink-2">
          News about the books arrives through the author&rsquo;s newsletter.
        </p>
        <a
          href={AUTHOR_NEWSLETTER}
          onClick={() => track("newsletter_open", { location: "footer" })}
          target="_blank"
          rel="noopener"
          className="label-lg mt-3 inline-flex items-center gap-2 underline decoration-ink/30 underline-offset-[6px] hover:text-rust"
        >
          Sign up at sarahstewarttaylor.com <span aria-hidden="true">↗</span>
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    );
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setState("sending");
    try {
      const res = await fetch(ACTION, { method: "POST", body: data });
      if (!res.ok) throw new Error(String(res.status));
      setState("done");
      track("newsletter_submit");
      form.reset();
    } catch {
      setState("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="border-t border-ink/20 pt-5" noValidate={false}>
      <p className="label text-ink-3" id="newsletter-label">
        For parents, teachers &amp; grown-up readers
      </p>
      <p className="mt-2 font-serif text-[1.02rem] leading-snug text-ink-2">
        Occasional news about the books. Adults only, please — we don&rsquo;t collect children&rsquo;s details.
      </p>
      <div className="mt-3 flex">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          className="min-h-12 w-full border border-ink/50 bg-transparent px-4 font-serif text-[1rem] placeholder:text-ink-3 focus:border-ink"
        />
        <button type="submit" disabled={state === "sending"} className="label-lg min-h-12 shrink-0 bg-ink px-5 text-cream hover:bg-rust disabled:opacity-60">
          {state === "sending" ? "Sending…" : "Sign up"}
        </button>
      </div>
      <p role="status" aria-live="polite" className="label mt-3 min-h-4 text-ink-2">
        {state === "done" && "Thank you — please check your inbox to confirm."}
        {state === "error" && "Something went wrong. Please try again in a moment."}
      </p>
    </form>
  );
}
