# Engineering

Daily code work: the main flow, its on-ramps, and the disciplines underneath.

## User-invoked

Reachable only when you type them (Claude Code: `disable-model-invocation: true`; Codex: `policy.allow_implicit_invocation: false` in `agents/openai.yaml`).

- **[ask-workbench](./ask-workbench/SKILL.md)**: Ask which skill or flow fits your situation. A router over the skills in this repo and the Workbench flows.
- **[shape](./shape/SKILL.md)**: Interview that also builds your project's domain model, sharpening terminology and updating `GLOSSARY.md` and ADRs inline.
- **[spec](./spec/SKILL.md)**: Turn the current conversation into a spec issue (`type:spec`, with acceptance criteria and non-goals) on the issue tracker.
- **[slice](./slice/SKILL.md)**: Break a plan, spec, or conversation into tracer-bullet issues, each declaring its blocking edges, labelled `ready-for-agent`.
- **[build-graph](./build-graph/SKILL.md)**: Implement a whole spec on one integration branch, running implementer subagents across the ready frontier, then closing out with `review`.
- **[triage](./triage/SKILL.md)**: Move issues through a state machine of triage roles.
- **[wayfind](./wayfind/SKILL.md)**: Plan a huge chunk of work (more than one agent session can hold) as a shared map of decision tickets, resolved one at a time until the way is clear.
- **[architecture-survey](./architecture-survey/SKILL.md)**: Scan a codebase for deepening opportunities, present them as a visual HTML report, then interview through whichever one you pick.
- **[setup-workbench](./setup-workbench/SKILL.md)**: Configure a repo for these skills (issue tracker, labels, domain docs, missing Workbench pieces). Run once per repo.
- **[retro](./retro/SKILL.md)**: Suggest improvements to the coding agent's environment after a session (or weekly across loop repos), most severe first.

## Model-invoked

Model- or user-reachable (rich trigger phrasing so the model can reach for them).

- **[build](./build/SKILL.md)**: Implement one issue, slice or small spec exactly to its acceptance criteria, test-first at agreed seams, proven by the project gate; also the loop's builder.
- **[review](./review/SKILL.md)**: Two-axis review of a diff (Standards and Spec) as parallel sub-agents; in the loop, the cross-vendor reviewer that writes a verdict.
- **[tdd](./tdd/SKILL.md)**: Test-driven development with a red-green-refactor loop, one vertical slice at a time.
- **[debug](./debug/SKILL.md)**: Disciplined diagnosis loop for hard bugs and performance regressions: a feedback loop that goes red on this bug, then minimise, hypothesise, instrument, fix, regression-test.
- **[prototype](./prototype/SKILL.md)**: Throwaway prototype to answer a design question: a shareable HTML file for state/logic, or several toggleable UI variations.
- **[research](./research/SKILL.md)**: Investigate a question against primary sources and leave a cited Markdown file in the repo, run as a background agent.
- **[domain-language](./domain-language/SKILL.md)**: Build and sharpen a project's domain model: challenge terms, stress-test with scenarios, update `GLOSSARY.md` and ADRs inline.
- **[module-design](./module-design/SKILL.md)**: Shared discipline and vocabulary for deep modules: small interfaces, clean seams, testable through the interface.
- **[pr](./pr/SKILL.md)**: The shape of a pull request body: the smallest visual that makes the change clear, before/after evidence, and a merge-danger call.
- **[wizard](./wizard/SKILL.md)**: Generate an interactive script that walks a human through steps only they can perform (credentials, dashboards, cutovers).
