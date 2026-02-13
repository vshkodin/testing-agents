---
name: requires
description: Defines prerequisites and steps to run the testing-agents (Crane) project. Use when the user asks what is required, first-run setup, onboarding, run the app, or get the environment running.
---

# Requires – project prerequisites and setup

## Prerequisites

- **Node.js** >= 18 (see `package.json` engines).
- **npm** (comes with Node).
- **Optional:** Git, `gh` CLI, and MCP servers (Playwright, gh-cli-mcp) for full agent/MCP workflows; see README.

## Required steps to run the app

Execute in order:

1. **Env**
   - Copy `.env.example` to `.env` (optional; app runs with defaults).
   - Do not commit `.env`; it is in `.gitignore`.

2. **Install**
   - Run: `npm install`

3. **Validate env** (optional)
   - Run: `node scripts/check-env.js`
   - Exit 0 means required vars (if any) are set. Default config has none required.

4. **Start server**
   - Run: `npm run dev` (watch mode) or `npm start`
   - Server listens on `PORT` from `.env` or `3000`.

5. **Confirm**
   - Open http://localhost:3000 or run: `npm test` (API tests use `BASE_URL` or http://localhost:3000).

## Env vars (reference)

| Var | Required | Default | Purpose |
|-----|----------|---------|---------|
| PORT | No | 3000 | Server port |
| NODE_ENV | No | development | Environment |
| BASE_URL | No | http://localhost:3000 | Base URL for API tests |
| GITHUB_TOKEN | No* | — | For `scripts/fetch-requirements.js` (private repos) |

\*Only when fetching from private repos.

## When to apply

- User says: "what's required", "first run", "set up the project", "run the app", "get env running", "onboarding".
- Before running API or E2E tests, ensure server is running or set `BASE_URL` to a running instance.
