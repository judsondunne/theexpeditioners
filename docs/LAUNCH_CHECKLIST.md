# Launch checklist

## Must happen before public launch

- [ ] **Rights:** written approval from the publisher(s) and Katherine Roy for covers, interior art, the jacket map and the vest printable (see ASSET_MANIFEST.md).
- [ ] **Copy approval:** synopses, hooks, story lines, bios, educator material, journal articles (CONTENT_VERIFICATION.md).
- [ ] **Review quotes:** publisher OK to use the seven pull quotes online.
- [ ] **Book 3:** confirm cover artist and exact publication date.
- [ ] **Privacy page:** legal review; update if analytics/newsletter are switched on.
- [ ] **Domain:** decision and access confirmed (DOMAIN_MIGRATION.md).

## Deploy (Vercel recommended)

1. Push the repository to GitHub and import it in Vercel (framework: Next.js; build `npm run build`; Node 20+).
2. Production environment variables (see `.env.example`):
   - `NEXT_PUBLIC_SITE_URL=https://<domain>`
   - `SITE_INDEXABLE=true` (production only — never on previews)
   - optional `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, `NEXT_PUBLIC_NEWSLETTER_ACTION`, `LEGACY_REDIRECTS`, `LEGACY_HOST`
3. Add the custom domain (apex + www) and let the host issue HTTPS.

## Production QA

- [ ] `npm test` passes against the production URL: `BASE_URL=https://<domain> npx playwright test`.
- [ ] `/robots.txt` allows crawling and lists the sitemap; a preview deployment still shows `Disallow: /`.
- [ ] `/sitemap.xml` uses the real domain.
- [ ] View-source on a book page: canonical, Open Graph image, JSON-LD (`Book` with ISBN).
- [ ] Share a book URL in a messaging app: the generated card appears.
- [ ] Every retailer link opens the right edition.
- [ ] Shelf: hover/tap a spine, drag the book, keyboard through the tabs. Test in Safari, Chrome, Firefox, iOS Safari, Android Chrome.
- [ ] Reduced motion (OS setting): story becomes a list, shelf snaps, nothing drifts.
- [ ] Lighthouse/PageSpeed on mobile: aim for LCP ≤ 2.5 s, CLS ≤ 0.1, INP ≤ 200 ms on real devices (field data takes ~28 days in Search Console).
- [ ] Downloads open: field sheet and vest PDFs.
- [ ] 404 page for a nonsense URL.

## After launch

- [ ] Search Console + Bing Webmaster Tools; submit the sitemap.
- [ ] Rich Results Test on a book page.
- [ ] Link the site from sarahstewarttaylor.com and the author's social profiles.
- [ ] Review analytics after a month (ANALYTICS.md).

## Regenerating assets

- `npm run art` — engravings, maps and cover crops from `assets-src/` (needs Python 3 with Pillow, NumPy, SciPy).
- `npm run pdfs -- http://localhost:3000` — printable PDFs, with the site running.
