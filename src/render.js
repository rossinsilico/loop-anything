const fs = require("fs");
const path = require("path");

const TEMPLATE_ROOT = path.resolve(__dirname, "..", "templates", "loop-pack");
const STAGE_SKILLS = ["loop-anything", "loop-dog-food", "loop-triage", "loop-review", "loop-prove", "loop-record"];
const SHARED_FILES = [
  "loop-state.md",
  "loop-decisions.md",
  "loop-contract.md",
  "loop-prompts.md",
  "loop-runs/.gitkeep"
];

function installLoop(options) {
  const agent = options.agent || "both";
  const dir = path.resolve(options.dir || ".");
  const stateDir = options.stateDir || ".";
  const dryRun = Boolean(options.dryRun);
  const force = Boolean(options.force);
  const backup = Boolean(options.backup);
  const operations = buildOperations({ agent, dir, stateDir });
  const written = [];
  const skipped = [];
  const backedUp = [];

  for (const operation of operations) {
    const exists = fs.existsSync(operation.to);
    if (exists && !force) {
      skipped.push(relativeTo(dir, operation.to));
      continue;
    }

    if (!dryRun && exists && force && backup) {
      const backupPath = `${operation.to}.bak`;
      fs.copyFileSync(operation.to, backupPath);
      backedUp.push(relativeTo(dir, backupPath));
    }

    if (!dryRun) {
      fs.mkdirSync(path.dirname(operation.to), { recursive: true });
      fs.copyFileSync(operation.from, operation.to);
    }

    written.push(relativeTo(dir, operation.to));
  }

  return {
    agent,
    dryRun,
    written,
    skipped,
    backedUp
  };
}

function buildOperations({ agent, dir, stateDir }) {
  const targets = expandTargets(agent);
  const operations = [];

  for (const sharedFile of SHARED_FILES) {
    operations.push({
      from: path.join(TEMPLATE_ROOT, "shared", sharedFile),
      to: path.join(dir, stateDir, sharedFile)
    });
  }

  if (targets.includes("codex")) {
    for (const skill of STAGE_SKILLS) {
      operations.push({
        from: path.join(TEMPLATE_ROOT, "skills", skill, "SKILL.md"),
        to: path.join(dir, ".agents", "skills", skill, "SKILL.md")
      });
    }
  }

  if (targets.includes("claude")) {
    for (const skill of STAGE_SKILLS) {
      operations.push({
        from: path.join(TEMPLATE_ROOT, "skills", skill, "SKILL.md"),
        to: path.join(dir, ".claude", "skills", skill, "SKILL.md")
      });
    }
    operations.push({
      from: path.join(TEMPLATE_ROOT, "reviewers", "loop-reviewer.md"),
      to: path.join(dir, ".claude", "agents", "loop-reviewer.md")
    });
  }

  return operations;
}

function expandTargets(agent) {
  if (agent === "both") {
    return ["codex", "claude"];
  }
  return [agent];
}

function relativeTo(root, file) {
  return path.relative(root, file) || ".";
}

module.exports = {
  STAGE_SKILLS,
  SHARED_FILES,
  buildOperations,
  expandTargets,
  installLoop
};
