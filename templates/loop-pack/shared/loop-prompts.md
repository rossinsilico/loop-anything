# Loop Prompts

Use these prompts to start or resume a loop after installing the pack.

## Dog Food An Object

Codex:

```text
$loop-anything.dog-food spec
Object: spec
Turn budget: single
Read loop-state.md, loop-contract.md, loop-decisions.md, and loop-prompts.md.
Choose one bounded task, name proof before acting, and record the result.
```

Claude:

```text
/loop-anything.dog-food spec
Object: spec
Turn budget: single
Read loop-state.md, loop-contract.md, loop-decisions.md, and loop-prompts.md.
Choose one bounded task, name proof before acting, and record the result.
```

## Start With Triage

Codex:

```text
$loop-triage read loop-state.md and loop-contract.md, select one bounded task,
name the proof command, and update Active Task.
```

Claude:

```text
/loop-triage read loop-state.md and loop-contract.md, select one bounded task,
name the proof command, and update Active Task.
```

## Review Before Proof

Codex:

```text
$loop-review read loop-state.md, loop-contract.md, and the current diff. Report
blocking findings before proof.
```

Claude:

```text
/loop-review read loop-state.md, loop-contract.md, and the current diff. Report
blocking findings before proof.
```

## Prove Before Completion

Codex:

```text
$loop-prove run the proof command recorded in loop-state.md, read the output,
and record the result.
```

Claude:

```text
/loop-prove run the proof command recorded in loop-state.md, read the output,
and record the result.
```

## Record Before Stopping

Codex:

```text
$loop-record update loop-state.md and loop-decisions.md with the result,
residual risk, and next action.
```

Claude:

```text
/loop-record update loop-state.md and loop-decisions.md with the result,
residual risk, and next action.
```

## Resume

```text
Read loop-state.md and loop-contract.md. If Active Task is empty, run triage.
If a task is active, continue from the recorded stage and stop at the next gate.
```
