import type { Metadata, Viewport } from "next";
import { Analytics } from "@/components/layout/Analytics";
import { PurchaseDock } from "@/components/purchase/PurchaseDock";
import { purchaseBook } from "@/lib/purchase";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { JsonLd } from "@/components/ui/JsonLd";
import { books } from "@/content/books";
import { site } from "@/content/site";
import { fontVariables } from "@/lib/fonts";
import { organizationSchema, websiteSchema } from "@/lib/schema";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "The Expeditioners — An Illustrated Adventure Trilogy by S. S. Taylor",
    template: "%s · The Expeditioners",
  },
  description: site.description,
  applicationName: site.name,
  verification: { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined, other: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } : undefined },
  authors: [{ name: "S. S. Taylor" }],
  creator: "S. S. Taylor",
  robots: site.indexable ? { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } } : { index: false, follow: false },
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale,
  },
  twitter: { card: "summary_large_image" },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: site.themeColor,
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={fontVariables}>
      <body>
        <SiteHeader purchases={books.map(purchaseBook)} />
        <main id="main" tabIndex={-1} className="outline-none">
          {children}
        </main>
        <SiteFooter />
        <PurchaseDock books={books.map(purchaseBook)} />
        <JsonLd data={[websiteSchema(), organizationSchema()]} />
        <Analytics />
      </body>
    </html>
  );
}
