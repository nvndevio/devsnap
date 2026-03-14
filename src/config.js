const path = require("path");
const fs = require("fs-extra");

const CONFIG_FILENAME = ".devsnap.json";

function getConfigPath(cwd = process.cwd()) {
  return path.join(cwd, CONFIG_FILENAME);
}

function loadConfig(cwd = process.cwd()) {
  const configPath = getConfigPath(cwd);
  if (!fs.existsSync(configPath)) {
    return null;
  }
  const content = fs.readFileSync(configPath, "utf-8");
  return JSON.parse(content);
}

function saveConfig(config, cwd = process.cwd()) {
  const configPath = getConfigPath(cwd);
  fs.writeJsonSync(configPath, config, { spaces: 2 });
}

module.exports = {
  CONFIG_FILENAME,
  getConfigPath,
  loadConfig,
  saveConfig,
};
