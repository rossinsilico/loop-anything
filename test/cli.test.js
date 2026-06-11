const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const { main, parseArgs } = require("../src/cli");
const { checkLoop } = require("../src/check");
const { installLoop } = require("../src/render");

test("parseArgs defaults to both-agent init", () => {
  const args = parseArgs(["init"]);
  assert.equal(args.command, "init");
  assert.equal(args.agent, "both");
  assert.equal(args.dir, ".");
  assert.equal(args.stateDir, ".");
});

test("parseArgs rejects unknown agent values", () => {
  assert.throws(
    () => parseArgs(["init", "--agent", "other"]),
    /Invalid --agent value/
  );
});

test("dry-run lists planned writes without creating files", () => {
  const dir = makeTempDir();
  const result = installLoop({ agent: "codex", dir, dryRun: true });

  assert.ok(result.written.includes(".agents/skills/loop-triage/SKILL.md"));
  assert.equal(fs.existsSync(path.join(dir, ".agents")), false);
});

test("install both writes Codex, Claude, and shared state", () => {
  const dir = makeTempDir();
  const result = installLoop({ agent: "both", dir });

  assert.equal(result.skipped.length, 0);
  assert.ok(fs.existsSync(path.join(dir, ".agents/skills/loop-triage/SKILL.md")));
  assert.ok(fs.existsSync(path.join(dir, ".claude/skills/loop-record/SKILL.md")));
  assert.ok(fs.existsSync(path.join(dir, ".claude/agents/loop-reviewer.md")));
  assert.ok(fs.existsSync(path.join(dir, "loop-state.md")));
  assert.ok(fs.existsSync(path.join(dir, "loop-contract.md")));
});

test("check passes for both-agent scaffold", () => {
  const dir = makeTempDir();
  installLoop({ agent: "both", dir });

  const result = checkLoop({ agent: "both", dir });
  assert.equal(result.ok, true, result.failures.join("\n"));
  assert.equal(result.failures.length, 0);
});

test("check fails when required files are absent", () => {
  const dir = makeTempDir();

  const result = checkLoop({ agent: "codex", dir });
  assert.equal(result.ok, false);
  assert.ok(result.failures.some((failure) => failure.includes("loop-state.md")));
  assert.ok(result.failures.some((failure) => failure.includes(".agents/skills/loop-triage/SKILL.md")));
});

test("second install skips existing files by default", () => {
  const dir = makeTempDir();
  installLoop({ agent: "codex", dir });
  const result = installLoop({ agent: "codex", dir });

  assert.equal(result.written.length, 0);
  assert.ok(result.skipped.includes("loop-state.md"));
  assert.ok(result.skipped.includes(".agents/skills/loop-prove/SKILL.md"));
});

test("force with backup overwrites generated files and writes backups", () => {
  const dir = makeTempDir();
  installLoop({ agent: "claude", dir });

  const statePath = path.join(dir, "loop-state.md");
  fs.writeFileSync(statePath, "# custom\n", "utf8");

  const result = installLoop({ agent: "claude", dir, force: true, backup: true });
  assert.ok(result.backedUp.includes("loop-state.md.bak"));
  assert.match(fs.readFileSync(statePath, "utf8"), /# Loop State/);
  assert.equal(fs.readFileSync(`${statePath}.bak`, "utf8"), "# custom\n");
});

test("CLI main returns non-zero for failed check", () => {
  const dir = makeTempDir();
  const stdout = createWriter();
  const stderr = createWriter();

  const code = main(["check", "--agent", "codex", "--dir", dir], {
    cwd: process.cwd(),
    stdout,
    stderr
  });

  assert.equal(code, 1);
  assert.match(stderr.output(), /missing file/);
});

test("CLI main installs and checks a target directory", () => {
  const dir = makeTempDir();
  const stdout = createWriter();
  const stderr = createWriter();

  const initCode = main(["init", "--agent", "both", "--dir", dir], {
    cwd: process.cwd(),
    stdout,
    stderr
  });
  assert.equal(initCode, 0, stderr.output());

  const checkCode = main(["check", "--agent", "both", "--dir", dir], {
    cwd: process.cwd(),
    stdout: createWriter(),
    stderr: createWriter()
  });
  assert.equal(checkCode, 0);
});

function makeTempDir() {
  return fs.mkdtempSync(path.join(os.tmpdir(), "loop-anything-test-"));
}

function createWriter() {
  let value = "";
  return {
    write(chunk) {
      value += chunk;
    },
    output() {
      return value;
    }
  };
}
