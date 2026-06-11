const fs = require("fs");
const path = require("path");

const METHODS = new Set(["prompt", "create", "run"]);
const TURN_BUDGETS = new Set(["single", "multi", "infinite"]);

function renderDogFood({ agent = "both", object = "current repo", turn = "single", stage = "triage", method = "prompt" }) {
  validateTurn(turn);
  const loopObject = normalizeObject(object);
  const targets = agent === "both" ? ["codex", "claude"] : [agent];
  return targets
    .map((target) => renderTargetPrompt({ target, object: loopObject, turn, stage, method }))
    .join("\n\n");
}

function createDogFoodState(options) {
  const dir = path.resolve(options.dir || ".");
  const stateDir = options.stateDir || ".";
  const targetPath = path.join(dir, stateDir, "loop-state.md");
  const object = normalizeObject(options.object);
  const turn = options.turn || "single";
  validateTurn(turn);

  if (fs.existsSync(targetPath) && !options.force) {
    throw new Error(`loop-state.md already exists; pass --force to replace it`);
  }

  const source = readSource({ from: options.from, cwd: options.cwd || process.cwd(), dir });
  const content = renderState({ object, turn, source });

  if (!options.dryRun) {
    fs.mkdirSync(path.dirname(targetPath), { recursive: true });
    if (fs.existsSync(targetPath) && options.backup) {
      fs.copyFileSync(targetPath, `${targetPath}.bak`);
    }
    fs.writeFileSync(targetPath, content, "utf8");
  }

  return {
    dryRun: Boolean(options.dryRun),
    path: path.relative(dir, targetPath),
    content
  };
}

function renderTargetPrompt({ target, object, turn, stage, method }) {
  const invocation = `${target === "codex" ? "$" : "/"}loop-anything.dog-food ${object}`;
  return `${labelFor(target)}:
${invocation}
Method: ${method}
Object: ${object}
Turn budget: ${turn}
Starting stage: ${stage}

Read loop-state.md, loop-contract.md, loop-decisions.md, and loop-prompts.md.
Treat the object as the thing to improve, verify, or orchestrate through the loop.
Select the next bounded task, name the proof command before acting, stop at each
permission or proof gate, and record the result before ending the turn.

Turn rules:
${turnRule(turn)}`;
}

function renderState({ object, turn, source }) {
  const sourceLine = source.path ? `Source: ${source.path}` : "Source: direct object";
  return `# Loop State

## Current Goal

Dog-food ${object}.

${sourceLine}
Turn budget: ${turn}

${source.excerpt}

## Boundaries

- Write scope: this repository
- Network writes: none unless the active task names the service and reason
- Destructive actions: human approval required
- Private data rules: keep secrets, tokens, and private user data out of state
- Turn budget: ${turn}

## Queue

| Status | Task | Proof Command | Notes |
| --- | --- | --- | --- |
| active | Dog-food ${object} | _name before acting_ | Created by \`loop-anything dog-food create\` |

## Active Task

- Task: Dog-food ${object}
- Reason: turn a supplied spec, plan, pattern, or compute-willing object into a bounded loop
- Expected files or services: source object, loop state, proof command output
- Proof command: _name before acting_
- Stop condition: stop on missing proof, failed proof, permission expansion, destructive action, or unclear next task

## Proof History

| Date | Command | Result | Notes |
| --- | --- | --- | --- |

## Decisions

- Keep state visible and reviewable.
- Keep proof commands explicit before work starts.
- Keep each loop bounded even when the requested turn budget is multi or infinite.

## Next Action

Run \`loop-anything dog-food run ${object} --turn ${turn}\`, then choose one bounded task and name its proof command.
`;
}

function readSource({ from, cwd, dir }) {
  if (!from) {
    return {
      path: null,
      excerpt: "No source file was provided. Use the object name as the starting scope."
    };
  }

  const sourcePath = path.resolve(cwd, from);
  if (!fs.existsSync(sourcePath)) {
    throw new Error(`source file not found: ${from}`);
  }

  const content = fs.readFileSync(sourcePath, "utf8");
  return {
    path: path.relative(dir, sourcePath),
    excerpt: excerptMarkdown(content)
  };
}

function excerptMarkdown(content) {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .slice(0, 12);

  if (lines.length === 0) {
    return "Source file is empty.";
  }

  return ["Source excerpt:", "", ...lines.map((line) => `> ${line}`)].join("\n");
}

function turnRule(turn) {
  if (turn === "single") {
    return "- Run exactly one bounded loop iteration, then stop after record.";
  }
  if (turn === "multi") {
    return "- Continue bounded iterations while proof stays green and the state board has a next action.";
  }
  return "- Continue while compute and permission boundaries allow; never bypass stop conditions, review, or proof.";
}

function normalizeObject(object) {
  const value = String(object || "").replace(/\s+/g, " ").trim();
  return value || "current repo";
}

function validateTurn(turn) {
  if (!TURN_BUDGETS.has(turn)) {
    throw new Error(`Invalid --turn value: ${turn}`);
  }
}

function labelFor(agent) {
  return agent === "codex" ? "Codex" : "Claude";
}

module.exports = {
  METHODS,
  TURN_BUDGETS,
  createDogFoodState,
  normalizeObject,
  renderDogFood
};
