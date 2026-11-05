import http from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';

const root = resolve(process.argv.includes('--dist') ? 'dist' : '.');
const port = Number(process.env.PORT || 4175);
const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.jpg': 'image/jpeg', '.png': 'image/png', '.glb': 'model/gltf-binary', '.txt': 'text/plain; charset=utf-8', '.woff2': 'font/woff2' };

http.createServer(async (req, res) => {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, { Allow: 'GET, HEAD' });
      return res.end();
    }
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const relative = pathname === '/' ? 'index.html' : pathname.endsWith('/') ? `${pathname.slice(1)}index.html` : pathname.slice(1);
    // Only serve the landing page's public files, never local credentials or tooling.
    if (!/^(?:index\.html|style\.css|app\.js|favicon\.svg|assets\/[\w/.-]+|(?:showcases|playground|hidden)\/[\w/.-]+\.(?:html|css|js|svg|webp|jpg|png|jpeg|avif|woff2|woff|mp4|webm|glb|txt|json))$/.test(relative)) throw new Error('Not found');
    const filename = resolve(root, relative);
    if (!filename.startsWith(root + sep) || !(await stat(filename)).isFile()) throw new Error('Not found');
    const data = await readFile(filename);
    res.writeHead(200, { 'Content-Type': mime[extname(filename)] || 'application/octet-stream', 'Content-Length': data.length, 'Cache-Control': 'no-cache', 'X-Content-Type-Options': 'nosniff' });
    res.end(req.method === 'HEAD' ? undefined : data);
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Not found');
  }
}).listen(port, '127.0.0.1', () => console.log(`Coollab: http://127.0.0.1:${port}`));
