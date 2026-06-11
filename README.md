# Loop Anything

Make agent loop orchestration easier and more powerful.

`loop-anything` is a tiny JavaScript CLI that adds a shared loop contract,
stage skills, reviewer prompts, and proof gates to any repo. It is not a
daemon, not a hosted service, and not another prompt pile. It gives agents a
small operating model they can resume from.

```bash
node bin/loop-anything.js dog-food spec --turn single
node bin/loop-anything.js check --agent both
```

## Why

One-off prompts are easy to start and hard to resume. Every new agent session
has to rediscover the goal, boundaries, state, review expectations, and proof
commands.

Loop Anything makes orchestration easier by turning a work object into a visible
loop:

- native Codex and Claude skill folders
- one shared state board
- one shared loop contract
- one reviewer role
- one dog-food command for specs, plans, patterns, and repo surfaces
- one check command for proof

It makes orchestration more powerful by turning "keep going" into a stage
machine:

```text
observe -> triage -> plan -> act -> review -> prove -> record -> stop
```

The generated files tell an agent what stage it is in, what it can touch, what
proof is required, when to stop, and where to record the next action.

## What It Generates

For Codex:

```text
.agents/skills/loop-triage/SKILL.md
.agents/skills/loop-dog-food/SKILL.md
.agents/skills/loop-review/SKILL.md
.agents/skills/loop-prove/SKILL.md
.agents/skills/loop-record/SKILL.md
```

For Claude:

```text
.claude/skills/loop-triage/SKILL.md
.claude/skills/loop-dog-food/SKILL.md
.claude/skills/loop-review/SKILL.md
.claude/skills/loop-prove/SKILL.md
.claude/skills/loop-record/SKILL.md
.claude/agents/loop-reviewer.md
```

Shared state:

```text
loop-state.md
loop-decisions.md
loop-contract.md
loop-prompts.md
loop-runs/
```

Codex and Claude use their native project folders, but read the same state
board. That is the point: separate tool installs, one shared loop.

## Install Modes

Current source checkout:

```bash
node bin/loop-anything.js dog-food spec --turn single
node bin/loop-anything.js init --agent both --dir /tmp/example-loop
node bin/loop-anything.js check --agent both --dir /tmp/example-loop
```

After registry publication:

```bash
npx loop-anything dog-food spec --turn single
npx loop-anything init --agent both
npx loop-anything check --agent both
```

Target one agent when needed:

```bash
node bin/loop-anything.js init --agent codex
node bin/loop-anything.js check --agent codex

# Claude only
node bin/loop-anything.js init --agent claude
node bin/loop-anything.js check --agent claude
```

Create loop state from a plan or spec:

```bash
node bin/loop-anything.js dog-food create plan --from docs/product-brief.md --turn multi
```

Preview writes without creating files:

```bash
node bin/loop-anything.js init --agent both --dry-run
```

## Commands

### `dog-food`

```bash
loop-anything dog-food [prompt|create|run] [object words...] [--from path] [--turn single|multi|infinite]
```

The main command. It treats a spec, plan, orchestration pattern, branch, issue,
repo area, or other compute-willing object as the loop target.

- `dog-food spec --turn single` prints the next Codex and Claude handoff.
- `dog-food create plan --from plan.md --turn multi` creates loop state from a
  Markdown plan.
- `dog-food run orchestration pattern --turn infinite` prints a guarded run
  prompt that continues only while review, proof, and permission gates hold.

### `init`

```bash
loop-anything init [--agent codex|claude|both] [--dir path] [--state-dir path] [--dry-run] [--force] [--backup]
```

Installs the loop pack into a project. Existing files are skipped unless
`--force` is set. With `--backup`, overwritten files get a `.bak` copy.

### `check`

```bash
loop-anything check [--agent codex|claude|both] [--dir path] [--state-dir path]
```

Validates required files, skill frontmatter, state-board headings, stage order,
and obvious marker or secret-looking values.

### `prompt`

```bash
loop-anything prompt [--agent codex|claude|both] [--stage triage|review|prove|record|resume]
```

Prints an agent-native handoff prompt for the next loop stage. Codex gets
`$loop-*` invocations. Claude gets `/loop-*` invocations.

## The Orchestration Contract

Loop Anything is useful because it adds a little process, not a lot of runtime.
The process is the product.

- `loop-dog-food`: turn a work object into a bounded loop
- `loop-triage`: choose one bounded task and name the proof command
- `loop-review`: check scope, diff, permissions, and secret risk
- `loop-prove`: run and record the proof command
- `loop-record`: update state, decisions, blockers, and next action

The full contract lives in `loop-contract.md`:

```text
observe -> triage -> plan -> act -> review -> prove -> record -> stop
```

`loop-prompts.md`, `loop-anything prompt`, and `loop-anything dog-food` give you
stage-specific handoffs so the next run can resume without rethinking the
process.

## Dogfooding

Dog food is all that matters: the package should prove its own loop before it
asks another repo to trust the loop.

This repo installs Loop Anything into itself. The checked-in `.agents/`,
`.claude/`, `loop-state.md`, `loop-contract.md`, and `loop-prompts.md` files are
the same scaffold the package generates for other projects.

The repo dogfoods itself with:

```bash
node bin/loop-anything.js dog-food run "loop-anything package" --turn multi
```

## Safety Defaults

- Shared state is Markdown you can read.
- Secrets do not belong in generated state files.
- Destructive actions require human approval.
- Network writes must be named by the active task.
- Completion claims require proof command output.
- The reviewer role is separate from the maker role.

## What This Is Not

Loop Anything does not run agents for you. It makes the repo easier for agents
to run well.

That keeps the package small while still adding leverage:

- no background daemon
- no hosted account
- no secret store
- no scheduler lock-in
- no vendor-specific runtime

## Reference Fit

Loop Anything follows the current project-skill layouts for both tools:

- Codex project skills: `.agents/skills/<skill-name>/SKILL.md`
- Claude project skills: `.claude/skills/<skill-name>/SKILL.md`
- Claude project subagents: `.claude/agents/<agent-name>.md`

Useful references:

- [OpenAI Codex Agent Skills](https://developers.openai.com/codex/skills)
- [Claude Code Skills](https://code.claude.com/docs/en/skills)
- [Claude Code Subagents](https://code.claude.com/docs/en/subagents)

## Development

```bash
npm test
sh scripts/validate.sh
node bin/loop-anything.js check --agent both
npm pack --dry-run
```

The validation script creates a temp project, installs both Codex and Claude
targets, runs `check`, scans generated files, and verifies the package contents
with `npm pack --dry-run`.

## Docs

- `docs/agent-loop-skill-pack-standard.md`
- `docs/orchestration-model.md`
- `docs/product-brief.md`

## License

MIT
