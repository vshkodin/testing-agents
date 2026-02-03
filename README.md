# Crane

Minimal Node API for AI-driven feature development (assessment demo).

## Setup

1. **Copy env template** (optional; app runs with defaults):
   ```bash
   cp .env.example .env
   ```
   Edit `.env` if you need to change `PORT` or set `GITHUB_TOKEN` for private repos. **Do not commit `.env`.**

2. **Install and run**:
   ```bash
   npm install   # no deps; optional
   npm start     # run server on port 3000
   npm test      # run tests (start server first, or set BASE_URL)
   ```

   Optional env check before start: `node scripts/check-env.js` (add required vars in the script if needed).

## How to use agents

Agents are Cursor subagents in `.cursor/agents/`. In Cursor chat, say **"Use the [agent-name] to …"** or ask for the task (e.g. "add unit tests"); project rules will delegate to the right agent.

| Agent | When to use | Example prompt |
|-------|--------------|----------------|
| **feature-dev-agent** | Add a feature, implement an issue, refactor from GitHub/criteria | *"Use the feature-dev-agent to add GET /api/version that returns the app version."* |
| **unit-test-agent** | Add unit tests, improve coverage, test a function/module | *"Use the unit-test-agent to add unit tests for src/server.js."* |
| **ui-test-agent** | Add UI or E2E tests, test a page or flow in the browser | *"Use the ui-test-agent to add UI tests for the home page."* |
| **api-test-agent** | Add API tests, test HTTP endpoints | *"Use the api-test-agent to add API tests for the health and root endpoints."* |
| **env-setup-agent** | Set up .env, document env vars, local dev / onboarding | *"Use the env-setup-agent to set up .env and document required vars."* |
| **github-agent** | Fetch issues/PRs, requirements, commit message, PR description, branch name | *"Use the github-agent to fetch issue #3 and give me the acceptance criteria."* |

**Feature from GitHub:** To drive development from an issue, give the issue number and (for private repos) a token, then ask the feature-dev-agent to implement it. Requirements are fetched with:

```bash
GITHUB_TOKEN=xxx node scripts/fetch-requirements.js owner/repo issue_number
```

**Demo & explanation:** See [ASSESSMENT_DEMO.md](ASSESSMENT_DEMO.md).

Agent definitions live in `.cursor/agents/`; rules in `.cursor/rules/` tell Cursor when to delegate (e.g. "add unit tests" → unit-test-agent).

## Endpoints

- `GET /` – app info
- `GET /health` – health check
