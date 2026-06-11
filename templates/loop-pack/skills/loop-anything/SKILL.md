---
name: loop-anything
description: Front-door skill for Loop Anything. Use when the operator invokes dog-food, create, run, prompt, or asks to turn a spec, plan, orchestration pattern, repo surface, branch, or issue into a bounded visible loop.
---

# Loop Anything

Use this as the branded entrypoint for the loop pack.

## Command Shape

Supported invocations:

- `$loop-anything dog-food <object> --turn single|multi|infinite`
- `$loop-anything create <object> --from <path> --turn single|multi|infinite`
- `$loop-anything run <object> --turn single|multi|infinite`
- `$loop-anything prompt --stage triage|review|prove|record|resume`

Claude can use the same command text with `/loop-anything`.

## Routing

- `dog-food` or `run`: follow `loop-dog-food`.
- `create`: create or update visible loop state from the named source, then
  follow `loop-dog-food`.
- `prompt`: print or use the matching stage prompt from `loop-prompts.md`.
- Unknown method: treat the remaining text as the work object and dogfood it.

## Rules

1. Read `loop-state.md`, `loop-contract.md`, `loop-decisions.md`, and
   `loop-prompts.md`.
2. Treat the named object as the current goal surface.
3. Keep state visible and permission boundaries explicit.
4. Name the proof command before implementation starts.
5. Stop on missing proof, failed proof, destructive action, hidden credentials,
   or expanded permissions.
6. Record the result before ending the turn.
