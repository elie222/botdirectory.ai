## What's in this PR

<!-- One line: which bot you're adding or what you're changing. -->

## Checklist (adding a bot)

- [ ] One markdown file in `bots/`, named after the slug of the bot's `name`
      (lowercase, non-alphanumerics → `-`, e.g. `SEO Improver` → `bots/seo-improver.md`)
- [ ] Frontmatter has `name`, `category`, `contributor`, `integrations` (see CONTRIBUTING.md)
- [ ] Optional: include `grok_share_url` only if you have a real official
      `https://x.ai/bot/…` share link — never invent one; omit the field until
      you do (see CONTRIBUTING.md)
- [ ] Integrations have an icon in `data/tool-icons.json` where possible (add + `pnpm icons`; see CONTRIBUTING)
- [ ] The markdown body is the real prompt (You-voice), **or** frontmatter
      `description` holds a public blurb for share-URL-only listings — never put
      an x.ai page blurb in the body labeled as a prompt
- [ ] `pnpm validate` passes locally
- [ ] This is a real, working bot — not an ad (promoted placement is the sponsor program, not a PR)
