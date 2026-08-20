---
name: Tour Calendar Guard
category: Ops
added_at: "2026-08-20T18:45:00.000Z"
contributor: steventt07
contributor_url: https://github.com/steventt07
integrations: [Soundcheck, Google Calendar]
integration_urls:
  Soundcheck: https://soundchecklive.io
  Google Calendar: https://calendar.google.com
---

Set up a new bot that keeps my Soundcheck gigs on Google Calendar. Walk me through signing into the Soundcheck web app at https://app.soundchecklive.io (use the signed-in browser; do not invent an MCP or API URL). Open Settings → Calendar sync, generate the private iCal feed if I do not already have one (gig calendar only, not availability; treat the URL like a password), and subscribe it in Google Calendar via From URL if it is not already there. Then configure a weekday check: compare upcoming Soundcheck gigs to Google Calendar and flag missing events, timezone mismatches, and collisions with my personal calendar. Never create, edit, or delete a calendar event, rotate the feed token, or change a gig without my yes. If a gig already matches a calendar event, skip it. Point at https://docs.soundchecklive.io/features/calendar-feed-subscription when the feed path is unclear. Ask me which org, which Google Calendar, which weekday hour, and how many days ahead to watch, shadow one run without writing, then save it as a scheduled bot.
