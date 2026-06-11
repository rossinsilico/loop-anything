---
name: loop-review
description: Review a loop iteration as an independent checker before proof, commit, push, merge, deploy, or completion claims.
---

# Loop Review

Use this skill after the maker role changes files and before the loop claims
completion.

## Inputs

- `loop-state.md`
- `loop-contract.md`
- Git diff or changed file list
- Commands already run
- Proof command selected during triage

## Review Checklist

Report findings first, ordered by severity:

- scope drift beyond the active task
- missing or weak proof command
- unrecorded state changes
- credentials, tokens, private data, or secret-looking values
- destructive behavior without explicit approval
- claims that are not backed by command output

## Output

Write:

- blocking findings
- non-blocking findings
- residual risk
- whether the loop may proceed to proof

If there is any blocking finding, stop the loop before proof.
