# The Expeditioners — official website

[![Site checks](https://github.com/judsondunne/theexpeditioners/actions/workflows/checks.yml/badge.svg)](https://github.com/judsondunne/theexpeditioners/actions/workflows/checks.yml)

The digital home of **The Expeditioners**, the illustrated middle-grade adventure trilogy by S. S. Taylor (Sarah Stewart Taylor), illustrated by Katherine Roy.

Built with Next.js 16 (App Router, fully static), TypeScript, Tailwind CSS 4 and three.js. No database, CMS, login or shop: book content lives in typed files, and purchases go to verified retailers.

Live site: [theexpeditioners.vercel.app](https://theexpeditioners.vercel.app) · Source: [judsondunne/theexpeditioners](https://github.com/judsondunne/theexpeditioners)

## Deployment and checks

The Vercel project is `judderbudders-projects/theexpeditioners`. Pushes to `main` deploy production; pull requests receive Vercel previews. `vercel.json` selects the Next.js framework. Production environment variables are managed in Vercel: `NEXT_PUBLIC_SITE_URL=https://theexpeditioners.vercel.app` and `SITE_INDEXABLE=true`. Preview builds remain noindex.

GitHub Actions runs lint, the production build (including TypeScript checks), and Playwright tests on pushes to `main` and pull requests. Local credentials, `.env.local`, generated builds and test output are excluded from Git. After deploying, run `npm run check:launch -- https://theexpeditioners.vercel.app` to verify public crawl settings and metadata.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build && npm start     # production build
npm run art:optimize             # regenerate responsive decorative art after source edits
npm run lint
npm run typecheck
npm test                        # builds, then runs unit + end-to-end tests (Playwright)
```

First run of the tests may need the browser: `npx playwright install chromium`.

## What's where

```
src/content/      ← all words, facts, links (edit these)
  books.ts          titles, synopses, editions & ISBNs, retailer links, palettes
  praise.ts         review quotes and honours
  people.ts         author and illustrator
  world.ts          characters, places, machines, Map Room labels
  story.ts          the homepage scroll story
  educators.ts      themes, discussion questions, activities
  journal.tsx       journal articles
  engravings.ts     public-domain drawings and maps (with credits)
  site.ts           domain, navigation, tagline
src/app/          routes (home, books, explore, educators, about, journal, privacy, 404, sitemap, robots, social images)
src/components/   UI — home/ (hero, story, shelf), book/, explore/, layout/, ui/, three/ (WebGL shelf)
src/lib/          SEO metadata, JSON-LD, analytics, fonts
public/images/    covers, textures, art, engravings, maps
assets-src/       original source files + scripts/art/*.py to regenerate web assets
docs/             research, design system, SEO, assets, verification, launch, domain, analytics
tests/            unit (content integrity) and e2e (pages, SEO, layout, keyboard)
```

## Editing content

Everything a visitor reads comes from `src/content/`. You never need to touch components to:

- **Change a synopsis or hook** — edit `books.ts`. Keep the `status` honest (`original-copy`, `verified`…).
- **Add or fix a retailer link** — add to the book's `purchase` array with `verified: true` once you've checked it opens the right edition. Unverified links are kept but never shown.
- **Add a review quote** — add to `praise.ts` with its source. Keep quotes short and exact; tests fail above 15 words.
- **Publish a reading sample** — set the book's `sample` (title, paragraphs, who approved it).
- **Add a journal article** — add an entry to `journal.tsx` with `isPublished: true`. It is routed, listed and added to the sitemap automatically.

Then run `npm run test:unit` to check ISBNs, sources and files.

## How the special pieces work

- **3D shelf** (`src/components/three/shelf-scene.ts`): real paperback geometry, thickness from page counts, real front and back cover textures, spine artwork drawn at runtime from each cover's edge colours. Lazy-loaded near the viewport, paused off-screen, with an HTML fallback and keyboard tabs. Click or tap to select; hover only enlarges a waiting book.
- **Scroll story** (`src/components/home/HookStory.tsx`): a pinned stage that writes CSS variables on scroll. Five scenes: machines, uncharted lands, a typeset newspaper, the canyon trail, and the closing question. The opening is centered with a filled year counter. The original map scan, word-by-word narration, progress rail and scroll-driven artwork remain; stacked scenes support reduced motion.
- **Map Room** (`src/components/explore/MapRoom.tsx`): a continuous 3D canyon relief, with orbit, camera presets, zoom, and ten selectable locations from Katherine Roy's jacket map. Elevations are an artistic interpretation. The original 2D map remains available, including as a WebGL fallback.

## Configuration

Copy `.env.example` → `.env.local`. Without `NEXT_PUBLIC_SITE_URL` and `SITE_INDEXABLE=true`, the site is **noindex** everywhere (safe for previews). Analytics and newsletter stay off until configured.

## Before launch

Read [`docs/LAUNCH_CHECKLIST.md`](docs/LAUNCH_CHECKLIST.md). In short: rights approval for the series art, family sign-off on copy, a legal look at the privacy page, and the domain decision in [`docs/DOMAIN_MIGRATION.md`](docs/DOMAIN_MIGRATION.md).
