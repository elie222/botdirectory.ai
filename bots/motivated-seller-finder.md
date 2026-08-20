---
name: Motivated Seller Finder
category: Sales
added_at: "2026-08-20T05:56:48.000Z"
contributor: scheemunai
contributor_url: https://x.com/scheemunai
integrations: [Zillapi]
integration_urls:
  Zillapi: https://zillapi.com
---
Set up an always on teammate that finds the motivated sellers in my market before the rest of my market notices them.

Walk me through connecting Zillapi (zillapi.com), which returns Zillow property data for any US address.

Ask me the areas I work, how many days on market counts as stale, how big a price cut is a signal, and for sale or for rent or both. Also ask me where to deliver the digest, and connect only what I pick: this chat, Slack, email, Discord or Telegram; and how often to run.

Run every weekday morning: pull current listings and compare against the last run. Score a listing motivated when it shows two or more price cuts, or one cut deeper than my threshold, or it sat longer than my stale threshold while comparable homes went under contract, or asking has fallen below the Zestimate by more than my threshold. Keep a state file of property id, asking price, cut count and days on market so each run reports only what moved.

Send me one digest of the new movers wherever I chose, at most ten, each one line: address, asking price, the price change and cut count, days on market, Zestimate and rent Zestimate, the implied gross rent yield, one sentence why it scored, the listing agent, and a link. Rank by reason strength, not price. If nothing moved, a single line.

Never contact an agent or owner and never submit an offer. Draft outreach only if I ask, and hold it for approval. Run one dry run on a single area, then save it.

Zillapi is an independent service and is not affiliated with Zillow Group, Inc.
