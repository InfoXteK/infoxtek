const { chromium } = require('playwright');
const BASE = process.env.BASE || 'http://127.0.0.1:3021';
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const ctx = await b.newContext({ viewport: { width: 1100, height: 900 } });
  const p = await ctx.newPage(); const errs = [];
  p.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errs.push(m.type() + ': ' + m.text()); }); p.on('pageerror', (e) => errs.push('pageerror: ' + e.message));
  const out = {};
  await p.goto(BASE + '/services/?q=2', { waitUntil: 'load' });
  await p.waitForSelector('.ring3d[data-gl]', { timeout: 20000 });
  out.mode = await p.getAttribute('.ring3d', 'data-gl');
  await p.waitForFunction(() => +document.querySelector('.ring3d').dataset.frames >= 8, null, { timeout: 90000 });
  out.stats = await p.evaluate(() => { const d = document.querySelector('.ring3d').dataset; return { fps: d.fps, q: d.q, frames: d.frames, dc: d.dc, err: d.err }; });
  await p.locator('.gstage').first().screenshot({ path: '/tmp/page_gal.png' });
  // one-click via chip
  const chip = p.locator('.gchips button', { hasText: 'Disaster Recovery' }).first(); await chip.click();
  await p.waitForSelector('.ring3d.hasdet .dtl:not([hidden])', { timeout: 10000 });
  out.panelOpen = await p.evaluate(() => [...document.querySelectorAll('.dtl')].filter((a) => !a.hidden).map((a) => a.querySelector('h3').textContent));
  // one-click via canvas: scan a grid until a node is hit
  await p.evaluate(() => document.querySelector('[data-a=map]').click());
  await p.waitForTimeout(500);
  const box = await p.locator('.gstage canvas.g3hud').first().boundingBox();
  let hit = null;
  for (let y = 70; y < box.height - 40 && !hit; y += 34) for (let x = 120; x < box.width - 120 && !hit; x += 34) {
    await p.mouse.click(box.x + x, box.y + y, { delay: 20 });
    const open = await p.evaluate(() => [...document.querySelectorAll('.dtl')].some((a) => !a.hidden));
    if (open) hit = [x, y];
  }
  out.canvasClickOpens = hit;
  out.overflow = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
  out.errs = errs.slice(0, 8);
  console.log(JSON.stringify(out, null, 1));
  await b.close();
})().catch((e) => { console.error('TEST FAIL', e.message); process.exit(1); });
