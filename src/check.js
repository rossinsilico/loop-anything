const fs = require("fs");
const path = require("path");
const { STAGE_SKILLS, SHARED_FILES, expandTargets } = require("./render");

const REQUIRED_STATE_HEADINGS = [
  "## Current Goal",
  "## Boundaries",
  "## Queue",
  "## Active Task",
  "## Proof History",
  "## Next Action"
];
const REQUIRED_PROMPT_TEXT = [
  "$loop-anything dog-food",
  "/loop-anything dog-food",
  "$loop-triage",
  "/loop-triage",
  "loop-state.md"
];

const MARKER_PATTERN = /\b(TBD|TODO|FIXME|INSERT_|YOUR_|PLACEHOLDER)\b/;
const SECRET_PATTERNS = [
  /gh[pousr]_[A-Za-z0-9_]{20,}/,
  /sk-[A-Za-z0-9_-]{20,}/,
  /AKIA[0-9A-Z]{16}/,
  /sb_(publishable|secret)_[A-Za-z0-9_-]{20,}/
];

function checkLoop(options) {
  const agent = options.agent || "both";
  const dir = path.resolve(options.dir || ".");
  const stateDir = options.stateDir || ".";
  const checked = [];
  const failures = [];
  const warnings = [];
  const filesToScan = [];

  for (const sharedFile of SHARED_FILES) {
    const target = path.join(dir, stateDir, sharedFile);
    requireFile(target, dir, failures, checked);
    if (fs.existsSync(target) && fs.statSync(target).isFile()) {
      filesToScan.push(target);
    }
  }

  const statePath = path.join(dir, stateDir, "loop-state.md");
  if (fs.existsSync(statePath)) {
    const state = fs.readFileSync(statePath, "utf8");
    for (const heading of REQUIRED_STATE_HEADINGS) {
      if (!state.includes(heading)) {
        failures.push(`loop-state.md missing heading: ${heading}`);
      }
    }
  }

  const contractPath = path.join(dir, stateDir, "loop-contract.md");
  if (fs.existsSync(contractPath)) {
    const contract = fs.readFileSync(contractPath, "utf8");
    if (!contract.includes("observe -> triage -> plan -> act -> review -> prove -> record -> stop")) {
      failures.push("loop-contract.md missing stage order");
    }
  }

  const promptsPath = path.join(dir, stateDir, "loop-prompts.md");
  if (fs.existsSync(promptsPath)) {
    const prompts = fs.readFileSync(promptsPath, "utf8");
    for (const text of REQUIRED_PROMPT_TEXT) {
      if (!prompts.includes(text)) {
        failures.push(`loop-prompts.md missing text: ${text}`);
      }
    }
  }

  for (const target of expandTargets(agent)) {
    if (target === "codex") {
      for (const skill of STAGE_SKILLS) {
        const skillPath = path.join(dir, ".agents", "skills", skill, "SKILL.md");
        requireSkill(skillPath, skill, dir, failures, checked);
        if (fs.existsSync(skillPath)) {
          filesToScan.push(skillPath);
        }
      }
    }

    if (target === "claude") {
      for (const skill of STAGE_SKILLS) {
        const skillPath = path.join(dir, ".claude", "skills", skill, "SKILL.md");
        requireSkill(skillPath, skill, dir, failures, checked);
        if (fs.existsSync(skillPath)) {
          filesToScan.push(skillPath);
        }
      }

      const reviewerPath = path.join(dir, ".claude", "agents", "loop-reviewer.md");
      requireFile(reviewerPath, dir, failures, checked);
      if (fs.existsSync(reviewerPath)) {
        filesToScan.push(reviewerPath);
      }
    }
  }

  for (const file of filesToScan) {
    scanFile(file, dir, failures, warnings);
  }

  return {
    ok: failures.length === 0,
    checked,
    warnings,
    failures
  };
}

function requireFile(file, root, failures, checked) {
  if (!fs.existsSync(file)) {
    failures.push(`missing file: ${path.relative(root, file)}`);
    return;
  }
  checked.push(path.relative(root, file));
}

function requireSkill(file, expectedName, root, failures, checked) {
  requireFile(file, root, failures, checked);
  if (!fs.existsSync(file)) {
    return;
  }

  const content = fs.readFileSync(file, "utf8");
  const frontmatter = readFrontmatter(content);
  if (!frontmatter) {
    failures.push(`${path.relative(root, file)} missing YAML frontmatter`);
    return;
  }
  if (!frontmatter.includes(`name: ${expectedName}`)) {
    failures.push(`${path.relative(root, file)} missing name: ${expectedName}`);
  }
  if (!/^description:\s+\S/m.test(frontmatter)) {
    failures.push(`${path.relative(root, file)} missing description`);
  }
}

function readFrontmatter(content) {
  if (!content.startsWith("---\n")) {
    return null;
  }
  const end = content.indexOf("\n---", 4);
  if (end === -1) {
    return null;
  }
  return content.slice(4, end);
}

function scanFile(file, root, failures, warnings) {
  const content = fs.readFileSync(file, "utf8");
  if (MARKER_PATTERN.test(content)) {
    failures.push(`marker text found in ${path.relative(root, file)}`);
  }
  for (const pattern of SECRET_PATTERNS) {
    if (pattern.test(content)) {
      failures.push(`secret-like value found in ${path.relative(root, file)}`);
    }
  }
  if (content.length > 12000) {
    warnings.push(`large generated file: ${path.relative(root, file)}`);
  }
}

module.exports = {
  checkLoop,
  readFrontmatter
};
