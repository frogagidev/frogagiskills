## What it does

`design-review` judges a UI from real screenshots, not from code. It captures each changed screen at 320, 768 and 1440 pixels and at 200 % text, plus loading, empty and error states, scores eight criteria from 1 to 10, fixes the three worst problems using tokens only, and stops after the second round. The two-round cap is deliberate: open-ended self-polishing costs more than it improves.

## When to reach for it

Type `/design-review`, or the agent reaches for it automatically when a task fits. The loop's reviewer calls it for issues labelled `type:design`.

| Situation | Use |
|---|---|
| A built screen needs a quality check | `design-review` |
| No direction chosen yet | [design-explore](./design-explore.md) first |

## The scorecard

Hierarchy, typography, spacing and rhythm, colour and contrast, states, motion (or its reduced-motion fallback), brand fit with `DESIGN.md`, and craft violations. A change that needs a new token, font or palette stops and asks you rather than inventing one.

## It's working if

- Each round leaves a folder of screenshots and a scorecard you can open.
- Fixes use existing tokens; no new hex values appear in the diff.

## Where it fits

The end of the design flow and part of review for design issues. For the map of all skills, see [ask-workbench](../engineering/ask-workbench.md).
