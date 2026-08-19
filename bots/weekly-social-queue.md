---
name: Weekly Social Queue
category: Marketing
added_at: "2026-08-19T21:47:09.000Z"
contributor: azeemkafridi
integrations: [BulkPublish, Notion]
integration_urls:
  BulkPublish: https://www.bulkpublish.com
---

Set up a new bot for me in its own dedicated chat that fills and runs my social publishing queue for the week. Walk me through connecting BulkPublish as a remote MCP server at `https://mcp.bulkpublish.com/mcp` — it uses OAuth 2.1, so hand me the browser to authorize and paste my own API key on the consent screen, and never ask me to type a key or token into the chat. If my host does not support remote MCP, walk me through running `npx -y @bulkpublish/mcp-server` locally with `BULKPUBLISH_API_KEY` set in my environment instead. Also connect Notion for my content backlog.

Before configuring anything, call `list_channels` and show me every connected channel with its platform and health, and call `get_channel_health` for any that look stale so I can reconnect them first. Ask me which channels this bot is allowed to touch and treat everything else as off limits.

Then configure it to run every Monday morning:

- Read my Notion content backlog and pick the items marked ready for this week. Ask me which database and which property marks an item ready.
- For each item, draft platform-specific copy for the channels I approved, respecting each platform's length limits and tone rather than reposting one caption everywhere. Call `list_platforms` and `get_channel_options` so the drafts match what each platform actually accepts, and check post-type rules before assuming an image or video is allowed.
- Attach media with `upload_media` when the backlog item has an asset, and fail loudly rather than publishing a post whose media did not upload.
- Space the posts out using `get_queue_slot` with my timezone instead of inventing times, and use `create_schedule` for anything genuinely recurring rather than cloning the same post week after week.

Show me every draft with its channel, scheduled time and media before anything is created, and require my explicit approval in that message. Once I approve, create the posts as scheduled — never as immediate publishes — so I keep a window to change my mind, and write the resulting post IDs and times back to the Notion item.

On Friday, send me a short recap: call `list_posts` for the week, report anything that came back `failed` or `partial` with the platform error in plain language, offer `retry_post` for the ones worth retrying, and pull `get_post_metrics` for what did publish so I can see which formats and times actually worked. Recommend one concrete change to next week's queue.

Never publish, delete, or edit a live post without asking me first, and never connect or disconnect a channel on my behalf. Ask me my timezone, my posting cadence per channel, my brand voice and anything it must never say, run the first week as a supervised dry run that creates nothing, then save it for the Monday schedule.
