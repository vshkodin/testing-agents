const http = require('http');
const fs = require('fs');
const path = require('path');
const { parseForm, validateCredentials } = require('./lib');

const PORT = process.env.PORT || 3000;
const PUBLIC = path.join(__dirname, '..', 'public');

function serveFile(res, filePath, contentType) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(data);
  });
}

const routes = {
  GET: {
    '/': (req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        name: 'crane',
        version: '1.0.0',
        endpoints: ['GET /', 'GET /health', 'GET /play', 'GET /playwright-ui', 'GET /login', 'GET /welcome'],
      }));
    },
    '/health': (req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    },
    '/play': (req, res) => serveFile(res, path.join(PUBLIC, 'play.html'), 'text/html'),
    '/playwright-ui': (req, res) => serveFile(res, path.join(PUBLIC, 'playwright-ui.html'), 'text/html'),
    '/login': (req, res) => serveFile(res, path.join(PUBLIC, 'login.html'), 'text/html'),
    '/welcome': (req, res) => serveFile(res, path.join(PUBLIC, 'welcome.html'), 'text/html'),
  },
  POST: {
    '/login': (req, res, body) => {
      const form = parseForm(body);
      if (validateCredentials(form.username, form.password)) {
        res.writeHead(302, { Location: '/welcome' });
        res.end();
      } else {
        res.writeHead(302, { Location: '/login?error=invalid' });
        res.end();
      }
    },
  },
};

function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = '';
    req.on('data', (chunk) => (data += chunk));
    req.on('end', () => resolve(data));
    req.on('error', reject);
  });
}

const server = http.createServer((req, res) => {
  const method = req.method;
  const pathUrl = (req.url || '/').split('?')[0];
  const handler = routes[method]?.[pathUrl];

  if (method === 'POST' && handler) {
    readBody(req).then((body) => {
      handler(req, res, body);
    }).catch(() => {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    });
    return;
  }

  if (routes.GET && routes.GET[pathUrl]) {
    routes.GET[pathUrl](req, res);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
