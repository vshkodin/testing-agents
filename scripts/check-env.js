#!/usr/bin/env node
/**
 * Optional: check that required env vars are set before running the app.
 * Run: node scripts/check-env.js
 * Exit: 0 if ok, 1 and message if missing.
 *
 * For crane, the app has no required vars (PORT is optional). This script
 * is a template; add required vars to REQUIRED_VARS when the app needs them.
 */

const REQUIRED_VARS = [
  // 'API_KEY',
  // 'DATABASE_URL',
];

const missing = REQUIRED_VARS.filter((name) => !process.env[name]);
if (missing.length > 0) {
  console.error('Missing required env vars:', missing.join(', '));
  console.error('Copy .env.example to .env and fill in values.');
  process.exit(1);
}
console.log('Env check OK');
process.exit(0);
