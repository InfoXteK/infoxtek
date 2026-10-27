const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist'] });
  const p = await (await b.newContext({ viewport: { width: 1100, height: 900 } })).newPage();
  await p.goto('http://127.0.0.1:3021/services/?q=0', { waitUntil: 'load' }); await p.waitForSelector('.ring3d[data-gl]');
  await p.locator('.gchips button', { hasText: 'Cyber Security' }).first().click(); await p.waitForSelector('.dtl:not([hidden])'); await p.waitForTimeout(1500);
  const out = await p.evaluate(async () => {
    const a = document.querySelector('.dtl:not([hidden])'), sw = a.querySelector('.dtl-switch'), ar = a.getBoundingClientRect();
    const res = [];
    for (const off of [300, 900, 1500]) { window.scrollTo({ top: window.scrollY + ar.top + off - 400, behavior: 'instant' }); await new Promise((r) => setTimeout(r, 400)); const r = sw.getBoundingClientRect(), a2 = a.getBoundingClientRect(); res.push({ articleTop: Math.round(a2.top), switchTop: Math.round(r.top) }); }
    return res;
  });
  console.log(JSON.stringify(out)); await b.close();
})();
