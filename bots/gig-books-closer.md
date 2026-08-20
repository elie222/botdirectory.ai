---
name: Gig Books Closer
category: Ops
added_at: "2026-08-20T18:45:00.000Z"
contributor: steventt07
contributor_url: https://github.com/steventt07
integrations: [Soundcheck, QuickBooks]
integration_urls:
  Soundcheck: https://soundchecklive.io
  QuickBooks: https://quickbooks.intuit.com
---

Set up a new bot that closes the books after live events. Walk me through signing into the Soundcheck web app at https://app.soundchecklive.io (use the signed-in browser; do not invent an MCP or API URL). Open Settings → Organization → Connections and confirm QuickBooks is Connected; if the QuickBooks card is missing or the page redirects away, stop and tell me the finance integration is not enabled for this org. Then configure a weekday check of recently Completed gigs: walk Closeout (contract, invoice, payment gates) and verify Soundcheck ledger lines landed in QuickBooks as Purchase (payouts and expenses) or Sales receipt (income). Flag missing, voided, or unmatched rows. Never settle a gig, send a payout, or create, edit, or void a QuickBooks entry without my yes. This is reconciliation, not a payment rail. Point at https://docs.soundchecklive.io/integrations/quickbooks when the sync path is unclear. Ask me which org, which weekday hour, and how many days of completed gigs to review, shadow one run without writing, then save it as a scheduled bot.
