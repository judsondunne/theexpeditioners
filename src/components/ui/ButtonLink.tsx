import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "ink" | "paper" | "rust" | "outline" | "outline-light";

const variants: Record<Variant, string> = {
  ink: "bg-ink text-cream hover:bg-rust",
  paper: "bg-cream text-ink hover:bg-white",
  rust: "bg-rust text-cream hover:bg-rust-2",
  outline: "border border-ink/70 text-ink hover:bg-ink hover:text-cream",
  "outline-light": "border border-cream/60 text-cream hover:bg-cream hover:text-ink",
};

const base =
  "group inline-flex min-h-12 items-center justify-center gap-3 px-6 label-lg transition-colors duration-200 ease-out";

export function ButtonLink({
  href,
  children,
  variant = "ink",
  className,
  arrow = true,
  external,
  ...rest
}: {
  href: string;
  children: ReactNode;
  variant?: Variant;
  className?: string;
  arrow?: boolean;
  external?: boolean;
} & Omit<ComponentProps<"a">, "href" | "children" | "className">) {
  const content = (
    <>
      <span>{children}</span>
      {arrow && (
        <span aria-hidden="true" className="transition-transform duration-300 ease-out group-hover:translate-x-1">
          {external ? "↗" : "→"}
        </span>
      )}
    </>
  );
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener" className={cn(base, variants[variant], className)} {...rest}>
        {content}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={cn(base, variants[variant], className)} {...rest}>
      {content}
    </Link>
  );
}

/** An inline text link with an arrow, for secondary actions. */
export function ArrowLink({
  href,
  children,
  className,
}: {
  href: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "group inline-flex items-center gap-2 label-lg underline decoration-current/30 underline-offset-[6px] transition-colors hover:decoration-current",
        className,
      )}
    >
      {children}
      <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-1">
        →
      </span>
    </Link>
  );
}
