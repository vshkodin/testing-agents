const http = require('http');

const base = process.env.BASE_URL || 'http://localhost:3000';

function request(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, base);
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () =>
        resolve({
          status: res.statusCode,
          headers: res.headers,
          body: data,
        })
      );
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

  // Health check tests
  const health = await request('/health');
  t('GET /health returns 200', health.status === 200);
  t(
    'GET /health returns Content-Type application/json',
    (health.headers['content-type'] || '').toLowerCase().includes('application/json')
  );
  let healthJson;
  try {
    healthJson = JSON.parse(health.body);
    t('GET /health returns valid JSON', true);
  } catch (_) {
    t('GET /health returns valid JSON', false);
  }
  if (healthJson) {
    t('GET /health returns status ok', healthJson.status === 'ok');
    t('GET /health returns timestamp field', typeof healthJson.timestamp === 'string');
    t(
      'GET /health timestamp is valid ISO 8601',
      healthJson.timestamp && !Number.isNaN(Date.parse(healthJson.timestamp))
    );
  }

  const play = await request('/play');
  t('GET /play returns 200', play.status === 200);
  t('GET /play returns HTML with Playwright Playground', play.body.includes('Playwright Playground'));

  const login = await request('/login');
  t('GET /login returns 200', login.status === 200);
  t('GET /login returns HTML with Login', login.body.includes('Login'));

  const welcome = await request('/welcome');
  t('GET /welcome returns 200', welcome.status === 200);
  t('GET /welcome returns HTML with Welcome', welcome.body.includes('Welcome'));

  const notFound = await request('/unknown');
  t('GET /unknown returns 404', notFound.status === 404);

  console.log(`\n${passed} passed, ${failed} failed`);
  process.exit(failed > 0 ? 1 : 0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
