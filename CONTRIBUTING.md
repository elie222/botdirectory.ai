# Contributing

A bot is one markdown file in `bots/`. Add the file, open a pull request, and it
shows up on [botdirectory.ai](https://botdirectory.ai). No plugin API, no review
board.

Prefer not to touch git? Tag **@botdirectoryai** on X with your prompt and the
mention bot will open the PR for you.

## The bot file contract

`bots/<slug>.md` — the slug is the `name` lowercased with every run of
non-alphanumerics replaced by `-` (e.g. `SEO Improver` → `seo-improver`).

```markdown
---
name: SEO Improver
category: Marketing
added_at: "2026-08-18T12:00:00.000Z"     # UTC time the listing is added
updated_at: "2026-08-24T12:00:00.000Z"   # optional — set after a material update
contributor: elie2222                    # optional — whose setup this is
contributor_url: https://x.com/elie2222  # optional — where the handle links (default: GitHub)
scouted_by: someoneelse                # optional — X handle of whoever found/submitted it
integrations: [GitHub, DataForSEO, Search Console]
integration_urls:                       # optional; lets deploy fetch missing favicons
  DataForSEO: https://dataforseo.com
url: https://example.com/my-bot        # optional — canonical homepage (dedupe key)
grok_share_url: https://x.ai/bot/Y7LbP6p5EBFjfdTp69cKr  # optional — real https://x.ai/bot/… you own
description: Plans my Instacart cart from meal ideas.  # optional — public blurb; NOT the prompt
added_via: https://x.com/.../status/…  # optional — set by the X mention bot
sources:                              # optional — source material beyond added_via
  - kind: youtube
    url: https://www.youtube.com/watch?v=example123
    start_seconds: 126                # optional — jump to the relevant moment
---

You improve my SEO on a schedule. Walk me through connecting GitHub,
DataForSEO and Google Search Console, then run every 2 weeks: find pages
losing impressions or sitting on page two, rewrite titles and metadata,
fix internal links, and open a PR I review before merge.
```

- **name** — what the bot is called on the shelf.
- **added_at** — the UTC time the listing is added, as an ISO 8601 timestamp.
- **updated_at** — optional ISO 8601 timestamp for a material prompt or listing
  update. This becomes the page's sitemap and structured-data modification date.
- **category** — one of: `Productivity`, `Sales`, `Marketing`, `Ops`, `Success`,
  `Personal`. Pick the closest fit — this list is deliberately short and curated.
- **contributor** — whose setup/prompt this is (optional; omit for anonymous
  sources). Links to `contributor_url` if set, else `github.com/<contributor>`.
- **scouted_by** — if you're submitting someone *else's* setup (say, from a
  tweet), put the author in `contributor` and your own X handle here — you get
  a "scouted by" credit on the page.
- **integrations** — the tools the prompt connects, as plain names
  (`[Gmail, Notion, Stripe]`). Any tool name is welcome — there's no fixed list.
  If the tool has an entry in [`data/tool-icons.json`](data/tool-icons.json)
  it shows its brand icon; otherwise the chip is just the name. Adding one for
  a new tool is appreciated but optional:

  ```json
  // an SVG from https://svgl.app or https://simpleicons.org (preferred)…
  "Stripe": "https://svgl.app/library/stripe.svg"
  // …a light/dark pair for mono logos so they stay visible in dark mode…
  "GitHub": { "light": "https://svgl.app/library/github_light.svg", "dark": "https://svgl.app/library/github_dark.svg" }
  // …or the tool's own favicon, pulled from its site
  "Gong": { "site": "https://www.gong.io" }
  ```

  Then run `pnpm icons` to download into `public/icons/` and commit the file
  alongside.

- **integration_urls** — optional official HTTPS homepages keyed by the exact
  names in `integrations`. On deploy, these are sent to Google's favicon proxy
  and mirrored into the site; the build runner never requests contributed
  hosts directly. The X mention bot fills these when it can identify a product
  confidently. Exact Simple Icons matches are discovered automatically, and
  every remaining integration gets a generated monogram rather than a blank.

- **grok_share_url** — optional official Grok Bot share URL. **Only** the shape
  `https://x.ai/bot/<nanoid-style-id>` is accepted (same contract as the private
  submit API). When set, the listing page shows an **Add to Grok Bot** button
  that opens that link. Recipients preview on x.ai and add a copy to their
  account. Link the creator's share URL only — do not scrape or rehost packed
  configs or skills ([bot sharing terms](https://x.ai/legal/bot-sharing-terms)).
  Tweets, marketing pages, and other URL shapes are rejected. Omit the field
  until you have a real share link; never invent one. The public JSON API
  exposes this as `grokShareUrl`.

- **description** — optional public listing / outcome copy (what the bot does).
  Distinct from the prompt. Use this for official x.ai share-page blurbs —
  never put a marketing blurb in the markdown body and label it as a prompt.
  Description-only listings (empty body) require `grok_share_url`.

- **sources** — optional original material that inspired the bot. Supported
  kinds are `x`, `youtube`, and `web`; the URL must match the selected kind.
  YouTube sources can include `start_seconds` to open at the relevant moment.
  The X mention bot's legacy `added_via` field is displayed as an X source
  automatically, so existing bot files do not need to be migrated.

- Copy counts are **not** part of the file — they're tracked server-side and
  start at zero for every bot.
- The **body is the prompt itself** — instructions *to* the bot (do this, watch
  that, send me X), in imperative / first-person-possessive briefing voice.
  Good: `Look at my Gmail twice per day.` / `You plan my grocery cart when I ask.`
  Bad: `Set up a bot that looks at Gmail.` / `This bot checks the user's Gmail.` /
  `You are a Gmail assistant that…` / stuffing the public x.ai blurb into the body.
  Prefer second person that leads with **You…** and uses **my** / **me**. No extra
  prose around the prompt. If you only have a public share blurb, put it in
  `description`, leave the body empty, and set `grok_share_url` — do not invent
  a fake full system prompt.

The value is the chip's dot color — pick the closest family color already in use.

## Quality bar

- **Real bot, working prompt.** You ran it end to end in Grok Bot, Rakazo, or
  another agent before opening the PR.
- **Self-contained.** The prompt should ask for what it needs (connections,
  schedules, context) and end by saving itself as a bot.
- **No pure ads.** A bot that exists to funnel people to your product will be
  closed — promoted placement is the [sponsor program](https://botdirectory.ai/#sponsor),
  not a PR.

## Checks

Every PR runs `pnpm validate` (schema, filename = slug, unique slug, known
category, prompt and/or description, unique `url`) plus `astro check` and a full
build. Run them locally:

```sh
pnpm install
pnpm validate
pnpm build
```

## Local dev

```sh
pnpm install
pnpm dev        # http://localhost:4321
```
