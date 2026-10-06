---
name: design-explore
description: Explore 2-3 visual directions for a screen or brand with free tools (Google Stitch, Penpot, Excalidraw), get the user's pick, and turn it into DESIGN.md + design/tokens.css. Use at the start of UI work, for a redesign, or when the user wants to see options before building.
---

# design-explore: directions before code

Free toolchain, no Figma seat needed:

| Tool | Use it for | Agent access |
|---|---|---|
| Google Stitch (free) | Fast UI directions from a prompt, sketch or screenshot; exports HTML/Tailwind/React | `stitch` MCP (see `$env:WORKBENCH_HOME/mcp/catalog.json`) or the web app |
| Penpot (free, open source) | Hand-editable canvas when you want to tweak layouts yourself; design-system file | `penpot` MCP via its local server + plugin |
| Excalidraw (free) | Wireframes and flows before visual design | Hermes `excalidraw` skill, or excalidraw.com |
| Claude Design / Artifact page | Side-by-side approval board | Claude Code / claude.ai |

## Steps
1. Read `DESIGN.md` (if any), `docs/SPEC.md` and the issue. Note what must be kept (brand, content, accessibility floor).
2. Wireframe the flow if layout is unclear (Excalidraw); skip for small screens.
3. Generate **2–3 distinct directions** (Stitch via MCP, or prompt Stitch in the browser and save exports to `design/refs/explore-<date>/`). Directions must differ in typography, density and colour, not just accent hue. Avoid everything in `references/craft.md` of the `design-review` skill.
4. Put the directions side by side on one approval page (Artifact page, Claude Design gallery, or a local HTML file at three widths). Ask the user to pick one and note any changes.
5. Optional refinement in Penpot when the user wants to adjust by hand: pull the chosen direction in, let the user edit, then read back the tokens through the `penpot` MCP.
6. Write the decision:
   - values into `design/tokens.css` (the only place values live; Penpot and Stitch are inputs, not the source of truth),
   - roles and rules into `DESIGN.md` (current state only),
   - a 5-line entry in `docs/DECISIONS.md` with links to the refs.
7. Hand over to the build loop: issues of type `type:design`, verified by calling the Skill tool with `design-review`.

## Stop
The user hasn't picked a direction. Don't build from an unapproved direction.
