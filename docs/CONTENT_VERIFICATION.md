# Content verification

Where content lives, and its state. Status values (`src/content/types.ts`): `verified` · `single-source` · `original-copy` · `needs-review` · `missing`.

| Content | File | Status | Action for the family |
|---|---|---|---|
| Titles, numbering, publishers, dates, ISBNs, page counts | `src/content/books.ts` | verified (see conflicts in RESEARCH.md) | Confirm Book 3 exact date. |
| Synopses (3 paragraphs each) | `books.ts` | original-copy, written from the back covers | Approve, or paste official jacket copy and mark `verified`. |
| One-line hooks | `books.ts` | original-copy | Approve. |
| Retailer links (Bookshop, B&N, Amazon, WorldCat) | `books.ts → purchase` | verified (resolve to the right ISBN) | Add affiliate IDs if wanted; Book 2 is not on Bookshop.org. |
| Age range 10–14, Lexile 880L/820L | `books.ts` | verified / single-source | — |
| Review pull quotes (7) | `src/content/praise.ts` | verified against original reviews | Confirm the publisher is happy for them to appear online. |
| Honours (Bluebonnet 2014–15, DCF 2013–14, Indie Next) | `praise.ts` | verified / Indie Next single-source | — |
| Homepage story lines | `src/content/story.ts` | original-copy, every line sourced | Approve wording. |
| Characters, places, machines, institutions | `src/content/world.ts` | sourced to reviews/jackets | Expand from the books with page references. |
| Map Room place names | `world.ts → jacketMapPlaces` | verified (as lettered on the map) | — |
| Author & illustrator bios | `src/content/people.ts` | verified | Approve tone; supply a portrait. |
| Educator themes, questions, activities | `src/content/educators.ts` | original-copy | A teacher's read-through would help. |
| Journal articles (2) | `src/content/journal.tsx` | original-copy | Approve before indexing. |
| Privacy policy | `src/app/privacy/page.tsx` | needs-review | **Legal review before launch.** |
| Reading sample | `books.ts → sample` | missing | None is shown. Supply an approved excerpt to enable one. |
| Trailer | — | missing | Old YouTube trailers are offline. |

## Things the site deliberately does not say

- Nothing about a Book Four or future instalments.
- No prices, stock levels or "bestseller" claims.
- No ages for M.K. (sources conflict), no identification of individual characters on the cover art.
- No standards alignment for classroom material.
- No invented quotes, endorsements or lore. The Explore page says so on the page.

## How to change content

See README → *Editing content*. The unit tests (`npm run test:unit`) check ISBN check digits, quote length, sources on every claim, and that asset files exist.
