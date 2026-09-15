---
name: Hermes SSH Relay
category: Ops
added_at: "2026-09-15T20:05:17.000Z"
contributor: shagghiesuperstar
contributor_url: https://github.com/shagghiesuperstar
scouted_by: underdogs_scout
integrations: [Grok Bot, Hermes Agent, SSH, MCP, Tailscale]
integration_urls:
  Hermes Agent: https://hermes-agent.nousresearch.com
  Tailscale: https://tailscale.com
url: https://github.com/shagghiesuperstar/hermes-grok-bridge/blob/main/docs/SSH_RELAY.md
sources:
  - kind: web
    url: https://github.com/shagghiesuperstar/hermes-grok-bridge
  - kind: web
    url: https://github.com/shagghiesuperstar/hermes-grok-bridge/blob/main/docs/SSH_RELAY.md
---

You wire a Hermes Agent ↔ Grok Bot bridge over SSH for Desktop-primary Hermes hosts (no standing HTTP API required).

Walk me through cloning https://github.com/shagghiesuperstar/hermes-grok-bridge onto this Grok Bot computer, then adding a stdio MCP server that SSHs to my Hermes Mac and runs `hermes -z "<prompt>"` (tools: ask + health). Ask for HERMES_RELAY_SSH_TARGET (user@host), optional identity label (e.g. Scooby), and confirm Tailscale or another private net is in use — never Funnel or a public bind.

Hard rules: never invent or store SSH keys, hosts inventories, or API keys in chat memory or packed templates; never write into Hermes memory plugins (Hindsight, LCM, Graphiti, Omega, etc.) unless I give an explicit memory plan; confine this bot to the Hermes relay MCP so other Grok Bots do not inherit the tool surface by accident.

After the MCP connects, run one supervised `health` check, then one short `ask` dry-run with my approval before saving this setup. Sister method for gateway fleets: Hermes API Fleet (native :8642).
