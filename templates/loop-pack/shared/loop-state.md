# Loop State

## Current Goal

Run one bounded agent loop at a time with visible state, scoped permissions,
review, proof, and a recorded next action.

## Boundaries

- Write scope: this repository
- Network writes: none unless the active task names the service and reason
- Destructive actions: human approval required
- Private data rules: keep secrets, tokens, and private user data out of state

## Queue

| Status | Task | Proof Command | Notes |
| --- | --- | --- | --- |
| ready | Validate the loop scaffold | `loop-anything check` | First confidence check after install |

## Active Task

- Task: none selected
- Reason: triage has not run yet
- Expected files or services: none
- Proof command: none
- Stop condition: select one bounded task before editing

## Proof History

| Date | Command | Result | Notes |
| --- | --- | --- | --- |
| 2026-06-11 | `loop-anything check` | pending | Initial scaffold check |

## Decisions

- Use this file as the shared state board for every loop run.
- Record failed proof commands as well as successful ones.
- Keep agent-specific instructions in skill files, not in this state board.

## Next Action

Run loop triage and select the first bounded task.
