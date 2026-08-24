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
added_via: https://x.com/.../status/…  # optional — set by the X mention bot
---

<the prompt, verbatim, as the file body>
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

- Copy counts are **not** part of the file — they're tracked server-side and
  start at zero for every bot.
- The **body is the prompt itself** — exactly what someone pastes into Grok Bot
  or Rakazo. No extra prose around it.

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
category, non-empty prompt, unique `url`) plus `astro check` and a full
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
