# Domain & migration plan

## What exists today

- **sstaylorbooks.com** — the original series site, now a Tumblr blog. DNS points at Tumblr (66.6.44.4); HTTPS fails, so many visitors and crawlers already get errors. The old site no longer ranks for "S. S. Taylor Expeditioners".
- **sarahstewarttaylor.com** — the author's main site (Wix), focused on her adult mysteries, with an unlinked `/expeditioners` page.
- Inbound links found in reviews, library pages and blogs point mostly at `sstaylorbooks.com` pages and posts.

## Recommendation

Use **sstaylorbooks.com** as the canonical home, or a new dedicated domain *only if* the family prefers a clearer name. Keeping the old domain preserves its existing links and history; a new domain starts from zero and would still need the redirects below. Do **not** move the series onto the mystery site: different audience, and this site's book-first structure would be diluted.

*Do not change DNS or turn on redirects until the family confirms who controls the domain registrar and the Tumblr account.*

## Old → new URL map (implemented, off by default)

Defined in `src/config/legacy-redirects.ts`; enable with `LEGACY_REDIRECTS=true` (and `LEGACY_HOST=sstaylorbooks.com` if the old domain is an alias of the new one). All are permanent (308).

| Old path | New destination |
|---|---|
| `/AboutTheBook`, `/BuyTheBook`, `/BuyTheBooks`, `/Trailer`, `/NewsandReviews` | `/books` |
| `/Author`, `/Contact` | `/about#author` |
| `/TheIllustrator` | `/about#illustrator` |
| `/ChapterOne` | `/books/the-treasure-of-drowned-mans-canyon` (until an approved sample exists) |
| `/SigningsandAppearances` (both cases) | `/about` |
| `/DesignYourOwnExplorersVest` | `/educators#explorers-vest` |
| `/DesignYourOwnMapoftheWorld` | `/educators#map-the-mistake` |
| `/post/*`, `/archive/*`, `/page/*`, `/tagged/*`, `/rss` | `/journal` |
| `/image/*` | `/explore#art` |
| `/random`, `/day` | `/` |

Worth migrating as journal entries later (with the family's approval): the "Behind the Scene" conversation between S. S. Taylor and Katherine Roy (posts 104148272560, 104747694330, 105342000724), the Book 3 announcement and Chapter One post. When migrated, point those post IDs at their new journal URLs instead of `/journal`.

## Steps

1. Confirm registrar access for sstaylorbooks.com and export anything worth keeping from Tumblr.
2. Deploy this site (see LAUNCH_CHECKLIST.md) and add the domain in the host (e.g. Vercel → Domains), `www` and apex, with HTTPS.
3. Set `NEXT_PUBLIC_SITE_URL=https://www.sstaylorbooks.com` (or the chosen domain), `SITE_INDEXABLE=true`, `LEGACY_REDIRECTS=true`.
4. Point DNS at the host. Check a sample of old URLs return 308 to the right pages.
5. Search Console: add a Domain property, submit `/sitemap.xml`, request indexing for `/` and `/books`. If a new domain is used, use the *Change of Address* tool from the old property.
6. Ask the author to link to the new site from sarahstewarttaylor.com (nav + `/expeditioners` page) and social profiles.
7. Monitor 404s in the host logs and Search Console for a month; add redirects as needed.
