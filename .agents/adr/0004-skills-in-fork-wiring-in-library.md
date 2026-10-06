# Skills live in this repo; per-profile wiring lives in the private agent library

The Workbench has two kinds of material: **skills** (portable procedures any harness can run) and **wiring** (who the
user is, model routing, the guard hook, the loop dispatcher, project templates, install scripts). Skills are safe to
share publicly; wiring holds personal preferences and machine paths.

## Decision

- This repo (public) holds every skill. Each Windows profile clones it to `<WORKBENCH_ROOT>\_skills`.
- The private `_agent-library` holds the wiring. Its `install.ps1` runs `scripts/link-skills.ps1` from this repo, which
  creates one directory junction per promoted skill in `~/.claude/skills`, `~/.agents/skills` and
  `~/.gemini/antigravity/skills`, and prints the Hermes `skills.external_dirs` entries (one per promoted bucket).
- Skills reference wiring only through `$env:WORKBENCH_HOME` / `$env:WORKBENCH_ROOT`, never fixed paths.
- Per-skill links, not one link per bucket, because the harnesses expect a flat skills directory and the promoted set
  spans three buckets (the same constraint ADR 0002 hit with Codex plugins).

## Consequences

A `git pull` in `_skills` updates every harness at once. Adding, removing or renaming a promoted skill needs a re-run
of `link-skills.ps1` (the library's `install.ps1` does it).
