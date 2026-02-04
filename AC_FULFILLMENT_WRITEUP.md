# AC Fulfillment Writeup: AI-Driven Development Assessment

This writeup demonstrates how this repository fulfills the assessment instructions: **AI-driven development** from **obtaining requirements/acceptance criteria programmatically** through **development and pushing code**, with a **custom agent** that can be **demonstrated and explained**.

---

## 1. Assessment Instructions (Summary)

| # | Instruction | Required deliverable |
|---|-------------|----------------------|
| 1 | Given a codebase in GitHub and a feature to add or refactor | Use a GitHub-hosted repo and implement or refactor a feature |
| 2 | Demonstrate AI to drive development (prompting, context, agents, MCP extensions) | Show prompting, persistent context, custom agents, and MCP where applicable |
| 3 | From obtaining requirements/acceptance criteria **programmatically** to developing and pushing code changes | Programmatic fetch of AC + full dev flow to commit/push |
| 4 | Show an Agent you have built | Present at least one custom agent |
| 5 | Demonstrate this agent in some way | Live or recorded demo of the agent in action |
| 6 | Explain how it was built and what it is doing as you demonstrate | Clear build story + step-by-step narration during demo |

---

## 2. Fulfillment of Each Instruction

### 2.1 Codebase in GitHub + feature to add/refactor

**Fulfillment:** This repo (e.g. **crane**) is a minimal Node API, intended to be hosted on GitHub. The workflow supports:

- **Adding a feature** (e.g. `GET /api/version`, login flow, new endpoint).
- **Refactoring** by giving the feature-dev-agent updated acceptance criteria or an issue.

**In demo:** Choose one small feature (e.g. “GET /api/version that returns version from package.json”) and implement it end-to-end, or refactor an existing endpoint using the same flow.

---

### 2.2 AI-driven development (prompting, context, agents, MCP)

**Fulfillment:**

| Element | Where it lives | Role |
|--------|----------------|------|
| **Prompting** | User chat in Cursor | User asks e.g. “Use the feature-dev-agent to add GET /api/version…” or “Implement issue #3”; prompts drive the whole flow |
| **Context** | `.cursor/rules/*.mdc`, agent prompts in `.cursor/agents/*.md` | Rules tell Cursor when to delegate to which agent; agent markdown files are the persistent system prompt for each subagent |
| **Agents** | `.cursor/agents/` (feature-dev-agent, github-agent, api-test-agent, env-setup-agent, gh-mcp-testing-agent, etc.) | Custom subagents with clear roles (feature dev, tests, env, GitHub, gh via MCP) |
| **MCP extensions** | `.cursor/mcp.json` (Playwright), optional **gh-cli-mcp** | Browser automation (e.g. open app, snapshot); optional GitHub CLI via MCP (workflows, issues, PRs) |

**In demo:** Show one prompt that kicks off the feature-dev-agent; point to rules and agent files as “context”; optionally show MCP (browser or gh) in a second part of the demo.

---

### 2.3 Requirements / acceptance criteria programmatically → develop → push

**Fulfillment:**

1. **Programmatic requirements**
   - **Script:** `scripts/fetch-requirements.js`
   - **Usage:** `GITHUB_TOKEN=xxx node scripts/fetch-requirements.js owner/repo issue_number`
   - **Output:** JSON with `title`, `body`, `acceptance_criteria` (parsed from issue body: “Acceptance criteria” / “AC” section and bullet items).
   - The feature-dev-agent (or user) runs this script when the source of truth is a GitHub issue.

2. **Develop**
   - Feature-dev-agent: obtain requirements → confirm AC → plan → implement → run tests → suggest commit/push.
   - Implementation follows project style (e.g. `src/server.js`, existing route pattern).

3. **Push**
   - Agent suggests a commit message (e.g. `feat(api): add GET /api/version`) and reminds to push; it can run git commands only with user confirmation.

**In demo:** Either (A) use a GitHub issue with AC and run `fetch-requirements.js`, then hand the JSON to the agent, or (B) paste the script output into chat and say “implement these acceptance criteria.” Then show implement → test → suggest commit/push.

---

### 2.4 Agent built

**Primary agent for the assessment:** **Feature Development Agent**

- **File:** `.cursor/agents/feature-dev-agent.md`
- **Role:** Run the full feature lifecycle: obtain requirements (including via `fetch-requirements.js`) → confirm acceptance criteria → implement → verify (run tests) → suggest commit and push.
- **Invocation:** User says e.g. “Use the feature-dev-agent to add …” or “Use the feature-dev-agent to implement issue #N.”

**Other agents** (can be mentioned as “also built”): github-agent (issues, PRs, commit messages), api-test-agent, env-setup-agent, gh-mcp-testing-agent (gh via MCP), etc. See README and ASSESSMENT_DEMO.md.

---

### 2.5 Demonstrate the agent

**Ways to demonstrate:**

1. **Live in Cursor**
   - In Cursor chat: *“Use the feature-dev-agent to add a GET /api/version endpoint that returns the app version from package.json. Acceptance criteria: 200, JSON, and a `version` field.”*
   - Let the agent run through: requirements → plan → code edits → `npm test` → suggested commit message and push reminder.
   - Optionally run `npm start` and `curl http://localhost:3000/api/version` to show the result.

