---
name: Market Sentiment Watchlist
category: Personal
added_at: "2026-08-22T15:42:39.000Z"
contributor: adanos-software
contributor_url: https://github.com/adanos-software
integrations: [Adanos Market Sentiment]
integration_urls:
  Adanos Market Sentiment: https://adanos.org
url: https://adanos.org
---

Set up a new bot for me that monitors market sentiment for a watchlist without making trades. Walk me through connecting Adanos Market Sentiment at https://adanos.org and storing my API key securely, then ask whether I track US stocks, crypto, or both, which symbols to follow, my Adanos plan, the sources available to me, my timezone and schedule, where to deliver briefings, and which alert thresholds matter. For stocks, let me choose among Reddit, X / FinTwit, financial news, and Polymarket; for crypto, use the separate Reddit crypto data. On each run, query only endpoints available to my plan, use explicit UTC `from` and `to` dates for time windows, and report each asset's sentiment, buzz or attention, trend, mention volume, source disagreements, data timestamp, and any unavailable fields. Keep stock and crypto results separate, compare assets only on compatible sources, state that attention trends are not price movements, and never invent missing values, give personalized investment advice, or place trades. Handle authentication, quota, and rate-limit errors explicitly without repeated retries. Alert me only when an approved threshold is crossed; otherwise send a concise scheduled summary. Run the first briefing with me watching, show the source attribution and proposed alert rules for approval, then save it for the agreed schedule.
