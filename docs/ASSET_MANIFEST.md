# Asset manifest

Rights states: **PD** public domain · **SITE** made for this site · **PENDING** official series material needing rights-holder sign-off before public launch.

## Official series material (PENDING)

| File | Use | Source | Alt text | Notes / missing variants |
|---|---|---|---|---|
| `public/images/covers/book-{1,2,3}-front.jpg` (880×1360) | Hero, shelf, book pages | Retailer product images of the Harlow Brook Books paperbacks (2019) | In `src/content/books.ts` | Largest available. Ask the publisher for print-resolution files. Book 3 cover artist **unconfirmed** (retailers credit Katherine Roy). |
| `public/images/covers/book-{1,2,3}-back.jpg` | 3D back covers, CSS book | Same | In `books.ts` | Contains jacket copy and review quotes. |
| `public/images/textures/book-*.webp` | WebGL textures | Derived from the covers above | — (decorative canvas) | Compressed copies. |
| `public/images/art/book1-explorers.webp` | Homepage story | Crop of the 2012 McSweeney's hardcover cover art (Katherine Roy), lettering excluded | In `src/app/page.tsx` | Caption credits Katherine Roy. |
| `public/images/art/book1-jacket-map.webp` (1600×1238) | Map Room | Katherine Roy's jacket map, archived from her blog | In `explore/page.tsx` | Bottom half is a web fade. **Request the full-resolution map**; the Map Room is built to accept it. |
| `public/images/art/book1-interior-explorer-and-kit.webp` (500×682) | Home, Explore | Interior illustration, archived from Katherine Roy's blog | In the page files | Request a higher-resolution scan. |
| `public/images/art/book1-kit-explorers-vest.webp` | Explore | Katherine Roy | In `explore/page.tsx` | |
| `public/downloads/explorers-vest-activity.pdf` | Educators | Original series website printable (art by Katherine Roy) | — | Rebuilt from a 500px image; ask for the original PDF. |
| Spine artwork (generated at runtime) | WebGL shelf | Site rendering derived from each cover's edge colours with site typography | — | **Not a photograph of the printed spine.** Replace with real spine scans if available. |

## Public-domain material (PD)

| File(s) | Source |
|---|---|
| `public/images/maps/world-1865*.webp` | A. J. Johnson, *Johnson's World on Mercator's Projection*, 1865 (Geographicus via Wikimedia Commons). Cartouche removed; partly "dissolved" for the hero. |
| `public/images/maps/arizona-1889.webp` | Rand McNally, *Arizona*, 1889 (Wikimedia Commons). Not currently displayed. |
| `public/images/maps/rhumb-chart-1751.webp` | Chart of the Pacific from Anson's voyage, 1751 (Geographicus via Wikimedia Commons) |
| `public/images/engravings/moran-*.webp` | Thomas Moran prints, c. 1875, Cooper Hewitt (via Wikimedia Commons) |
| `public/images/engravings/flammarion.webp` | Wood engraving from Flammarion, *L'atmosphère*, 1888 |
| `public/images/engravings/unknown-polar-map.webp` | *Popular Science Monthly* vol. 49, 1896 |
| `public/images/engravings/tabulating-machine-1890.webp` | *Scientific American*, 30 Aug 1890 |
| `public/images/engravings/{compass,airship,…}.webp` (26 files) | Pearson Scott Foresman line art, donated to the public domain (Wikimedia Commons). List and labels in `src/content/engravings.ts`. |

Originals are kept in `assets-src/` and regenerated with `npm run art`. Engravings are always decorative or captioned as historical; none is presented as series art.

## Site-made (SITE)

Social cards (`opengraph-image.tsx`), favicon/apple icon, the field-sheet PDF (`npm run pdfs`), page-edge and spine textures (runtime canvas).

## Fonts

League Gothic, Newsreader, IBM Plex Mono, Reenie Beanie — SIL OFL. TTF copies in `assets-src/fonts/` are static instances used only for social cards.

## Still needed from the family

1. Written approval to use the covers, interior art and jacket map online (publisher + illustrator).
2. Print-resolution cover files, real spine scans, the full jacket map, and Book 2's endpaper chart.
3. A credited author portrait (none is used; the uncredited photo found online was deliberately left out).
4. Trailer video files, if they should return.
5. Confirmation of the Book 3 cover artist.

## Responsive display derivatives

`public/images/optimized/` is generated from the existing public-domain engraving and map assets by `npm run art:optimize`. The original sources remain intact. Mask variants retain transparency at small display sizes; the hero map is flattened against white before compression, preserving its appearance when multiplied onto the paper background. These files remove first-request resizing and encoding from the critical path.
