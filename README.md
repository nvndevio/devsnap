# DevSnap

**Capture and reproduce development environments in seconds.**

DevSnap scans your project (Node version, package manager, env files) and saves a config. Anyone who clones the repo can run one command to get the same environment: correct Node, dependencies, and env file.

## Install

Use without installing (recommended):

```bash
npx devsnap init
npx devsnap setup
```

Or install globally:

```bash
npm install -g devsnap
devsnap init
devsnap setup
```

## Commands

| Command | Description |
|--------|-------------|
| `devsnap init` | Create `.devsnap.json` in the current project (detects Node, package manager, env file) |
| `devsnap export` | Re-scan project and update `.devsnap.json` |
| `devsnap setup` | One-shot setup: check Node → install deps → copy env → run setup scripts |
| `devsnap doctor` | Check environment (Node, package manager, env file, optional tools like PostgreSQL, Docker) |

## Quick start

**Maintainer (you):**

```bash
cd your-project
npx devsnap init
# Edit .devsnap.json if needed (e.g. node version, setup scripts)
git add .devsnap.json
git commit -m "chore: add devsnap config"
git push
```

**Teammate (clone & run):**

```bash
git clone <repo-url>
cd <repo>
npx devsnap setup
```

DevSnap will:

1. Check Node version (optional: use `nvm`/`fnm` if mismatch)
2. Install dependencies (npm/yarn/pnpm/bun based on lockfile)
3. Copy `.env.example` (or configured file) to `.env`
4. Run any custom setup scripts from `.devsnap.json`

## Config (`.devsnap.json`)

```json
{
  "node": "auto",
  "packageManager": "auto",
  "env": ".env.example",
  "setup": []
}
```

- **node**: `"auto"` (use current) or a version string like `"20"` or `"20.11"`
- **packageManager**: `"auto"` (detect from lockfile) or `"npm"` | `"yarn"` | `"pnpm"` | `"bun"`
- **env**: env template file to copy to `.env` (e.g. `.env.example`)
- **setup**: array of shell commands to run after install (e.g. `["npx prisma generate"]`)

## Requirements

- Node.js 18+
- One of: npm, yarn, pnpm, or bun (for `devsnap setup`)

## License

MIT
