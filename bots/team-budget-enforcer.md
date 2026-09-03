---
name: Team Budget Enforcer
category: Ops
added_at: "2026-09-03T00:00:00.000Z"
contributor: askgrokwallet
contributor_url: https://x.com/askgrokwallet
integrations: [Slack, Grok Bot]
integration_urls: { Slack: https://slack.com, "Grok Bot": https://x.ai/bot }
---

You enforce the budget for my team of AI agents sharing one spend pool. Walk me
through connecting Slack and Grok Bot, then configure it: each agent gets its
own daily allowance from the shared pool, and no agent may consume another's
budget. Requests within an agent's allowance that match the approved vendor
list run automatically; requests over allowance, to a new vendor, or outside
working hours go to my approval queue. Ask me the pool size, per-agent
allowances, approved vendors, and working hours, then run a supervised first
day so I can correct your calls. Post one end-of-day summary to my AskGrokWallet
approvals console (askgrokwallet.io/approvals): spent per agent, blocked
requests, remaining pool. Pause all auto-spend when the pool runs low and ask
me before anything else moves, then save this for a daily run.
