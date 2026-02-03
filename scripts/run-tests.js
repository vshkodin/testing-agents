const http = require('http');

const base = process.env.BASE_URL || 'http://localhost:3000';

function request(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, base);
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode, body: data }));
    }).on('error', reject);
  });
}

async function run() {
  let passed = 0;
  let failed = 0;

  const t = (name, ok) => {
    if (ok) { passed++; console.log(`  ✓ ${name}`); }
    else { failed++; console.log(`  ✗ ${name}`); }
  };

  console.log('Running tests...\n');

  const root = await request('/');
  t('GET / returns 200', root.status === 200);
  try {
    const json = JSON.parse(root.body);
    t('GET / returns JSON with name', json.name === 'crane');
  } catch (_) {
    t('GET / returns valid JSON', false);
  }

  const health = await request('/health');
  t('GET /health returns 200', health.status === 200);
  try {
    const json = JSON.parse(health.body);
    t('GET /health returns status ok', json.status === 'ok');
  } catch (_) {
    t('GET /health returns valid JSON', false);
  }

  const notFound = await request('/unknown');
  t('GET /unknown returns 404', notFound.status === 404);

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
