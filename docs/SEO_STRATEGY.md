# SEO strategy

## Information architecture

```
/                                  Series home → Book One
/books                             "The Expeditioners books in order" (BookSeries + FAQPage)
/books/the-treasure-of-drowned-mans-canyon   Book One (Book, Breadcrumb)
/books/the-secret-of-king-tritons-lair        Book Two
/books/the-lost-city-of-maps                  Book Three
/explore                           World guide + Map Room
/educators                         Classroom resources (+ /educators/field-sheet, noindex)
/about                             Author (Person, alternateName) + illustrator + credits
/journal, /journal/[slug]          Two published articles (Article)
/privacy                           Policy
```

Every page has a unique `<title>` and description, a canonical URL, Open Graph/Twitter tags (generated cards for the site and each book), semantic headings (one `h1`), breadcrumbs (visible + JSON-LD) and an obvious next step.

## Intent → page

| Priority | Query intent | Target |
|---|---|---|
| A | "the expeditioners" / official site | `/` |
| A | "the expeditioners books in order" — no good answer ranks today | `/books` |
| A | book titles | `/books/[slug]` |
| A | "s. s. taylor expeditioners", "sarah stewart taylor expeditioners" | `/about` (+ `Person.alternateName`) |
| A | where to buy | `/books/[slug]#buy` |
| B | middle-grade adventure with maps / steampunk for kids | `/explore`, journal |
| C | mapmaking activity, discussion questions | `/educators` |

These are hypotheses, not measured keyword volumes. Check them in Search Console after launch.

## Technical

- **Rendering:** everything statically generated; book copy is in the HTML (no client-only content). WebGL is decoration over server-rendered fallbacks.
- **Canonical domain:** `NEXT_PUBLIC_SITE_URL`. **Indexing:** only when `SITE_INDEXABLE=true`. Otherwise `robots.txt` disallows all and pages carry `noindex`, so preview deployments never compete with production.
- **Sitemap** (`/sitemap.xml`) lists only canonical, indexable routes with cover images. Unknown slugs return a real **404** (`dynamicParams = false`).
- **Structured data** (`src/lib/schema.ts`): `WebSite`, `BookSeries`, `Book` (with `workExample` editions, ISBNs, formats, `position`, `isPartOf`), `Person` (S. S. Taylor with `alternateName: Sarah Stewart Taylor`, Katherine Roy), `BreadcrumbList`, `Article`, `FAQPage`. **Never** prices, offers, availability or ratings. Structured data doesn't guarantee rich results.
- **Performance:** fonts self-hosted via `next/font`; images through `next/image` (AVIF/WebP); three.js loaded only near the shelf; story updates write only CSS variables.

## AI-assisted discovery

The same things help: clear bibliographic facts, author identity linked across names, accessible HTML, plainly worded FAQs. No `llms.txt` and no gimmicks.

## After launch

1. Verify the domain in Google Search Console and Bing Webmaster Tools; submit `/sitemap.xml`.
2. Validate structured data with the Rich Results Test and the Schema.org validator.
3. Watch the "books in order" and title queries; extend the journal only with genuinely useful pieces (planned topics in `src/content/journal.tsx`).

## Implemented conversion and discovery expansion

- `/buy`: clear purchase intent, actual retailer links and ordering ISBNs for all three books.
- `/journal/what-is-steampunk-for-young-readers`: an introductory genre guide connected to the trilogy and Map Room.
- `/journal/how-to-make-a-book-cipher`: a worked activity and functioning encoder, connected to the educator resources and Book One.
- All guide pages have individual social images, clean sharing URLs and related internal links.
- Book pages and reading-order pages carry Book and ItemList data; the visible FAQs remain useful without relying on FAQ rich-result eligibility.
- Google/Bing ownership verification is configurable. Production indexing requires a public HTTPS origin and explicit enablement; previews remain excluded.

The remaining launch dependency is the real public origin and connected search accounts. `npm run check:launch -- https://THE_DOMAIN` checks the public deployment before sitemap submission. See `GROWTH_PLAN.md` for acquisition and measurement, rather than treating metadata alone as a sales strategy.
