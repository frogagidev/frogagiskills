# Workbench Skills

Agent skills for real engineering across four equal harnesses: **Claude Code, Codex, Hermes and Antigravity**.
Small, composable skills for the whole path from idea to merged change, plus the Workbench flows that run it
unattended: a cross-vendor build/review loop, migration of existing projects, and a code-first design flow.

This repo started as a fork of [mattpocock/skills](https://github.com/mattpocock/skills) (MIT), whose grilling,
spec/ticket, TDD, review and domain-modelling skills form its core. The skills are renamed to the Workbench's
workflow vocabulary, overlapping skills are merged, and upstream improvements keep flowing in through
[`upstream-map.json`](./upstream-map.json) and the [`upstream-sync`](./skills/workbench/upstream-sync/SKILL.md) skill.

## Install

On a Workbench machine (the main route): the agent library's `install.ps1` does this for you.

```powershell
git clone https://github.com/frogagidev/frogagiskills "$env:WORKBENCH_ROOT\_skills"
pwsh "$env:WORKBENCH_ROOT\_skills\scripts\link-skills.ps1"
```

Each skill becomes a directory junction in `~/.claude/skills`, `~/.agents/skills` and `~/.gemini/antigravity/skills`;
the script prints the Hermes `skills.external_dirs` entries to paste. A `git pull` updates every harness at once.

Elsewhere: `/plugin marketplace add frogagidev/frogagiskills` then `/plugin install workbench-skills@workbench`
(Claude Code), or `npx skills@latest add frogagidev/frogagiskills` (any agent). Pick one route per machine. Then run
`/setup-workbench` once per repo.

## The flows

`/ask-workbench` is the router; it knows every skill below and how they connect.

| You have | Start with | Then |
|---|---|---|
| An idea to build | `/shape` | `/spec` → `/slice` → `build` (per issue), `/build-graph` (whole spec), or the loop |
| Issues labelled `ready-for-agent` | the Workbench loop | builder in any harness, `review` by a different vendor, you merge |
| A hard bug | `debug` | `/retro` afterwards |
| Incoming issues you didn't write | `/triage` | `build` |
| A huge, foggy effort | `/wayfind` | `/spec` once the map clears |
| An existing project to bring across | `import-project.ps1`, then `/migrate` | the main flow |
| "How should this look?" | `design-explore` | `prototype` (UI), `design-review` |
| A new project | `/new-project` | `/shape` |

## Reference

Skills split on one axis: who can invoke them. **User-invoked** skills run only when you type them; their job is to
orchestrate. **Model-invoked** skills can be typed or reached for by the agent when the task fits; they hold the
reusable discipline. A user-invoked skill may call model-invoked skills, never another user-invoked one.

### Engineering

Daily code work: the main flow, its on-ramps, and the disciplines underneath.

**User-invoked**

- **[ask-workbench](./skills/engineering/ask-workbench/SKILL.md)**: Ask which skill or flow fits your situation. A router over the skills in this repo and the Workbench flows.
- **[shape](./skills/engineering/shape/SKILL.md)**: Interview that also builds your project's domain model, sharpening terminology and updating `GLOSSARY.md` and ADRs inline.
- **[spec](./skills/engineering/spec/SKILL.md)**: Turn the current conversation into a spec issue (`type:spec`, with acceptance criteria and non-goals) on the issue tracker.
- **[slice](./skills/engineering/slice/SKILL.md)**: Break a plan, spec, or conversation into tracer-bullet issues, each declaring its blocking edges, labelled `ready-for-agent`.
- **[build-graph](./skills/engineering/build-graph/SKILL.md)**: Implement a whole spec on one integration branch, running implementer subagents across the ready frontier, then closing out with `review`.
- **[triage](./skills/engineering/triage/SKILL.md)**: Move issues through a state machine of triage roles.
- **[wayfind](./skills/engineering/wayfind/SKILL.md)**: Plan a huge chunk of work (more than one agent session can hold) as a shared map of decision tickets, resolved one at a time until the way is clear.
- **[architecture-survey](./skills/engineering/architecture-survey/SKILL.md)**: Scan a codebase for deepening opportunities, present them as a visual HTML report, then interview through whichever one you pick.
- **[setup-workbench](./skills/engineering/setup-workbench/SKILL.md)**: Configure a repo for these skills (issue tracker, labels, domain docs, missing Workbench pieces). Run once per repo.
- **[retro](./skills/engineering/retro/SKILL.md)**: Suggest improvements to the coding agent's environment after a session (or weekly across loop repos), most severe first.

**Model-invoked**

- **[build](./skills/engineering/build/SKILL.md)**: Implement one issue, slice or small spec exactly to its acceptance criteria, test-first at agreed seams, proven by the project gate; also the loop's builder.
- **[review](./skills/engineering/review/SKILL.md)**: Two-axis review of a diff (Standards and Spec) as parallel sub-agents; in the loop, the cross-vendor reviewer that writes a verdict.
- **[tdd](./skills/engineering/tdd/SKILL.md)**: Test-driven development with a red-green-refactor loop, one vertical slice at a time.
- **[debug](./skills/engineering/debug/SKILL.md)**: Disciplined diagnosis loop for hard bugs and performance regressions: a feedback loop that goes red on this bug, then minimise, hypothesise, instrument, fix, regression-test.
- **[prototype](./skills/engineering/prototype/SKILL.md)**: Throwaway prototype to answer a design question: a shareable HTML file for state/logic, or several toggleable UI variations.
- **[research](./skills/engineering/research/SKILL.md)**: Investigate a question against primary sources and leave a cited Markdown file in the repo, run as a background agent.
- **[domain-language](./skills/engineering/domain-language/SKILL.md)**: Build and sharpen a project's domain model: challenge terms, stress-test with scenarios, update `GLOSSARY.md` and ADRs inline.
- **[module-design](./skills/engineering/module-design/SKILL.md)**: Shared discipline and vocabulary for deep modules: small interfaces, clean seams, testable through the interface.
- **[pr](./skills/engineering/pr/SKILL.md)**: The shape of a pull request body: the smallest visual that makes the change clear, before/after evidence, and a merge-danger call.
- **[wizard](./skills/engineering/wizard/SKILL.md)**: Generate an interactive script that walks a human through steps only they can perform (credentials, dashboards, cutovers).

### Productivity

General workflow tools, not code-specific.

**User-invoked**

- **[grill](./skills/productivity/grill/SKILL.md)**: Get relentlessly interviewed about a plan or design until every branch of the design tree is resolved.
- **[handoff](./skills/productivity/handoff/SKILL.md)**: Compact the current conversation into a handoff document so another agent can continue the work.
- **[teach](./skills/productivity/teach/SKILL.md)**: Teach the user a new skill or concept over multiple sessions, using the current directory as a stateful teaching workspace.
- **[questionnaire](./skills/productivity/questionnaire/SKILL.md)**: Turn a decision you can't answer alone into a Markdown questionnaire for the one person who can (filled in async, or together over a meeting).
- **[wait-what](./skills/productivity/wait-what/SKILL.md)**: Fire this the moment a message doesn't land. The agent re-pitches it with the context you're missing, in plain English, using your `GLOSSARY.md` vocabulary.

**Model-invoked**

- **[interview](./skills/productivity/interview/SKILL.md)**: Interview the user relentlessly about a plan, decision, or idea until every branch of the design tree is resolved.
- **[writing-for-agents](./skills/productivity/writing-for-agents/SKILL.md)**: Writing documents for agents: skills, AGENTS.md/CLAUDE.md, and any doc an agent reaches by a pointer.

### Workbench

Skills that tie the set into the Workbench: the loop, migration, design and project setup. They read wiring from the
agent library through `$env:WORKBENCH_HOME` and `$env:WORKBENCH_ROOT`.

**User-invoked**

- **[new-project](./skills/workbench/new-project/SKILL.md)**: Scaffold a new project from the Workbench template, with a private GitHub repo, labels and generated harness adapters.
- **[migrate](./skills/workbench/migrate/SKILL.md)**: Bring an existing project into the Workbench from its intake snapshot: audit, plan, create, distil, gate, publish, parity check.
- **[upstream-sync](./skills/workbench/upstream-sync/SKILL.md)**: Port new upstream changes through the rename map, as a reviewed pull request.

**Model-invoked**

- **[stuck](./skills/workbench/stuck/SKILL.md)**: Get a short second opinion from a stronger clean-context advisor when the same failure repeats.
- **[recovery-audit](./skills/workbench/recovery-audit/SKILL.md)**: Read-only assessment of an inherited, broken or unfamiliar repository before any change.
- **[design-explore](./skills/workbench/design-explore/SKILL.md)**: Two or three visual directions with free tools (Stitch, Penpot, Excalidraw), your pick, then tokens and `DESIGN.md`.
- **[design-review](./skills/workbench/design-review/SKILL.md)**: Score a UI change from real screenshots against `DESIGN.md` and the craft rules, two rounds at most.

## Contributing

Rules for agents and humans editing this repo are in [AGENTS.md](./AGENTS.md). Run `npm run check` before committing.
Decisions are recorded in [.agents/adr/](./.agents/adr/).

## Licence

MIT. Original work copyright Matt Pocock; Workbench modifications copyright Jayden Ramat. See [LICENSE](./LICENSE).
