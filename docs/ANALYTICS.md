# Analytics

**Status: off.** Nothing is tracked until a provider is configured.

## Recommended setup

[Plausible](https://plausible.io) — cookieless, no personal data, no consent banner needed in most jurisdictions (confirm with legal review).

1. Create the site in Plausible.
2. Set `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=<your domain>` in production. The root layout then loads the script (`outbound-links` variant, which also counts clicks to retailers).
3. In Plausible, add the custom events below as goals.

## Events (`src/lib/analytics.ts → track`)

| Event | When | Properties |
|---|---|---|
| `cta_click` | Primary calls to action (header, hero, story, shelf, panels) | `location`, `target` |
| `retailer_click` | Any retailer or library link | `retailer`, `book`, `format` |
| `book_view` | A book page is viewed | `book` |
| `shelf_interact` | First interaction with the 3D shelf | `via` (canvas, tab, keyboard…) |
| `story_complete` | Reader reaches the end of the homepage story | — |
| `educator_download` | A classroom PDF is downloaded | `resource` |
| `newsletter_signup` | Only after the provider confirms the sign-up | — |
| `sample_open` | Reserved for when an approved sample exists | — |

**A retailer click is a click, not a sale.** Report it as "interest in buying".

## Useful questions to answer

- What share of visitors who start the story finish it, and do finishers click through to Book One more often?
- Which retailer do visitors choose? (Consider an affiliate programme with Bookshop.org.)
- Which book pages are reached directly from search?

## Children's privacy

No identifiers, no cookies, no forms aimed at children. Keep it that way when adding tools.

Set `NEXT_PUBLIC_ANALYTICS_DEBUG=true` locally to log events to the console instead.

## Conversion and discovery additions

The integration is still inactive without `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`. New events:

- `purchase_open`: bookstore chooser opened; `book`, `location`, `page`.
- `retailer_click`: now also carries `location` and `page`, so the hero, shelf, buying page and guide endings can be compared. Exclude `retailer=worldcat` from the buying-interest metric.
- `newsletter_open`: click to the author's newsletter. `newsletter_submit` records an accepted form submission; it is not a confirmed double opt-in.
- `share_click`: successful native share or link copy; method and article path.
- `activity_copy`: a cipher copied; resource name only. The entered message is never sent to analytics.
- `web_vital`: metric, numeric value and rating for LCP/INP/CLS. CLS is unitless; LCP/INP are milliseconds.

All events carry a pathname without query strings or fragments. Early events are held in a bounded in-memory queue until the configured script loads. No event is a completed-sale event. No cookies, persistent visitor identifiers or message text are added by this code.

Configure custom events in the analytics account before using them as goals. See `GROWTH_PLAN.md` for the measurement and launch sequence.
