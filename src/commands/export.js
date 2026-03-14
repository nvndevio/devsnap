const chalk = require("chalk");
const { loadConfig, saveConfig } = require("../config");
const { detectNodeVersion } = require("../utils/detectNode");
const { detectPackageManager } = require("../utils/detectPackageManager");
const { detectEnvFile } = require("../utils/detectEnv");

async function exportCmd() {
  const nodeVersion = detectNodeVersion();
  const packageManager = detectPackageManager();
  const envFile = detectEnvFile();

  let config = loadConfig();
  if (!config) {
    config = {
      node: nodeVersion || "auto",
      packageManager: "auto",
      env: envFile || ".env.example",
      setup: [],
    };
    saveConfig(config);
  } else {
    config.packageManager = "auto";
    config.env = envFile || config.env || ".env.example";
    if (nodeVersion) config.node = config.node === "auto" ? nodeVersion : config.node;
    saveConfig(config);
  }

  console.log(chalk.bold("\nDev environment exported\n"));
  console.log(chalk.gray("Node:") + "        " + (nodeVersion || chalk.yellow("not found")));
  console.log(chalk.gray("Package manager:") + " " + packageManager);
  console.log(chalk.gray("Env file:") + "      " + (envFile || chalk.yellow("none")));
  console.log(chalk.green("\n✓ .devsnap.json updated.\n"));
}

module.exports = exportCmd;
