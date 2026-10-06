# Workbench Skills: rules for agents editing this repo

This repo is the skill source for the Workbench (four equal harnesses: Claude Code, Codex, Hermes, Antigravity).
It started as a fork of [mattpocock/skills](https://github.com/mattpocock/skills) and still follows it through
`upstream-map.json` (see the `upstream-sync` skill and [ADR 0005](./.agents/adr/0005-upstream-sync-via-map.md)).

## Buckets

Skills live in bucket folders under `skills/`:

- `engineering/`: daily code work (promoted)
- `productivity/`: daily non-code workflow tools (promoted)
- `workbench/`: Workbench integration: loop, migration, design, project setup (promoted)
- `misc/`: kept around but rarely used, not promoted
- `in-progress/`: beta, not promoted, not linked by default
- `deprecated/`: no longer used

Every skill in a **promoted** bucket must appear in the top-level `README.md` (name linked to its `SKILL.md`), in its
bucket `README.md`, and in `.claude-plugin/plugin.json`'s `skills` array. Non-promoted skills appear in none of them
except their own bucket `README.md`. Promoted bucket READMEs and the top-level README group entries into
**User-invoked** and **Model-invoked**.

## Invocation

Every `SKILL.md` is user-invoked (`disable-model-invocation: true` plus `policy.allow_implicit_invocation: false` in
`agents/openai.yaml`) or model-invoked (neither). Every skill has an `agents/openai.yaml`. A user-invoked skill may call
model-invoked skills, never another user-invoked one. Dependencies are written as "Call the Skill tool with `<name>`".
Details: [.agents/invocation.md](./.agents/invocation.md).

## The router

[`ask-workbench`](./skills/engineering/ask-workbench/SKILL.md) maps every user-reachable skill and the flows between
them. Whenever you add, rename, remove, or change how a user-reachable skill fits the flows, update it in the same change.

## Docs pages

Promoted skills have a human-facing page at `docs/<bucket>/<skill-name>.md`, written to
[.agents/writing-docs.md](./.agents/writing-docs.md). A rename moves the page.

## Names and upstream

A rename, merge or drop of anything that came from upstream must also update `upstream-map.json`, so future upstream
changes can be mapped. Never edit `last_synced_sha` by hand; `upstream-sync` updates it when a port is merged.

## Checks and linking

- `npm run check` must pass before every commit (frontmatter, invocation pairs, promoted lists, router coverage,
  Skill-tool references, branding leftovers, em-dashes). CI runs it on every PR.
- `claude plugin validate . --strict` after touching `.claude-plugin/`.
- Link skills into the harnesses: `scripts/link-skills.ps1` (Windows) or `scripts/link-skills.sh`.

## Style

No em-dashes anywhere in this repo's prose. Rewrite the sentence with a comma, colon, period, parentheses or a
conjunction instead; never do a blind character substitution. Australian spelling in Workbench-authored text.
