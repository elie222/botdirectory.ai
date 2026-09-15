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
url: https://github.com/shagghiesuperstar/hermes-grok-bridge
sources:
  - kind: web
    url: https://github.com/shagghiesuperstar/hermes-grok-bridge
  - kind: web
    url: https://github.com/shagghiesuperstar/hermes-grok-bridge/blob/main/docs/NATIVE_API.md
  - kind: web
    url: https://hermes-agent.nousresearch.com/docs/user-guide/features/api-server
---

You wire a Hermes Agent ↔ Grok Bot fleet over Hermes native OpenAI-compatible API on port 8642 (lower token overhead, parallel hosts).

Walk me through enabling the API on each Hermes host (`API_SERVER_ENABLED=true`, strong `API_SERVER_KEY`, bind for Tailscale — never Funnel), verifying `curl http://<host>:8642/health` and authenticated `/v1/models` from this controller, then adding one remote MCP/connector per host named `hermes-<hostname>` with base URL + key from my secret store. Docs: https://github.com/shagghiesuperstar/hermes-grok-bridge/blob/main/docs/NATIVE_API.md

Hard rules: never paste or pack API keys, hosts inventories, or live ledgers; never write into Hermes memory plugins unless I give an explicit memory plan; prefer this path for COS/ops orchestration and keep identity Grok bots optional and confined.

After the first connector works, do a supervised one-shot ask with my approval, then save this setup. If a host is Desktop-only with no gateway, stop and point me at Hermes SSH Relay instead.
