# Rebrand the fork as Workbench Skills, renamed to workflow vocabulary

This repo began as a fork of `mattpocock/skills`. It is now the skill source for the Workbench, so the skills are named
for the job they do in the Workbench flows rather than for their author, and overlapping skills are merged so each job
has exactly one skill.

## Decision

- Brand: **workbench** (`ask-workbench`, `setup-workbench`, plugin `workbench-skills`).
- Main-flow skills use short verbs that read as a sequence: `shape` → `spec` → `slice` → `build` / `build-graph` →
  `review` → `pr` → `retro`. Disciplines use nouns that name the vocabulary they own: `interview`, `domain-language`,
  `module-design`, `debug`.
- Workbench skills that overlapped upstream were merged into the upstream skill (Workbench `spec` into `spec`, `build`
  into `build`, `review` into `review`, `retro` into `retro`). Workbench-only skills live in the promoted
  `skills/workbench/` bucket.
- Labels: the upstream triage roles stay; Workbench's `agent-ready` becomes `ready-for-agent`; a spec issue is
  `type:spec` and never `ready-for-agent` (upstream labelled specs `ready-for-agent`, which made AFK agents try to build
  whole specs).
- Matt-specific misc skills moved to `deprecated/`; `git-guardrails-claude-code` is replaced by the Workbench guard hook,
  which covers all four harnesses.

## Consequences

Upstream changes no longer apply as plain merges. They are ported through `upstream-map.json` (ADR 0005). The MIT
licence keeps the upstream copyright notice alongside ours.
