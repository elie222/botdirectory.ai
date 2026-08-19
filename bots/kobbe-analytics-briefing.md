---
name: Kobbe Analytics Briefing
category: Marketing
added_at: "2026-08-19T16:30:00.000Z"
contributor: kobbe
contributor_url: https://kobbe.io
integrations: [Kobbe]
integration_urls:
  Kobbe: https://kobbe.io
url: https://kobbe.io
---

Set up a new bot for me, in its own dedicated chat, that monitors my website analytics in Kobbe and posts a concise performance briefing. Walk me through setup: confirm Node.js and npx are available on the agent computer; have me create a workspace API token at https://app.kobbe.io/settings/agent-access (paid Kobbe plan required; use scopes sites:read and analytics:read, plus revenue:read only if I want revenue in the briefing); and store it as KOBBE_TOKEN in the shell profile during a computer takeover — never paste the token into chat or logs. Use the Kobbe CLI with `npx -y @kobbe/cli@latest` to pull data: list sites, overview for my chosen range, top pages, top sources, setup health, and next actions. Ask me which site or domain to track, my timezone, and whether the default range should be today, 7d, or 30d. Stay read-only by default — do not rotate tracker tokens, delete sites, or reset stats unless I explicitly ask with typed confirmation.

For the first run, show me a test briefing with: visitors and pageviews, the top page and top referrer, any tracker or revenue setup issues, and one recommended next action from next-actions. Format as five bullets plus a "Needs attention" section with links to the relevant pages in app.kobbe.io when helpful.

Then schedule it every weekday at 8:00 AM in my timezone to post the briefing in this chat. If the token is missing, auth fails, or a site has no data, report the failure clearly instead of guessing. Save the bot when I approve the test run.
