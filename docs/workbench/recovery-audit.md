## What it does

`recovery-audit` gives you a read-only picture of a repo you didn't just write: git state, toolchain, the checks that pass or fail, the data that cleanup must never touch, and a numbered repair plan with the risk of each step. It changes nothing until you approve the plan, and it never reads secrets.

## When to reach for it

Type `/recovery-audit`, or the agent reaches for it automatically when a task fits.

| Situation | Use |
|---|---|
| Picking up an old or unfamiliar project | `recovery-audit` |
| Bringing a project into the Workbench | [migrate](./migrate.md), which runs this on the intake snapshot |
| A specific bug in a repo you know | [debug](../engineering/debug.md) |

## Evidence before cleanup

The audit records what exists before anything is moved: uncommitted work, stashes, worktrees, persistent data. Repairs that would overwrite user changes, need secrets, or delete anything stop and ask first.

## It's working if

- The report lists commands it actually ran and their results, not guesses.
- Every repair step carries a risk tier, and nothing ran before you approved it.

## Where it fits

A reach-for-it-anytime standalone, and the first look inside [migrate](./migrate.md). For the map of all skills, see [ask-workbench](../engineering/ask-workbench.md).
