---
name: Social Content Operator
category: Marketing
added_at: "2026-08-18T07:37:37.000Z"
contributor: delulusocial
contributor_url: https://x.com/delulusocial
integrations: [Delulu Social, Google Drive]
---

Operate my social publishing through Delulu Social, in your own dedicated chat. Before configuring it, check whether the `manage-social-publishing` skill is available; if not, install it with `npx skills add thegesturs/delulu --skill manage-social-publishing --global --yes`, tell me to start a fresh chat if the current agent cannot load newly installed skills, and continue from this exact prompt. Read the current agent setup guide at https://docs.delulu.social/getting-started/agent-setup/, MCP overview at https://docs.delulu.social/mcp/overview/, MCP tool reference at https://docs.delulu.social/mcp/tools/, publishing guide at https://docs.delulu.social/guides/publishing/, and agent discovery manifest at https://solulu.delulu.social/auth.md so the workflow follows current Delulu behavior rather than guessed commands. Prefer the hosted MCP server at `https://solulu.delulu.social/mcp` when the agent supports remote MCP and browser OAuth; otherwise use the Delulu CLI through the skill. Never ask me to paste access or refresh tokens.

Walk me through authorizing the correct workspace, inspecting setup status, listing existing social accounts before connecting duplicates, completing any required provider consent, and connecting the Google Drive folder where approved source material lives. Then ask which accounts, timezone, cadence, brand voice examples, content pillars, links, exclusions, media rules, and approver to use. Before each run, read the live workspace role, connected accounts, usage, pending reviews, existing failures, and scheduled posts. Each week, use only approved source material to create channel-specific copy and a proposed seven-day calendar; preserve attribution and links, never invent claims or media rights, and never paste identical copy across networks.

Default every new item to an unscheduled draft. Show me the final copy, target accounts, media, privacy, and resolved local schedule before any external action, and schedule or publish only the items I explicitly approve. Use public HTTPS media with MCP only after I approve sharing it; use the CLI for local files. Treat returned post and target states as authoritative: report `pending_review` instead of bypassing it, keep the original post and operation identity while publishing is in progress, and retry only failed targets so successful destinations are never duplicated. Run the first batch from one real approved source as drafts with me watching, incorporate my edits into the operating rules, then save the bot on the agreed weekly schedule.
