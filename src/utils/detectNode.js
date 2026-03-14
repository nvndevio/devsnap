const { execaSync } = require("execa");

function detectNodeVersion() {
  try {
    const { stdout } = execaSync("node", ["--version"], { encoding: "utf-8" });
    return stdout.trim().replace(/^v/, "");
  } catch {
    return null;
  }
}

function parseNodeVersion(versionString) {
  if (!versionString) return null;
  const match = versionString.match(/^v?(\d+)\.(\d+)/);
  if (!match) return null;
  return {
    major: parseInt(match[1], 10),
    minor: parseInt(match[2], 10),
    raw: versionString.replace(/^v/, ""),
  };
}

function satisfiesVersion(current, required) {
  if (!required || required === "auto") return true;
  const cur = parseNodeVersion(typeof current === "string" ? current : null);
  const req = parseNodeVersion(required);
  if (!cur || !req) return true;
  if (cur.major > req.major) return true;
  if (cur.major === req.major && cur.minor >= req.minor) return true;
  return false;
}

module.exports = {
  detectNodeVersion,
  parseNodeVersion,
  satisfiesVersion,
};
