# Reach and book sales

The site now helps a reader discover the series, decide whether it suits them, and reach a bookstore without taking a detour through another page. These changes are implemented; sales uplift has not yet been measured.

## Implemented

- Header, home hero, story ending, map-room ending, trilogy shelf, book heroes, reading-order page and guide endings open a bookstore chooser. Its normal href remains usable without JavaScript.
- The chooser uses verified paperback links for the selected book. It offers the other bookstores and a library option without invented stock, prices, discounts or urgency.
- Book pages retain a purchase action after the main action scrolls away. On the homepage this appears on smaller screens only. It yields to the buying section and site footer.
- `/buy` puts all three current paperbacks, retailer links and ISBNs on one page. It links to the parent guide and classroom ordering details.
- The reader-fit guide, a new steampunk guide and a working book-cipher activity provide useful discovery paths. Guides have related links, native sharing/copying and individual social cards.
- Reading-order schema links the actual three Book works. Book schema includes format, publisher, date, pages and exact recognition labels. No fictional offers or star ratings are emitted.
- Titles, descriptions, article dates and social images are explicit. Ownership-verification tokens can be configured for Google and Bing.
- Indexing requires an explicit public HTTPS origin; Vercel previews remain noindex. `npm run check:launch -- https://YOUR_DOMAIN` tests the live crawl and metadata setup.
- Optional analytics records purchase chooser opens, retailer clicks by placement, guide sharing and activity copying. Core Web Vitals measurement covers LCP, INP and CLS. No purchase completion can be inferred from these events.

## Performance verification

A production-build Lighthouse mobile audit on 25 October 2026 measured 924,766 transferred bytes on the homepage, versus 1,751,061 before this optimization pass (about 47% less). Engraving masks and the hero map now have precompressed size variants; story artwork starts loading as its section approaches. The 3D canyon uses fewer terrain segments on small screens.

The final local audit scored performance 79, accessibility 100 and best practices 100, with no measured layout shift. Simulated LCP was 5.5 seconds, so slow-connection loading still needs improvement and real-user measurement. Lint, type checking and the production build passed. The final Playwright run passed 97 tests; five intentionally inapplicable device cases were skipped. These are lab results, not field Core Web Vitals. The SEO score was 69 because the preview deliberately blocks indexing; the audit must be rerun against the actual public deployment after indexing is enabled. Automated scores do not replace manual accessibility review or imply search rankings.

## Public launch

The site was deployed on 25 October 2026 to [theexpeditioners.vercel.app](https://theexpeditioners.vercel.app), in the `judderbudders-projects/theexpeditioners` Vercel project. Production uses `NEXT_PUBLIC_SITE_URL=https://theexpeditioners.vercel.app` and `SITE_INDEXABLE=true`; previews remain noindex. The production domain is the canonical origin. This deployment does not move the historic domain or change its DNS. The anonymous live launch audit passed all 11 checked pages for HTTPS, crawl policy, sitemap, canonical URLs and social metadata. The deployed buying and map-room checks passed 22 desktop/mobile tests, with two device-inapplicable cases skipped.

The CLI-created project initially used the Other framework preset. `vercel.json` now explicitly selects Next.js. `.vercelignore` retains the fonts and artwork used for generated social cards while excluding local environment files, test output and unused source artwork. Future releases can use `vercel deploy --prod --scope judderbudders-projects` from this checkout, followed by `npm run check:launch -- https://theexpeditioners.vercel.app`.

Remaining growth setup:

1. Verify ownership in Search Console and Bing Webmaster Tools, add the verification tokens if using their HTML-tag method, and submit `/sitemap.xml`. Crawl access alone does not guarantee indexing or rankings.
2. Configure the analytics account and goals. The optional integration remains off until its domain is provided. A working dashboard is required before claiming conversion improvements.
3. Update the author's series page, navigation and owned profiles to link to the new home. Draft copy is in `GROWTH_COPY.md`; no messages or posts have been sent.
4. If moving the historic `sstaylorbooks.com` domain later, confirm ownership and use the existing migration/redirect plan. Redeploy with its canonical production origin. Preserve individual old URLs where possible.

## What to measure

| Question | Measure | Decision |
| --- | --- | --- |
| Do visitors reach a bookstore? | Unique visitors with `retailer_click` / site visitors | Primary site conversion proxy; separate library clicks |
| Does the chooser help? | Visitors with retailer clicks / visitors with `purchase_open` | Diagnose confusion or too many choices |
| Which placements contribute? | `location` on `retailer_click` | Compare hero, book page, shelf, dock and guide ending |
| Do discovery pages bring readers? | Search landing pages and guide-to-retailer paths | Improve topics that attract relevant readers |
| Does interactive content travel? | `share_click`, `activity_copy`, referred visits | Assess the cipher and teacher resources |
| Is the site usable on real phones? | LCP, INP and CLS by device/page | Fix slow or unstable pages before buying traffic |
| Did sales actually increase? | Publisher/retailer reports with dates and channels | Keep this distinct from outbound clicks |

A useful starting target is a stable baseline, not a promised conversion rate. Review weekly at first. Compare like traffic sources and device types; do not treat a handful of clicks as an A/B-test result.

## Acquisition sequence

**Owned audience first.** Use the author's existing newsletter and website to introduce the series site. Link to Book One or `/buy` for readers ready to shop, and the parent guide for people choosing a gift.

**Libraries and classrooms.** Lead with the free cipher or mapmaking activity, then the books, verified award-list selections and ordering ISBNs. The resource is available without an email gate. Outreach drafts need a real recipient and explicit sending instruction before dispatch.

**Earned links.** Offer the useful resources to relevant librarians, teachers and reading groups rather than asking for generic backlinks. Keep the original review attribution and link sources. Reclaim old broken series links after a production URL exists.

**Paid traffic later.** No ad spend has been committed. First establish a working retailer path, attribution and a sales-report baseline. A publisher/retailer reporting arrangement is needed to estimate return on ad spend; this site alone cannot see completed orders.

## Search guidance used

- [Google: descriptive, concise titles](https://developers.google.com/search/docs/appearance/title-link)
- [Google: crawlable ecommerce navigation](https://developers.google.com/search/docs/specialty/ecommerce/help-google-understand-your-ecommerce-site-structure)
- [Google: book actions](https://developers.google.com/search/docs/appearance/structured-data/book) — eligibility is restricted; ordinary Book markup does not guarantee a buy panel in Search.
- [web.dev: improve interaction responsiveness](https://web.dev/articles/optimize-inp)

Do not promise rankings, FAQ rich results, shopping placement or sales increases. Publish useful material, connect the production site, measure the result and improve it.
