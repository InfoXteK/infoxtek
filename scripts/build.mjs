import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, existsSync } from 'node:fs';
import { scenes, custom } from '../src/config/scenes.mjs';
import { K, nn } from '../src/config/kit.mjs';
import { envs, pageEnv } from '../src/config/envs.mjs';
import { site, contact, nav, platforms, services, reasons, industries, bookings, resources, testimonials, tips, products, platformInfo , netMonitVersions, netMonitOlderOption } from '../src/config/site.mjs';
import { reasonDetails, industryDetails, tipDetails } from '../src/config/details.mjs';

const VERSION = JSON.parse(readFileSync('package.json', 'utf8')).version;
const OUT = 'dist';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const ld = (o) => JSON.stringify(o).replace(/</g, '\\u003c');
const url = (p) => site.url + p;
if (contact.formEndpoint && !contact.formEndpoint.startsWith('https://')) throw new Error('formEndpoint must be https');
const origin = contact.formEndpoint ? new URL(contact.formEndpoint).origin : '';

const csp = ["default-src 'self'", "script-src 'self'", "style-src 'self'", "img-src 'self' data:", "font-src 'self'",
  `connect-src 'self' ${origin}`.trim(), "object-src 'none'", "base-uri 'self'", `form-action 'self' ${origin}`.trim()].join('; ');

const ICONS = { cloud: 'M7 18a4 4 0 010-8 5 5 0 019.6-1A4.5 4.5 0 0117 18z', desktop: 'M3 5h18v11H3zM8 20h8M12 16v4', gear: 'M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2', network: 'M12 4a2 2 0 100 4 2 2 0 000-4zM5 16a2 2 0 100 4 2 2 0 000-4zM19 16a2 2 0 100 4 2 2 0 000-4zM12 8v4M12 12l-6 4M12 12l6 4', shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z', lock: 'M6 11h12v9H6zM8 11V8a4 4 0 018 0v3', chat: 'M4 5h16v11H9l-5 4z', chip: 'M7 7h10v10H7zM9 3v4M15 3v4M9 17v4M15 17v4M3 9h4M3 15h4M17 9h4M17 15h4', code: 'M8 7l-5 5 5 5M16 7l5 5-5 5M14 5l-4 14', phone: 'M8 3h8v18H8zM11 18h2', globe: 'M12 3a9 9 0 100 18 9 9 0 000-18zM3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18', search: 'M10 4a6 6 0 100 12 6 6 0 000-12zM15 15l5 5', megaphone: 'M4 10v4h3l8 4V6L7 10zM18 9v6', cart: 'M3 4h3l2 11h10l2-8H7', server: 'M4 4h16v6H4zM4 14h16v6H4zM8 7h.01M8 17h.01' };
const icon = (n) => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[n] || ICONS.cloud}"/></svg>`;
const colr = { r: '#d64545', g: '#0e9aa7', b: '#3b4cca' };
const sceneSvg = (sc, title, slug) => {
  const W = 124, H = 40, n = sc.n;
  const lines = sc.f.map(([r]) => r.slice(1).map((b, k) => `<line x1="${n[r[k]][1]}" y1="${n[r[k]][2]}" x2="${n[b][1]}" y2="${n[b][2]}"/>`).join('')).join('');
  const boxes = n.map(([t, x, y, k = 'n']) => `<g class="nd ${k}"><rect x="${x - W / 2}" y="${y - H / 2}" width="${W}" height="${H}" rx="9"/><text x="${x}" y="${y + 4}" text-anchor="middle">${esc(t)}</text></g>`).join('');
  const pk = sc.f.map(([r, c], i) => `<circle r="5" fill="${colr[c]}"><animateMotion dur="${(1.5 * (r.length - 1) + 0.4).toFixed(1)}s" begin="${(i * 0.6).toFixed(1)}s" repeatCount="indefinite" path="M${r.map((j) => `${n[j][1]},${n[j][2]}`).join(' L')}"/></circle>`).join('');
  return `<div class="scene rv" data-t="0.12,0.37,0.62,0.87"><div class="deep"><svg class="envl c2" viewBox="0 0 640 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${(envs[slug] || (() => ''))()}</svg><svg class="main" viewBox="0 0 640 300" role="img" aria-label="${esc(title)} scenario animation"><g class="lk">${lines}</g>${boxes}${pk}</svg></div><ul class="logs" aria-hidden="true">${sc.l.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>`;
};
const styleMap = { '/': 'bento', '/why-choose-us/': 'minimal', '/industries/': 'flat', '/tools-tips/': 'clay', '/book-online/': 'material', '/contact/': 'neumorphism',
  '/services/': 'fluent', '/products/': 'glass', '/services/cloud-solutions/': 'glass', '/services/cloud-desktop/': 'fluent', '/services/managed-it/': 'material', '/services/network-solutions/': 'bento', '/services/disaster-recovery/': 'skeuo',
  '/services/cyber-security/': 'cyber', '/services/support-consulting/': 'minimal', '/services/web-applications/': 'neumorphism', '/services/ai-solutions/': 'liquid', '/services/mobile-applications/': 'liquid', '/services/web-design-development/': 'maximal',
  '/services/seo/': 'flat', '/services/digital-marketing/': 'brutal', '/services/full-stack-apps/': 'oled', '/services/ecommerce/': 'clay', '/services/hosting-maintenance/': 'material' };
