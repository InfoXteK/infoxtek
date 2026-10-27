const { chromium } = require('playwright');
const BASE = 'http://127.0.0.1:3021'; const R = {}; const errs = [];
const watch = (p) => { p.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errs.push(m.type() + ': ' + m.text().slice(0, 160)); }); p.on('pageerror', (e) => errs.push('pageerror: ' + e.message.slice(0, 160))); };
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const ctx = await b.newContext({ viewport: { width: 1100, height: 900 } }); const p = await ctx.newPage(); watch(p);
  // A: Net-Monit V11.3 in the license form and version list
  try {
    await p.goto(BASE + '/contact/?v=v11.3#license', { waitUntil: 'load' });
    R.A_license = await p.evaluate(() => { const s = [...document.querySelectorAll('select')].find((x) => [...x.options].some((o) => /V11\.3/.test(o.textContent))); return s ? { options: [...s.options].map((o) => o.textContent.trim()), selected: s.options[s.selectedIndex].textContent.trim() } : null; });
    await p.goto(BASE + '/products/net-monit/', { waitUntil: 'load' });
    R.A_product = await p.evaluate(() => ({ hasV113: /V11\.3/.test(document.body.textContent), repoLinks: [...document.querySelectorAll('a[href*="Net-Monit-V11_3"]')].length }));
    await p.goto(BASE + '/products/', { waitUntil: 'load' }); R.A_productsTable = await p.evaluate(() => /V11\.3/.test(document.body.textContent));
  } catch (e) { R.A_fail = e.message.slice(0, 200); }
  // B: removed texts
  try { await p.goto(BASE + '/', { waitUntil: 'load' }); R.B_homeHint = await p.evaluate(() => /Drag the floating skills/i.test(document.body.textContent)); } catch (e) { R.B_fail = e.message.slice(0, 200); }
  // C: services map: switcher inside the open panel, on-stage arrows, one click between items
  try {
    await p.goto(BASE + '/services/?q=0', { waitUntil: 'load' }); await p.waitForSelector('.ring3d[data-gl]');
    R.C_arrows = await p.evaluate(() => document.querySelectorAll('.gnav').length);
    await p.locator('.gchips button', { hasText: 'Cyber Security' }).first().click(); await p.waitForSelector('.dtl:not([hidden])');
    const h = () => p.evaluate(() => document.querySelector('.dtl:not([hidden]) h3').textContent);
    R.C_first = await h(); R.C_switch = await p.evaluate(() => { const s = document.querySelector('.dtl:not([hidden]) .dtl-switch'); const r = s.getBoundingClientRect(); return { pills: s.querySelectorAll('[data-a=go]').length, groups: s.querySelectorAll('[data-a=grp]').length, display: getComputedStyle(s).display, sticky: getComputedStyle(s).position }; });
    await p.locator('.dtl:not([hidden]) .dtl-switch [data-a=go]', { hasText: 'Disaster Recovery' }).click(); await p.waitForTimeout(400); R.C_afterPill = await h();
    await p.locator('.dtl:not([hidden]) .dtl-switch [data-a=grp]').nth(1).click(); await p.waitForTimeout(400); R.C_afterGroup = await h();
    await p.locator('.gnext').first().click(); await p.waitForTimeout(400); R.C_afterArrow = await h();
    await p.locator('.dtl:not([hidden]) .dtl-switch').first().scrollIntoViewIfNeeded(); await p.mouse.wheel(0, 700); await p.waitForTimeout(500);
    R.C_stickyWhileScrolled = await p.evaluate(() => { const r = document.querySelector('.dtl:not([hidden]) .dtl-switch').getBoundingClientRect(); return Math.round(r.top); });
  } catch (e) { R.C_fail = e.message.slice(0, 250); }
  // D: DR flow, failure step with its choreography
  try {
    await p.goto(BASE + '/services/disaster-recovery/?q=1', { waitUntil: 'load' }); await p.locator('.flow3d').scrollIntoViewIfNeeded();
    await p.waitForFunction(() => { const e = document.querySelector('.flow3d'); return e && e.dataset.gl === 'webgl2' && +e.dataset.frames >= 3; }, null, { timeout: 90000 });
    await p.click('.f3chips .f3c:nth-child(4)'); await p.waitForTimeout(4500);
    R.D_caption = (await p.textContent('.f3cap')).slice(0, 70);
    await p.locator('.f3stage').screenshot({ path: '/tmp/dr_fail.png' });
    await p.click('.f3chips .f3c:nth-child(5)'); await p.waitForTimeout(4500); await p.locator('.f3stage').screenshot({ path: '/tmp/dr_failover.png' });
    R.D_err = await p.getAttribute('.flow3d', 'data-err');
  } catch (e) { R.D_fail = e.message.slice(0, 250); }
  R.errs = errs.slice(0, 8); require('fs').writeFileSync('/tmp/t9.json', JSON.stringify(R, null, 1)); await b.close();
})().catch((e) => { console.error('FAIL', e.message); process.exit(1); });
