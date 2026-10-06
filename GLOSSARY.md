# Workbench Skills

Agent skills (slash commands and behaviours) loaded by Claude Code, Codex, Hermes and Antigravity. Skills are organised
into buckets and consume per-repo configuration written by `setup-workbench`.

## Language

**Harness**:
The agent tool that runs a skill: Claude Code, Codex, Hermes or Antigravity. All four are equal; any of them may take any lane.
_Avoid_: client, tool (when the harness is meant)

**Lane**:
A kind of work a harness takes on in the loop: build, review, research, design. The reviewer lane always runs on a different model vendor from the build lane.

**Contract**:
The files every harness reads in a project: `AGENTS.md`, skills, MCP list and policy. An **Issue** with acceptance criteria is the contract for one change.

**Gate**:
The project's single definition of done (`scripts/verify.ps1`), run by builders, reviewers and CI alike.

**Flow**:
A path through the skills, mapped by `ask-workbench`: the main flow (shape, spec, slice, build, review, pr, retro), on-ramps, and the Workbench flows (loop, migration, design).

**Loop**:
The scheduled dispatcher that moves `ready-for-agent` **Issues** through build and review in any harness. Agents never merge.

**Issue tracker**:
The tool that hosts a repo's issues: GitHub Issues (Workbench default), GitLab, a local `.scratch/` markdown convention, or similar. `spec`, `slice` and `triage` read from and write to it.
_Avoid_: backlog manager, backlog backend, issue host

**Issue**:
A single tracked unit of work inside an **Issue tracker**: a bug, task, spec, or slice produced by `slice`.
_Avoid_: ticket (use only when quoting external systems that call them tickets, or for a **Decision ticket**)

**Spec issue**:
The issue `spec` publishes. Labelled `type:spec`, never `ready-for-agent`, so the loop never tries to build a whole spec at once.

**Decision ticket**:
A `wayfind` unit: a child **Issue** of a `wayfind:map` holding a *question* whose resolution is a decision, not a slice of a build.

**Triage role**:
A canonical state-machine label applied to an **Issue** during triage (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). Each role maps to a real label string via `docs/agents/triage-labels.md`.

**Loop label**:
A label the loop reads or writes: `in-progress`, `needs-review`, `loop-approved`, `changes-requested`, `needs-human`, `blocked`, `agent:<harness>`, plus `risk:*`, `size:*`, `type:*`.

**Upstream**:
[mattpocock/skills](https://github.com/mattpocock/skills), the repo this one was forked from. `upstream-map.json` records how every upstream path maps here.

## Relationships

- An **Issue tracker** holds many **Issues**
- An **Issue** carries one **Triage role** at a time, plus any number of **Loop labels**
- A **Spec issue** is split by `slice` into **Issues** with blocking edges
- A **Decision ticket** is an **Issue** (a child of a `wayfind:map`)

## Flagged ambiguities

- "backlog" was previously used for both the *tool* hosting issues and the *body of work*. Resolved: the tool is the **Issue tracker**.
- `agent-ready` (old Workbench label) and `ready-for-agent` (upstream triage role) meant the same thing. Resolved: `ready-for-agent` everywhere.
