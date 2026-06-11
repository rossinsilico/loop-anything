# Loop Decisions

Use this file for decisions that should survive across loop runs.

## Accepted Decisions

- The loop moves through explicit stages: observe, triage, plan, act, review,
  prove, record, and stop.
- The maker role cannot claim completion without a proof command.
- The reviewer role checks the state board, diff, permissions, and proof.
- Shared state stays outside agent-specific folders.
- Public install instructions stay package-neutral and must not depend on a
  personal GitHub namespace.
- The package payload stays lean; self-installed repo loop files are committed
  for dogfooding but excluded from npm by the `files` allowlist.

## Rejected Patterns

- Hidden state that only one agent can read.
- Separate Codex and Claude state boards for the same loop.
- Background writes without a named permission boundary.
- Success claims based on confidence instead of command output.
