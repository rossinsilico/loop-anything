# Loop State

## Current Goal

Use Loop Anything to improve Loop Anything: keep the package owner-neutral,
make orchestration easier and more powerful, and verify every publish step with
the package's own loop checks.

## Boundaries

- Write scope: this repository
- Network writes: none unless the active task names the service and reason
- Destructive actions: human approval required
- Private data rules: keep secrets, tokens, and private user data out of state

## Queue

| Status | Task | Proof Command | Notes |
| --- | --- | --- | --- |
| proof green | Improve package orchestration and owner-neutral install docs | `npm test && sh scripts/validate.sh && node bin/loop-anything.js check --agent both` | Ready to commit and push |

## Active Task

- Task: Improve package orchestration and owner-neutral install docs
- Reason: the first public release worked, but install docs were tied to a GitHub owner and the orchestration layer needed a stronger prompt handoff
- Expected files or services: package source, docs, generated self-loop files, GitHub repository
- Proof command: `npm test && sh scripts/validate.sh && node bin/loop-anything.js check --agent both`
- Stop condition: stop if tests fail, validation fails, GitHub push fails, or a registry publish is required without authentication

## Proof History

| Date | Command | Result | Notes |
| --- | --- | --- | --- |
| 2026-06-11 | `npm test` | pass | 13 tests passed |
| 2026-06-11 | `sh scripts/validate.sh` | pass | Temp install/check, prompt smoke, and `npm pack --dry-run` passed |
| 2026-06-11 | `node bin/loop-anything.js check --agent both` | pass | Self-installed repo scaffold passed |

## Decisions

- Use this file as the shared state board for every loop run.
- Record failed proof commands as well as successful ones.
- Keep agent-specific instructions in skill files, not in this state board.
- Keep public install docs owner-neutral.
- Keep the npm package payload lean while allowing the GitHub repo to dogfood its own loop files.

## Next Action

Commit the second release, push to GitHub, then verify the public repository state.
