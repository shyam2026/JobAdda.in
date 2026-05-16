const { createServer } = require('http');
const { parse } = require('url');
const path = require('path');
const fs = require('fs');
const next = require('next');
const { loadEnvConfig } = require('@next/env');

// Load environment variables exactly like Next.js does
const projectDir = process.cwd();
loadEnvConfig(projectDir);

// Hostinger's Node.js environment passes the port via process.env.PORT
const port = process.env.PORT || 3000;
const dev = process.env.NODE_ENV === 'development';

const app = next({ dev, port });
const handle = app.getRequestHandler();

// MIME type map for serving static files directly
const MIME_TYPES = {
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.webp': 'image/webp',
  '.webm': 'video/webm',
  '.mp4': 'video/mp4',
  '.map': 'application/json',
};

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      const { pathname } = parsedUrl;

      // Serve static files from .next/static directly
      // This bypasses any reverse proxy issues on Hostinger
      if (pathname.startsWith('/_next/static/')) {
        const filePath = path.join(projectDir, '.next', 'static', pathname.replace('/_next/static/', ''));
        
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const ext = path.extname(filePath).toLowerCase();
          const contentType = MIME_TYPES[ext] || 'application/octet-stream';
          
          res.setHeader('Content-Type', contentType);
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
          res.setHeader('X-Content-Type-Options', 'nosniff');
          
          const stream = fs.createReadStream(filePath);
          stream.pipe(res);
          return;
        }
      }

      // Serve public directory files directly
      if (pathname.startsWith('/') && !pathname.startsWith('/api') && !pathname.startsWith('/_next')) {
        const publicFile = path.join(projectDir, 'public', pathname);
        if (fs.existsSync(publicFile) && fs.statSync(publicFile).isFile()) {
          const ext = path.extname(publicFile).toLowerCase();
          const contentType = MIME_TYPES[ext] || 'application/octet-stream';
          
          res.setHeader('Content-Type', contentType);
          res.setHeader('Cache-Control', 'public, max-age=86400');
          
          const stream = fs.createReadStream(publicFile);
          stream.pipe(res);
          return;
        }
      }

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
