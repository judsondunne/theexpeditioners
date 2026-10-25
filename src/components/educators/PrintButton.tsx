"use client";

export function PrintButton() {
  return (
    <button type="button" onClick={() => window.print()} className="label-lg inline-flex min-h-11 items-center bg-ink px-5 text-cream hover:bg-rust">
      Print this sheet
    </button>
  );
}
