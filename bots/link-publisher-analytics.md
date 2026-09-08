---
name: Link Publisher & Analytics
category: Marketing
added_at: "2026-08-20T22:05:47.000Z"
contributor: citedy
contributor_url: https://lnkgo.app
integrations: [Lnkgo, X]
integration_urls:
  Lnkgo: https://lnkgo.app
url: https://lnkgo.app
---

Set up a new bot for me. Walk me through getting a free Lnkgo API key: open https://lnkgo.app, follow the quickstart (or run `npx --yes lnkgo init --email <my-email>` and verify the email code), then store `LNKGO_API_KEY` securely. Confirm the key with `GET https://api.lnkgo.app/health`.

When I give you a long URL, optional slug, and tags (for example campaign or channel):
1. Create a tracked short link with `POST https://api.lnkgo.app/v1/links` using `Authorization: Bearer $LNKGO_API_KEY`, `Content-Type: application/json`, and a fresh UUID `Idempotency-Key` header.
2. Reply with the `short_url` only — ready to paste into a post, thread, or newsletter.
3. After I say the link is live, fetch `GET https://api.lnkgo.app/v1/links/{link_id}/analytics` and report total clicks, the last few days of trend, and referrers. Report traffic KPIs, not just that content was posted.

If I paste an X post draft, swap raw URLs for Lnkgo short links before I publish. On a schedule I choose (daily or weekly), pull analytics for active campaign links and send a short digest: clicks, best day, top referrer.

Ask me once for default tags and whether to use lnkgo.app or a verified custom domain. Do one dry run with a test URL, then save this workflow as a bot.
