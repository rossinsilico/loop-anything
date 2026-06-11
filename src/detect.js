const fs = require("fs");
const path = require("path");

function detectProject(inputDir, cwd) {
  const root = path.resolve(cwd, inputDir || ".");
  const gitRoot = findGitRoot(root);
  return {
    root,
    gitRoot,
    isGitRepo: Boolean(gitRoot)
  };
}

function findGitRoot(startDir) {
  let current = path.resolve(startDir);
  while (true) {
    if (fs.existsSync(path.join(current, ".git"))) {
      return current;
    }
    const parent = path.dirname(current);
    if (parent === current) {
      return null;
    }
    current = parent;
  }
}

module.exports = {
  detectProject,
  findGitRoot
};
