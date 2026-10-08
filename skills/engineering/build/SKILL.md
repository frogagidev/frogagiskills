---
name: build
description: Implement one piece of work (an issue, a slice, or a small spec) exactly to its acceptance criteria, test-first at agreed seams, prove it with the project gate, and hand back a result. Use when the user says "build #12", "implement this issue", or when the Workbench loop starts you on an issue.
---

# Build

The issue (or spec) is the **contract**: build exactly its acceptance criteria (AC-n) and nothing its non-goals (NG-n)
exclude. You may be running interactively, or **headless** in a worktree the Workbench loop created
(`$env:WORKBENCH_ROOT\_worktrees\<repo>\agent-<n>`).

## Steps

1. Read the contract: `gh issue view <n> --comments` (or the spec/slice file). On a rework round, read the latest
   review comment too. Read `AGENTS.md`, the project's domain glossary and ADRs in the area you're touching, and only
   the files you need. UI work: `DESIGN.md` and `design/tokens.css` as well.
2. Build test-first: call the Skill tool with `tdd` and work one red-green slice at a time at the seams the spec agreed.
   Run typechecking and single test files regularly.
3. Make the smallest change that meets every AC and breaks no NG. No drive-by edits, no new dependencies (if one is
   truly needed, stop and report it).
4. Run the gate: `pwsh scripts/verify.ps1` (or the repo's documented full check) until it passes.
   - Track failure signatures (first error line + file). The **same signature three times**: call the Skill tool with
     `stuck`. Still failing after its advice: stop and report blocked.
   - Never skip, delete or weaken tests, relax lint rules, or add ignore comments to get green.
5. Call the Skill tool with `review` on your diff and fix what it raises (interactive runs; in the loop a different
   vendor reviews instead).
6. Commit on the current branch with message `#<n>: <summary>`.
7. Hand back:
   - **Interactive:** push and open the PR yourself; call the Skill tool with `pr` for the body.
   - **Headless (loop):** do not push or open a PR. Write `.agent/result.json`
     (`{"status":"done|blocked","issue":<n>,"summary":"...","gate":"pass|fail","attempts":<k>}`) and `.agent/result.md`
     (the PR body, shaped by the `pr` skill: what changed, an AC evidence table, the gate result, `[VERIFY]` items,
     risks). The loop pushes and opens the PR. Write the result files even when blocked.

## Rules

Stay inside the worktree. Never push to `main`, merge, deploy, or read secrets (`.env*`, keys). Prefer CLIs to MCP
tools and point to log files rather than pasting them.

- **One writer per folder.** If another harness may be building in this checkout, build in your own worktree:
  `git worktree add $env:WORKBENCH_ROOT\_worktrees\<repo>\<n>-<slug> -b agent/<n>-<slug> origin/main`.
- **Bringing a PR branch up to date:** `git fetch origin`, then `git merge origin/main`. Never rebase: rebasing needs a
  force push, which the guard blocks. Re-run the gate after resolving conflicts.
- Stop any dev server or browser you started before you hand back.
