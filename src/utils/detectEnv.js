const path = require("path");
const fs = require("fs-extra");

const ENV_CANDIDATES = [
  ".env.example",
  ".env.sample",
  ".env.template",
  ".env.dist",
  ".env",
];

function detectEnvFile(cwd = process.cwd()) {
  for (const name of ENV_CANDIDATES) {
    const envPath = path.join(cwd, name);
    if (fs.existsSync(envPath)) {
      return name;
    }
  }
  return null;
}

function copyEnvFile(sourceName, targetName = ".env", cwd = process.cwd()) {
  const src = path.join(cwd, sourceName);
  const dest = path.join(cwd, targetName);
  if (!fs.existsSync(src)) return false;
  if (sourceName === targetName) return true;
  fs.copyFileSync(src, dest);
  return true;
}

module.exports = {
  detectEnvFile,
  copyEnvFile,
  ENV_CANDIDATES,
};
