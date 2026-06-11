# Loop Anything Product Brief

## Working Thesis

There is plenty of talk about agent loops. There is not yet a small, obvious
GitHub repo that lets a developer create one in their own project in under a
minute.

`loop-anything` should be that repo.

## One-Liner

`loop-anything` makes agent loop orchestration easier and more powerful by
turning a spec, plan, orchestration pattern, or repo surface into a bounded
dogfood loop with shared state, reviewer prompts, and proof gates.

## GitHub Headline

```text
loop-anything dog-food spec --turn single

Turn any work object into a bounded agent loop: state, review, proof, record.
```

## Why This Can Travel

The current agent conversation is moving from single prompts to repeatable
workflows. Developers understand the pain immediately: every session starts by
re-explaining context, rules, review expectations, and proof commands.

The viral wedge is not "agent loops are important." The wedge is:

> Here is the command that turns a spec, plan, or repo surface into a bounded
> dogfood loop for Codex and Claude.

## Product Shape

Ship a dependency-light JavaScript CLI package with Markdown templates.

```bash
node bin/loop-anything.js dog-food spec --turn single
node bin/loop-anything.js dog-food create plan --from docs/product-brief.md --turn multi
node bin/loop-anything.js dog-food run "orchestration pattern" --turn infinite
node bin/loop-anything.js init --agent both
node bin/loop-anything.js check
node bin/loop-anything.js prompt --agent both --stage triage
```

Default behavior:

- detect whether the current directory is a git repo
- skip existing files unless `--force` is set
- create agent-specific skill folders
- create shared loop state
- create a reviewer prompt for Claude
- create a proof-first stage contract
- print the next check command
- create visible loop state from a Markdown spec or plan
- print agent-native stage prompts on demand

The CLI implements the Agent Loop Skill Pack Standard in
`docs/agent-loop-skill-pack-standard.md`. The public hook is not a new agent
runtime. It is a mutual scaffold standard that installs into the normal Codex
and Claude project locations.

The differentiator is the orchestration model in `docs/orchestration-model.md`:
each loop moves through named stages, records state, separates maker and
reviewer roles, and stops at explicit gates.

Brand thesis: dog food is all that matters. The package has to run its own loop
cleanly before asking another repo to trust it.

## Value Proposition

Easier:

- one command to dogfood a spec, plan, pattern, or repo surface
- no daemon, account, scheduler, or secret store
- native Codex and Claude project folders
- one shared state board

More powerful:

- stage-by-stage loop control
- single, multi, and infinite turn budgets with hard stop conditions
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

For Codex:

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

For Claude:

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

Stage skills govern one part of the loop. The package ships `loop-dog-food`,
`loop-triage`, `loop-review`, `loop-prove`, and `loop-record`.

### Dog Food Command

`loop-anything dog-food` is the front door.

- `dog-food spec --turn single` prints an agent-native handoff for one bounded
  loop.
- `dog-food create plan --from plan.md --turn multi` creates visible loop state
  from a Markdown plan.
- `dog-food run "orchestration pattern" --turn infinite` emits a guarded run
  prompt that continues only while permission, review, and proof gates hold.

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

### Prompt Command

`loop-anything prompt` prints stage-specific handoff prompts for Codex and
Claude. It makes the package useful even before a scheduled automation exists:
operators can copy the next-stage prompt directly from the CLI or from
`loop-prompts.md`.

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
  dogfood.js
  render.js
  check.js
  prompts.js
templates/
  loop-pack/
    manifest.json
    shared/loop-state.md
    shared/loop-decisions.md
    shared/loop-contract.md
    shared/loop-prompts.md
    skills/loop-dog-food/SKILL.md
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

### `dog-food`

Inputs:

- method: `prompt`, `create`, or `run`; default `prompt`
- object words, default `current repo`
- `--from <path>` for Markdown source when using `create`
- `--turn single|multi|infinite`, default `single`
- `--agent codex|claude|both`, default `both`

Output:

- prompt/run methods print Codex and/or Claude handoff text
- create method writes `loop-state.md` from the supplied work object

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

### `prompt`

Inputs:

- `--agent codex|claude|both`, default `both`
- `--stage triage|review|prove|record|resume`, default `triage`

Output:

- stage-specific Codex and/or Claude prompt text

## Non-Goals

- No background daemon.
- No hosted service.
- No secret storage.
- No MCP server in v0.
- No registry-specific install claims unless the package has been published
  there.
- No pretending Codex and Claude have identical config surfaces.
- No internal permission or sleep-run notes in the public repo.

## First Release Definition

Release `loop-anything` when:

1. `node bin/loop-anything.js init --dry-run` works.
2. `node bin/loop-anything.js init --agent both --dir /tmp/loop-anything-test`
   writes the expected files.
3. `node bin/loop-anything.js check --dir /tmp/loop-anything-test` exits 0.
4. Generated files include the loop contract and five skills:
   `loop-dog-food`, `loop-triage`, `loop-review`, `loop-prove`, and
   `loop-record`.
5. `npm test`, `sh scripts/validate.sh`, and `npm pack --dry-run` pass.
6. README shows the two-command path.
7. No generated file contains credentials, private data, or marker text.
