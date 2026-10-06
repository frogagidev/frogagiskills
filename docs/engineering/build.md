## What it does

`build` builds work that has already been decided. You point it at a [ticket](https://www.aihero.dev/ai-coding-dictionary/ticket), a [spec](https://www.aihero.dev/ai-coding-dictionary/spec), or the plan you just agreed in the conversation, and it writes the code, drives [tdd](../engineering/tdd.md) at the seams, typechecks as it goes, runs [review](../engineering/review.md) at the end, and commits to the current branch.

It never reopens the plan. There is no interview, no clarifying round, no proposal of a different approach. Whatever was settled upstream is the input, and the skill's whole job is to turn that into a commit. That is what separates it from typing "build this" at a fresh [agent](https://www.aihero.dev/ai-coding-dictionary/agent), which often redesigns the work while it builds it.

## When to reach for it

You invoke this by typing `/build` yourself, and the agent won't reach for it on its own. It ships with `disable-model-invocation: true`, so no other skill can call it either. Wherever [ask-workbench](../engineering/ask-workbench.md) or [slice](../engineering/slice.md) says "then `/build` per ticket", that is an instruction to you, not something the agent will do unprompted.

Where the work currently lives decides whether this is the right skill:

| The work is… | Reach for |
| --- | --- |
| A ticket on the tracker | `/build #42`, one ticket per [session](https://www.aihero.dev/ai-coding-dictionary/session), [clearing](https://www.aihero.dev/ai-coding-dictionary/clearing) context between tickets |
| A spec, not yet split up, and the build spans sessions | [slice](../engineering/slice.md) first, then `/build` per ticket |
| A spec, and the build is small | `/build` directly against the spec |
| Only in the conversation you just had, and it's still small | `/build` right there, in the same window |
| Not written down anywhere yet | [shape](../engineering/shape.md), or [grill](../productivity/grill.md) if there's no codebase |
| One concrete behaviour you want test-first, with no spec | [tdd](../engineering/tdd.md) directly |
| Already built, and you want it checked | [review](../engineering/review.md) directly |

The same-session case is worth naming because the skill's own first line doesn't cover it. `SKILL.md` says "the spec or tickets", which pushes the [model](https://www.aihero.dev/ai-coding-dictionary/model) to look for a file that doesn't exist. If the plan lives only in the thread, say so when you invoke it.

## Prerequisites

`build` commits to the branch you are on. It does not create one, and it does not ask. Check you are on the branch you want the work on before you start.

If the tickets came from [slice](../engineering/slice.md), [setup-workbench](../engineering/setup-workbench.md) configured the tracker they live on. `review` reads the same configuration to find the originating spec at close-out.

## What one run does

A run has five steps, in order:

1. Read the ticket or spec and work out the seams.
2. Drive [tdd](../engineering/tdd.md) at the pre-agreed seams, one red-green slice at a time.
3. Typecheck often, run single test files as it goes.
4. Run the full test suite once, at the end.
5. Run [review](../engineering/review.md), then commit to the current branch.

One run covers one ticket. The tickets [slice](../engineering/slice.md) produces are tracer-bullet vertical slices sized to fit a single fresh [context window](https://www.aihero.dev/ai-coding-dictionary/context-window), so the intended rhythm is: clear context, implement one ticket, commit, clear again. Each ticket is self-contained, so you can discard the previous ticket's context.

## Pre-agreed seams

The skill's central idea is the **seam**, the public boundary you observe behaviour at without reaching inside. Tests live at seams. When the seam is agreed before any code exists, the tests last, and you can rewrite the implementation underneath without changing them.

The "pre-agreed" part matters, and it is also the skill's weakest point. Nothing inside `build` agrees the seams. `tdd` is the skill that asks, and it refuses to write a test at an unconfirmed seam. So in practice the agreement happens either upstream in the spec, or in the first exchange of the run. If it happens nowhere, the run becomes "just write the code" and nothing warns you. Naming the seams in the spec is what stops that.

## Common questions

**It finished, but my ticket is still open and the acceptance criteria are still unchecked.**

Correct, and expected. `build` has no completion step. It ends at the commit and never touches the work item. This is the same on GitHub Issues and on the local markdown tracker, so it is not a tracker integration problem. It also does not act on the findings `review` produced, and does not tick the `- [ ]` boxes on the originating issue. Close the ticket and reconcile the criteria yourself. This matters most on a dependency chain, because `slice` defines the frontier as tickets whose blockers are all closed. If nothing gets closed, nothing ever becomes visibly unblocked.

**Can I point it at all my tickets at once, or run several in parallel?**

Not with `/build`: one invocation, one ticket. For a whole spec in one run, use [build-graph](../engineering/build-graph.md), which gives each ticket on the ready frontier to a [subagent](https://www.aihero.dev/ai-coding-dictionary/subagent) in its own worktree, then merges the results onto one integration branch. Running several `/build` sessions side by side in one checkout is worse than unsupported. One field report describes a `git commit --amend` in one session landing on another session's commit, a stash vanishing from `refs/stash`, and commits landing on the wrong branch, all in a single afternoon across three issues. The sessions share one working directory, one index, and one HEAD. Users work around this with git worktrees, but `refs/stash` is shared across worktrees too, so worktrees alone do not fix the stash case.

**Can it open a pull request instead of committing?**

Not built in. It commits straight to the current branch. Several people find this too eager, because the code lands before they can verify it works. There is no configuration flag and no PR mode. People override it in the invocation ("commit to a branch and open a PR") or by editing their local copy of the skill. When the agent does write the PR, [pr](../engineering/pr.md) shapes its body.

**`review` says it cannot see my changes.**

`review` reviews `git diff <fixed-point>...HEAD`, which excludes staged and working-tree changes. `build` runs it before committing, so unless an interim commit already exists there is nothing in that diff to review. Multiple people have reported this and it is unfixed on both sides. Commit first, then review against the point you branched from.

Separately, some people do not want the review inside the run at all, because an agent reviewing the code it just wrote is biased toward its own solution. Running [review](../engineering/review.md) in a fresh session against a fixed point is a valid alternative. The same bias is why that skill runs its two axes in separate sub-agents.

**One ticket burned 150k tokens. Am I using it wrong?**

Probably not. The ticket is more likely too big. A run does codebase exploration, a red-green loop per seam, a full suite, and a review, so a non-trivial ticket exceeding 100k [tokens](https://www.aihero.dev/ai-coding-dictionary/token) is normal rather than a sign something broke. The fix is upstream. Right-size the tickets in [slice](../engineering/slice.md) so each fits one fresh window. If a single ticket keeps going over, split it rather than raising the [effort](https://www.aihero.dev/ai-coding-dictionary/effort) level.

**`/build #2` in a fresh session worked on something completely unrelated.**

The agent resolves `#2` against whatever numbered list it can see. In a fresh session that may be a todo file, a checklist, or another work list rather than the configured tracker. The agent does not stop when the match is uncertain, so the mistake is not obvious until the work has started. Pass the full reference, the issue URL or `owner/repo#2`, and ask it to confirm the title back before it begins.

## It's working if

- The session opens by reading the ticket or spec and restating what it will build, rather than asking you what to build.
- You can see an actual `/tdd` invocation in the trace, not just tests appearing in the diff.
- Typechecks and single test files run repeatedly during the run, and the full suite runs once near the end.
- The run reaches a commit on your current branch without you prompting it to carry on.
- The diff is one ticket's worth of change: a vertical slice through every layer, not several tickets swept together.

## Where it fits

`build` is the build step of the main chain:

```txt
shape → spec → slice → implement → review → retro
```

Its neighbours are [slice](../engineering/slice.md), which produces the tickets it consumes and declares the blocking edges that decide their order; [tdd](../engineering/tdd.md), which it drives internally at each seam; and [review](../engineering/review.md), which it runs before committing. It sits downstream of the planning skills and trusts them. It does not re-validate the shape of what it was handed, so a badly-structured map or a horizontally-layered ticket gets built as written.

That trust is why [wayfind](../engineering/wayfind.md) merges onto the chain at [spec](../engineering/spec.md) rather than looping its map straight into `build`. Go straight to `build` from a map only when the effort turned out small.

[ask-workbench](../engineering/ask-workbench.md) is the router over the whole set when you are not sure which flow you are in.
