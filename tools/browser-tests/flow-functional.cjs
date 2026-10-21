const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:3021';
const ARGS = ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'];
const R = {}; const errs = [];
const wf = (p, fn, arg, t) => p.waitForFunction(fn, arg, { timeout: t || 90000 });
(async () => {
  const b = await chromium.launch({ args: ARGS });
  const ctx = await b.newContext({ viewport: { width: 1100, height: 900 } });
  const p = await ctx.newPage();
  p.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errs.push(m.type() + ': ' + m.text()); }); p.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
  // A: service page flow
  try {
    await p.goto(BASE + '/services/disaster-recovery/?q=2', { waitUntil: 'load' });
    await p.locator('.flow3d').scrollIntoViewIfNeeded();
    await wf(p, () => { const e = document.querySelector('.flow3d'); return e && e.dataset.gl === 'webgl2' && +e.dataset.frames >= 4; });
    R.A_mode = await p.getAttribute('.flow3d', 'data-gl');
    R.A_cap0 = await p.textContent('.f3cap');
    await p.click('.f3chips .f3c:nth-child(4)'); // step 3
    R.A_cap3 = await p.textContent('.f3cap');
    R.A_listOn = await p.evaluate(() => [...document.querySelectorAll('.f3list li')].map((l) => l.classList.contains('on')));
    R.A_pressed = await p.evaluate(() => [...document.querySelectorAll('.f3chips .f3c')].map((c) => c.getAttribute('aria-pressed')).join(','));
    await p.focus('.f3stage'); await p.keyboard.press('ArrowRight'); R.A_afterRight = (await p.textContent('.f3cap')).slice(0, 40);
    await p.keyboard.press('ArrowLeft'); await p.keyboard.press('ArrowLeft'); R.A_afterLeft2 = (await p.textContent('.f3cap')).slice(0, 40);
    await p.click('.f3bar .f3b:nth-of-type(3)'); // play (button order: prev,next? check label below)
    R.A_buttons = await p.evaluate(() => [...document.querySelectorAll('.f3bar > button')].map((x) => x.textContent));
    await p.click('.f3chips .f3c:first-child'); R.A_all = (await p.textContent('.f3cap')).slice(0, 30);
    await p.waitForTimeout(2500);
    await p.locator('.f3').first().screenshot({ path: '/tmp/page_flow_dr.png' });
    R.A_err = await p.getAttribute('.flow3d', 'data-err'); R.A_q = await p.getAttribute('.flow3d', 'data-q');
  } catch (e) { R.A_fail = e.message.slice(0, 300); }
  // B: services page, panel switching
  try {
    await p.goto(BASE + '/services/?q=2', { waitUntil: 'load' });
    await p.waitForSelector('.ring3d[data-gl]');
    await p.locator('.gchips button', { hasText: 'Cyber Security' }).first().click();
    await wf(p, () => { const a = [...document.querySelectorAll('.dtl')].find((x) => !x.hidden); const e = a && a.querySelector('.flow3d'); return e && e.dataset.gl === 'webgl2' && +e.dataset.frames >= 3; });
    R.B_first = await p.evaluate(() => { const a = [...document.querySelectorAll('.dtl')].find((x) => !x.hidden); return a.querySelector('h3').textContent; });
    await p.locator('.dtl:not([hidden]) .f3').first().scrollIntoViewIfNeeded(); await p.waitForTimeout(1500);
    await p.locator('.dtl:not([hidden]) .f3stage').first().screenshot({ path: '/tmp/page_flow_cyber.png' });
    await p.evaluate(() => document.querySelector('.dtl:not([hidden]) [data-a=map]').click()); await p.waitForTimeout(400);
    await p.locator('.gchips button', { hasText: 'Cloud Desktop' }).first().click();
    await wf(p, () => { const a = [...document.querySelectorAll('.dtl')].find((x) => !x.hidden); const e = a && a.querySelector('.flow3d'); return e && e.dataset.gl === 'webgl2' && +e.dataset.frames >= 3; });
    R.B_second = await p.evaluate(() => { const a = [...document.querySelectorAll('.dtl')].find((x) => !x.hidden); return { h: a.querySelector('h3').textContent, canvases: document.querySelectorAll('.f3gl').length, stageHasGL: !!a.querySelector('.f3gl') }; });
  } catch (e) { R.B_fail = e.message.slice(0, 300); }
  // C: generated flow in a reasons panel
  try {
    await p.goto(BASE + '/why-choose-us/?q=2', { waitUntil: 'load' });
    await p.waitForSelector('.ring3d[data-gl]');
    await p.locator('.gchips button').first().click();
    await wf(p, () => { const a = [...document.querySelectorAll('.dtl')].find((x) => !x.hidden); const e = a && a.querySelector('.flow3d'); return e && e.dataset.gl === 'webgl2' && +e.dataset.frames >= 3; });
    R.C_ok = await p.evaluate(() => { const a = [...document.querySelectorAll('.dtl')].find((x) => !x.hidden); return { h: a.querySelector('h3').textContent, chips: a.querySelectorAll('.f3chips .f3c').length, cap: a.querySelector('.f3cap').textContent.slice(0, 60) }; });
    await p.locator('.dtl:not([hidden]) .f3stage').first().scrollIntoViewIfNeeded(); await p.waitForTimeout(1500);
    await p.locator('.dtl:not([hidden]) .f3stage').first().screenshot({ path: '/tmp/page_flow_why.png' });
  } catch (e) { R.C_fail = e.message.slice(0, 300); }
  R.errs = errs.slice(0, 10);
  console.log(JSON.stringify(R, null, 1)); await b.close();
})().catch((e) => { console.error('TEST FAIL', e.message); process.exit(1); });
