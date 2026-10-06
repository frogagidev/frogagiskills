# Triage Labels

The skills speak in terms of five canonical triage roles. This file maps those roles to the actual label strings used in this repo's issue tracker.

| Canonical role             | Label in our tracker | Meaning                                  |
| -------------------------- | -------------------- | ---------------------------------------- |
| `needs-triage`             | `needs-triage`       | Maintainer needs to evaluate this issue  |
| `needs-info`               | `needs-info`         | Waiting on reporter for more information |
| `ready-for-agent`          | `ready-for-agent`    | Fully specified, ready for an AFK agent  |
| `ready-for-human`          | `ready-for-human`    | Requires human implementation            |
| `wontfix`                  | `wontfix`            | Will not be actioned                     |

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), use the corresponding label string from this table.

Edit the right-hand column to match whatever vocabulary you actually use.

## Workbench loop labels

The loop and `slice` also use these. They are created from the project's `.github/labels.json`; rename them only there and in this table together.

| Label | Meaning |
| --- | --- |
| `in-progress` | A builder has claimed this issue |
| `needs-review` | PR open; waiting for the cross-vendor reviewer |
| `loop-approved` | Reviewer approved with evidence; human merge pending |
| `changes-requested` | Reviewer asked for fixes; back to the builder |
| `needs-human` | Judgement call, or review rounds used up |
| `blocked` | Builder stopped with evidence; needs input |
| `agent:claude` / `agent:codex` / `agent:hermes` / `agent:antigravity` | Which harness builds it (otherwise the loop rotates) |
| `risk:low` / `risk:med` / `risk:high` | How far the loop may build it unattended |
| `size:s` / `size:m` / `size:l` | Rough change size |
| `type:feature` / `type:bug` / `type:chore` / `type:design` / `type:spec` | Kind of work; `type:spec` is never built directly |
