const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { loadEnvConfig } = require('@next/env');

// Load environment variables exactly like Next.js does
const projectDir = process.cwd();
loadEnvConfig(projectDir);

// Hostinger's Node.js environment passes the port via process.env.PORT
const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV === 'development'; // Default to production to prevent Hostinger memory overflow

const app = next({ dev, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('internal server error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://localhost:${port}`);
    });
});