const customScene = (c, title, ev) => `<div class="scene rv" data-t="${(c.t || [0.12, 0.37, 0.62, 0.87]).join(',')}"><div class="deep"><svg class="envl c2" viewBox="0 0 640 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${((typeof ev === 'function' ? ev : envs[ev]) || (() => ''))()}</svg><svg class="main" viewBox="0 0 640 300" role="img" aria-label="${esc(title)} scenario animation">${layered(c.d(K))}</svg></div><ul class="logs" aria-hidden="true">${c.l.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div>`;
const accents = { 'cloud-solutions': ['#1e6fd9', '#00a6b8'], 'cloud-desktop': ['#0f6cbd', '#2b88d8'], 'managed-it': ['#3949ab', '#1f9d8f'], 'network-solutions': ['#00796b', '#3949ab'], 'disaster-recovery': ['#b45309', '#475569'], 'support-consulting': ['#334155', '#0e9aa7'], 'web-applications': ['#6d28d9', '#0284c7'], 'mobile-applications': ['#be185d', '#6d28d9'], 'web-design-development': ['#c2410c', '#be185d'], 'seo': ['#15803d', '#1d4ed8'], 'digital-marketing': ['#be123c', '#b45309'], 'ecommerce': ['#be185d', '#b45309'], 'hosting-maintenance': ['#0369a1', '#15803d'], 'ai-solutions': ['#6d28d9', '#0891b2'] };
const layered = (m) => { const re = /<line class="ln[^>]*>.*?<\/line>/gs; return (m.match(re) || []).join('') + m.replace(re, ''); };
const short = (s, n = 62) => (s.length <= n ? s : s.slice(0, s.lastIndexOf(' ', n)) + '...');
const vOpt = (v) => `${v.label}${v.status === 'latest' ? ' (latest)' : ''}`;
const verPanels = () => `<div class="vctl"><label for="vsel">Choose a Net-Monit version</label><select id="vsel" aria-controls="vpanels">${netMonitVersions.map((v) => `<option value="${esc(v.id)}">${esc(vOpt(v))}</option>`).join('')}</select></div><div id="vpanels">${netMonitVersions.map((v) => `<div class="vpanel" data-v="${esc(v.id)}"><h3>Net-Monit ${esc(v.label)} <span class="vbadge${v.status === 'latest' ? ' on' : ''}">${v.status === 'latest' ? 'Latest' : 'Previous'}</span></h3><p>${esc(v.note)}</p><p><a class="btn" href="${esc(v.repo)}">Get ${esc(v.label)} on GitHub</a> <a class="btn ghost" href="/contact/?v=${encodeURIComponent(v.id)}#license">Request a ${esc(v.label)} license</a></p></div>`).join('')}</div>`;
const verTable = () => `<section class="sec alt" id="net-monit-versions"><div class="wrap"><h2>Net-Monit versions</h2><div class="tablewrap"><table class="vtable"><thead><tr><th scope="col">Version</th><th scope="col">Status</th><th scope="col">Get it</th><th scope="col">License</th></tr></thead><tbody>${netMonitVersions.map((v) => `<tr><th scope="row">${esc(v.label)}</th><td>${v.status === 'latest' ? 'Latest' : 'Previous'}</td><td><a href="${esc(v.repo)}">GitHub</a></td><td><a href="/contact/?v=${encodeURIComponent(v.id)}#license">Request key</a></td></tr>`).join('')}</tbody></table></div></div></section>`;
const dtls = (id, groups) => { const all = groups.flatMap((g, gi) => g.items.map((x, xi) => ({ g, gi, x, xi }))).filter((o) => o.x.det); if (!all.length) return ''; return `<div class="dtls">${all.map(({ g, gi, x, xi }) => { const did = `d-${id}-${gi}-${xi}`, d = x.det; return `<article class="dtl" id="${did}" aria-labelledby="${did}-h" data-g="${gi}" data-i="${xi}"><div class="dtl-in"><p class="dtl-k">${esc(g.name)}</p><h3 id="${did}-h" tabindex="-1">${esc(x.t)}</h3><p class="dtl-lead">${esc(d.intro)}</p><div class="dtl-grid">${d.points.map(([a, b]) => `<div class="dtl-pt"><b>${esc(a)}</b><p>${esc(b)}</p></div>`).join('')}</div>${d.example ? `<p class="dtl-ex">${esc(d.example)}</p>` : ''}${d.links && d.links.length ? `<p class="dtl-links">${d.links.map(([a, h]) => `<a class="btn" href="${h}">${esc(a)}</a>`).join('')}</p>` : ''}<p class="dtl-nav"><button type="button" data-a="prev">&lsaquo; Previous</button><button type="button" data-a="map">Back to 3D map</button><button type="button" data-a="next">Next &rsaquo;</button></p></div></article>`; }).join('')}</div>`; };
const ring3d = (id, groups) => `<div class="ring3d" id="${id}"><div class="tabs" role="tablist">${groups.map((g, gi) => `<button type="button" role="tab" aria-selected="${gi === 0}" data-g="${gi}">${esc(g.name)}</button>`).join('')}</div><div class="stage"><div class="rings">${groups.map((g, gi) => `<div class="ring${gi === 0 ? ' on' : ''}" data-g="${gi}">${g.items.map((x, xi) => `<a class="c3" ${x.det ? `href="#d-${id}-${gi}-${xi}" data-det="d-${id}-${gi}-${xi}"` : x.h ? `href="${x.h}"` : 'role="button"'} data-t="${esc(x.t)}" data-d="${esc(x.d)}">${x.i ? icon(x.i) : ''}<b>${esc(x.t)}</b><span>${esc(short(x.d))}</span></a>`).join('')}</div>`).join('')}</div><button class="nav prev" type="button" aria-label="Previous">&lsaquo;</button><button class="nav next" type="button" aria-label="Next">&rsaquo;</button></div><div class="sel" aria-live="polite"><div><h3></h3><p></p></div><a class="btn" hidden>Open</a></div><p class="tip">Drag the ring, use the arrow buttons or the left and right keys. Click the highlighted front card to open it.</p>${dtls(id, groups)}</div>`;
const svcItems = (g) => services.filter((s) => (s.grp || 'IT & Security') === g).map((s) => ({ t: s.title, d: s.summary, h: `/services/${s.slug}/`, i: s.icon }));
const svcRing = (id) => ring3d(id, ['IT & Security', 'Digital & Software'].map((g) => ({ name: g, items: svcItems(g) })));
const pages = [];
const page = (path, title, description, body, crumbs = []) => pages.push({ path, title, description, body, crumbs });
const head = (t, s = '', h = 0) => `<section class="band" data-h="${h}"><div class="wrap"><h1>${esc(t)}</h1>${s ? `<p class="lead">${esc(s)}</p>` : ''}</div></section>`;
const cta = `<section class="cta"><div class="wrap"><h2>Talk to us about your IT</h2><p>Tell us what you need and we will suggest a sensible next step.</p><a class="btn" href="/contact/">Request a consultation</a></div></section>`;
const reasonList = `<ol class="reasons">${reasons.map((r) => `<li><strong>${esc(r.title)}</strong><span>${esc(r.text)}</span></li>`).join('')}</ol>`;
const cards = (arr, fn) => `<div class="grid">${arr.map(fn).join('')}</div>`;

page('/', `${site.name} | ${site.tagline}`, site.description, `
<section class="hero"><div class="netbg" aria-hidden="true"></div><div class="floaters" role="group" aria-label="Draggable skill chips"><span>AI</span><span>ZERO TRUST</span><span>XDR</span><span>DLP</span><span>LLM</span><span>MFA</span><span>SIEM</span><span>EDR</span><span>CLOUD</span><span>BACKUP</span><span>NAC</span><span>INTUNE</span></div><p class="hint">Drag the floating skills around</p><div class="wrap hero-grid">
<div><h1>${esc(site.tagline)}</h1><p class="lead">${esc(site.description)}</p>
<p class="actions"><a class="btn" href="/contact/">Request a consultation</a><a class="btn ghost" href="/services/">See our services</a></p></div>

</div></section>
<section class="vendors"><div class="wrap"><p>Platforms we design, deploy and support: click a highlighted one to explore it</p><div class="chips">${platforms.map((v) => { const q = platformInfo.find((z) => z.chip === v); return q ? `<a href="/platforms/${q.slug}/">${v}</a>` : `<span>${v}</span>`; }).join('')}</div></div></section>
<section class="sec"><div class="wrap"><h2>Choose your service</h2>${svcRing('pick')}</div></section>
<section class="sec alt"><div class="wrap"><h2>Why organizations choose us</h2>${reasonList}</div></section>
${testimonials.length ? `<section class="sec"><div class="wrap"><h2>What clients say</h2>${cards(testimonials, (t) => `<blockquote class="card"><p>${esc(t.quote)}</p><footer>${esc(t.name)}, ${esc(t.role)}</footer></blockquote>`)}</div></section>` : ''}
${cta}`);

page('/why-choose-us/', `Why Choose Us | ${site.name}`, 'Experienced, proactive and tailored IT support built for long-term partnerships.',
  `${head('Why choose us', 'Five reasons clients stay with us.')}<section class="sec"><div class="wrap">${ring3d('why', [{ name: 'Five reasons', items: reasons.map((r) => ({ t: r.title, d: r.text, i: 'gear', det: reasonDetails[r.title] })) }])}</div></section>${cta}`, [['Why Choose Us', '/why-choose-us/']]);

page('/services/', `Our Services | ${site.name}`, 'Cloud, managed IT, network, disaster recovery and consulting services from InfoXteK.',
  `${head('Our services', 'IT, security and digital services from one accountable team.')}<section class="sec"><div class="wrap">${svcRing('pick2')}</div></section>${cta}`, [['Our Services', '/services/']]);
for (const [si, s] of services.entries()) {
  page(`/services/${s.slug}/`, `${s.title} | ${site.name}`, s.summary,
    `<section class="band" data-h="${si}"><div class="wrap">${icon(s.icon)}<h1>${esc(s.title)}</h1><p class="lead">${esc(s.summary)}</p></div></section>
<section class="sec"><div class="wrap"><h2>See it in action</h2>${custom[s.slug] ? customScene(custom[s.slug], s.title, s.slug) : sceneSvg(scenes[s.slug], s.title, s.slug)}<p class="note">Illustrative simulation of a typical scenario. Not live customer data.</p></div></section>
<section class="sec"><div class="wrap two"><div class="rv"><h2>How we deliver it</h2><p>${esc(s.intro)}</p><ol class="steps">${s.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol></div>
<aside class="rv"><h2>Outcomes</h2><ul class="ticks">${s.outcomes.map((o) => `<li>${esc(o)}</li>`).join('')}</ul></aside></div></section>
<section class="sec"><div class="wrap rv"><h2>What we do</h2><ul class="ticks cols">${s.caps.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div></section>
<section class="sec alt"><div class="wrap"><h2>Technology we work with</h2><div class="grid">${s.stacks.map((g) => `<div class="card rv"><h3>${esc(g.g)}</h3><p class="chips">${g.i.map((x) => `<span>${esc(x)}</span>`).join('')}</p></div>`).join('')}</div><p class="note">Product names are trademarks of their owners and are listed to describe the platforms we support.</p></div></section>${cta}`,
    [['Our Services', '/services/'], [s.title, `/services/${s.slug}/`]]);
}

page('/products/', `Products | ${site.name}`, 'Net-Monit network monitoring, PC Admin Tools and the iFiNeX expense app from InfoXteK.',
  `${head('Our products', 'Software we build and run ourselves.')}<section class="sec"><div class="wrap">${ring3d('prod', [{ name: 'Products', items: products.map((x) => ({ t: x.title, d: x.summary, h: x.page ? `/products/${x.slug}/` : (x.download || ''), i: x.icon })) }, { name: 'Platforms', items: platformInfo.map((x) => ({ t: x.name, d: x.tag, h: `/platforms/${x.slug}/`, i: 'shield' })) }])}<div class="gap"></div>${cards(products, (x) => `<article class="card rv" id="${x.slug}">${icon(x.icon)}<h2>${x.page ? `<a href="/products/${x.slug}/">${esc(x.title)}</a>` : esc(x.title)}</h2><p><strong>${esc(x.tag)}</strong></p><p>${esc(x.summary)}</p><ul class="ticks">${x.points.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>${x.page ? `<a class="btn" href="/products/${x.slug}/">Explore</a> <a class="btn ghost" href="${esc(x.download)}">GitHub</a>` : x.download ? `${x.howto ? `<p class="note">${esc(x.howto)}</p>` : ''}<a class="btn" href="${esc(x.download)}">Download from GitHub Releases</a>` : '<span class="btn ghost soon" aria-disabled="true">Download link coming soon</span>'}</article>`)}</div></section>${verTable()}${cta}`, [['Products', '/products/']]);
Object.assign(styleMap, { '/products/net-monit/': 'cyber', '/products/pc-admin-tools/': 'brutal', '/platforms/': 'flat' });
for (const x of products.filter((q) => q.page)) {
  const path = `/products/${x.slug}/`;
  page(path, `${x.title} | ${site.name}`, x.summary.slice(0, 155), `<section class="band" data-h="${x.slug.length}"><div class="wrap">${icon(x.icon)}<h1>${esc(x.title)}</h1><p class="lead">${esc(x.tag)}</p></div></section>
<section class="sec"><div class="wrap"><h2>How it works</h2>${customScene(custom[x.slug], x.title, pageEnv[path])}<p class="note">Illustrative simulation of a typical scenario. Not live data.</p></div></section>
<section class="sec alt"><div class="wrap two"><div class="rv"><h2>Overview</h2><p>${esc(x.summary)}</p><h3>Key features</h3><ul class="ticks">${x.features.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div><aside class="rv"><h2>Get it</h2>${x.slug === 'net-monit' ? verPanels() : `<p><a class="btn" href="${esc(x.download)}">View on GitHub</a></p>`}${x.start ? `<h3>Quick start</h3><ul class="ticks">${x.start.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : ''}<h3>Good to know</h3><ul class="ticks">${x.facts.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></aside></div></section>
${x.editions ? `<section class="sec"><div class="wrap"><h2>Editions</h2>${cards(x.editions, ([n, d]) => `<article class="card rv"><h3>${esc(n)}</h3><p>${esc(d)}</p></article>`)}</div></section>` : ''}${cta}`, [['Products', '/products/'], [x.title, path]]);
}
page('/platforms/', `Platforms | ${site.name}`, 'Explore the security and cloud platforms InfoXteK designs, deploys and supports.',
  `${head('Platforms we work with', 'Click a platform to see what it is, how it is secured and where AI is taking it.')}<section class="sec"><div class="wrap">${ring3d('plat', [{ name: 'Platforms', items: platformInfo.map((x) => ({ t: x.name, d: x.tag, h: `/platforms/${x.slug}/`, i: 'shield' })) }])}<p class="note">More platform pages are being added. Product names are trademarks of their owners; listing a platform does not imply a partnership.</p></div></section>${cta}`, [['Platforms', '/platforms/']]);
for (const x of platformInfo) {
  const path = `/platforms/${x.slug}/`; styleMap[path] = x.style;
  const rel = services.find((s) => s.slug === x.svc);
  page(path, `${x.name} | ${site.name}`, `${x.name}: ${x.tag}. What it is, how it is secured and its AI direction.`, `<section class="band" data-h="${x.slug.length}"><div class="wrap"><h1>${esc(x.name)}</h1><p class="lead">${esc(x.tag)}</p></div></section>
<section class="sec"><div class="wrap"><h2>What it does, in motion</h2>${customScene(custom[x.slug], x.name, pageEnv[path])}<p class="note">Illustrative simulation of a typical scenario. Not live data.</p></div></section>
<section class="sec alt"><div class="wrap"><div class="grid"><article class="card rv"><h3>What it is</h3><p>${esc(x.what)}</p></article><article class="card rv"><h3>Security</h3><ul class="ticks">${x.security.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></article><article class="card rv"><h3>AI direction</h3><ul class="ticks">${x.ai.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></article></div>${rel ? `<p>Related service: <a href="/services/${rel.slug}/">${esc(rel.title)}</a></p>` : ''}<p class="note">Summary for orientation only: check the vendor's documentation for current features. Product names are trademarks of their owners; InfoXteK does not claim a vendor partnership.</p></div></section>${cta}`, [['Platforms', '/platforms/'], [x.name, path]]);
}

page('/industries/', `Industries | ${site.name}`, 'IT services for agriculture, banking and financial services, education, energy and utilities, and government.',
  `${head('Industries we serve', 'Every sector has its own risks and rules.')}<section class="sec"><div class="wrap">${ring3d('ind', [{ name: 'Industries', items: industries.map((i) => ({ t: i.name, d: i.summary, i: 'shield', det: industryDetails[i.name] })) }])}</div></section>${cta}`, [['Industries', '/industries/']]);

page('/tools-tips/', `Tools & Tips | ${site.name}`, 'Practical cyber security, backup, AI and cloud tips from InfoXteK.',
  `${head('Tools and tips', 'Practical advice on security, recovery, AI and cloud.')}<section class="sec"><div class="wrap">${ring3d('tips', tips.map((g) => ({ name: g.g, items: g.i.map((x) => ({ t: x.t, d: x.d, i: 'shield', det: tipDetails[x.t] })) })))}${resources.length ? `<h2>Downloads</h2><ul class="list">${resources.map((r) => `<li><a href="${esc(r.href)}">${esc(r.title)}</a><p>${esc(r.text)}</p></li>`).join('')}</ul>` : ''}</div></section>${cta}`, [['Tools & Tips', '/tools-tips/']]);

page('/book-online/', `Book Online | ${site.name}`, 'Request IT support, software implementation, home entertainment setup or remote tech support.',
  `${head('Book online', 'Choose the service you need, then send us a request.')}<section class="sec"><div class="wrap">${cards(bookings, (b) => `<article class="card"><h2>${esc(b.title)}</h2><p>${esc(b.text)}</p><a class="btn small" href="/contact/?service=${encodeURIComponent(b.title)}">Request this service</a></article>`)}<p class="note">Online scheduling and pricing are not connected yet. Requests go through the contact form.</p></div></section>`, [['Book Online', '/book-online/']]);

const details = [contact.email && `<li>Email: <a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a></li>`, contact.phone && `<li>Phone: ${esc(contact.phone)}</li>`, contact.address && `<li>Address: ${esc(contact.address)}</li>`].filter(Boolean);
page('/contact/', `Contact Us | ${site.name}`, 'Contact InfoXteK to discuss your IT needs.',
  `${head('Contact us', 'Tell us about your project or problem.')}<section class="sec"><div class="wrap two">
<form id="contact-form" novalidate${contact.formEndpoint ? ` data-endpoint="${esc(contact.formEndpoint)}"` : ''}>
<label for="name">Name</label><input id="name" name="name" autocomplete="name" required maxlength="120"><p class="err" id="name-e" hidden></p>
<label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" required maxlength="160"><p class="err" id="email-e" hidden></p>
<label for="service">Service</label><select id="service" name="service"><option value="">General enquiry</option>${[...services.map((s) => s.title), ...bookings.map((b) => b.title)].map((t) => `<option>${esc(t)}</option>`).join('')}</select>
<label for="message">Message</label><textarea id="message" name="message" rows="5" required maxlength="2000"></textarea><p class="err" id="message-e" hidden></p>
<p class="hp" aria-hidden="true"><label>Leave empty <input name="website" tabindex="-1" autocomplete="off"></label></p>
<button class="btn" type="submit">Send message</button><p id="status" role="status"></p></form>
<aside><h2>Details</h2>${details.length ? `<ul class="list">${details.join('')}</ul>` : '<p class="note">Company contact details have not been added yet.</p>'}</aside></div></section>
<section class="sec alt" id="license"><div class="wrap two"><div><h2>Request a Net-Monit license</h2><p>Net-Monit licenses are free and issued by us. In Net-Monit open the License page (or Settings, then License), copy your Device ID and Activation Code, and send them here. Please use your corporate email address (free webmail addresses are not accepted). We reply by email with your key.</p><p class="note">Keys are tied to one installation. If you reinstall or move to a new folder you need a new key. Typical turnaround is 4 to 7 business days.</p></div>
<form id="license-form" novalidate data-mailto="${esc(contact.email || '')}" data-cc="${Buffer.from((contact.licenseCc || []).join(',')).toString('base64')}"${contact.formEndpoint ? ` data-endpoint="${esc(contact.formEndpoint)}"` : ''}>
<label for="lname">Name</label><input id="lname" name="lname" autocomplete="name" required maxlength="120"><p class="err" id="lname-e" hidden></p>
<label for="lemail">Corporate email</label><input id="lemail" name="lemail" type="email" autocomplete="email" required maxlength="160"><p class="err" id="lemail-e" hidden></p>
<label for="lcompany">Company</label><input id="lcompany" name="lcompany" autocomplete="organization" required maxlength="160"><p class="err" id="lcompany-e" hidden></p>
<label for="lversion">Net-Monit version</label><select id="lversion" name="lversion">${netMonitVersions.map((v) => `<option value="${esc(vOpt(v))}" data-v="${esc(v.id)}">${esc(vOpt(v))}</option>`).join("")}<option value="${esc(netMonitOlderOption)}">${esc(netMonitOlderOption)}</option></select>
<label for="los">Operating system</label><select id="los" name="los"><option>Windows</option><option>Linux</option></select>
<label for="ldevice">Device ID</label><input id="ldevice" name="ldevice" required maxlength="200" spellcheck="false"><p class="err" id="ldevice-e" hidden></p>
<label for="lactivation">Activation Code</label><input id="lactivation" name="lactivation" required maxlength="200" spellcheck="false"><p class="err" id="lactivation-e" hidden></p>
<p class="hp" aria-hidden="true"><label>Leave empty <input name="lwebsite" tabindex="-1" autocomplete="off"></label></p>
<button class="btn" type="submit">Request license</button><p id="lstatus" role="status"></p></form></div></section>`, [['Contact Us', '/contact/']]);

const envFor = (p) => envs[(p.path.match(/^\/services\/([^/]+)\/$/) || [])[1]] || pageEnv[p.path];
const withArt = (p) => { const e = envFor(p); return e ? p.body.replace(/(<section class="band"[^>]*>)/, `$1<svg class="bgart c2" viewBox="0 0 640 300" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${e()}</svg>`) : p.body; };
const brandize = (html) => { let skip = 0; return html.split(/(<[^>]+>)/).map((s) => { if (s[0] === '<') { if (/^<(script|style|title|svg)\b/i.test(s)) skip++; else if (/^<\/(script|style|title|svg)>/i.test(s)) skip--; return s; } return skip > 0 ? s : s.replace(/InfoXteK/g, 'Info<b class="bx">X</b>te<b class="bx">K</b>'); }).join(''); };
const layout = (p) => {
  const crumbs = [['Home', '/'], ...p.crumbs];
  const jsonld = [
    { '@context': 'https://schema.org', '@type': 'Organization', name: site.name, url: site.url },
    { '@context': 'https://schema.org', '@type': 'WebSite', name: site.name, url: site.url },
    ...(p.crumbs.length ? [{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c[0], item: url(c[1]) })) }] : []),
  ];
  const cur = (path) => (path === p.path || (path !== '/' && p.path.startsWith(path)) ? ' aria-current="page"' : '');
  return `<!doctype html>
<html lang="${site.locale}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="${esc(csp)}"><meta name="referrer" content="strict-origin-when-cross-origin">${p.noindex ? '<meta name="robots" content="noindex">' : ''}
<title>${esc(p.title)}</title><meta name="description" content="${esc(p.description)}"><link rel="canonical" href="${url(p.path)}">
<meta property="og:type" content="website"><meta property="og:site_name" content="${esc(site.name)}"><meta property="og:title" content="${esc(p.title)}"><meta property="og:description" content="${esc(p.description)}"><meta property="og:url" content="${url(p.path)}"><meta name="twitter:card" content="summary">
<meta name="theme-color" content="#3b4cca"><link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png"><link rel="icon" href="/favicon.png" sizes="128x128" type="image/png"><link rel="apple-touch-icon" href="/favicon.png"><link rel="stylesheet" href="/assets/site.css?v=${VERSION}">
<script type="application/ld+json">${ld(jsonld)}</script></head>
<body data-style="${styleMap[p.path] || 'flat'}" data-svc="${(p.path.match(/^\/services\/([^/]+)\/$/) || [])[1] || ''}"><a class="skip" href="#main">Skip to content</a>
<header class="top"><div class="wrap bar"><a class="logo" href="/" aria-label="${esc(site.name)} home"><img src="/assets/logo.png" width="34" height="44" alt=""><span>Info<b>X</b>te<b>K</b></span></a>
<button class="menu" aria-expanded="false" aria-controls="nav">Menu</button>
<nav id="nav" aria-label="Main">${nav.map((n) => `<a href="${n.path}"${cur(n.path)}>${esc(n.label)}</a>`).join('')}<a class="btn small" href="/book-online/"${cur('/book-online/')}>Book Online</a></nav></div></header>
${p.crumbs.length ? `<nav class="crumbs wrap" aria-label="Breadcrumb">${crumbs.map((c, i) => (i < crumbs.length - 1 ? `<a href="${c[1]}">${esc(c[0])}</a>` : `<span aria-current="page">${esc(c[0])}</span>`)).join(' / ')}</nav>` : ''}
<main id="main">${withArt(p)}</main>
<footer class="foot"><div class="wrap"><strong>${esc(site.name)}</strong><p>${esc(site.description)}</p><p class="small-print">&copy; ${new Date().getUTCFullYear()} ${esc(site.name)}. Version ${VERSION}.</p></div></footer>
<script src="/assets/site.js?v=${VERSION}" defer></script></body></html>`;
};

rmSync(OUT, { recursive: true, force: true });
mkdirSync(`${OUT}/assets`, { recursive: true });
for (const p of pages) {
  const dir = p.path === '/' ? OUT : `${OUT}${p.path}`;
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/index.html`, brandize(layout(p)));
}
writeFileSync(`${OUT}/404.html`, layout({ path: '/404/', noindex: true, title: `Page not found | ${site.name}`, description: 'Page not found.', crumbs: [], body: `${head('Page not found', 'That page does not exist or has moved.')}<section class="sec"><div class="wrap"><a class="btn" href="/">Back to home</a></div></section>` }));
cpSync('src/assets', `${OUT}/assets`, { recursive: true });
writeFileSync(`${OUT}/assets/site.css`, readFileSync(`${OUT}/assets/site.css`, 'utf8') + Object.entries(accents).map(([k, [a, b]]) => `body[data-svc="${k}"]{--indigo:${a};--indigo-d:${a};--teal:${b}}`).join('\n') + services.map((_, i) => `.band[data-h="${i}"]::before{filter:hue-rotate(${i * 22}deg)}`).join('\n'));
if (existsSync('public')) cpSync('public', OUT, { recursive: true });
const day = new Date().toISOString().slice(0, 10);
writeFileSync(`${OUT}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `<url><loc>${url(p.path)}</loc><lastmod>${day}</lastmod></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(`${OUT}/robots.txt`, `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
console.log(`Built ${pages.length} pages + 404 -> ${OUT}/ (v${VERSION})`);
