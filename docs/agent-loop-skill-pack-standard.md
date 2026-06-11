# Agent Loop Skill Pack Standard

Version: 0.1

## Purpose

An Agent Loop Skill Pack is a portable folder set that teaches coding agents how
to run a bounded loop inside a repository.

The pack standard exists so one source can install cleanly into both Codex and
Claude while preserving each tool's normal project layout.

## Design Goals

- Use normal project files, not a daemon.
- Keep state visible in Markdown.
- Keep skills small enough to load on demand.
- Use tool-native install paths for Codex and Claude.
- Make proof commands explicit before work starts.
- Keep destructive actions behind human approval.
- Avoid storing secrets or private data in loop state.
- Stay lightweight-to-medium: powerful enough to govern loops, small enough to
  inspect quickly.

## Pack Contents

Every pack has four layers:

```text
loop-pack/
  manifest.json
  shared/
    loop-state.md
    loop-decisions.md
    loop-contract.md
    loop-prompts.md
    loop-runs/.gitkeep
  skills/
    loop-dog-food/SKILL.md
    loop-triage/SKILL.md
    loop-review/SKILL.md
    loop-prove/SKILL.md
    loop-record/SKILL.md
  reviewers/
    loop-reviewer.md
```

### `manifest.json`

The manifest describes the pack without depending on one agent vendor.

```json
{
  "name": "loop-anything",
  "version": "0.3.0",
  "description": "Bounded agent loop scaffold with visible state, review, and proof.",
  "skills": ["loop-dog-food", "loop-triage", "loop-review", "loop-prove", "loop-record"],
  "state": ["loop-state.md", "loop-decisions.md", "loop-contract.md", "loop-prompts.md"],
  "reviewers": ["loop-reviewer"],
  "stages": ["observe", "triage", "plan", "act", "review", "prove", "record", "stop"],
  "targets": ["codex", "claude"]
}
```

### Shared State Files

Shared state files are copied to the repository root by default:

```text
loop-state.md
loop-decisions.md
loop-contract.md
loop-prompts.md
loop-runs/
```

They are intentionally agent-neutral. Codex and Claude should read the same
state board and decisions.

### Shared Skill Source

Each skill source follows the common Agent Skills shape:

```text
skills/<skill-name>/SKILL.md
```

Each `SKILL.md` must start with YAML frontmatter:

```markdown
---
name: loop-triage
description: Select one bounded task for an agent loop from visible state and real repo evidence.
---
```

Use only fields that both targets can tolerate in the shared source:

- `name`
- `description`

Target-specific fields should be added during install only when needed.

## Orchestration Contract

Every installed pack includes `loop-contract.md`, which defines the loop stage
order:

```text
observe -> triage -> plan -> act -> review -> prove -> record -> stop
```

The contract turns a folder scaffold into an orchestration system. It tells the
agent what each stage reads, what each stage writes, which proof is required,
and when the loop must stop for human input.

The v0 installer generates five skills:

- `loop-dog-food`: turn a work object into a bounded loop
- `loop-triage`: choose one bounded task
- `loop-review`: check state, diff, permissions, and secret risk
- `loop-prove`: run and record the proof command
- `loop-record`: update state and next action

It also generates `loop-prompts.md`, a human-readable prompt menu for Codex and
Claude stage handoffs. The same text is available through `loop-anything prompt`
and the object-scoped front door is available through `loop-anything dog-food`.

## Codex Install Spec

Codex project skills install under `.agents/skills`.

### Project Install

```text
.agents/
  skills/
    loop-dog-food/SKILL.md
    loop-triage/SKILL.md
    loop-review/SKILL.md
    loop-prove/SKILL.md
    loop-record/SKILL.md
loop-state.md
loop-decisions.md
loop-contract.md
loop-prompts.md
loop-runs/
```

### User Install

```text
$HOME/.agents/
  skills/
    loop-dog-food/SKILL.md
    loop-triage/SKILL.md
    loop-review/SKILL.md
    loop-prove/SKILL.md
    loop-record/SKILL.md
```

Use project install for repo-specific loops. Use user install only for general
personal workflows that should be available across repositories.

### Codex Installer Rules

`loop-anything init --agent codex` should:

1. Copy shared skills to `.agents/skills/*`.
2. Copy shared state files to the repo root unless `--state-dir` is set.
3. Preserve `name` and `description` frontmatter.
4. Avoid Codex plugin packaging in v0.
5. Print the next check command.

### Codex Check Rules

`loop-anything check --agent codex` should verify:

