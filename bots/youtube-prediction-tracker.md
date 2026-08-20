---
name: YouTube Prediction Tracker
category: Personal
added_at: "2026-08-20T06:25:19.000Z"
contributor: scheemunai
contributor_url: https://x.com/scheemunai
integrations: [TranscriptAPI]
integration_urls:
  TranscriptAPI: https://transcriptapi.com
---
Set up an always on teammate that keeps score on the people I listen to.

Walk me through connecting TranscriptAPI (transcriptapi.com), which returns YouTube transcripts and video and channel search.

Ask me which channels to follow (institutional such as @TED, @NASA or @natgeo, or the shows and analysts I watch), which subjects to score, and how confidently a statement must be made to count as a call. Also ask me where to send the weekly scoreboard (this chat, Slack, email, Discord or Telegram) and where to keep the scoreboard itself (a Notion database, a Google Sheet, or a state file), and connect only what I pick.

Run weekly: check each channel for new uploads, pull the transcript, and extract every falsifiable prediction (a claim about the future with something checkable and, where stated, a date). Log each: who said it, the channel, the video, the timestamp, the claim in their own words, the resolve date, and how confidently it was said. Skip opinions, jokes and hedges. Keep a state file of every video read.

Every week, take the calls whose resolve date passed, check what happened, and mark each correct, wrong or unresolvable with a one line note and a source. Send me one update a week wherever I chose: new calls logged, calls that just resolved, and the running scoreboard (each voice's hit rate, call count, most confident wrong call, least likely right one). Add one line I would enjoy, for example the voice whose confidence and accuracy are furthest apart. If nothing moved, a single line.

Keep it fair: quote accurately, link video and timestamp, do not score sarcasm, do not post publicly. Run one dry run over one channel's last month, then save it.

TranscriptAPI is an independent service and is not affiliated with YouTube or Google.
