const { detectProject } = require("./detect");
const { installLoop } = require("./render");
const { checkLoop } = require("./check");
const { renderPrompt, STAGES } = require("./prompts");
const { METHODS, TURN_BUDGETS, createDogFoodState, normalizeObject, renderDogFood } = require("./dogfood");
const { version } = require("../package.json");

const VALID_AGENTS = new Set(["codex", "claude", "both"]);

function printHelp(stdout) {
  stdout.write(`loop-anything ${version}

Usage:
  loop-anything dog-food [prompt|create|run] [object words...] [--from path] [--turn single|multi|infinite]
  loop-anything init [--agent codex|claude|both] [--dir path] [--state-dir path] [--dry-run] [--force] [--backup]
  loop-anything check [--agent codex|claude|both] [--dir path] [--state-dir path]
  loop-anything prompt [--agent codex|claude|both] [--stage triage|review|prove|record|resume]

Commands:
  dog-food  Create or print an object-scoped dogfood loop
  init      Install loop orchestration files into a project
  check     Validate an installed loop scaffold
  prompt    Print an agent-native prompt for a loop stage

Options:
  --agent      Target agent layout. Defaults to both
  --dir        Target project directory. Defaults to current directory
  --state-dir  Directory for shared state files. Defaults to target root
  --from       Source Markdown/spec/plan file for dog-food create
  --turn       Dog-food turn budget. Defaults to single
  --dry-run    Print planned writes without creating files
  --force      Overwrite generated files
  --backup     Save .bak copies when used with --force
  --stage      Prompt stage. Defaults to triage
  --help       Show this help
  --version    Show version
`);
}

function parseArgs(argv) {
  const args = {
    command: argv[0],
    agent: "both",
    dir: ".",
    stateDir: ".",
    dryRun: false,
    force: false,
    backup: false,
    stage: "triage",
    turn: "single",
    method: "prompt",
    object: "current repo",
    from: null,
    help: false,
    version: false
  };
  const objectParts = [];

  if (!args.command || args.command === "--help" || args.command === "-h") {
    args.help = true;
    args.command = "help";
    return args;
  }

  if (args.command === "--version" || args.command === "-v") {
    args.version = true;
    args.command = "version";
    return args;
  }

  for (let index = 1; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--dry-run") {
      args.dryRun = true;
    } else if (token === "--force") {
      args.force = true;
    } else if (token === "--backup") {
      args.backup = true;
    } else if (token === "--help" || token === "-h") {
      args.help = true;
    } else if (token === "--version" || token === "-v") {
      args.version = true;
    } else if (token === "--agent") {
      index += 1;
      args.agent = requireValue(token, argv[index]);
    } else if (token === "--dir") {
      index += 1;
      args.dir = requireValue(token, argv[index]);
    } else if (token === "--state-dir") {
      index += 1;
      args.stateDir = requireValue(token, argv[index]);
    } else if (token === "--stage") {
      index += 1;
      args.stage = requireValue(token, argv[index]);
    } else if (token === "--turn" || token === "--mode") {
      index += 1;
      args.turn = requireValue(token, argv[index]);
    } else if (token === "--from") {
      index += 1;
      args.from = requireValue(token, argv[index]);
    } else if (args.command === "dog-food" && !token.startsWith("--")) {
      if (objectParts.length === 0 && METHODS.has(token)) {
        args.method = token;
      } else {
        objectParts.push(token);
      }
    } else {
      throw new Error(`Unknown option: ${token}`);
    }
  }

  if (objectParts.length > 0) {
    args.object = normalizeObject(objectParts.join(" "));
  }

  if (!VALID_AGENTS.has(args.agent)) {
    throw new Error(`Invalid --agent value: ${args.agent}`);
  }
  if (!STAGES.has(args.stage)) {
    throw new Error(`Invalid --stage value: ${args.stage}`);
  }
  if (!TURN_BUDGETS.has(args.turn)) {
    throw new Error(`Invalid --turn value: ${args.turn}`);
  }

  return args;
}

function requireValue(flag, value) {
  if (!value || value.startsWith("--")) {
    throw new Error(`${flag} requires a value`);
  }
  return value;
}

function main(argv, io) {
  try {
    const args = parseArgs(argv);

    if (args.help) {
      printHelp(io.stdout);
      return 0;
    }

    if (args.version) {
      io.stdout.write(`${version}\n`);
      return 0;
    }

    if (args.command === "init") {
      const project = detectProject(args.dir, io.cwd);
      const result = installLoop({
        agent: args.agent,
        dir: project.root,
        stateDir: args.stateDir,
        dryRun: args.dryRun,
        force: args.force,
        backup: args.backup
      });
      printInstallResult(result, io.stdout);
      return 0;
    }

    if (args.command === "check") {
      const project = detectProject(args.dir, io.cwd);
      const result = checkLoop({
        agent: args.agent,
        dir: project.root,
        stateDir: args.stateDir
      });
      printCheckResult(result, io.stdout, io.stderr);
      return result.ok ? 0 : 1;
    }

    if (args.command === "prompt") {
      io.stdout.write(`${renderPrompt({ agent: args.agent, stage: args.stage })}\n`);
      return 0;
    }

    if (args.command === "dog-food") {
      if (args.method === "create") {
        const result = createDogFoodState({
          dir: detectProject(args.dir, io.cwd).root,
          stateDir: args.stateDir,
          object: args.object,
          turn: args.turn,
          from: args.from,
          cwd: io.cwd,
          dryRun: args.dryRun,
          force: args.force,
          backup: args.backup
        });
        io.stdout.write(`${result.dryRun ? "would write" : "wrote"}: ${result.path}\n`);
        io.stdout.write(`Next: loop-anything dog-food run ${args.object} --turn ${args.turn}\n`);
        return 0;
      }

      io.stdout.write(`${renderDogFood({
        agent: args.agent,
        object: args.object,
        turn: args.turn,
        stage: args.stage,
        method: args.method
      })}\n`);
      return 0;
    }

    throw new Error(`Unknown command: ${args.command}`);
  } catch (error) {
    io.stderr.write(`loop-anything: ${error.message}\n`);
    return 1;
  }
}

function printInstallResult(result, stdout) {
  const prefix = result.dryRun ? "would write" : "wrote";
  for (const file of result.written) {
    stdout.write(`${prefix}: ${file}\n`);
  }
  for (const file of result.skipped) {
    stdout.write(`skipped existing: ${file}\n`);
  }
  for (const file of result.backedUp) {
    stdout.write(`backed up: ${file}\n`);
  }
  stdout.write(`\nNext: loop-anything check --agent ${result.agent}\n`);
}

function printCheckResult(result, stdout, stderr) {
  for (const item of result.checked) {
    stdout.write(`ok: ${item}\n`);
  }
  for (const warning of result.warnings) {
    stdout.write(`warn: ${warning}\n`);
  }
  for (const failure of result.failures) {
    stderr.write(`fail: ${failure}\n`);
  }
  stdout.write(result.ok ? "loop-anything check passed\n" : "loop-anything check failed\n");
}

module.exports = {
  main,
  parseArgs
};