- `.agents/skills/loop-triage/SKILL.md` exists
- `.agents/skills/loop-dog-food/SKILL.md` exists
- `.agents/skills/loop-review/SKILL.md` exists
- `.agents/skills/loop-prove/SKILL.md` exists
- `.agents/skills/loop-record/SKILL.md` exists
- each skill has `name` and `description`
- `loop-state.md` exists
- `loop-state.md` includes `Current Goal`, `Queue`, `Proof History`, and
  `Next Action`
- `loop-contract.md` includes the stage order
- `loop-prompts.md` includes Codex and Claude dogfood and triage prompts

## Claude Install Spec

Claude project skills install under `.claude/skills`.

### Project Install

```text
.claude/
  skills/
    loop-dog-food/SKILL.md
    loop-triage/SKILL.md
    loop-review/SKILL.md
    loop-prove/SKILL.md
    loop-record/SKILL.md
  agents/
    loop-reviewer.md
loop-state.md
loop-decisions.md
loop-contract.md
loop-prompts.md
loop-runs/
```

### Personal Install

```text
$HOME/.claude/
  skills/
    loop-dog-food/SKILL.md
    loop-triage/SKILL.md
    loop-review/SKILL.md
    loop-prove/SKILL.md
    loop-record/SKILL.md
```

Use project install for repo-specific loops. Use personal install for reusable
operator habits.

### Claude Installer Rules

`loop-anything init --agent claude` should:

1. Copy shared skills to `.claude/skills/*`.
2. Copy `reviewers/loop-reviewer.md` to `.claude/agents/loop-reviewer.md`.
3. Copy shared state files to the repo root unless `--state-dir` is set.
4. Preserve `description` frontmatter and include `name` for cross-tool
   clarity.
5. Print the next check command.

### Claude Check Rules

`loop-anything check --agent claude` should verify:

- `.claude/skills/loop-triage/SKILL.md` exists
- `.claude/skills/loop-dog-food/SKILL.md` exists
- `.claude/skills/loop-review/SKILL.md` exists
- `.claude/skills/loop-prove/SKILL.md` exists
- `.claude/skills/loop-record/SKILL.md` exists
- `.claude/agents/loop-reviewer.md` exists
- each skill has YAML frontmatter and a `description`
- `loop-state.md` exists
- `loop-state.md` includes `Current Goal`, `Queue`, `Proof History`, and
  `Next Action`
- `loop-contract.md` includes the stage order
- `loop-prompts.md` includes Codex and Claude dogfood and triage prompts

## Both-Target Install Spec

`loop-anything init --agent both` installs both target layouts and one shared
state set:

```text
.agents/skills/...      Codex project skills
.claude/skills/...      Claude project skills
.claude/agents/...      Claude reviewer agent
loop-state.md           shared state board
loop-decisions.md       shared decisions
loop-contract.md        shared stage contract
loop-prompts.md         shared prompt menu
loop-runs/              optional run notes
```

The two agents should not receive separate state files by default. Divergent
state is how loops lose the plot.

## Overwrite Rules

The installer must not overwrite existing files unless `--force` is set.

Default behavior:

- write missing files
- skip existing files
- list skipped files
- exit 0 if the scaffold is otherwise valid

With `--force`:

- overwrite generated files
- keep a `.bak` copy only if `--backup` is set
- never overwrite files outside the selected target paths

## Standalone Install Commands

Current source checkout:

```bash
node bin/loop-anything.js dog-food spec --turn single
node bin/loop-anything.js init --agent both
node bin/loop-anything.js check --agent both
```

After registry publication:

```bash
npx loop-anything dog-food spec --turn single
npx loop-anything init --agent both
npx loop-anything check --agent both
```

### Codex Only

```bash
node bin/loop-anything.js init --agent codex
node bin/loop-anything.js check --agent codex
```

### Claude Only

```bash
node bin/loop-anything.js init --agent claude
node bin/loop-anything.js check --agent claude
```

### Both

```bash
node bin/loop-anything.js init --agent both
node bin/loop-anything.js check --agent both
```

### Dry Run

```bash
node bin/loop-anything.js init --agent both --dry-run
```

## Compatibility Notes

- Codex requires `name` and `description` in `SKILL.md`.
- Claude recommends `description`; `name` is retained for cross-agent clarity.
- Codex repo skills belong in `.agents/skills`.
- Claude project skills belong in `.claude/skills`.
- Shared state belongs outside agent-specific folders.

## First Stable Standard

The v0 standard is stable when `loop-anything` can:

1. Scaffold Codex-only project files.
2. Scaffold Claude-only project files.
3. Scaffold both targets with one shared state board.
4. Check each scaffold without network access.
5. Refuse overwrites unless explicitly forced.
