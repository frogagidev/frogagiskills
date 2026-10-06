---
name: stuck
description: Get a short second opinion from a stronger clean-context advisor when the same failure repeats. Use after the same error signature appears 3 times, after 2 failed approaches, or when unsure which of two designs to pick.
---

# Stuck: advisor inversion

The advisor gives judgement; **you** still do the work. It is a stronger model in a clean context, consulted briefly.

## Triggers (any)
- Same failure signature 3 times.
- Two different approaches both failed.
- Genuine 50/50 design choice with real cost either way.

## Steps
1. Write a brief, ≤300 words, to `.agent/stuck.md`: goal (AC), what you tried (one line each), the exact failing output (≤20 lines), your current hypothesis, the specific question.
2. Ask the advisor:
   - Claude Code: delegate to the `advisor` subagent (defined in the agent library) with the brief.
   - Codex or other: `claude -p --model claude-fable-5-1 "$(Get-Content .agent/stuck.md -Raw)"` from the worktree (read-only use).
3. Apply the advice as **one** new hypothesis. Re-run the gate.
4. Max 3 consults per issue. Still stuck → set result `blocked`, include the brief and advice in `.agent/result.md`.

## Success
New hypothesis tested; outcome recorded.
