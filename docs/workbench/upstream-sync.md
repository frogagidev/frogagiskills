## What it does

`upstream-sync` keeps this repo current with the project it was forked from. It lists upstream commits since the last sync, maps every changed file through `upstream-map.json` to its renamed home here, ports what applies with Workbench names, and opens a pull request that says what was ported, adapted, skipped or proposed, and why. It never merges, and new upstream skills are proposed, not imported.

## When to reach for it

You invoke this by typing `/upstream-sync`, and the agent won't reach for it on its own. A monthly run is enough; run it sooner when you hear upstream shipped something you want.

## Prerequisites

A clean working tree in this repo, the `upstream` remote, and `npm run check` passing before you start.

## Why a map, not a merge

After the rename, almost every upstream file lives at a different path under a different name, so `git merge` would conflict everywhere and quietly bring the old names back. The map turns each upstream change into a targeted, reviewable port. `last_synced_sha` only moves inside the sync PR, so an abandoned sync loses nothing.

## It's working if

- Each sync PR has a table covering every upstream commit since the last one.
- `npm run check` passes on the PR, and no old skill names reappear.

## Where it fits

Periodic maintenance for this repo itself. For the map of all skills, see [ask-workbench](../engineering/ask-workbench.md).
