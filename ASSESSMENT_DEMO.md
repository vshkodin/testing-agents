# Assessment: AI-Driven Development & Feature Development Agent

This document explains how the assessment requirements are met and how to demonstrate the **Feature Development Agent** and the full workflow.

---

## 1. Assessment Requirements Coverage

| Requirement | How it's met |
|-------------|--------------|
| **Codebase in GitHub + feature to add/refactor** | This repo (crane) is a minimal Node API. You can push it to GitHub and add a feature (e.g. a new endpoint, health check improvement) as the demo. |
| **AI-driven development (prompting, context, agents, MCP)** | **Prompting**: Clear user prompts drive the flow. **Context**: Cursor rules and agent prompt provide persistent context. **Agents**: Custom subagent `feature-dev-agent`. **MCP**: cursor-ide-browser can be used to open GitHub, run the app in browser, or verify UI. |
| **Requirements / acceptance criteria programmatically** | `scripts/fetch-requirements.js` fetches a GitHub issue via GitHub API and parses acceptance criteria from the issue body. |
| **Develop and push code changes** | Agent implements the feature, runs tests, suggests commit message, and reminds to push (or runs git with user approval). |
| **Show an Agent you have built** | **Feature Development Agent** in `.cursor/agents/feature-dev-agent.md`. |
| **Demonstrate the agent** | Use Cursor chat: “Use the feature-dev-agent to add feature X” or “Implement the acceptance criteria from issue #N”. |
| **Explain how it was built and what it does** | See sections 2 and 3 below. |

---

## 2. How the Agent Was Built

### 2.1 What the Agent Is

- **Type**: Cursor **subagent** (custom agent with a dedicated system prompt).
- **Location**: `.cursor/agents/feature-dev-agent.md` (project-scoped; can be committed and shared).
- **Role**: Runs the full feature lifecycle: obtain requirements → confirm acceptance criteria → implement → run tests → suggest commit and push.

### 2.2 Build Steps

1. **Create the agent file**
   - Path: `.cursor/agents/feature-dev-agent.md`.
   - Format: YAML frontmatter + markdown body (the system prompt).

2. **Frontmatter**
   - `name`: `feature-dev-agent` (unique, lowercase, hyphens).
   - `description`: When to delegate (e.g. “adding a new feature”, “implementing an issue”, “refactoring from GitHub/criteria”). This is what the AI uses to decide when to call this agent.

3. **System prompt (body)**
   - **Obtain requirements**: Use GitHub issue (run `scripts/fetch-requirements.js`) or REQUIREMENTS.md / user-provided criteria.
   - **Confirm acceptance criteria**: If none parsed, propose 3–5; otherwise confirm.
   - **Implement**: Plan files/changes, implement, follow project conventions.
   - **Verify**: Run `npm test` (or project test command), fix until green.
   - **Prepare for push**: Summary, suggested commit message, push reminder.
   - **Rules**: Use existing stack/style; one logical change per commit; state assumptions if requirements are ambiguous.
   - **Output format**: Requirements → Plan → Implementation → Verification → Commit.

4. **Supporting pieces**
   - **Cursor rule** (`.cursor/rules/feature-workflow.mdc`): Tells the AI to delegate feature work to `feature-dev-agent` and to use `fetch-requirements.js` when the source is GitHub.
   - **Script** (`scripts/fetch-requirements.js`): Fetches issue JSON from GitHub API and parses acceptance criteria from the body so requirements are obtained **programmatically**.

### 2.3 Design Choices

- **Project-level agent**: Stored in the repo so the team gets the same behavior.
- **Description wording**: Includes “adding a new feature”, “implementing an issue”, “refactoring from GitHub/criteria” so the AI reliably delegates.
- **Explicit workflow**: Numbered steps and output format reduce drift and make demos repeatable.

---

## 3. What the Agent Does (During a Demo)

When you say something like: *“Use the feature-dev-agent to add a GET /api/version endpoint that returns the app version”*, the agent:

1. **Obtains requirements**
   - If you point to a GitHub issue, it runs `fetch-requirements.js` and gets title, body, and parsed acceptance criteria.
   - If you only describe the feature, it uses that as the requirement and can propose acceptance criteria.

2. **Confirms acceptance criteria**
   - Lists the criteria it will implement (e.g. “GET /api/version returns 200 and JSON with version field”).

3. **Implements**
   - Plans changes (e.g. `src/server.js`, add route and version from `package.json`).
   - Edits the code and keeps the existing style.

4. **Verifies**
   - Runs `npm test` and fixes any failures.

5. **Prepares for push**
   - Summarizes changes, suggests a commit message (e.g. `feat(api): add GET /api/version`), and reminds you to push or offers to run git commands if you confirm.

You can **narrate the demo** by saying:  
*“I’m using the Feature Development Agent. It’s going to get the requirements, turn them into acceptance criteria, implement the change, run the tests, and then suggest a commit and push.”*

---

## 4. How to Demonstrate

### 4.1 Prerequisites

- Repo cloned and open in Cursor.
- Node 18+.
- Optional: GitHub repo + issue (with optional `GITHUB_TOKEN` for private repos).

