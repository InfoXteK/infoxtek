// Static checks on dist/: internal links resolve, SEO tags present, no external resource URLs.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
const walk = (d) => readdirSync(d).flatMap((n) => { const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p]; });
const files = walk('dist'), html = files.filter((f) => f.endsWith('.html')); let bad = 0;
const fail = (m) => { console.error('FAIL', m); bad++; };
for (const f of html) {
  const s = readFileSync(f, 'utf8');
  for (const t of ['<title>', 'name="description"', 'rel="canonical"', 'og:title', 'lang="']) if (!s.includes(t)) fail(`${f} missing ${t}`);
  if ((s.match(/<h1[ >]/g) || []).length !== 1) fail(`${f} needs exactly one h1`);
  for (const m of s.matchAll(/(?:href|src)="([^"]+)"/g)) {
    const u = m[1];
    if (/^(mailto:|#)/.test(u)) continue;
    if (/^https?:\/\//.test(u)) { if (!/^https:\/\/(infoXtek\.com|github\.com\/InfoXteK\/)/i.test(u)) fail(`${f} external ref ${u}`); continue; }
    const path = u.split(/[?#]/)[0]; const t = join('dist', path);
    if (!(existsSync(t) && (!statSync(t).isDirectory() || existsSync(join(t, 'index.html'))))) fail(`${f} broken link ${u}`);
  }
}
console.log(`${html.length} html files checked, ${bad} problems`);
// v2.6.0 security assertions
const bannedSinks = /\beval\s*\(|new Function|document\.write|\.innerHTML\s*=|insertAdjacentHTML|sendBeacon|XMLHttpRequest|WebSocket|document\.cookie|\bimport\s*\(/;
for (const f of files.filter((x) => /\.(js|mjs)$/.test(x))) if (bannedSinks.test(readFileSync(f, 'utf8'))) fail(`${f} uses a banned sink`);
for (const f of html) {
  const s = readFileSync(f, 'utf8');
  if (!s.includes('Content-Security-Policy')) fail(`${f} missing CSP`);
  if (!s.includes('name="referrer"')) fail(`${f} missing referrer policy`);
  if (/\sstyle\s*=\s*["']/i.test(s)) fail(`${f} has inline style attribute (blocked by CSP)`);
  if (/\son[a-z]+\s*=\s*["']/i.test(s)) fail(`${f} has inline event handler`);
  if (/<script(?![^>]*\bsrc=)[^>]*>(?!\s*<\/script>)/i.test(s.replace(/<script[^>]*type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, ''))) fail(`${f} has inline script`);
  for (const m of s.matchAll(/<a [^>]*target="_blank"[^>]*>/g)) if (!/rel="[^"]*noopener/.test(m[0])) fail(`${f} target=_blank without noopener`);
  const csp = (s.match(/Content-Security-Policy" content="([^"]+)"/) || [])[1] || '';
  for (const h of csp.matchAll(/https?:\/\/[^\s;&]+/g)) if (!/^https:\/\//.test(h[0])) fail(`${f} CSP allows non-HTTPS host ${h[0]}`);
}
console.log(`security assertions done, ${bad} total problems`); process.exit(bad ? 1 : 0);

