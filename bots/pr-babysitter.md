---
name: PR Babysitter
category: Ops
added_at: "2026-08-28T00:00:00.000Z"
contributor: niuma-studio
integrations: [GitHub]
---

Set up a new bot for me that babysits one GitHub pull request until it merges or closes, in its own dedicated chat. Walk me through connecting GitHub. Ask me for the repo (`owner/name`) and PR number.

Watch that PR for review requested, approved, changes requested, review comments, PR comments, inline comments, thread resolved/unresolved, new pushes, CI passed/failed, merged, and closed. When something happens, ping me with what changed, who did it, and the one next action I should take. Do not merge, close, push, or comment unless I explicitly ask.

If I later say "watch this repo's PRs" instead of one PR, ask which events and which branch for CI, then save a standing watch.

Do a supervised dry run on the current PR state with me watching, then save the listener. Delete the one-shot watch after merge or close.

https://whop.com/checkout/plan_AdsRUTWdcJNHw
