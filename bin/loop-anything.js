#!/usr/bin/env node

const { main } = require("../src/cli");

const exitCode = main(process.argv.slice(2), {
  cwd: process.cwd(),
  stdout: process.stdout,
  stderr: process.stderr
});

process.exitCode = exitCode;
