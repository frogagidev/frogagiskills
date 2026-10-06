## What it does

`stuck` gets you a short second opinion when a build keeps failing the same way. It writes a brief of no more than 300 words (goal, what was tried, the exact failing output, the current hypothesis, one question), sends it to a stronger model in a clean context, and applies the answer as one new hypothesis. The advisor gives judgement only and never does the work, which keeps the expensive model's share of the tokens tiny.

## When to reach for it

Type `/stuck`, or the agent reaches for it automatically when a task fits. [build](../engineering/build.md) calls it when the same failure signature appears three times, which is the main way it runs.

| Situation | Use |
|---|---|
| The same error three times, or two approaches both failed | `stuck` |
| A hard bug you haven't started on yet | [debug](../engineering/debug.md): it builds the feedback loop first |
| A genuine fifty-fifty design choice | `stuck`, with the two options in the brief |

## Advisor inversion

The usual pattern is a strong model doing the work and a cheap one checking it. Here it is inverted: the cheaper builder does the work and consults the strong model for a few hundred tokens of judgement. Three consults per issue at most; after that the builder stops and reports the issue as blocked, with the brief and the advice attached as evidence.

## It's working if

- Blocked issues arrive with a brief and the advice already attached, so you can see exactly where it went wrong.
- The same failure stops looping: each retry follows a different hypothesis.

## Where it fits

An escalation step inside [build](../engineering/build.md), in any harness and in the Workbench loop. For the map of all skills, see [ask-workbench](../engineering/ask-workbench.md).
