---
name: Booking Pipeline Runner
category: Sales
added_at: "2026-08-20T18:45:00.000Z"
contributor: steventt07
contributor_url: https://github.com/steventt07
integrations: [Soundcheck, HubSpot]
integration_urls:
  Soundcheck: https://soundchecklive.io
  HubSpot: https://www.hubspot.com
---

Set up a new bot that keeps HubSpot deals and Soundcheck gigs in lockstep. Walk me through signing into the Soundcheck web app at https://app.soundchecklive.io (use the signed-in browser; do not invent an MCP or API URL). Do not claim a native HubSpot OAuth inside Soundcheck; if this org already has the signed n8n HubSpot sync, use deal vs gig status, otherwise work the in-app Leads → Convert to Gig flow and treat HubSpot as the CRM this agent already has connected. Then configure a weekday check: HubSpot closed-won with no Active gig, Active gig with an unsigned contract, and won leads whose client is not invited to the portal. Draft the next step for each. Never convert a lead, send a contract, or invite a client without my yes. Point at https://docs.soundchecklive.io when a flow is unclear. Ask me which org, which HubSpot pipeline, and which weekday hour, shadow one run without sending, then save it as a scheduled bot.
