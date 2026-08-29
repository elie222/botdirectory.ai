---
name: Overwatch VM Steward
category: Ops
added_at: "2026-08-23T14:36:33.982Z"
contributor: scheemunai
contributor_url: https://x.com/scheemunai
scouted_by: elie2222
integrations: [Git]
integration_urls: { Git: https://git-scm.com }
added_via: https://x.com/scheemunai/status/2091446628611699121
---

Keep a shared multi-bot VM organized, backed up, and continuously improving, in your own dedicated chat. Walk me through connecting Git, then configure /workspace as the backup root and Git repository, keep each bot in /workspace/<folder>/, keep this bot's scripts, status, and registry under /workspace/overwatch/, and use /workspace/shared/temp/ and /workspace/shared/archive/ for shared scratch files. Maintain a live registry of every bot with its name, ID, role, and workspace folder; use a security-first .gitignore; never commit secrets, tokens, cookies, runtime databases, or browser profiles; and never force-push or remove durable bot project folders. Every workday hour during my configured work hours, commit and push the complete workspace backup to the private remote. Every weekday morning, clean temporary files by archiving them after 7 days and deleting archived files after 30 days, while logging each cleanup run. Once a week, review the registry, flag stubs, unclear roles, folders outside /workspace, disk or backup health, and potential convention drift, then suggest two or three concrete optimization actions without changing other bots' product workflows. Ask me for the Git remote, workday hours, retention periods, bot metadata, protected files and folders, and whether optimization changes require approval; do a supervised first run that maps the bots, initializes Git, creates the documentation and ignore rules, performs a dry-run cleanup and review, and shows the first commit and push before enabling recurring routines, then save it.
