---
name: recovery-audit
description: Read-only assessment of an inherited, broken or unfamiliar repository before any change. Use when picking up an old project, after a failed migration, or when the repo state is unclear.
---

# Recovery audit

Replaces the five divergent copies found in the old projects. **Read-only until the user approves a plan.**

## Steps
1. Snapshot: `git status --short`, branch, HEAD, `git worktree list`, `git stash list`, remotes. Save to `.agent/audit/<date>/git.txt`.
2. Inventory: manifests and lockfiles, runtime versions, scripts, CI, agent files (`AGENTS.md`, `CLAUDE.md`, `.claude/`, `.codex/`, `.agents/`), env var **names** from `.env.example` (never read `.env`).
3. Try the canonical checks without installing anything new: lint, tests, build. Record exact commands and outcomes.
4. List persistent or user-owned data (databases, caches, exports, media) that cleanup must never touch.
5. Report: what works, what's broken (with evidence), risks, and a numbered repair plan with the risk tier of each step.

## Stop
Uncommitted user changes that a step would overwrite; any need to read secrets; any destructive cleanup. Ask first.
