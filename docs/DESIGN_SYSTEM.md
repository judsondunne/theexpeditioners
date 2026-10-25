# Design system — "The chart room"

## Reference analysis (what we took, what we didn't)

| Reference | Taken | Left behind |
|---|---|---|
| **Stripe Press** (spines) | WebGL books with real spine typography (author · title · mark); click or tap pulls a book from the stack; hover gently enlarges it; background shifts to the book's colour | Their dark-only palette and infinite stack |
| **Agency** (book landing) | Hero composition: big condensed title, serif subtitle, centred cover, review plate with dash pagination, rectangular CTA under the cover | The paper-cut illustration (tried; rejected by the client) and the green |
| **Money in Check** | Faint ruled grid; pencil scribbles; tiny ink figures; word-by-word "ink-in" statement with inline drawings; minimal mouse scroll cue; figure line-up above the footer | Their chess motif; live location |
| **Moebius-style ship drawings** | Ink line + flat accent colour; tiny figures for scale (surveyor on the hero neatline, footer line-up) | Sci-fi subject matter |
| **Steampunk blueprint tank** | Aged paper, technical callouts with leader lines, a single cyan "glow" accent | Faux parchment textures everywhere |
| **Campaign-board desk** | Field-guide sections (Goals/NPCs → places, people, marvels) as typographic dossiers | Photographic props |
| **Keith Thompson plates** | Framed plates: double hairline, engraved small-caps header, figure numbers, italic captions | Creature art |

The common language: **a nineteenth-century survey sheet, printed today.** Ink on field paper, neatlines and graticules, engraved plates, pencil marginalia — with dimensional books and an illuminated canyon relief sitting on top.

## Colour (`src/app/globals.css` → `@theme`)

| Token | Hex | Use |
|---|---|---|
| `paper` / `paper-2` / `paper-3` | #ece3d1 / #e3d7c0 / #d4c4a6 | Page grounds, alternating bands |
| `ink` / `ink-2` / `ink-3` | #1d1915 / #4b4136 / #665847 | Text, rules |
| `sepia` | #4a3726 | Map ink, hero annotations |
| `rust` / `rust-2` | #a33c26 / #8a2f1c | Action colour, highlights, focus ring |
| `brass` | #b8863b | Reserved |
| `signal` | #39c6d6 | Dark-section focus and occasional instrument accents. Never for body text on paper. |
| `night` / `night-2` / `night-3` | #15110e … | Cinematic sections (story, Map Room) |
| `cream` | #efe6d4 | Text on dark |

Per-book palettes (sampled from the covers) live in `src/content/books.ts` → `palette`: canyon plum, deep-sea navy, desert sand. Book pages and the shelf background use them.

## Type

- **League Gothic** — display, always uppercase (`.display`). A 1903 American wood-type gothic.
- **Newsreader** (variable, optical size) — text and editorial statements; light weight at large sizes.
- **IBM Plex Mono** — technical labels, nav (`.label`, `.label-lg`: 11–12px, tracked 0.14–0.16em, uppercase).
- **Reenie Beanie** — pencil notes only (`<Scribble>`), decorative and `aria-hidden`.

Scale is fluid (`clamp`), e.g. hero title `clamp(5.5rem, 8.6vw, 9.25rem)`, section titles `clamp(2rem, 3.6vw, 3.2rem)`, body 17–19px, measure 34rem.

## Components

`Plate` (framed figure) · `Engraving` (public-domain drawing as a CSS mask, recoloured by `currentColor`) · `Scribble` · `ButtonLink` / `ArrowLink` (rectangular, no radius) · `QuoteRotator` · `RetailerLinks` · `Breadcrumbs` · `HeroBook` (CSS 3D paperback) · `TrilogyShelf` + `three/shelf-scene.ts` (WebGL) · `BookViewer` (single-book WebGL) · `HookStory` (pinned scroll story) · `InkStatement` · `MapRoom` + `three/canyon-scene.ts` (3D relief), with `OriginalMap` for the original jacket map.

## Motion rules

- Scroll drives the story; nothing hijacks scroll or delays navigation.
- Only CSS custom properties change per frame; React doesn't re-render while scrolling.
- Ambient motion is minimal (airship drift, book float) and stops under `prefers-reduced-motion`, where the story becomes a plain list and the shelf snaps instead of animating.
- WebGL loads lazily near the viewport and pauses off-screen; a static cover row/image is always the fallback.

## Rules of thumb

- No rounded buttons, gradients-as-decoration, glass, pills or icon grids.
- Engravings are atmosphere, never presented as book illustrations (captions say so).
- Every section has one obvious next step.
