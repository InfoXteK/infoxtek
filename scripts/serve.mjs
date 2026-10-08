import { createServer } from 'node:http';
import { readFileSync, existsSync, statSync } from 'node:fs';
import { join, extname, normalize } from 'node:path';
const RESERVED = new Set([80, 443, 3306, 5432, 8080]);
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.xml': 'application/xml', '.txt': 'text/plain' };
const root = join(process.cwd(), 'dist');
const handler = (req, res) => {
  let p = normalize(decodeURIComponent(new URL(req.url, 'http://x').pathname)).replace(/^(\.\.[/\\])+/, '');
  let f = join(root, p);
  if (existsSync(f) && statSync(f).isDirectory()) f = join(f, 'index.html');
  if (!f.startsWith(root) || !existsSync(f)) { res.writeHead(404, { 'content-type': 'text/html' }); return res.end(readFileSync(join(root, '404.html'))); }
  res.writeHead(200, { 'content-type': types[extname(f)] || 'application/octet-stream' }); res.end(readFileSync(f));
};
let port = Number(process.env.PORT || 3000);
const tryListen = () => {
  while (RESERVED.has(port)) port++;
  const s = createServer(handler);
  s.once('error', (e) => { if (e.code === 'EADDRINUSE' || e.code === 'EACCES') { port++; tryListen(); } else throw e; });
  s.listen(port, '127.0.0.1', () => console.log(`Serving dist/ at http://127.0.0.1:${port}`));
};
tryListen();
