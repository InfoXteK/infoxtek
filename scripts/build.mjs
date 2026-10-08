import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, existsSync } from 'node:fs';
import { site, contact, nav, platforms, services, reasons, industries, bookings, resources, testimonials } from '../src/config/site.mjs';

const VERSION = JSON.parse(readFileSync('package.json', 'utf8')).version;
const OUT = 'dist';
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
const ld = (o) => JSON.stringify(o).replace(/</g, '\\u003c');
const url = (p) => site.url + p;
if (contact.formEndpoint && !contact.formEndpoint.startsWith('https://')) throw new Error('formEndpoint must be https');
const origin = contact.formEndpoint ? new URL(contact.formEndpoint).origin : '';

const csp = ["default-src 'self'", "script-src 'self'", "style-src 'self'", "img-src 'self' data:", "font-src 'self'",
  `connect-src 'self' ${origin}`.trim(), "object-src 'none'", "base-uri 'self'", `form-action 'self' ${origin}`.trim()].join('; ');

const ICONS = { cloud: 'M7 18a4 4 0 010-8 5 5 0 019.6-1A4.5 4.5 0 0117 18z', desktop: 'M3 5h18v11H3zM8 20h8M12 16v4', gear: 'M12 8a4 4 0 100 8 4 4 0 000-8zM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M19 5l-2 2M7 17l-2 2', network: 'M12 4a2 2 0 100 4 2 2 0 000-4zM5 16a2 2 0 100 4 2 2 0 000-4zM19 16a2 2 0 100 4 2 2 0 000-4zM12 8v4M12 12l-6 4M12 12l6 4', shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z', lock: 'M6 11h12v9H6zM8 11V8a4 4 0 018 0v3', chat: 'M4 5h16v11H9l-5 4z' };
const icon = (n) => `<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="${ICONS[n] || ICONS.cloud}"/></svg>`;
const pages = [];
const page = (path, title, description, body, crumbs = []) => pages.push({ path, title, description, body, crumbs });
const head = (t, s = '') => `<section class="band"><div class="wrap"><h1>${esc(t)}</h1>${s ? `<p class="lead">${esc(s)}</p>` : ''}</div></section>`;
const cta = `<section class="cta"><div class="wrap"><h2>Talk to us about your IT</h2><p>Tell us what you need and we will suggest a sensible next step.</p><a class="btn" href="/contact/">Request a consultation</a></div></section>`;
const reasonList = `<ol class="reasons">${reasons.map((r) => `<li><strong>${esc(r.title)}</strong><span>${esc(r.text)}</span></li>`).join('')}</ol>`;
const cards = (arr, fn) => `<div class="grid">${arr.map(fn).join('')}</div>`;

page('/', `${site.name} | ${site.tagline}`, site.description, `
<section class="hero"><div class="wrap hero-grid">
<div><h1>${esc(site.tagline)}</h1><p class="lead">${esc(site.description)}</p>
<p class="actions"><a class="btn" href="/contact/">Request a consultation</a><a class="btn ghost" href="/services/">See our services</a></p></div>
<div class="art"><svg viewBox="0 0 320 260" aria-hidden="true"><g class="orbit"><circle cx="160" cy="130" r="100"/><circle cx="160" cy="130" r="62"/></g><g class="nodes"><circle cx="160" cy="30" r="9"/><circle cx="260" cy="130" r="9"/><circle cx="160" cy="230" r="9"/><circle cx="60" cy="130" r="9"/><circle cx="222" cy="68" r="7"/><circle cx="98" cy="192" r="7"/></g><path class="core" d="M160 96l34 14v26c0 22-15 36-34 42-19-6-34-20-34-42v-26z"/></svg></div><ul class="stack" aria-label="What we manage">${services.map((s) => `<li><a href="/services/${s.slug}/">${esc(s.title)}</a></li>`).join('')}</ul>
</div></section>
<section class="vendors"><div class="wrap"><p>Platforms we design, deploy and support</p><div class="chips">${platforms.map((v) => `<span>${v}</span>`).join('')}</div></div></section>
<section class="sec"><div class="wrap"><h2>Our services</h2>${cards(services, (s) => `<article class="card rv">${icon(s.icon)}<h3><a href="/services/${s.slug}/">${esc(s.title)}</a></h3><p>${esc(s.summary)}</p></article>`)}</div></section>
<section class="sec alt"><div class="wrap"><h2>Why organizations choose us</h2>${reasonList}</div></section>
${testimonials.length ? `<section class="sec"><div class="wrap"><h2>What clients say</h2>${cards(testimonials, (t) => `<blockquote class="card"><p>${esc(t.quote)}</p><footer>${esc(t.name)}, ${esc(t.role)}</footer></blockquote>`)}</div></section>` : ''}
${cta}`);

page('/why-choose-us/', `Why Choose Us | ${site.name}`, 'Experienced, proactive and tailored IT support built for long-term partnerships.',
  `${head('Why choose us', 'Five reasons clients stay with us.')}<section class="sec"><div class="wrap">${reasonList}</div></section>${cta}`, [['Why Choose Us', '/why-choose-us/']]);

page('/services/', `Our Services | ${site.name}`, 'Cloud, managed IT, network, disaster recovery and consulting services from InfoXtek.',
  `${head('Our services', 'Six service areas, one accountable team.')}<section class="sec"><div class="wrap">${cards(services, (s) => `<article class="card rv">${icon(s.icon)}<h2><a href="/services/${s.slug}/">${esc(s.title)}</a></h2><p>${esc(s.summary)}</p></article>`)}</div></section>${cta}`, [['Our Services', '/services/']]);
for (const s of services) {
  page(`/services/${s.slug}/`, `${s.title} | ${site.name}`, s.summary,
    `<section class="band"><div class="wrap">${icon(s.icon)}<h1>${esc(s.title)}</h1><p class="lead">${esc(s.summary)}</p></div></section>
<section class="sec"><div class="wrap two"><div class="rv"><h2>How we deliver it</h2><p>${esc(s.intro)}</p><ol class="steps">${s.steps.map((t) => `<li>${esc(t)}</li>`).join('')}</ol></div>
<aside class="rv"><h2>Outcomes</h2><ul class="ticks">${s.outcomes.map((o) => `<li>${esc(o)}</li>`).join('')}</ul></aside></div></section>
<section class="sec"><div class="wrap rv"><h2>What we do</h2><ul class="ticks cols">${s.caps.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></div></section>
<section class="sec alt"><div class="wrap"><h2>Technology we work with</h2><div class="grid">${s.stacks.map((g) => `<div class="card rv"><h3>${esc(g.g)}</h3><p class="chips">${g.i.map((x) => `<span>${esc(x)}</span>`).join('')}</p></div>`).join('')}</div><p class="note">Product names are trademarks of their owners and are listed to describe the platforms we support.</p></div></section>${cta}`,
    [['Our Services', '/services/'], [s.title, `/services/${s.slug}/`]]);
}

page('/industries/', `Industries | ${site.name}`, 'IT services for agriculture, banking and financial services, education, energy and utilities, and government.',
  `${head('Industries we serve', 'Every sector has its own risks and rules.')}<section class="sec"><div class="wrap">${cards(industries, (i) => `<article class="card"><h2>${esc(i.name)}</h2><p>${esc(i.summary)}</p></article>`)}</div></section>${cta}`, [['Industries', '/industries/']]);

page('/tools-tips/', `Tools & Tips | ${site.name}`, 'Practical IT resources and tips from InfoXtek.',
  `${head('Tools and tips', 'Practical IT resources.')}<section class="sec"><div class="wrap narrow">${resources.length
    ? `<ul class="list">${resources.map((r) => `<li><a href="${esc(r.href)}">${esc(r.title)}</a><p>${esc(r.text)}</p></li>`).join('')}</ul>`
    : '<p class="note">No resources have been published yet. Add entries to <code>resources</code> in <code>src/config/site.mjs</code>.</p>'}</div></section>`, [['Tools & Tips', '/tools-tips/']]);

page('/book-online/', `Book Online | ${site.name}`, 'Request IT support, software implementation, home entertainment setup or remote tech support.',
  `${head('Book online', 'Choose the service you need, then send us a request.')}<section class="sec"><div class="wrap">${cards(bookings, (b) => `<article class="card"><h2>${esc(b.title)}</h2><p>${esc(b.text)}</p><a class="btn small" href="/contact/?service=${encodeURIComponent(b.title)}">Request this service</a></article>`)}<p class="note">Online scheduling and pricing are not connected yet. Requests go through the contact form.</p></div></section>`, [['Book Online', '/book-online/']]);

const details = [contact.email && `<li>Email: <a href="mailto:${esc(contact.email)}">${esc(contact.email)}</a></li>`, contact.phone && `<li>Phone: ${esc(contact.phone)}</li>`, contact.address && `<li>Address: ${esc(contact.address)}</li>`].filter(Boolean);
page('/contact/', `Contact Us | ${site.name}`, 'Contact InfoXtek to discuss your IT needs.',
  `${head('Contact us', 'Tell us about your project or problem.')}<section class="sec"><div class="wrap two">
<form id="contact-form" novalidate${contact.formEndpoint ? ` data-endpoint="${esc(contact.formEndpoint)}"` : ''}>
<label for="name">Name</label><input id="name" name="name" autocomplete="name" required maxlength="120"><p class="err" id="name-e" hidden></p>
<label for="email">Email</label><input id="email" name="email" type="email" autocomplete="email" required maxlength="160"><p class="err" id="email-e" hidden></p>
<label for="service">Service</label><select id="service" name="service"><option value="">General enquiry</option>${[...services.map((s) => s.title), ...bookings.map((b) => b.title)].map((t) => `<option>${esc(t)}</option>`).join('')}</select>
<label for="message">Message</label><textarea id="message" name="message" rows="5" required maxlength="2000"></textarea><p class="err" id="message-e" hidden></p>
<p class="hp" aria-hidden="true"><label>Leave empty <input name="website" tabindex="-1" autocomplete="off"></label></p>
<button class="btn" type="submit">Send message</button><p id="status" role="status"></p></form>
<aside><h2>Details</h2>${details.length ? `<ul class="list">${details.join('')}</ul>` : '<p class="note">Company contact details have not been added yet.</p>'}</aside></div></section>`, [['Contact Us', '/contact/']]);

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
<meta name="theme-color" content="#3b4cca"><link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/assets/site.css?v=${VERSION}">
<script type="application/ld+json">${ld(jsonld)}</script></head>
<body><a class="skip" href="#main">Skip to content</a>
<header class="top"><div class="wrap bar"><a class="logo" href="/">${esc(site.name)}</a>
<button class="menu" aria-expanded="false" aria-controls="nav">Menu</button>
<nav id="nav" aria-label="Main">${nav.map((n) => `<a href="${n.path}"${cur(n.path)}>${esc(n.label)}</a>`).join('')}<a class="btn small" href="/book-online/"${cur('/book-online/')}>Book Online</a></nav></div></header>
${p.crumbs.length ? `<nav class="crumbs wrap" aria-label="Breadcrumb">${crumbs.map((c, i) => (i < crumbs.length - 1 ? `<a href="${c[1]}">${esc(c[0])}</a>` : `<span aria-current="page">${esc(c[0])}</span>`)).join(' / ')}</nav>` : ''}
<main id="main">${p.body}</main>
<footer class="foot"><div class="wrap"><strong>${esc(site.name)}</strong><p>${esc(site.description)}</p><p class="small-print">&copy; ${new Date().getUTCFullYear()} ${esc(site.name)}. Version ${VERSION}.</p></div></footer>
<script src="/assets/site.js?v=${VERSION}" defer></script></body></html>`;
};

rmSync(OUT, { recursive: true, force: true });
mkdirSync(`${OUT}/assets`, { recursive: true });
for (const p of pages) {
  const dir = p.path === '/' ? OUT : `${OUT}${p.path}`;
  mkdirSync(dir, { recursive: true });
  writeFileSync(`${dir}/index.html`, layout(p));
}
writeFileSync(`${OUT}/404.html`, layout({ path: '/404/', noindex: true, title: `Page not found | ${site.name}`, description: 'Page not found.', crumbs: [], body: `${head('Page not found', 'That page does not exist or has moved.')}<section class="sec"><div class="wrap"><a class="btn" href="/">Back to home</a></div></section>` }));
cpSync('src/assets', `${OUT}/assets`, { recursive: true });
if (existsSync('public')) cpSync('public', OUT, { recursive: true });
const day = new Date().toISOString().slice(0, 10);
writeFileSync(`${OUT}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${pages.map((p) => `<url><loc>${url(p.path)}</loc><lastmod>${day}</lastmod></url>`).join('\n')}\n</urlset>\n`);
writeFileSync(`${OUT}/robots.txt`, `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`);
console.log(`Built ${pages.length} pages + 404 -> ${OUT}/ (v${VERSION})`);
