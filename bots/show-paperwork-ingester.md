---
name: Show Paperwork Ingester
category: Ops
added_at: "2026-08-20T18:45:00.000Z"
contributor: steventt07
contributor_url: https://github.com/steventt07
integrations: [Soundcheck, Gmail]
integration_urls:
  Soundcheck: https://soundchecklive.io
  Gmail: https://mail.google.com
---

Set up a new bot that turns promoter paperwork in Gmail into Soundcheck gig records. Walk me through signing into the Soundcheck web app at https://app.soundchecklive.io (use the signed-in browser; do not invent an MCP or API URL). Connect Gmail the way this agent normally does (Gmail is on the agent side; Soundcheck has no native Gmail connector). Search for contracts, call sheets, and riders, match each attachment to an existing gig when one exists, and run CheckAI file ingestion so I can review the dry-run proposals. If the ingestion UI is missing for this org, stop and point at https://docs.soundchecklive.io/features/ai/file-ingestion. Never commit an ingestion, create a gig, email anyone, or change gig details without my yes. Ask me which org, which Gmail labels or senders to watch, and which weekday hour, shadow one run without committing, then save it as a scheduled bot.
