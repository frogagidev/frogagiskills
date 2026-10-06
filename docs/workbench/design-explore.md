## What it does

`design-explore` turns "how should this look?" into a decision before any production code is written. It produces two or three genuinely different visual directions with free tools, puts them side by side for you to pick, and records the chosen values in `design/tokens.css` and the rules in `DESIGN.md`. The design tools are inputs; the tokens file stays the single source of truth for code.

## When to reach for it

Type `/design-explore`, or the agent reaches for it automatically when a task fits.

| Situation | Use |
|---|---|
| A new screen, a redesign, or a brand direction | `design-explore` |
| Code variations of one screen to click through | [prototype](../engineering/prototype.md) (UI branch) |
| Checking a built UI | [design-review](./design-review.md) |

## Prerequisites

Optional tool access: Google Stitch (free with a Google account) and Penpot (free, open source) each have an MCP server listed in the agent library's `mcp/catalog.json`. Without them the skill works through their web apps and saves exports by hand.

## Directions, not variations

The directions must differ in typography, density and colour, not just the accent hue, and avoid the banned defaults in the craft rules. Nothing is built from a direction you haven't picked.

## It's working if

- You chose between real alternatives, on one page, at real sizes.
- After the decision, every colour and spacing value in new code comes from `design/tokens.css`.

## Where it fits

The start of the design flow: `design-explore` → build → [design-review](./design-review.md). For the map of all skills, see [ask-workbench](../engineering/ask-workbench.md).
