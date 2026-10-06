## What it does

`new-project` starts a project the Workbench way in one step: the project template copied into your root, the harness adapters generated, a private GitHub repo with the loop labels, branch protection where your plan allows it, and Hermes trusting the repo's skills. It then fills `AGENTS.md`, `docs/SPEC.md` and, for UI projects, `DESIGN.md` with you, and makes the gate real for your stack.

## When to reach for it

You invoke this by typing `/new-project`, and the agent won't reach for it on its own.

| Situation | Use |
|---|---|
| A brand-new project | `new-project` |
| An existing repo that should work with these skills | [setup-workbench](../engineering/setup-workbench.md) |
| An existing project to bring across | [migrate](./migrate.md) |

## Prerequisites

A Workbench machine: `$env:WORKBENCH_HOME` set by the agent library's installer, `gh` logged in, and Node for the adapter generator.

## It's working if

- The new repo's CI runs the gate on its first push and passes.
- Any harness opened in the folder knows the project's commands without being told.

## Where it fits

A run-once setup, followed by [shape](../engineering/shape.md) for the first feature. For the map of all skills, see [ask-workbench](../engineering/ask-workbench.md).
