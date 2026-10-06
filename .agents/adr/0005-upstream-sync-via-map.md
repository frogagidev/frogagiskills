# Follow upstream through a rename map, porting changes as reviewed PRs

Upstream (`mattpocock/skills`) keeps improving as agentic workflows change. After the rebrand (ADR 0003) its paths and
skill names no longer match ours, so `git merge upstream/main` would conflict on nearly every file and silently
reintroduce old names.

## Decision

- `upstream-map.json` records, for every upstream path, where it lives here: a new path, `merged-into:<skill>`, or
  `dropped`, plus `last_synced_sha` (the last upstream commit fully considered).
- The user-invoked `upstream-sync` skill lists upstream commits since `last_synced_sha`, maps each changed path through
  the map, ports what applies onto a branch with our names, and opens a PR that lists what was ported, adapted or
  skipped and why. It never merges. `last_synced_sha` moves only in that PR.
- New upstream skills are proposed, not imported automatically: the PR suggests a Workbench name and bucket.

## Consequences

Every rename, merge or drop of an upstream-derived file must update the map in the same change (`npm run check`
verifies every upstream path is mapped).