### 4.2 Demo A: Feature from a description (no GitHub)

1. In Cursor chat, say:
   ```text
   Use the feature-dev-agent to add a GET /api/version endpoint that returns
   { "version": "<from package.json>" }. Acceptance criteria: 200, JSON,
   and version field present.
   ```
2. Let the agent run: it will confirm criteria, implement, run `npm test`, and suggest commit/push.
3. Run `npm start` and `curl http://localhost:3000/api/version` to show the new endpoint.

### 4.3 Demo B: Feature from a GitHub issue (programmatic requirements)

1. Create a GitHub issue with title and body that includes acceptance criteria, e.g.:
   ```text
   ## Acceptance criteria
   - GET /api/version returns 200 and JSON with a "version" field from package.json
   ```
2. In Cursor chat:
   ```text
   Use the feature-dev-agent to implement the feature from issue #<N> in this repo.
   Fetch requirements with: GITHUB_REPO=owner/repo GITHUB_ISSUE=<N> GITHUB_TOKEN=xxx node scripts/fetch-requirements.js
   ```
3. The agent will run `fetch-requirements.js`, get criteria, implement, test, and suggest commit/push.
4. Optionally show the script output: `node scripts/fetch-requirements.js owner/repo N` (with token in env) to show **programmatic** requirements.

### 4.4 Demo C: MCP (browser)

- Use Cursor’s MCP **cursor-ide-browser**: open the app (e.g. `http://localhost:3000`), take a snapshot, and show that the API responds (or that a simple front-end shows the new feature). This demonstrates “MCP extensions” as part of AI-driven development.

### 4.5 Explaining While Demonstrating

- **“How it was built”**: Point to `.cursor/agents/feature-dev-agent.md` (frontmatter + prompt) and `.cursor/rules/feature-workflow.mdc`; mention the create-subagent / create-rule patterns and the `fetch-requirements.js` script.
- **“What it’s doing”**: For each step (requirements → criteria → implement → test → commit), briefly say what the agent is doing and show the corresponding output or code change.

---

## 5. File Map

| Path | Purpose |
|------|--------|
| `.cursor/agents/feature-dev-agent.md` | Feature Development Agent (subagent definition and prompt). |
| `.cursor/agents/unit-test-agent.md` | Unit Test Agent: writes and runs unit tests for functions/modules. |
| `.cursor/agents/ui-test-agent.md` | UI Test Agent: writes and runs UI/browser tests for pages and flows. |
| `.cursor/agents/api-test-agent.md` | API Test Agent: writes and runs API/HTTP tests for endpoints. |
| `.cursor/agents/env-setup-agent.md` | Env Setup Agent: sets up .env, .env.example, and documents required vars. |
| `.cursor/agents/github-agent.md` | GitHub Agent: fetch issues/PRs, requirements, commit message, PR description, branch name. |
| `.cursor/rules/feature-workflow.mdc` | Rule: delegate feature work to the agent and use programmatic requirements when using GitHub. |
| `.cursor/rules/testing-agents.mdc` | Rule: delegate to unit-test-agent, ui-test-agent, or api-test-agent when adding/running tests. |
| `.cursor/rules/env-setup.mdc` | Rule: delegate to env-setup-agent when setting up env or local dev. |
| `.cursor/rules/github-agent.mdc` | Rule: delegate to github-agent for GitHub issues, PRs, commits, repo workflow. |
| `scripts/fetch-requirements.js` | Fetches a GitHub issue and parses acceptance criteria (programmatic requirements). |
| `scripts/run-tests.js` | Project test runner used by the agent for verification. |
| `src/server.js` | Minimal API; new features (e.g. `/api/version`) are added here for the demo. |
| `ASSESSMENT_DEMO.md` | This file: requirements mapping, build explanation, and demo script. |

---

## 6. Quick Reference: Key Prompts

- **Invoke the agent (generic):**  
  *“Use the feature-dev-agent to add [feature description].”*
- **With acceptance criteria:**  
  *“Use the feature-dev-agent to implement [feature]. Acceptance criteria: [list].”*
- **From GitHub issue:**  
  *“Use the feature-dev-agent to implement the feature from issue #N. Fetch requirements with the fetch-requirements script and GITHUB_REPO / GITHUB_ISSUE.”*

**Testing agents**
- **Unit tests:** *"Use the unit-test-agent to add unit tests for [file or function]."*
- **UI tests:** *"Use the ui-test-agent to add UI tests for [page or flow]."*
- **API tests:** *"Use the api-test-agent to add API tests for [endpoints]."*

**Env setup**
- *"Use the env-setup-agent to set up .env and document required vars."*

**GitHub**
- *"Use the github-agent to fetch issue #N and give me the acceptance criteria."*
- *"Use the github-agent to suggest a commit message for my staged changes."*
- *"Use the github-agent to draft a PR description for this branch."*

These prompts, plus the agents and rules, show **AI-driven development** from **requirements/acceptance criteria** (including programmatic fetch) through **development**, **testing** (unit, UI, API), and **pushing** the code, with **custom agents** you built and can demonstrate and explain.
