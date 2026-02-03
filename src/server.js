const http = require('http');

const PORT = process.env.PORT || 3000;

const routes = {
  GET: {
    '/': (req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        name: 'crane',
        version: '1.0.0',
        endpoints: ['GET /', 'GET /health'],
      }));
    },
    '/health': (req, res) => {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
    },
  },
};

const server = http.createServer((req, res) => {
  const handler = routes[req.method]?.[req.url];
  if (handler) {
    handler(req, res);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
