---
name: loop-prove
description: Run and record the proof command for a loop iteration before completion, publish, merge, deploy, or handoff.
---

# Loop Prove

Use this skill before any completion claim or publish action.

## Process

1. Read the active task in `loop-state.md`.
2. Identify the proof command recorded during triage.
3. Run the full command from the correct working directory.
4. Read the exit code and output.
5. Record the command, result, and residual risk in `loop-state.md`.

## Rules

- Do not replace the proof command with an easier command after implementation.
- Do not claim success when the proof command fails.
- Record failed proof runs because they are useful state.
- If proof requires network or hosted service writes, confirm the state board
  allows that service.

## Output

Write:

- command
- exit code
- relevant output
- result
- residual risk
