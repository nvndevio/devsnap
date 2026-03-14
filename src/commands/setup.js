const chalk = require("chalk");
const path = require("path");
const fs = require("fs-extra");
const { loadConfig } = require("../config");
const { detectNodeVersion, satisfiesVersion } = require("../utils/detectNode");
const {
  detectPackageManager,
  getInstallCommand,
  isPackageManagerInstalled,
} = require("../utils/detectPackageManager");
const { copyEnvFile } = require("../utils/detectEnv");
const { runCommand } = require("../utils/runCommand");

async function setup() {
  const cwd = process.cwd();
  let config = loadConfig(cwd);

  if (!config) {
    console.log(chalk.yellow("No .devsnap.json found. Run") + " devsnap init " + chalk.yellow("first."));
    return;
  }

  const nodeVersion = detectNodeVersion();
  const requiredNode = config.node || "auto";

  // 1. Check Node version
  console.log(chalk.bold("\nDevSnap setup\n"));
  if (nodeVersion) {
    if (satisfiesVersion(nodeVersion, requiredNode)) {
      console.log(chalk.green("✔ Node version OK") + chalk.gray(` (${nodeVersion})`));
    } else {
      console.log(
        chalk.red("✖ Node version mismatch.") +
          chalk.gray(` Current: ${nodeVersion}, expected: ${requiredNode}. Use nvm or fnm to switch.`)
      );
      return;
    }
  } else {
    console.log(chalk.yellow("⚠ Node not found. Install Node.js first."));
    return;
  }

  // 2. Install dependencies
  const packageManager = config.packageManager === "auto" ? detectPackageManager(cwd) : config.packageManager;
  const packageJsonPath = path.join(cwd, "package.json");

  if (fs.existsSync(packageJsonPath)) {
    if (!isPackageManagerInstalled(packageManager)) {
      console.log(chalk.yellow(`⚠ ${packageManager} not found. Install it or use another manager.`));
    } else {
      const [cmd, ...args] = getInstallCommand(packageManager);
      console.log(chalk.gray(`Running ${cmd} ${args.join(" ")}...`));
      const result = await runCommand(cmd, args, { cwd });
      if (result.success) {
        console.log(chalk.green("✔ Dependencies installed"));
      } else {
        console.log(chalk.red("✖ Install failed."), result.error?.message || "");
        return;
      }
    }
  } else {
    console.log(chalk.gray("No package.json, skipping install"));
  }

  // 3. Copy env file
  const envSource = config.env;
  if (envSource && envSource !== ".env") {
    const copied = copyEnvFile(envSource, ".env", cwd);
    if (copied) {
      console.log(chalk.green("✔ Env file copied") + chalk.gray(` (${envSource} → .env)`));
    } else {
      console.log(chalk.yellow("⚠ Env file not found:") + " " + envSource);
    }
  }

  // 4. Run setup scripts
  const setupScripts = Array.isArray(config.setup) ? config.setup : [];
  for (const script of setupScripts) {
    if (typeof script === "string") {
      console.log(chalk.gray(`Running: ${script}`));
      const [cmd, ...args] = script.split(/\s+/);
      const result = await runCommand(cmd, args, { cwd });
      if (!result.success) {
        console.log(chalk.red("✖ Setup script failed:"), script);
      }
    }
  }

  console.log(chalk.green("\n✓ Setup complete.\n"));
}

module.exports = setup;
