const chalk = require("chalk");
const { saveConfig } = require("../config");
const { detectNodeVersion } = require("../utils/detectNode");
const { detectPackageManager } = require("../utils/detectPackageManager");
const { detectEnvFile } = require("../utils/detectEnv");

function init() {
  const nodeVersion = detectNodeVersion();
  const packageManager = detectPackageManager();
  const envFile = detectEnvFile();

  const config = {
    node: "auto",
    packageManager: "auto",
    env: envFile || ".env.example",
    setup: [],
  };

  saveConfig(config);
  console.log(chalk.green("✓ DevSnap config created (.devsnap.json)"));
  if (nodeVersion) {
    console.log(chalk.gray(`  Node detected: ${nodeVersion}`));
  }
  console.log(chalk.gray(`  Package manager: ${packageManager}`));
  if (envFile) {
    console.log(chalk.gray(`  Env file: ${envFile}`));
  }
}

module.exports = init;