2. **From a GitHub issue (programmatic AC)**
   - Create an issue with an “Acceptance criteria” section and bullet list.
   - In chat: *“Use the feature-dev-agent to implement the feature from issue #N. Fetch requirements with the fetch-requirements script (GITHUB_REPO, GITHUB_ISSUE, GITHUB_TOKEN).”*
   - Show the script output (JSON with `acceptance_criteria`), then the agent implementing and testing.

3. **Optional: MCP**
   - **Browser:** “Open http://localhost:3000 and take a snapshot” (Playwright MCP).
   - **gh MCP:** “Use the gh-mcp-testing-agent to list open issues” or “run the CI workflow” (if gh-cli-mcp is enabled).

---

### 2.6 Explain how it was built and what it does during the demo

**How it was built (short version):**

- **Agent:** A Cursor **subagent** = one markdown file under `.cursor/agents/` with:
  - **Frontmatter:** `name`, `description` (so Cursor knows when to delegate).
  - **Body:** System prompt = steps (obtain requirements, confirm AC, implement, verify, prepare for push), rules (use existing stack, one logical change, state assumptions), and output format.
- **Programmatic requirements:** A small Node script (`fetch-requirements.js`) that calls the GitHub API, fetches the issue, and parses acceptance criteria from the body (section headers + bullet list).
- **Context/routing:** Cursor **rules** in `.cursor/rules/` (e.g. `feature-workflow.mdc`) tell the AI to delegate “add a feature” / “implement an issue” to the feature-dev-agent and to use the fetch-requirements script when the source is GitHub.

**What to say while demonstrating (step-by-step):**

1. **Before running:** “I’m using the Feature Development Agent. It’s defined in `.cursor/agents/feature-dev-agent.md`. The rules in `.cursor/rules/feature-workflow.mdc` tell Cursor to use this agent when I ask to add a feature or implement an issue.”
2. **Requirements:** “I’m asking it to add GET /api/version. If we had a GitHub issue, we’d run `fetch-requirements.js` to get the acceptance criteria as JSON; here I’m giving the criteria in the prompt.”
3. **Plan:** “The agent is confirming the acceptance criteria and planning which files to change—in this case the server and maybe package.json.”
4. **Implement:** “It’s editing the code following our existing style.”
5. **Verify:** “It runs `npm test` to make sure nothing’s broken.”
6. **Commit/Push:** “It suggests a commit message and reminds me to push; I can approve and push myself or ask it to run git with my confirmation.”

That covers **how it was built** and **what it is doing** at each step of the demo.

---

## 3. One-Page Demo Script (Feature-Dev-Agent)

Use this for a short, repeatable demo.

**Setup:** Repo open in Cursor, terminal available. Optional: GitHub issue with AC and `GITHUB_TOKEN` set.

**Prompt (no GitHub issue):**
```text
Use the feature-dev-agent to add a GET /api/version endpoint that returns
{ "version": "<from package.json>" }. Acceptance criteria: HTTP 200,
JSON response, and a "version" field that matches package.json.
```

**Prompt (with GitHub issue #N):**
```text
Use the feature-dev-agent to implement the feature from issue #N.
Fetch requirements with: GITHUB_REPO=owner/repo GITHUB_ISSUE=N GITHUB_TOKEN=xxx node scripts/fetch-requirements.js
```

**While the agent runs, say:**

- “Requirements are coming from the prompt / from the fetch-requirements script.”
- “It’s confirming acceptance criteria and planning changes.”
- “It’s implementing in src/server.js (or the right files).”
- “It’s running npm test for verification.”
- “It’s suggesting a commit message and reminding me to push.”

**After:** Run `npm start` and `curl http://localhost:3000/api/version` to show the new endpoint.

---

## 4. File Reference (Where Things Live)

| Purpose | Path |
|--------|------|
| Feature Development Agent (main demo agent) | `.cursor/agents/feature-dev-agent.md` |
| Rule: delegate feature work + use fetch-requirements | `.cursor/rules/feature-workflow.mdc` |
| Programmatic fetch of AC from GitHub | `scripts/fetch-requirements.js` |
| Example requirements (no GitHub) | `REQUIREMENTS.example.md` |
| Other agents | `.cursor/agents/*.md` |
| Other rules | `.cursor/rules/*.mdc` |
| Playwright MCP config | `.cursor/mcp.json` |
| Extended demo & file map | `ASSESSMENT_DEMO.md` |

---

## 5. Checklist for the Assessor

- [ ] **Codebase on GitHub** – repo is available and cloneable  
- [ ] **Feature add/refactor** – a concrete feature is implemented or refactored using the flow  
- [ ] **AI-driven dev** – prompting, context (rules + agents), and optionally MCP are shown  
- [ ] **Programmatic AC** – `fetch-requirements.js` (or equivalent) is used to get AC from an issue  
- [ ] **Develop + push** – implementation, tests, and commit/push (or clear suggestion) are shown  
- [ ] **Agent built** – feature-dev-agent (and optionally others) are shown in `.cursor/agents/`  
- [ ] **Demonstration** – agent is invoked and observed through at least one full cycle  
- [ ] **Explanation** – presenter explains how the agent was built and what it does at each step  

This writeup and the repo together show fulfillment of the assessment instructions from **programmatic requirements/acceptance criteria** through **development and pushing**, with a **custom agent** that can be **demonstrated and explained** in a structured way.
