const path = require("path");
const fs = require("fs-extra");

const LOCKFILES = {
  "package-lock.json": "npm",
  "yarn.lock": "yarn",
  "pnpm-lock.yaml": "pnpm",
  "bun.lockb": "bun",
};

function detectPackageManager(cwd = process.cwd()) {
  for (const [lockfile, manager] of Object.entries(LOCKFILES)) {
    const lockPath = path.join(cwd, lockfile);
    if (fs.existsSync(lockPath)) {
      return manager;
    }
  }
  return "npm";
}

function getInstallCommand(manager) {
  const commands = {
    npm: ["npm", "install"],
    yarn: ["yarn", "install"],
    pnpm: ["pnpm", "install"],
    bun: ["bun", "install"],
  };
  return commands[manager] || commands.npm;
}

function isPackageManagerInstalled(manager) {
  const { execaSync } = require("execa");
  try {
    if (manager === "npm") {
      execaSync("npm", ["--version"], { encoding: "utf-8" });
      return true;
    }
    if (manager === "yarn") {
      execaSync("yarn", ["--version"], { encoding: "utf-8" });
      return true;
    }
    if (manager === "pnpm") {
      execaSync("pnpm", ["--version"], { encoding: "utf-8" });
      return true;
    }
    if (manager === "bun") {
      execaSync("bun", ["--version"], { encoding: "utf-8" });
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

module.exports = {
  detectPackageManager,
  getInstallCommand,
  isPackageManagerInstalled,
  LOCKFILES,
};
