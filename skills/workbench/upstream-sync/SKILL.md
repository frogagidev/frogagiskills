---
name: upstream-sync
description: Port new upstream changes (mattpocock/skills) into this repo through the rename map, as a reviewed pull request.
disable-model-invocation: true
---

# Upstream sync

This repo follows its upstream through `upstream-map.json` (see `.agents/adr/0005-upstream-sync-via-map.md`). Plain
merges don't work after the rebrand: paths and names differ. You port changes by hand, one upstream commit at a time,
and open a PR. **Never merge it yourself.**

## Steps

1. Preconditions: the working tree is clean, you are in this repo's root, and the `upstream` remote points at
   `https://github.com/mattpocock/skills` (add it if missing). `git fetch upstream`.
2. Read `upstream-map.json`. List what's new: `git log --reverse --oneline <last_synced_sha>..upstream/main`.
   Nothing new: report "up to date" and stop.
3. Create a branch `upstream-sync/<yyyy-mm-dd>` from `main`.
4. For each upstream commit, in order, `git show --stat <sha>` and map every changed path through the map:
   - **mapped path**: apply the change to our file, translating skill names, paths and labels with the map's `names`
     table (for example `to-spec` → `spec`, `ready-for-agent` stays). Keep our Workbench additions intact; where the
     upstream change conflicts with a Workbench rule (labels, loop mode, `$env:WORKBENCH_*` paths), keep ours and note it.
   - **`merged-into:<skill>`**: fold the change into that skill only if it still applies.
   - **`dropped`**: skip, and say why in the PR.
   - **not in the map** (a new upstream file or skill): don't import it. Propose a Workbench name and bucket in the PR
     body, and add it only if the user agrees in a follow-up.
5. Run `npm run check` after each commit's port; fix what it reports.
6. Set `last_synced_sha` in `upstream-map.json` to the last upstream commit you **fully considered** (ported or
   deliberately skipped), and add any new mappings you created.
7. Commit (`chore(upstream): port <short sha range>`), push the branch, open a PR. The body has a table: upstream
   commit, what it changed, what we did (ported / adapted / skipped / proposed), and why. Add a changeset if skill
   behaviour changed.

## Stop

- The working tree is dirty or `npm run check` fails before you start.
- An upstream change would rename or remove a skill the Workbench flows depend on (`build`, `review`, `spec`, `slice`):
  stop and ask before porting it.
