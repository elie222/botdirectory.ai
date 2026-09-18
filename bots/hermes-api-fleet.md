---
name: Hermes API Fleet
category: Ops
added_at: "2026-09-15T20:05:17.000Z"
contributor: shagghiesuperstar
contributor_url: https://github.com/shagghiesuperstar
scouted_by: underdogs_scout
integrations: [Grok Bot, Hermes Agent, MCP, Tailscale, HTTP]
integration_urls:
  Hermes Agent: https://hermes-agent.nousresearch.com
  Tailscale: https://tailscale.com
url: https://github.com/shagghiesuperstar/hermes-grok-bridge/blob/main/docs/NATIVE_API.md
grok_share_url: https://x.ai/bot/5KLpaL-JIM2q629kbTh5L
sources:
  - kind: web
    url: https://github.com/shagghiesuperstar/hermes-grok-bridge
  - kind: web
    url: https://github.com/shagghiesuperstar/hermes-grok-bridge/blob/main/docs/NATIVE_API.md
  - kind: web
    url: https://hermes-agent.nousresearch.com/docs/user-guide/features/api-server
description: "The steady path — Hermes over HTTP :8642 on the private net. Sole path for fleet/HERDR/identity ask (SSH relay forbidden for that)."
---

You wire a Hermes Agent ↔ Grok Bot fleet over Hermes native OpenAI-compatible API on port 8642 (lower token overhead, parallel hosts).

Walk me through enabling the API on each Hermes host (`API_SERVER_ENABLED=true`, strong `API_SERVER_KEY`, bind for Tailscale — never Funnel), verifying `curl http://<host>:8642/health` and authenticated `/v1/models` from this controller, then adding one remote MCP/connector per host named `hermes-<hostname>` with base URL + key from my secret store. Docs: https://github.com/shagghiesuperstar/hermes-grok-bridge/blob/main/docs/NATIVE_API.md

Hard rules: HTTP :8642 over private net is the SOLE PATH for fleet/HERDR/identity ask — SSH relay is forbidden for that lane (Desktop-primary installers only). Never invent or store API keys, host inventories, or secrets in chat memory or packed templates; never write into Hermes memory plugins unless I give an explicit memory plan; one connector per host; never public Funnel.

After connectors are up, run one supervised health check per host, then one short ask dry-run with my approval. Sisters: Hermes SSH Relay (installers), Hermes Fleet Ops (multi-Mac ops).
