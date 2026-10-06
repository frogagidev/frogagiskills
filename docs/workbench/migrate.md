## What it does

`migrate` brings an existing project into the Workbench without touching the original. It works from a read-only intake snapshot, audits it, agrees a plan with you, builds the new project at `<root>\<name>`, distils the old agent files into a short `AGENTS.md`, docs and project skills, gets the gate green, publishes a private repo through a reviewed PR, and finishes with a parity check in two harnesses. `MIGRATION.md` in the intake folder records every step.

## When to reach for it

You invoke this by typing `/migrate`, and the agent won't reach for it on its own.

| Situation | Use |
|---|---|
| A project you want to keep developing with the Workbench | intake script, then `migrate` |
| Just understanding an old repo | [recovery-audit](./recovery-audit.md) |
| Starting from nothing | [new-project](./new-project.md) |

## Prerequisites

An intake snapshot made by the agent library's `import-project.ps1`, run from a profile that can read the original. The skill stops if the snapshot is missing.

## Distil, don't copy

Old setups often carried duplicated instruction files, status notes inside `AGENTS.md`, and several divergent copies of the same skill. The migration keeps only what is still true, drops what the shared skills already do, and parks the originals in `docs/legacy-agent-setup/` until nothing useful is left in them.

## It's working if

- The original folder's git status is unchanged after the migration.
- The new `AGENTS.md` is under 100 lines and two different harnesses each merged a change through it.
- Secrets committed in the old history are listed for rotation, not silently carried.

## Where it fits

An on-ramp that ends on the main flow. For the map of all skills, see [ask-workbench](../engineering/ask-workbench.md).
