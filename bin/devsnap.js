#!/usr/bin/env node

const { program } = require("commander");

program
  .name("devsnap")
  .description("Capture and reproduce development environments with one command.")
  .version("0.1.0");

program
  .command("init")
  .description("Initialize devsnap config")
  .action(require("../src/commands/init"));

program
  .command("export")
  .description("Export development environment")
  .action(require("../src/commands/export"));

program
  .command("setup")
  .description("Setup development environment")
  .action(require("../src/commands/setup"));

program
  .command("doctor")
  .description("Check environment issues")
  .action(require("../src/commands/doctor"));

program.parse();
