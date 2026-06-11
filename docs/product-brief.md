# Loop Anything Product Brief

## Working Thesis

There is plenty of talk about agent loops. There is not yet a small, obvious
GitHub repo that lets a developer create one in their own project in under a
minute.

`loop-anything` should be that repo.

## One-Liner

`loop-anything` makes agent loop orchestration easier and more powerful by
installing a shared loop contract for Codex and Claude: stage skills, shared
state, reviewer prompts, and proof gates inside any repo.

## GitHub Headline

```text
npx github:rossinsilico/loop-anything init

Turn any repo into a bounded agent loop: state, skills, review, proof.
```

## Why This Can Travel

The current agent conversation is moving from single prompts to repeatable
workflows. Developers understand the pain immediately: every session starts by
re-explaining context, rules, review expectations, and proof commands.

The viral wedge is not "agent loops are important." The wedge is:

> Here is the command that installs a shared loop contract for Codex and Claude.

## Product Shape

Ship a dependency-light JavaScript CLI package with Markdown templates.

```bash
npx github:rossinsilico/loop-anything init
npx github:rossinsilico/loop-anything init --agent codex
npx github:rossinsilico/loop-anything init --agent claude
npx github:rossinsilico/loop-anything init --agent both
npx github:rossinsilico/loop-anything check
```

Default behavior:

- detect whether the current directory is a git repo
- skip existing files unless `--force` is set
- create agent-specific skill folders
- create shared loop state
- create a reviewer prompt for Claude
- create a proof-first stage contract
- print the next check command

The CLI implements the Agent Loop Skill Pack Standard in
`docs/agent-loop-skill-pack-standard.md`. The public hook is not a new agent
runtime. It is a mutual scaffold standard that installs into the normal Codex
and Claude project locations.

The differentiator is the orchestration model in `docs/orchestration-model.md`:
each loop moves through named stages, records state, separates maker and
reviewer roles, and stops at explicit gates.

## Value Proposition

Easier:

- one command to install the loop shape
- no daemon, account, scheduler, or secret store
- native Codex and Claude project folders
- one shared state board

More powerful:

- stage-by-stage loop control
- maker/reviewer separation
- proof gates before completion claims
- durable decisions and next actions
- validation before trust

## Generated Repo Shape

Source pack:

```text
loop-pack/
  manifest.json
  shared/
    loop-state.md
    loop-decisions.md
    loop-contract.md
    loop-runs/.gitkeep
  skills/
    loop-triage/SKILL.md
    loop-review/SKILL.md
    loop-prove/SKILL.md
    loop-record/SKILL.md
  reviewers/
    loop-reviewer.md
```

For Codex:

```text
.agents/
  skills/
    loop-triage/SKILL.md
    loop-review/SKILL.md
    loop-prove/SKILL.md
    loop-record/SKILL.md
loop-state.md
loop-decisions.md
loop-contract.md
loop-runs/
```

For Claude:

```text
.claude/
  skills/
    loop-triage/SKILL.md
    loop-review/SKILL.md
    loop-prove/SKILL.md
    loop-record/SKILL.md
  agents/
    loop-reviewer.md
loop-state.md
loop-decisions.md
loop-contract.md
loop-runs/
```

## Core Abstractions

### Loop Contract

The loop contract is the stage model:

```text
observe -> triage -> plan -> act -> review -> prove -> record -> stop
```

It defines what each stage reads, what it writes, and when the loop must stop.

### State Board

The single visible source of truth. It holds the goal, boundaries, task queue,
active task, proof history, and next action.

### Stage Skills

Stage skills govern one part of the loop. The v0 package ships `loop-triage`,
`loop-review`, `loop-prove`, and `loop-record`.

### Reviewer Prompt

Runs as a fresh checker. It reviews the diff, state board, proof output,
permission boundaries, and secret exposure risk.

### Check Command

`loop-anything check` validates the scaffold:

- required files exist
- skill frontmatter is present
- state board has a current goal and next action
- the loop contract includes the stage order
- no marker text remains
- no obvious secret-looking values are present

## MVP File Tree

```text
package.json
README.md
LICENSE
bin/
  loop-anything.js
src/
  cli.js
  detect.js
  render.js
  check.js
templates/
  loop-pack/
    manifest.json
    shared/loop-state.md
    shared/loop-decisions.md
    shared/loop-contract.md
    skills/loop-triage/SKILL.md
    skills/loop-review/SKILL.md
    skills/loop-prove/SKILL.md
    skills/loop-record/SKILL.md
    reviewers/loop-reviewer.md
docs/
  agent-loop-skill-pack-standard.md
  orchestration-model.md
  product-brief.md
```

## CLI Behavior

### `init`

Inputs:

- `--agent codex|claude|both`, default `both`
- `--dir <path>`, default current directory
- `--state-dir <path>`, default target root
- `--force`, overwrite generated files
- `--backup`, create `.bak` files when overwriting
- `--dry-run`, print planned writes

Output:

- files written
- skipped files
- backup files
- next command

### `check`

Inputs:

- optional `--agent codex|claude|both`
- optional `--dir <path>`
- optional `--state-dir <path>`

Output:

- pass/fail checklist
- file paths with exact failures
- non-zero exit when required files or proof fields are missing

## Non-Goals

- No background daemon.
- No hosted service.
- No secret storage.
- No MCP server in v0.
- No npm publication in the initial GitHub release.
- No pretending Codex and Claude have identical config surfaces.
- No internal permission or sleep-run notes in the public repo.

## First Release Definition

Publish `rossinsilico/loop-anything` when:

1. `node bin/loop-anything.js init --dry-run` works.
2. `node bin/loop-anything.js init --agent both --dir /tmp/loop-anything-test`
   writes the expected files.
3. `node bin/loop-anything.js check --dir /tmp/loop-anything-test` exits 0.
4. Generated files include the loop contract and four stage skills:
   `loop-triage`, `loop-review`, `loop-prove`, and `loop-record`.
5. `npm test`, `sh scripts/validate.sh`, and `npm pack --dry-run` pass.
6. README shows the two-command path.
7. No generated file contains credentials, private data, or marker text.
