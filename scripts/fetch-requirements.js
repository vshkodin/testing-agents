#!/usr/bin/env node
/**
 * Fetches requirements / acceptance criteria programmatically from GitHub.
 *
 * Usage:
 *   GITHUB_TOKEN=xxx node scripts/fetch-requirements.js [owner/repo] [issue_number]
 *   node scripts/fetch-requirements.js owner/repo 1   # uses env GITHUB_TOKEN
 *
 * Output: JSON with title, body, labels, acceptance_criteria (parsed from body).
 * Exit: 0 on success, 1 on error.
 */

const https = require('https');

const [repo = process.env.GITHUB_REPO || '', issueNum = process.env.GITHUB_ISSUE || ''] = process.argv.slice(2);
const token = process.env.GITHUB_TOKEN;

if (!repo || !issueNum) {
  console.error('Usage: GITHUB_TOKEN=xxx node scripts/fetch-requirements.js <owner/repo> <issue_number>');
  console.error('   or: GITHUB_REPO=owner/repo GITHUB_ISSUE=1 GITHUB_TOKEN=xxx node scripts/fetch-requirements.js');
  process.exit(1);
}

function get(url, token) {
  return new Promise((resolve, reject) => {
    const u = new URL(url);
    const opts = {
      hostname: u.hostname,
      path: u.pathname + u.search,
      method: 'GET',
      headers: {
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    };
    https.get(opts, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode !== 200) {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
          return;
        }
        try {
          resolve(JSON.parse(data));
        } catch (_) {
          reject(new Error('Invalid JSON'));
        }
      });
    }).on('error', reject);
  });
}

function parseAcceptanceCriteria(body) {
  if (!body) return [];
  const lines = body.split(/\r?\n/);
  const criteria = [];
  let inSection = false;
  const sectionPattern = /^\s*[-*]?\s*(?:acceptance criteria|acceptance|criteria|AC)\s*:?\s*$/i;
  const itemPattern = /^\s*[-*]\s+(.+)$/;
  for (const line of lines) {
    if (sectionPattern.test(line.trim())) {
      inSection = true;
      continue;
    }
    if (inSection) {
      const m = line.match(itemPattern);
      if (m) criteria.push(m[1].trim());
      else if (line.trim() === '' || line.match(/^#+\s/)) inSection = false;
    }
  }
  if (criteria.length > 0) return criteria;
  lines.forEach((line) => {
    const m = line.match(itemPattern);
    if (m && (m[1].toLowerCase().includes('should') || m[1].includes('Given'))) criteria.push(m[1].trim());
  });
  return criteria;
}

async function main() {
  const url = `https://api.github.com/repos/${repo}/issues/${issueNum}`;
  const issue = await get(url, token);
  const acceptance_criteria = parseAcceptanceCriteria(issue.body);
  const out = {
    title: issue.title,
    body: issue.body,
    state: issue.state,
    labels: (issue.labels || []).map((l) => l.name),
    html_url: issue.html_url,
    acceptance_criteria: acceptance_criteria.length ? acceptance_criteria : undefined,
  };
  console.log(JSON.stringify(out, null, 2));
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
