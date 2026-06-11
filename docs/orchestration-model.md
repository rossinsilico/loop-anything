# Loop Orchestration Model

## Thesis

Folders make a loop installable. Orchestration makes a loop useful.

`loop-anything` installs a lightweight-to-medium operating model for recurring
agent work: stage skills, visible state, review gates, proof gates, and stop
conditions. The goal is to make loop orchestration easier to start and more
powerful once it is running.

## The Value Add

Most agent-loop advice says:

```text
write a prompt
run it on a schedule
hope the agent remembers what matters
```

`loop-anything` says:

```text
install a loop contract
run one stage at a time
record state and proof
stop at gates
resume from the board
```

The package gives the agent a process governor, not just context.

## Easier And More Powerful

Easier:

- one command installs the working folder shape
- one state board keeps Codex and Claude aligned
- one check command catches missing pieces
- native tool folders avoid custom runtime setup

More powerful:

- stages make progress inspectable
- gates prevent silent drift
- maker and reviewer roles separate doing from checking
- proof commands turn confidence into evidence
- recorded next actions make the loop resumable

## Loop Contract

Every loop iteration follows this state machine:

```text
observe -> triage -> plan -> act -> review -> prove -> record -> stop
```

Stages are explicit. A loop cannot skip from `act` to `stop` without review,
proof, and state recording.

## Roles

### Operator

The human or scheduler that starts the loop and defines permission boundaries.

### Maker

The agent role that performs the selected task. The maker cannot declare
completion without proof.

### Reviewer

The independent checker that reviews the diff, state board, proof plan,
permission boundary, and secret exposure risk.

## Stage Skills

The first release ships six high-leverage skills:

- `loop-anything`: branded front door for dog-food, create, run, and prompt
- `loop-dog-food`: turn a work object into a bounded loop
- `loop-triage`: choose one bounded task
- `loop-review`: check state, diff, permissions, and secret risk
- `loop-prove`: run and record the proof command
- `loop-record`: update state and next action

The remaining stages live in `loop-contract.md` until users need them as
separate skills.

## Modes

### Manual

The human starts the loop and approves gates interactively.

### Scheduled

An external scheduler starts the same prompt regularly. The loop still stops at
approval gates.

### Watcher

A future mode can react to issues, CI failures, or inbox items. Watcher mode is
not part of v0 because the manual contract must be reliable first.

## Why This Is Different

Template repos give files.

Loop orchestration gives:

- named stages
- proof-first movement between stages
- shared state across agents
- explicit stop conditions
- maker and reviewer separation
- a common install target for Codex and Claude
