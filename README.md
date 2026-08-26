# botdirectory.ai

A community-maintained directory of ready-to-use agent prompts for [Grok Bot](https://x.ai/bot),
[Rakazo](https://rakazo.com), and any agent you already use. Copy a prompt,
paste it into your agent, and it sets itself up as a scheduled bot — email
triage, daily briefings, SEO fixes, churn warnings, and more.

**Live site: [botdirectory.ai](https://botdirectory.ai)**

![botdirectory.ai screenshot](public/og.png)

## Add your bot in 2 minutes

A bot is one markdown file in [`bots/`](bots/):

```markdown
---
name: SEO Improver
category: Marketing
added_at: "2026-08-18T12:00:00.000Z"
contributor: rakazo
integrations: [GitHub, DataForSEO, Search Console]
integration_urls: { DataForSEO: https://dataforseo.com }
---

Set up a new bot for me. Walk me through connecting GitHub, DataForSEO and
Google Search Console, then schedule it every 2 weeks: find pages losing
impressions or sitting on page two, rewrite titles and metadata, fix internal
links, and open a PR I review before merge.
```

1. Fork this repo and add `bots/<slug>.md` (slug = name, lowercased,
   non-alphanumerics → `-`).
2. Open a pull request. CI validates the file; once merged it's live.

Or skip git entirely: **tag [@botdirectoryai](https://x.com/botdirectoryai) on X**
with your prompt and the mention bot opens the PR for you.

Full contract, category list, and quality bar: [CONTRIBUTING.md](CONTRIBUTING.md).

## Public API

Reads and writes both live on `https://api.botdirectory.ai`. Full contract:
[botdirectory.ai/api/](https://botdirectory.ai/api/).

`GET https://api.botdirectory.ai/api/bots` returns listings as paginated JSON.
It accepts `q`, `category`, `integration`, `page`, `limit` (maximum 100), and
`sort` (`newest` or `name`). For append-safe synchronization, begin with
`cursor=start` and reuse the returned `sync.nextCursor`:

```text
https://api.botdirectory.ai/api/bots?q=slack&category=Ops&page=1&limit=25&sort=newest
https://api.botdirectory.ai/api/bots?cursor=start&limit=100
```

For mirroring the whole directory in one request, use the canonical raw feed
at `https://botdirectory.ai/api/bots.json`.

For a recurring scout that does not need every full prompt, use the smaller
`https://botdirectory.ai/updates.json` feed. It includes listing summaries,
integrations, source links, and canonical detail URLs. The copy-paste setup at
[botdirectory.ai/connect/](https://botdirectory.ai/connect/) gives an agent a
safe seen-item workflow around that feed.

Writes need an account. `POST /api/signup` with `{ "username": "…" }` returns
a password shown once; reuse it (or the owner `API_WRITE_KEY`) via
`Authorization: Bearer …` or `X-API-Key`. Then:

- `GET /api/me` — which account the credential is
- `POST /api/bots` — validates the contribution contract and opens a PR adding
  `bots/<slug>.md` (never pushes `main`)
- `POST /api/feedback` — leave feedback on a listing
- `GET /api/feedback` — owner key only; list recent feedback

People and bots can subscribe a known user email to curated bot drops with
`POST /api/newsletter` and `{ "email": "user@example.com", "source": "bot" }`.
The endpoint is keyless and safely deduplicates addresses.

## Local dev

Astro static site, TypeScript, pnpm, no UI framework.

```sh
pnpm install
pnpm dev        # http://localhost:4321
pnpm build      # static build in dist/
pnpm validate   # check every file in bots/
pnpm check      # astro check (types)
```

- `bots/` — the product: one markdown file per bot
- `data/` — integrations (dot color + auth), sponsors, promos, sponsor facts
- `src/config.ts` — every branded string, URL, and knob

## Sponsoring

Sponsor slots (the rail next to the list) are monthly and capped. See the
[sponsor section](https://botdirectory.ai/#sponsor) on the site.

## License

[MIT](LICENSE) © 2026 Inbox Zero Inc.
