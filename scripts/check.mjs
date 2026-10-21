// Static checks on dist/: internal links resolve, SEO tags present, no external resource URLs.
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { validateFlow } from '../src/config/flows3d.mjs';
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
for (const f of ['dist/favicon.ico', 'dist/favicon-48.png', 'dist/favicon-192.png', 'dist/apple-touch-icon.png', 'dist/logo-512.png', 'dist/site.webmanifest']) if (!existsSync(f)) fail(`${f} missing`);
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
  { const ids = [...s.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]); const dup = ids.filter((x, i) => ids.indexOf(x) !== i); if (dup.length) fail(`${f} duplicate ids: ${[...new Set(dup)].slice(0, 4).join(', ')}`); }
  const csp = (s.match(/Content-Security-Policy" content="([^"]+)"/) || [])[1] || '';
  for (const h of csp.matchAll(/https?:\/\/[^\s;&]+/g)) if (!/^https:\/\//.test(h[0])) fail(`${f} CSP allows non-HTTPS host ${h[0]}`);
}
// v3.0.0 3D assertions: flow data is valid, engine scripts load only where needed and in the right order, engine code stays private and small.
const unesc = (v) => v.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
let flowCount = 0;
for (const f of html) {
  const s = readFileSync(f, 'utf8'), hasRing = s.includes('class="ring3d"'), hasFlow = s.includes('class="flow3d"');
  const order = [...s.matchAll(/src="\/assets\/([a-z0-9-]+)\.js/g)].map((m) => m[1]), has = (n) => order.includes(n);
  if ((hasRing || hasFlow) && !has('gl-core')) fail(`${f} has 3D content but no gl-core.js`);
  if (hasRing && !has('gl-galaxy')) fail(`${f} has a 3D map but no gl-galaxy.js`);
  if (hasFlow && !has('gl-flow')) fail(`${f} has a 3D flow but no gl-flow.js`);
  if (!hasRing && !hasFlow && order.some((n) => n.startsWith('gl-'))) fail(`${f} loads 3D engine scripts without any 3D content`);
  if (order.some((n) => n.startsWith('gl-')) && order.indexOf('site') < order.reduce((m, n, i) => (n.startsWith('gl-') ? i : m), -1)) fail(`${f} must load gl-*.js before site.js`);
  for (const m of s.matchAll(/class="flow3d" data-f="([^"]*)"/g)) { flowCount++; try { validateFlow(JSON.parse(unesc(m[1])), f); } catch (e) { fail(`${f} bad flow data: ${e.message}`); } }
}
const glFiles = files.filter((x) => /assets[\\/]gl-[a-z]+\.js$/.test(x)); let glBytes = 0;
const privacy = /fetch\s*\(|localStorage|sessionStorage|indexedDB|toDataURL|toBlob|getImageData|readPixels|WEBGL_debug_renderer_info|UNMASKED_|https?:\/\/|document\.referrer|navigator\.(userAgent|platform|languages)/;
for (const g of glFiles) { const src = readFileSync(g, 'utf8'); glBytes += src.length; if (privacy.test(src)) fail(`${g} uses a network, storage, readback or fingerprinting API`); if (src.length > 70000) fail(`${g} is over the 70 KB budget (${src.length})`); }
if (glBytes > 150000) fail(`3D engine total ${glBytes} bytes is over the 150 KB budget`);
if (glFiles.length !== 3) fail(`expected 3 engine files, found ${glFiles.length}`);
console.log(`3D checks: ${flowCount} flow blocks validated, engine ${glBytes} bytes in ${glFiles.length} files`);
console.log(`security assertions done, ${bad} total problems`); process.exit(bad ? 1 : 0);

