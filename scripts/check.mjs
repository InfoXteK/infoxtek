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
    if (/^https?:\/\//.test(u)) { if (!/^https:\/\/infoXtek\.com/.test(u)) fail(`${f} external ref ${u}`); continue; }
    const path = u.split(/[?#]/)[0]; const t = join('dist', path);
    if (!(existsSync(t) && (!statSync(t).isDirectory() || existsSync(join(t, 'index.html'))))) fail(`${f} broken link ${u}`);
  }
}
console.log(`${html.length} html files checked, ${bad} problems`); process.exit(bad ? 1 : 0);
