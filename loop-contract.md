# Loop Contract

Every loop iteration follows this stage order:

```text
observe -> triage -> plan -> act -> review -> prove -> record -> stop
```

## Dog Food

Turn a named work object into a bounded loop.

Input examples:

- spec
- plan
- orchestration pattern
- repo surface
- issue or branch

Output:

- object
- turn budget
- selected task
- proof command
- stop condition

Stop if the object is too vague to prove or the requested turn budget would
bypass review, proof, or permission gates.

## Observe

Read the state board, repository state, and any named external surface.

Output:

- current goal
- visible blockers
- changed facts since the last run

Stop if the target repo, service, or permission boundary is ambiguous.

## Triage

Choose one bounded task.

Output:

- selected task
- reason for selection
- expected files or services
- proof command
- stop condition

Stop if no task can be proven in one loop.

## Plan

Name the smallest path to completion.

Output:

- steps
- files expected to change
- verification commands

Stop if the task needs destructive action or hidden credentials.

## Act

Make the smallest useful change.

Output:

- diff
- commands run
- unresolved issues

Stop if implementation expands beyond the selected task.

## Review

Run a checker pass over state, diff, permission boundaries, and proof plan.

Output:

- findings first
- severity
- blocking or non-blocking status

Stop if there is a blocking finding.

## Prove

Run the named proof command and read the result.

Output:

- command
- exit code
- relevant output
- residual risk

Stop if proof fails.

## Record

Update durable state.

Output:

- completed work
- proof history
- decisions
- next action

Stop if the next action requires human input.
