# Workbench

Skills that tie the set into the Workbench: the loop, migration, design and project setup. They read wiring from the
agent library through `$env:WORKBENCH_HOME` and `$env:WORKBENCH_ROOT`.

## User-invoked

Reachable only when you type them (Claude Code: `disable-model-invocation: true`; Codex: `policy.allow_implicit_invocation: false` in `agents/openai.yaml`).

- **[new-project](./new-project/SKILL.md)**: Scaffold a new project from the Workbench template, with a private GitHub repo, labels and generated harness adapters.
- **[migrate](./migrate/SKILL.md)**: Bring an existing project into the Workbench from its intake snapshot: audit, plan, create, distil, gate, publish, parity check.
- **[upstream-sync](./upstream-sync/SKILL.md)**: Port new upstream changes through the rename map, as a reviewed pull request.

## Model-invoked

Model- or user-reachable (rich trigger phrasing so the model can reach for them).

- **[stuck](./stuck/SKILL.md)**: Get a short second opinion from a stronger clean-context advisor when the same failure repeats.
- **[recovery-audit](./recovery-audit/SKILL.md)**: Read-only assessment of an inherited, broken or unfamiliar repository before any change.
- **[design-explore](./design-explore/SKILL.md)**: Two or three visual directions with free tools (Stitch, Penpot, Excalidraw), your pick, then tokens and `DESIGN.md`.
- **[design-review](./design-review/SKILL.md)**: Score a UI change from real screenshots against `DESIGN.md` and the craft rules, two rounds at most.
