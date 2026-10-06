# The canonical install block

One install story, one wording. `README.md`, `.changeset/*` and the docs must say **this** and nothing else.
Change it here first, then propagate.

## Workbench machines: the link script (the main route)

On a Windows profile set up with the Workbench, the agent library's `install.ps1` clones this repo to
`<WORKBENCH_ROOT>\_skills` and links every promoted skill into all four harnesses:

<canonical-block name="workbench">

```powershell
git clone https://github.com/frogagidev/frogagiskills "$env:WORKBENCH_ROOT\_skills"
pwsh "$env:WORKBENCH_ROOT\_skills\scripts\link-skills.ps1"
```

Each skill becomes a directory junction in `~/.claude/skills`, `~/.agents/skills` and `~/.gemini/antigravity/skills`;
the script prints the Hermes `skills.external_dirs` entries to paste. A `git pull` updates every harness at once.

</canonical-block>

## Claude Code only: the plugin

<canonical-block name="claude-code">

```
/plugin marketplace add frogagidev/frogagiskills
/plugin install workbench-skills@workbench
```

</canonical-block>

## Other machines and agents: skills.sh

<canonical-block name="skills-sh-whole-set">

```bash
npx skills@latest add frogagidev/frogagiskills
```

Pick the skills you want and which agents to install them on. Make sure `setup-workbench` is one of them.

</canonical-block>

<canonical-block name="skills-sh-one-skill">

```bash
npx skills@latest add frogagidev/frogagiskills --skill=<name>
```

</canonical-block>

## The routes are exclusive

Pick one route per machine. Linking and the plugin (or skills.sh) together leave every skill installed twice.
