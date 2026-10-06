---
name: migrate
description: Bring an existing project into the Workbench from its intake snapshot: audit, plan, create, distil, gate, publish, parity check.
disable-model-invocation: true
---

# migrate: existing project → Workbench project

Works in any harness. The **original is never touched**; you work from `<ROOT>\_migrate\<name>\source`
(read-only snapshot) and build the new project at `<ROOT>\<name>`. `MIGRATION.md` in the intake folder is
the running record: tick its status boxes and fill its sections as you go. Ask before every step marked 🔐.

## Phase 1: Intake (the user runs it)
`import-project.ps1 -Source "<old path>" -Name <name>` creates `_migrate\<name>\` with `source\`,
`MIGRATION.md`, `intake.json`, `copy.log`. If it's missing, stop and ask the user to run it.

## Phase 2: Audit (read-only)
1. Read `MIGRATION.md` and `intake.json`.
2. Call the Skill tool with `recovery-audit` and run it **against `source\`**, writing to `_migrate\<name>\audit\`:
   stack and versions, canonical commands (from README, package scripts, CI, old AGENTS/CLAUDE files),
   tests and whether they could run, data dependencies (databases, files, schemas), external services and
   accounts, scheduled jobs, and the old agent setup (rules, commands, skills, MCP, hooks).
3. Check git history for secrets: `git -C source log --all -p | rg -n "<patterns>"` for keys/tokens/passwords
   (report file + commit only, never values). Committed secrets must be rotated.
4. Classify every old agent file: **keep** (still-true rules → AGENTS.md / docs), **skill** (a reusable
   procedure that isn't already in the shared library), **drop** (duplicated, stale, status prose, superseded
   by skills this repo already has, such as `recovery-audit`, `review` or `build`).
5. Write the Audit section of `MIGRATION.md`.

## Phase 3: Plan with the owner (🔐 approval)
Present one batch: mode (**history** keeps git history; **fresh** starts clean, best for messy or huge repos),
what to carry/retire, data handling (regenerate, re-import, or re-run intake with `-IncludeData`), secrets to
re-create, external services, risks, and the new name. Record the decisions in `MIGRATION.md` → Plan/Decisions.

## Phase 4: Create the target (the user runs it, or you with approval)
`migrate-create.ps1 -Name <name> [-Mode fresh] [-Ui]`. It clones/copies the snapshot to `<ROOT>\<name>`,
parks old agent files in `docs/legacy-agent-setup/`, untracks any committed secret files, overlays the
template (never overwriting project files) and commits on branch `workbench/migrate` (history mode).

## Phase 5: Distil (in `<ROOT>\<name>`)
1. Write `AGENTS.md` (≤100 lines): purpose, stack, commands, structure, hard rules, boundaries. Take only what
   is still true from `docs/legacy-agent-setup/`; no status, phase notes or dated approvals. Keep the template's
   Agent skills, Workflow and Skill guidance sections as they are.
2. Move deep knowledge into `docs/` (SPEC, ARCHITECTURE, and an ADR in `docs/adr/` per past decision worth keeping).
   Design content → `DESIGN.md` (current state) + `design/tokens.css`.
3. Recreate genuinely project-specific procedures as `.agents/skills/<name>/SKILL.md`. Don't copy skills the
   shared library already has.
4. MCP servers → `.agents/mcp.json` (only what's still needed); permissions → `.agents/policy.json`.
5. `node scripts/sync.mjs`. Delete `docs/legacy-agent-setup/` only when everything useful is carried (a later commit).

## Phase 6: Gate green
1. Make `scripts/verify.ps1` run the project's real lint/test/build. Install dependencies from lockfiles (🔐 for anything new).
2. 🔐 The user re-creates secrets in `.env` from the password manager (names are in `MIGRATION.md`). Never read `.env`.
3. Run the gate until it passes; record anything left as `[VERIFY]`.

## Phase 7: Publish (🔐 the user runs it)
`publish-project.ps1 -Path <ROOT>\<name>` (private repo, all branches, labels, protection, Hermes trust).
History mode: open a PR `workbench/migrate → <default branch>`; review it with a different vendor's harness
(`review` skill); the user merges.

## Phase 8: Parity check
Spec two tiny issues and build each in a different harness (e.g. Claude Code and Codex); review cross-vendor.
This proves every harness can work on the migrated project.

## Phase 9: Close-out
Fill `MIGRATION.md` → Close-out: new repo URL, what was retired, open risks, and a note to the user that the
original folder is now superseded (they decide whether and when to archive or delete it, and the snapshot).
Add the repo to `$env:WORKBENCH_HOME/loop/repos.json` with `"enabled": false`.

## Stop
- The snapshot is missing or the target already exists.
- A step needs secrets, production data, external writes or deleting anything: ask.
- The audit finds secrets in history: report them before going further.
