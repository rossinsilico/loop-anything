const { detectProject } = require("./detect");
const { installLoop } = require("./render");
const { checkLoop } = require("./check");
const { version } = require("../package.json");

const VALID_AGENTS = new Set(["codex", "claude", "both"]);

function printHelp(stdout) {
  stdout.write(`loop-anything ${version}

Usage:
  loop-anything init [--agent codex|claude|both] [--dir path] [--state-dir path] [--dry-run] [--force] [--backup]
  loop-anything check [--agent codex|claude|both] [--dir path] [--state-dir path]

Commands:
  init    Install loop orchestration files into a project
  check   Validate an installed loop scaffold

Options:
  --agent      Target agent layout. Defaults to both
  --dir        Target project directory. Defaults to current directory
  --state-dir  Directory for shared state files. Defaults to target root
  --dry-run    Print planned writes without creating files
  --force      Overwrite generated files
  --backup     Save .bak copies when used with --force
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
    help: false,
    version: false
  };

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
    } else {
      throw new Error(`Unknown option: ${token}`);
    }
  }

  if (!VALID_AGENTS.has(args.agent)) {
    throw new Error(`Invalid --agent value: ${args.agent}`);
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
