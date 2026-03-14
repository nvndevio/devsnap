const { execa } = require("execa");

async function runCommand(command, args = [], options = {}) {
  const { cwd = process.cwd(), stdio = "inherit" } = options;
  try {
    await execa(command, args, { cwd, stdio });
    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
}

function runCommandSync(command, args = [], options = {}) {
  const { execaSync } = require("execa");
  const { cwd = process.cwd(), encoding = "utf-8" } = options;
  try {
    execaSync(command, args, { cwd, encoding });
    return { success: true };
  } catch (err) {
    return { success: false, error: err };
  }
}

module.exports = {
  runCommand,
  runCommandSync,
};
