const chalk = require("chalk");
const { loadConfig } = require("../config");
const { detectNodeVersion, satisfiesVersion } = require("../utils/detectNode");
const {
  detectPackageManager,
  isPackageManagerInstalled,
} = require("../utils/detectPackageManager");
const { detectEnvFile } = require("../utils/detectEnv");
const path = require("path");
const fs = require("fs-extra");

function checkCommand(cmd, args = ["--version"]) {
  try {
    const { execaSync } = require("execa");
    execaSync(cmd, args, { encoding: "utf-8" });
    return true;
  } catch {
    return false;
  }
}

function doctor() {
  const cwd = process.cwd();
  const config = loadConfig(cwd);
  const nodeVersion = detectNodeVersion();
  const packageManager = config?.packageManager === "auto" ? detectPackageManager(cwd) : (config?.packageManager || "npm");
  const envFile = config?.env || detectEnvFile(cwd);

  console.log(chalk.bold("\nDevSnap doctor\n"));

  // Node
  if (nodeVersion) {
    const ok = !config?.node || config.node === "auto" || satisfiesVersion(nodeVersion, config.node);
    if (ok) {
      console.log(chalk.green("✔ Node version OK") + chalk.gray(` (${nodeVersion})`));
    } else {
      console.log(chalk.red("✖ Node version mismatch") + chalk.gray(` (current: ${nodeVersion}, expected: ${config.node})`));
    }
  } else {
    console.log(chalk.red("✖ Node missing"));
  }

  // Package manager
  if (isPackageManagerInstalled(packageManager)) {
    console.log(chalk.green(`✔ ${packageManager} installed`));
  } else {
    console.log(chalk.red(`✖ ${packageManager} missing`));
  }

  // Env file
  if (envFile) {
    const envPath = path.join(cwd, envFile);
    if (fs.existsSync(envPath)) {
      console.log(chalk.green("✔ Env file present") + chalk.gray(` (${envFile})`));
    } else {
      console.log(chalk.yellow("⚠ Env file configured but not found:") + " " + envFile);
    }
  } else {
    console.log(chalk.gray("○ No env file configured"));
  }

  // Optional: PostgreSQL (example external check)
  if (checkCommand("psql", ["--version"])) {
    console.log(chalk.green("✔ PostgreSQL (psql) available"));
  } else {
    console.log(chalk.yellow("✖ PostgreSQL missing") + chalk.gray(" (optional)"));
  }

  // Optional: Docker
  if (checkCommand("docker", ["--version"])) {
    console.log(chalk.green("✔ Docker available"));
  } else {
    console.log(chalk.gray("○ Docker not found") + chalk.gray(" (optional)"));
  }

  console.log("");
}

module.exports = doctor;
