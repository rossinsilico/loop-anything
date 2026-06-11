# Loop Anything

Make agent loop orchestration easier and more powerful.

`loop-anything` is a tiny JavaScript CLI that adds a shared loop contract,
stage skills, reviewer prompts, and proof gates to any repo. It is not a
daemon, not a hosted service, and not another prompt pile. It gives agents a
small operating model they can resume from.

```bash
npx github:rossinsilico/loop-anything init --agent both
npx github:rossinsilico/loop-anything check --agent both
```

## Why

One-off prompts are easy to start and hard to resume. Every new agent session
has to rediscover the goal, boundaries, state, review expectations, and proof
commands.

Loop Anything makes orchestration easier by installing those pieces in one
command:

- native Codex and Claude skill folders
- one shared state board
- one shared loop contract
- one reviewer role
- one check command

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
.agents/skills/loop-review/SKILL.md
.agents/skills/loop-prove/SKILL.md
.agents/skills/loop-record/SKILL.md
```

For Claude:

```text
.claude/skills/loop-triage/SKILL.md
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
loop-runs/
```

Codex and Claude use their native project folders, but read the same state
board. That is the point: separate tool installs, one shared loop.

## Install Modes

From GitHub:

```bash
# Codex only
npx github:rossinsilico/loop-anything init --agent codex
npx github:rossinsilico/loop-anything check --agent codex

# Claude only
npx github:rossinsilico/loop-anything init --agent claude
npx github:rossinsilico/loop-anything check --agent claude

# Both
npx github:rossinsilico/loop-anything init --agent both
npx github:rossinsilico/loop-anything check --agent both
```

Local checkout usage:

```bash
node bin/loop-anything.js init --agent both --dir /tmp/example-loop
node bin/loop-anything.js check --agent both --dir /tmp/example-loop
```

Preview writes without creating files:

```bash
npx github:rossinsilico/loop-anything init --agent both --dry-run
```

After an npm release, the command becomes `npx loop-anything ...`.

## Commands

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

## The Orchestration Contract

Loop Anything is useful because it adds a little process, not a lot of runtime.
The process is the product.

- `loop-triage`: choose one bounded task and name the proof command
- `loop-review`: check scope, diff, permissions, and secret risk
- `loop-prove`: run and record the proof command
- `loop-record`: update state, decisions, blockers, and next action

The full contract lives in `loop-contract.md`:

```text
observe -> triage -> plan -> act -> review -> prove -> record -> stop
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
