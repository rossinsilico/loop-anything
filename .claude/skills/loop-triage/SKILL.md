---
name: loop-triage
description: Select one bounded task for an agent loop from visible state, real repo evidence, permission boundaries, and a named proof command.
---

# Loop Triage

Use this skill at the start of a loop iteration.

## Inputs

- `loop-state.md`
- `loop-contract.md`
- Current repository state
- Any explicit human instruction for this run

## Process

1. Read `loop-state.md` and `loop-contract.md`.
2. Inspect the real target named by the state board.
3. Identify candidate tasks that fit inside one loop iteration.
4. Select exactly one task.
5. Name the proof command before implementation starts.
6. Stop if the task needs destructive action, hidden credentials, or a broader
   permission boundary than the state board allows.

## Output

Write or update the `Active Task` section in `loop-state.md` with:

- task
- reason
- expected files or services
- proof command
- stop condition

Do not implement until the active task and proof command are clear.
