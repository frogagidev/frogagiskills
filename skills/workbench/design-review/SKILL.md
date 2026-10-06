---
name: design-review
description: Score a UI change from real screenshots against DESIGN.md and the craft rules, fix the worst problems, and stop after two rounds. Use for design-type issues, UI polish, "does this look right", or before approving any user-visible change.
---

# Design review: screenshot scorecard loop

Combines the Video&Motion contact-sheet loop, the formbrain-public viewport checks and Impeccable's
"bounded passes" rule. For the design work itself, call the Skill tool with `impeccable` if it is installed, and with `prototype` for code variations.

## Inputs
`DESIGN.md`, `design/tokens.css`, the issue's AC, `references/craft.md`.

## Steps
1. Run the app. Capture each changed screen at **320, 768, 1440 px** and at **200 % text** (Playwright), plus loading, empty and error states. Save them to `design/review/<date>-<slug>/round-<k>/`.
2. **Look** at the screenshots: open the images, don't reason from code.
3. Score 1–10 for each of: hierarchy · typography · spacing/rhythm · colour & contrast (AA) · states · motion (or reduced-motion fallback) · brand fit with `DESIGN.md` · craft (`references/craft.md` violations).
4. Write `scorecard.md` next to the screenshots: scores, the 3 worst problems, each with screenshot + fix.
5. Fix the 3 worst problems using tokens only (no new hex values or one-off spacing).
6. Round 2: re-capture and re-score. **Stop after round 2**, even if not perfect; list what remains.
7. Optional second opinion: send the round-2 sheet to Gemini (Antigravity) for a critique of the screenshots only.

## Success
Every score ≥7, no craft violations, accessibility checks pass, or the remaining items are listed for the human.

## Stop
The change needs a new token, font or palette decision → `[FILL]` for the user; don't invent one.
