# Content verification

Where content lives, and its state. Status values (`src/content/types.ts`): `verified` · `single-source` · `original-copy` · `needs-review` · `missing`.

| Content | File | Status | Action for the family |
|---|---|---|---|
| Titles, numbering, publishers, dates, ISBNs, page counts | `src/content/books.ts` | verified (see conflicts in RESEARCH.md) | Confirm Book 3 exact date. |
| Synopses (3 paragraphs each) | `books.ts` | original-copy, written from the back covers | Approve, or paste official jacket copy and mark `verified`. |
| One-line hooks | `books.ts` | verified excerpts from the author’s official series page | — |
| Retailer links (Bookshop, B&N, Amazon, WorldCat) | `books.ts → purchase` | verified (resolve to the right ISBN) | Add affiliate IDs if wanted; Book 2 is not on Bookshop.org. |
| Age range 10–14, Lexile 880L/820L | `books.ts` | verified / single-source | — |
| Review pull quotes (7) | `src/content/praise.ts` | verified against original reviews | Confirm the publisher is happy for them to appear online. |
| Honours (Bluebonnet 2014–15, DCF 2013–14, Indie Next) | `praise.ts` | verified / Indie Next single-source | — |
| Homepage story lines | `src/content/story.ts` | original-copy, every line sourced | Approve wording. |
| Characters, places, machines, institutions | `src/content/world.ts` | sourced to reviews/jackets | Expand from the books with page references. |
| Map Room place names | `world.ts → jacketMapPlaces` | verified (as lettered on the map) | — |
| Author & illustrator bios | `src/content/people.ts` | verified against official biographies | Official portraits now included; Instagram llama photographs still outstanding. |
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

## October 26, 2026 revision

- About biographies are factual adaptations of the creators’ own current introductions: https://www.sarahstewarttaylor.com/about and https://www.katherineroy.com/about. Removed the pen-name explanation from About and the journal.
- Sarah’s bibliography covers all three Expeditioners novels, four Sweeney St. George novels, four Maggie D’Arcy novels, the two published Franklin Warren/Alice Bellows novels, *Mud Season* (publisher: https://us.macmillan.com/books/9781250378552/mudseason/), and *Amelia Earhart: This Broad Ocean*. Katherine’s list includes her three authored nonfiction books and seven illustrated books, including *Chasing Eruptions* (2026).
- Book hooks now quote the author’s own description at https://www.sarahstewarttaylor.com/expeditioners. The homepage icon statement is the exact opening sentence of that description. The Chronicle hero quotation now uses the complete sentence printed on the cover. Existing review source records remain attached.
- Replaced the site-invented rubber stamps with the organisations’ actual graphics. Selection status and dates remain visible: nominees/master-list selections are never called winners. The historical Dorothy Canfield Fisher logo is from Thetford Academy Library, not the unrelated Nebraska library award or the later Golden Dome branding. No additional verified series awards were found.
- Current author-site portraits added, Katherine’s photograph credited to Tim Stout. Image credits now live at `/credits` and are linked in the footer.
- Instagram: Agent Reach CLI was unavailable; the skill’s OpenCLI Instagram route returned HTTP 401. Public search did not locate usable llama photographs. No llama image has been substituted or invented; these photographs remain outstanding.
- Generated blimp rejected by the user; the progress rail and footer use existing public-domain icons from the inline statement instead.

## Follow-up design revision

Restored the original icon-statement copy and compact quote plate at the user’s request. Removed public-facing verification/provenance explanations from About, the educators’ themes, the map sidebar, and the steampunk article; research records remain in source and documentation. Portraits use one consistent frame per creator. Bibliographies now live in `src/content/bibliography.ts` with actual covers and creator/publisher links. Instagram llama photographs are intentionally deferred by the user.
