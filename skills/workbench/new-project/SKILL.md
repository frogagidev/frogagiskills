---
name: new-project
description: Scaffold a new project from the Workbench template, with a private GitHub repo, labels and generated harness adapters.
disable-model-invocation: true
---

# new-project

## Steps
1. Ask (one batch): project name (kebab-case), one-line purpose, UI yes/no, stack (e.g. Next.js + pnpm, Python + uv, Node script), and whether it will deploy (Vercel / Cloudflare / none).
2. Run `pwsh $env:WORKBENCH_HOME\scripts\new-project.ps1 -Name <name> [-Ui]` (this profile: `C:\MyProjects_Harness\Projects\_agent-library`). It copies `templates/project`, fills placeholders, runs `sync.mjs`, `git init`, creates the **private** GitHub repo, pushes labels, protects `main` and trusts the repo in Hermes.
3. Fill `AGENTS.md` (commands, structure, rules) and `docs/SPEC.md` with the user. For UI, fill `DESIGN.md` and `design/tokens.css` (or call the Skill tool with `design-explore` to choose a direction).
4. Make `scripts/verify.ps1` real for the chosen stack (lint, typecheck, tests, build) and get it green on the empty project.
5. Add the project to `$env:WORKBENCH_HOME\loop\repos.json` with `"enabled": false` (switch it on after 3–5 good manual runs).
6. First commit + push. Then suggest `/spec` for the first feature.

## Success
Repo exists on GitHub (private), CI runs `verify`, `node scripts/sync.mjs --check` passes, labels present.
