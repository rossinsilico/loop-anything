---
name: loop-dog-food
description: Turn a spec, plan, orchestration pattern, or other work object into a bounded loop with visible state, a turn budget, review gates, and proof commands.
---

# Loop Dog Food

Use this skill when the operator wants the repo, spec, plan, or orchestration
pattern to improve itself through the loop.

## Inputs

- `loop-state.md`
- `loop-contract.md`
- `loop-decisions.md`
- `loop-prompts.md`
- A named work object, such as a spec, plan, branch, issue, repo area, or
  orchestration pattern
- A turn budget: `single`, `multi`, or `infinite`

## Process

1. Treat the work object as the current goal surface.
2. Zoom out enough to identify the highest-leverage next loop task.
3. Choose exactly one bounded task unless the turn budget explicitly permits
   additional iterations.
4. Name the proof command before implementation starts.
5. Keep permission boundaries visible in `loop-state.md`.
6. Stop if the loop needs destructive action, hidden credentials, broader
   permissions, or proof that cannot be run.

## Turn Budgets

- `single`: complete one bounded iteration, record it, then stop.
- `multi`: continue while proof stays green and the state board names a next
  action.
- `infinite`: continue while compute and permission boundaries allow, but never
  bypass review, proof, or stop conditions.

## Output

Update `loop-state.md` with the chosen task, proof command, stop condition, and
next action. Record durable decisions in `loop-decisions.md`.
