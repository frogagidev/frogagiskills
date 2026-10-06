---
name: ask-workbench
description: Ask which skill or flow fits your situation. A router over the skills in this repo and the Workbench flows.
disable-model-invocation: true
---

# Ask Workbench

You don't remember every skill, so ask. Every skill here works in all four harnesses (Claude Code, Codex, Hermes,
Antigravity); which one you open is your choice per task.

A **flow** is a path through the skills. Most work runs along one **main flow**; **on-ramps** merge onto it; the
**Workbench flows** (loop, migration, design) wrap around it. Everything else is standalone, or a vocabulary layer
underneath.

## The main flow: idea → ship

1. **`/shape`** sharpens the idea by interview and records what it learns in `GLOSSARY.md` and ADRs. Start here
   whenever you are in a working directory. (No working directory? `/grill`, under Standalone.)
2. **Branch: can every question be settled in conversation?** If one needs a runnable answer (state, business logic, a
   UI you have to see), detour through **`/prototype`**, bridged by **`/handoff`** out and back (a prototype lives in
   its own directory). For visual direction with design tools, use the design flow below.
3. **Branch: is this a multi-session build?**
   - **Yes** → **`/spec`** (synthesises the thread into a spec issue labelled `type:spec`, with AC-n and NG-n), then
     **`/slice`** (tracer-bullet issues with **blocking edges**, labelled `ready-for-agent`). Then build them one of
     three ways:
     - **`/build`** per issue, clearing context between each, in whichever harness you like;
     - **`/build-graph`** for the whole spec in one run: implementer subagents across the ready **frontier**, one
       integration branch;
     - **the loop** (below): let the Workbench dispatcher build and review the `ready-for-agent` issues unattended.
   - **No** → **`/build`** right here.

   Either way, `build` drives **`/tdd`** at the agreed seams and runs the **`/review`** two-axis check (Standards +
   Spec). When the work goes up as a pull request, **`/pr`** shapes the body.

4. **`/retro`** closes the loop: it suggests changes to the agent's **environment** (navigation pointers, automated
   checks, coding standards, steering files, tooling), not the code. `/retro weekly` does the same across all loop repos.

### Context hygiene

Keep steps 1 to 3 in **one unbroken context window** until `/slice` has run, so the interview, spec and slices share
the same thinking. Each `/build` then starts fresh from its issue. If a session nears the **smart zone** limit
(~150k tokens) before `/slice`, `/compact` at the nearest phase boundary (see Phase boundaries).

## Workbench flows

- **The loop (any harness, unattended).** The dispatcher in the agent library (`loop_tick.py`) picks
  `ready-for-agent` issues with no open blockers, starts a builder in a worktree with **`build`**, and has a
  **different vendor's harness** run **`review`**. An `agent:<harness>` label picks the builder; otherwise harnesses
  rotate. You merge. When the same failure repeats three times, the builder calls **`stuck`** for a short second
  opinion from a stronger model.
- **Migration (bring an existing project across).** Run the library's `import-project.ps1`, then **`/migrate`**:
  audit, plan with you, create the Workbench project, distil the old agent files, gate green, publish, parity check.
  **`recovery-audit`** is its read-only first look, and works on any inherited repo.
- **Design (how should it look).** **`design-explore`** produces two or three directions with free tools (Google
  Stitch, Penpot, Excalidraw), you pick one, and it records the values in `design/tokens.css` and `DESIGN.md`. Code
  variations of a screen go through **`/prototype`** (UI branch). **`design-review`** scores the built result from real
  screenshots, two rounds at most.
- **New project.** **`/new-project`** scaffolds from the Workbench template; **`/setup-workbench`** configures an
  existing repo (issue tracker, labels, domain docs, missing Workbench pieces).
- **Following upstream.** **`/upstream-sync`** ports new upstream changes through the rename map as a PR you review.

## On-ramps

- **Bugs and requests piling up** → **`/triage`** moves issues you didn't create through triage roles and produces
  `ready-for-agent` issues. Don't triage issues `/slice` produced; they are ready by construction.
- **Something's broken** → **`/debug`** for the hard ones. It refuses to theorise until it has a **tight feedback
  loop** (one command that goes red on *this* bug), then fixes with a regression test. Afterwards, `/retro` in the same
  session; if there's no good seam to lock the bug down, that's a job for `/architecture-survey`.
- **A huge, foggy effort** → **`/wayfind`** charts a shared map of **decision tickets** and resolves them one at a time,
  producing decisions, not deliverables. When the map clears, merge onto the main flow at `/spec`.

## Codebase health

- **`/architecture-survey`** surfaces **deepening opportunities** whenever you have a spare moment; picking one
  generates an idea for `/shape`. **`/module-design`** (below) is the bench you design the chosen one on.

## Vocabulary underneath

- **`/domain-language`**: sharpen the project's domain words, resolve overloaded terms, record hard-to-reverse
  decisions as ADRs. `/shape` drives it.
- **`/module-design`**: the deep-module vocabulary (module, interface, depth, seam, adapter, leverage, locality).
  `/tdd` and `/architecture-survey` both speak it.

## Phase boundaries

At the boundary between two phases you have five options: **Continue**, **`/clear`**, **`/handoff`** (only for a new
harness, a new directory, a colleague, or forking a side task), **Subagent**, or **`/compact`** (the default, at the
bottom of the tree). Read [PHASE-BOUNDARIES.md](PHASE-BOUNDARIES.md) for the ordered questions. Switching harness is
exactly the case `/handoff` exists for, though in the loop the issue and PR already carry everything.

## Standalone

- **`/grill`**: the same interview as `/shape` but stateless; for plans, designs or writing with no repo under them.
- **`/interview`**: the interview primitive itself (rounds, the frontier, facts are the agent's job, decisions yours).
  `/grill`, `/shape`, `/triage`, `/wayfind` and `/architecture-survey` run it.
- **`/prototype`**: throwaway code that answers one design question (logic or UI), kept on a `prototype/<name>` branch
  as a primary source.
- **`/research`**: a background agent reads primary sources and leaves a cited Markdown file; take it into `/shape`.
- **`/questionnaire`**: when the blocker is in someone else's head, write them a questionnaire.
- **`/wizard`**: an interactive script for steps only a human can take (credentials, dashboards, cutovers).
- **`/wait-what`**: the message didn't land; get it re-pitched in plain English.
- **`/teach`**: learn a concept over several sessions in a stateful directory.
- **`/writing-for-agents`**: the reference for writing documents agents read (skills, AGENTS.md, pointed-at docs).

## Precondition

**`/setup-workbench`** once per repo before the first engineering flow (issue tracker, labels, domain docs). On a
Workbench machine, new projects created with `/new-project` already have it.
