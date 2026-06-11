---
name: loop-record
description: Update durable loop state after a loop iteration with completed work, proof history, decisions, blockers, and next action.
---

# Loop Record

Use this skill at the end of a loop iteration.

## Inputs

- Active task
- Diff summary
- Review result
- Proof command and output
- Any new decisions or blockers

## Process

1. Update `Proof History` in `loop-state.md`.
2. Clear or update `Active Task`.
3. Move completed queue items to a finished state.
4. Add durable decisions to `loop-decisions.md`.
5. Write exactly one `Next Action`.
6. Stop if the next action requires human input.

## Output

The loop can stop only after state names:

- what changed
- what proved it
- what risk remains
- what happens next
