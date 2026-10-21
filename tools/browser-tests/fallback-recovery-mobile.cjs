const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:3021';
const GL = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];
const ONLY = process.env.ONLY || 'DEFG'; const R = {}; const wf = (p, fn, arg, t) => p.waitForFunction(fn, arg, { timeout: t || 90000 });
const watch = (p, errs) => { p.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errs.push(m.type() + ': ' + m.text()); }); p.on('pageerror', (e) => errs.push('pageerror: ' + e.message)); };
(async () => {
  // D: no WebGL at all -> 2D fallback, flow step cards stay
  if (ONLY.includes('D')) try {
    const b = await chromium.launch({ args: ['--disable-gpu', '--disable-3d-apis'] }); const p = await (await b.newContext({ viewport: { width: 1100, height: 900 } })).newPage(); const errs = []; watch(p, errs);
    await p.goto(BASE + '/services/', { waitUntil: 'load' }); await p.waitForSelector('.ring3d[data-gl]'); await p.waitForTimeout(1500);
    R.D_mode = await p.getAttribute('.ring3d', 'data-gl');
    R.D_webgl2 = await p.evaluate(() => { try { return !!document.createElement('canvas').getContext('webgl2'); } catch (e) { return 'throws'; } });
    await p.locator('.gchips button', { hasText: 'Disaster Recovery' }).first().click();
    await p.waitForSelector('.dtl:not([hidden])');
    R.D_panel = await p.evaluate(() => { const a = document.querySelector('.dtl:not([hidden])'); const f = a.querySelector('.flow3d'); return { f3on: f.classList.contains('f3on'), live: !!f.querySelector('.f3list.live'), items: f.querySelectorAll('.f3list li').length, stage: !!a.querySelector('.f3stage') }; });
    await p.locator('.gstage').first().screenshot({ path: '/tmp/fallback_2d.png' });
    R.D_errs = errs.slice(0, 5); await b.close();
  } catch (e) { R.D_fail = e.message.slice(0, 250); }
  // E: context loss and restore on galaxy and flow host; permanent loss falls back to 2D
  if (ONLY.includes('E')) try {
    const b = await chromium.launch({ args: GL }); const p = await (await b.newContext({ viewport: { width: 1100, height: 900 } })).newPage(); const errs = []; watch(p, errs);
    await p.goto(BASE + '/services/?q=1', { waitUntil: 'load' }); await p.waitForSelector('.ring3d[data-gl="webgl2"]');
    await wf(p, () => +document.querySelector('.ring3d').dataset.frames >= 5);
    const f0 = +(await p.getAttribute('.ring3d', 'data-frames'));
    await p.evaluate(() => { const c = document.querySelector('.g3gl'); const ext = c.getContext('webgl2').getExtension('WEBGL_lose_context'); window.__x = ext; ext.loseContext(); });
    await p.waitForTimeout(700); await p.evaluate(() => window.__x.restoreContext());
    await wf(p, (f) => +document.querySelector('.ring3d').dataset.frames >= f + 6, f0 + 0);
    R.E_restored = { mode: await p.getAttribute('.ring3d', 'data-gl'), framesBefore: f0, framesAfter: +(await p.getAttribute('.ring3d', 'data-frames')) };
    await p.evaluate(() => { const c = document.querySelector('.g3gl'); c.getContext('webgl2').getExtension('WEBGL_lose_context').loseContext(); });
    await p.waitForTimeout(3600);
    R.E_permanent = await p.getAttribute('.ring3d', 'data-gl'); R.E_hasGlCanvas = await p.evaluate(() => !!document.querySelector('.g3gl'));
    R.E_stillInteractive = await (async () => { await p.locator('.gchips button', { hasText: 'Cloud Desktop' }).first().click(); await p.waitForSelector('.dtl:not([hidden])'); return await p.evaluate(() => document.querySelector('.dtl:not([hidden]) h3').textContent); })();
    R.E_errs = errs.slice(0, 6); await b.close();
  } catch (e) { R.E_fail = e.message.slice(0, 250); }
  // F: reduced motion
  if (ONLY.includes('F')) try {
    const b = await chromium.launch({ args: GL }); const ctx = await b.newContext({ viewport: { width: 1100, height: 900 }, reducedMotion: 'reduce' }); const p = await ctx.newPage(); const errs = []; watch(p, errs);
    await p.goto(BASE + '/services/disaster-recovery/?q=1', { waitUntil: 'load' }); await p.locator('.flow3d').scrollIntoViewIfNeeded();
    await wf(p, () => { const e = document.querySelector('.flow3d'); return e && e.dataset.gl === 'webgl2' && +e.dataset.frames >= 2; });
    await p.waitForTimeout(6000);
    R.F_flow = { playHidden: await p.evaluate(() => document.querySelector('.f3bar .f3b:nth-of-type(3)').hidden), capStill: (await p.textContent('.f3cap')).slice(0, 12) };
    await p.goto(BASE + '/services/?q=1', { waitUntil: 'load' }); await p.waitForSelector('.ring3d[data-gl="webgl2"]'); await wf(p, () => +document.querySelector('.ring3d').dataset.frames >= 2);
    await p.waitForTimeout(3500); const a = +(await p.getAttribute('.ring3d', 'data-frames')); await p.waitForTimeout(2500); const c = +(await p.getAttribute('.ring3d', 'data-frames'));
    R.F_galaxyIdleFrames = { a, c, delta: c - a }; R.F_errs = errs.slice(0, 5); await b.close();
  } catch (e) { R.F_fail = e.message.slice(0, 250); }
  // G: mobile (touch, DPR 2)
  if (ONLY.includes('G')) try {
    const b = await chromium.launch({ args: GL }); const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true }); const p = await ctx.newPage(); const errs = []; watch(p, errs);
    await p.goto(BASE + '/services/', { waitUntil: 'load' }); await p.waitForSelector('.ring3d[data-gl="webgl2"]'); await wf(p, () => +document.querySelector('.ring3d').dataset.frames >= 4);
    R.G_q = await p.getAttribute('.ring3d', 'data-q');
    await p.locator('.gchips button', { hasText: 'Network Solutions' }).first().tap();
    await p.waitForSelector('.dtl:not([hidden]) .flow3d'); await p.locator('.dtl:not([hidden]) .flow3d').first().scrollIntoViewIfNeeded();
    await wf(p, () => { const a = [...document.querySelectorAll('.dtl')].find((x) => !x.hidden); const e = a && a.querySelector('.flow3d'); return e && e.dataset.gl === 'webgl2' && +e.dataset.frames >= 3; });
    await p.locator('.dtl:not([hidden]) .f3').first().scrollIntoViewIfNeeded(); await p.waitForTimeout(2200);
    R.G_overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    R.G_stage = await p.evaluate(() => { const r = document.querySelector('.dtl:not([hidden]) .f3stage').getBoundingClientRect(); return { w: Math.round(r.width), h: Math.round(r.height) }; });
    await p.locator('.dtl:not([hidden]) .f3').first().screenshot({ path: '/tmp/mobile_flow.png' });
    await p.locator('.dtl:not([hidden]) .f3chips .f3c').nth(3).tap(); await p.waitForTimeout(3500); await p.locator('.dtl:not([hidden]) .f3').first().screenshot({ path: '/tmp/mobile_flow3.png' });
    await p.evaluate(() => document.querySelector('.dtl:not([hidden]) [data-a=map]').click()); await p.waitForTimeout(500);
    await p.locator('.gstage').first().screenshot({ path: '/tmp/mobile_gal.png' });
    R.G_errs = errs.slice(0, 5); await b.close();
  } catch (e) { R.G_fail = e.message.slice(0, 250); }
  require('fs').writeFileSync('/tmp/t3_' + ONLY + '.json', JSON.stringify(R, null, 1));
})().catch((e) => { console.error('TEST FAIL', e.message); process.exit(1); });
