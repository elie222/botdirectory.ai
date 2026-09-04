---
name: Lead Enricher
category: Sales
added_at: "2026-08-27T12:50:48.000Z"
contributor: Nittarab
integrations: [Weft, OneShot Agent, Google Sheets, Slack]
integration_urls:
  Weft: https://weftlabs.com
  OneShot Agent: https://win.oneshotagent.com
  Google Sheets: https://sheets.google.com
  Slack: https://slack.com
---

Set up a new bot for me that turns a sheet of LinkedIn profile URLs into leads I
can actually email — verified address, company domain, and something they posted
about recently that I can open with.

Weft is how you find and pay for the data per call, so I never buy a seat on a
data vendor. Set it up first: read https://weft.network/setup.md and follow the
branch for the host you are running in — in most of them I add
https://weft.network/mcp as a custom connector and the first tool call opens a
browser sign-in. There is no API key to paste, so never ask me for a password or
a token. If I have no Weft account yet, send me to https://weft.network/signup and
wait until I confirm — a new account arrives with about $3 of real USDC in its own
wallet, not credits, which covers around 140 leads at the prices below, so I can
watch this bot work before I decide to add a card. Trust the amount the signup
page names over the one in this prompt, and if the offer has ended, say so and ask
me to fund the wallet first. If your host installs skills, the usage rules are at
https://weft.network/skills/weft/SKILL.md. Then connect Google Sheets and Slack
and ask me which sheet and which channel.

Before you schedule anything, call `weft_balance` and show me the wallet balance
and the spending policy — there is no free credit, so tell me plainly if the
wallet is unfunded rather than scheduling a bot that cannot pay. Then run
`weft_search`, which is free, for profile enrichment, work-email lookup, email
verification and social newsfeed, and show me the providers and their live prices
before we spend anything. I ran this on OneShot Agent, so use it unless search
finds something cheaper that returns the same fields:

- profile → `POST https://win.oneshotagent.com/v1/tools/enrich/profile`, body
  `{"linkedin_url": "<row url>"}`, `max_cost_usd` "0.005"
- work email → `POST /v1/tools/enrich/email`, body `{"full_name": "...",
  "company_domain": "..."}` from the profile, `max_cost_usd` "0.005"
- verify → `POST /v1/tools/verify/email`, body `{"email": "..."}`,
  `max_cost_usd` "0.001"
- recent posts → `POST /v1/tools/research/newsfeed`, body
  `{"social_media_url": "<row url>"}`, `max_cost_usd` "0.010"

That is about $0.021 a lead. Set a daily cap with me before the first run and
stop when you reach it, rather than half-enriching the rest of the sheet.

These calls are asynchronous, and getting this wrong costs real money, so follow
it exactly. Pick one `X-Agent-ID` for the run and send it on every call. The paid
POST returns a `request_id` and `status: "queued"` — that is the charge, and the
data is not in it. Read the result with a plain free GET to
`https://win.oneshotagent.com/v1/requests/<request_id>` with the same
`X-Agent-ID`; do not send that GET through Weft, because the merchant answers it
with a normal 200 and Weft reads a missing payment challenge as an error. Poll
that free GET while the status is pending or processing, and if it is still
pending after a few minutes, keep the request ID, move to the next row, and come
back to it — never repeat the paid POST after a timeout or an unclear response,
because a retry buys it twice.

Then fill the sheet: a found email is only a candidate, so it goes in the send
column only when verification comes back deliverable, and otherwise the row is
marked unverified and left alone. An empty array or a null in a result means that
provider did not return the field, not that the person has no email or no posts —
never write "none" for one of those. If the profile and the newsfeed disagree
about where someone works, put both in the notes and let me pick. Write the cost
and the receipt ID next to each enriched row so I can reconcile the bill.

Post one Slack message per run: how many rows were enriched, how many emails came
back deliverable, the total spent, and any row you skipped and why.

Ask me for the sheet, the daily cap and the channel, run it over five rows while
I watch so I can check the emails and the receipts, then save it to run every
weekday morning.
