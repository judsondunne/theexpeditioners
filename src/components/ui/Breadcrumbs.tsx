import Link from "next/link";
import { JsonLd } from "@/components/ui/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";
import { cn } from "@/lib/cn";

/** Visible breadcrumb trail plus matching BreadcrumbList structured data. */
export function Breadcrumbs({ items, className }: { items: { name: string; path: string }[]; className?: string }) {
  const trail = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className={cn("label", className)}>
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1">
          {trail.map((item, i) => (
            <li key={item.path} className="flex items-center gap-2">
              {i > 0 && <span aria-hidden="true" className="opacity-50">/</span>}
              {i === trail.length - 1 ? (
                <span aria-current="page" className="opacity-70">
                  {item.name}
                </span>
              ) : (
                <Link href={item.path} className="opacity-70 underline-offset-4 hover:underline hover:opacity-100">
                  {item.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(trail)} />
    </>
  );
}
