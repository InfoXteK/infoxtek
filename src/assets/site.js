(() => {
  const btn = document.querySelector('.menu'), nav = document.getElementById('nav');
  if (btn && nav) btn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(open));
  });
  const form = document.getElementById('contact-form');
  if (!form) return;
  const svc = new URLSearchParams(location.search).get('service');
  const sel = form.elements.service;
  if (svc && sel) for (const o of sel.options) if (o.text === svc) sel.value = o.text;
  const status = document.getElementById('status');
  const rules = { name: (v) => (v.trim() ? '' : 'Enter your name.'), email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'Enter a valid email address.'), message: (v) => (v.trim().length >= 10 ? '' : 'Enter a message of at least 10 characters.') };
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    let bad = null;
    for (const k of Object.keys(rules)) {
      const f = form.elements[k], err = document.getElementById(k + '-e'), m = rules[k](f.value);
      err.hidden = !m; err.textContent = m; f.setAttribute('aria-invalid', String(!!m));
      if (m && !bad) bad = f;
    }
    if (bad) { bad.focus(); status.textContent = ''; return; }
    if (form.elements.website.value) return; // honeypot
    const endpoint = form.dataset.endpoint;
    if (!endpoint) { status.textContent = 'This form is not connected yet, so your message was not sent. Please use the contact details on this page.'; return; }
    status.textContent = 'Sending...';
    try {
      const r = await fetch(endpoint, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(form) });
      if (!r.ok) throw new Error();
      form.reset(); status.textContent = 'Message sent. We will reply by email.';
    } catch { status.textContent = 'Sending failed. Please try again or use the contact details on this page.'; }
  });
})();
(() => {
  const els = document.querySelectorAll('.rv');
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.documentElement.classList.add('js');
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
  els.forEach((el) => io.observe(el));
})();
if (matchMedia('(prefers-reduced-motion: reduce)').matches) document.querySelectorAll('.scene svg, .bgart').forEach((s) => s.pauseAnimations && s.pauseAnimations());
(() => {
  const f = document.getElementById('license-form'); if (!f) return;
  const st = document.getElementById('lstatus');
  const free = /^(gmail|googlemail|yahoo|ymail|hotmail|outlook|live|msn|icloud|me|aol|proton|protonmail|gmx|mail|yandex|zoho|qq|163)\./i;
  const msg = { lname: 'Enter your name.', lcompany: 'Enter your company name.', lemail: 'Enter your corporate email address.', ldevice: 'Enter your Device ID.', lactivation: 'Enter your Activation Code.' };
  f.addEventListener('submit', async (e) => {
    e.preventDefault(); let bad = null;
    for (const k in msg) {
      const el = f.elements[k], er = document.getElementById(k + '-e'), v = el.value.trim(); let m = '';
      if (!v) m = msg[k];
      else if (k === 'lemail') { if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) m = 'Enter a valid email address.'; else if (free.test(v.split('@')[1])) m = 'Please use your corporate email address, not a free webmail address.'; }
      er.hidden = !m; er.textContent = m; el.setAttribute('aria-invalid', String(!!m)); if (m && !bad) bad = el;
    }
    if (bad) { bad.focus(); st.textContent = ''; return; }
    if (f.elements.lwebsite.value) return;
    const d = Object.fromEntries(new FormData(f)), ep = f.dataset.endpoint, to = f.dataset.mailto;
    if (ep) {
      st.textContent = 'Sending...';
      try { const r = await fetch(ep, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(f) }); if (!r.ok) throw 0; f.reset(); st.textContent = 'Request received. We will email your license key.'; } catch { st.textContent = 'Sending failed. Please try again.'; }
    } else if (to) {
      let cc = ''; try { cc = atob(f.dataset.cc || ''); } catch { cc = ''; }
      const body = `Net-Monit license request\n\nName: ${d.lname}\nCompany: ${d.lcompany}\nCorporate email: ${d.lemail}\nNet-Monit version: ${d.lversion}\nOperating system: ${d.los}\nDevice ID: ${d.ldevice}\nActivation Code: ${d.lactivation}\n`;
      location.href = 'mailto:' + to + '?' + (cc ? 'cc=' + encodeURIComponent(cc) + '&' : '') + 'subject=' + encodeURIComponent('Net-Monit License Request') + '&body=' + encodeURIComponent(body);
      st.textContent = 'Your email app should open with the request filled in. Press Send to submit it. If nothing opens, email ' + to + ' with the same details.';
    } else st.textContent = 'This form is not connected yet.';
  });
})();
document.querySelectorAll('.floaters span').forEach((el) => {
  const hero = el.closest('.hero'); if (!hero) return;
  el.tabIndex = 0; el.setAttribute('role', 'button'); el.setAttribute('aria-label', el.textContent + ' skill chip: drag or fling it, or use the arrow keys');
  let on = false, sx, sy, ox, oy, lx, ly, vx = 0, vy = 0, raf = 0;
  const place = (x, y) => { el.style.left = Math.max(0, Math.min(hero.clientWidth - el.offsetWidth, x)) + 'px'; el.style.top = Math.max(0, Math.min(hero.clientHeight - el.offsetHeight, y)) + 'px'; };
  const fling = () => { if (Math.abs(vx) + Math.abs(vy) < 0.4) return; const mx = hero.clientWidth - el.offsetWidth, my = hero.clientHeight - el.offsetHeight; let x = el.offsetLeft + vx, y = el.offsetTop + vy; if (x < 0 || x > mx) { vx = -vx * 0.7; x = Math.max(0, Math.min(mx, x)); } if (y < 0 || y > my) { vy = -vy * 0.7; y = Math.max(0, Math.min(my, y)); } el.style.left = x + 'px'; el.style.top = y + 'px'; vx *= 0.965; vy *= 0.965; raf = requestAnimationFrame(fling); };
  el.addEventListener('pointerdown', (e) => { cancelAnimationFrame(raf); on = true; el.setPointerCapture(e.pointerId); el.classList.add('drag'); ox = el.offsetLeft; oy = el.offsetTop; sx = lx = e.clientX; sy = ly = e.clientY; vx = vy = 0; e.preventDefault(); });
  el.addEventListener('pointermove', (e) => { if (!on) return; place(ox + e.clientX - sx, oy + e.clientY - sy); vx = (e.clientX - lx) * 0.9 + vx * 0.1; vy = (e.clientY - ly) * 0.9 + vy * 0.1; lx = e.clientX; ly = e.clientY; });
  const end = () => { if (!on) return; on = false; el.classList.remove('drag'); raf = requestAnimationFrame(fling); };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
  el.addEventListener('keydown', (e) => { const d = { ArrowLeft: [-14, 0], ArrowRight: [14, 0], ArrowUp: [0, -14], ArrowDown: [0, 14] }[e.key]; if (!d) return; e.preventDefault(); place(el.offsetLeft + d[0], el.offsetTop + d[1]); });
});
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('.scene').forEach((sc) => {
  const svg = sc.querySelector('svg.main'), deep = sc.querySelector('.deep'); if (!svg || !deep) return;
  const logs = [...sc.querySelectorAll('.logs li')].map((l) => l.textContent), T = (sc.dataset.t || '').split(',').map(Number);
  sc.classList.add('ix');
  const ctl = document.createElement('div'); ctl.className = 'ctl';
  const cap = document.createElement('p'); cap.className = 'cap'; cap.setAttribute('aria-live', 'polite'); cap.textContent = 'Click a step (or press 1 to 4) to freeze the scene at that moment, press P to pause or play, and move your pointer over it to tilt it in 3D.';
  const play = document.createElement('button'); play.type = 'button'; play.textContent = 'Pause'; let paused = false;
  const setP = (p) => { paused = p; play.textContent = p ? 'Play' : 'Pause'; try { p ? svg.pauseAnimations() : svg.unpauseAnimations(); } catch {} };
  play.onclick = () => { setP(!paused); if (!paused) cap.textContent = 'Playing.'; };
  ctl.append(play);
  logs.forEach((t, i) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = 'Step ' + (i + 1); b.onclick = () => { try { svg.setCurrentTime((T[i] || 0.12 + i * 0.25) * 12); } catch {} setP(true); cap.textContent = 'Step ' + (i + 1) + ': ' + t; }; ctl.append(b); });
  sc.append(ctl, cap);
  if (calm) { setP(true); return; }
  sc.addEventListener('pointermove', (e) => { if (e.pointerType === 'touch') return; const r = sc.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; deep.style.setProperty('--ty', x * 14 + 'deg'); deep.style.setProperty('--tx', -y * 12 + 'deg'); });
  sc.addEventListener('pointerleave', () => { deep.style.setProperty('--ty', '0deg'); deep.style.setProperty('--tx', '0deg'); });
});
if (!calm) {
  document.querySelectorAll('.card').forEach((c) => { c.addEventListener('pointermove', (e) => { if (e.pointerType === 'touch') return; const r = c.getBoundingClientRect(); c.style.setProperty('--ry', ((e.clientX - r.left) / r.width - 0.5) * 12 + 'deg'); c.style.setProperty('--rx', -((e.clientY - r.top) / r.height - 0.5) * 10 + 'deg'); }); c.addEventListener('pointerleave', () => { c.style.setProperty('--rx', '0deg'); c.style.setProperty('--ry', '0deg'); }); });
  document.querySelectorAll('.band').forEach((b) => b.addEventListener('pointermove', (e) => { const r = b.getBoundingClientRect(); b.style.setProperty('--mx', (e.clientX - r.left) / r.width - 0.5); b.style.setProperty('--my', (e.clientY - r.top) / r.height - 0.5); }));
}
(() => {
  const st = document.getElementById('stage'); if (!st) return;
  let on = false, moved = 0, sx = 0, sy = 0, rz = -32, rx = 0;
  const mv = (e) => { if (!on) return; const dx = e.clientX - sx, dy = e.clientY - sy; sx = e.clientX; sy = e.clientY; moved += Math.abs(dx) + Math.abs(dy); rz += dx * 0.5; rx = Math.max(-25, Math.min(25, rx - dy * 0.3)); st.style.setProperty('--rz', rz + 'deg'); st.style.setProperty('--rx', rx + 'deg'); };
  const up = () => { on = false; st.classList.remove('drag'); removeEventListener('pointermove', mv); removeEventListener('pointerup', up); };
  st.addEventListener('pointerdown', (e) => { on = true; moved = 0; sx = e.clientX; sy = e.clientY; st.classList.add('drag'); addEventListener('pointermove', mv); addEventListener('pointerup', up); });
  st.addEventListener('click', (e) => { if (moved > 6) { e.preventDefault(); e.stopPropagation(); } }, true);
})();
/*G3*/
document.querySelectorAll('.ring3d').forEach((root) => {
  try {
    const groups = [...root.querySelectorAll('.ring')].map((r) => [...r.querySelectorAll('.c3')].map((c) => ({ t: c.dataset.t, d: c.dataset.d, det: c.dataset.det || '', h: c.dataset.det ? '' : c.getAttribute('href') })));
    const tabs = [...root.querySelectorAll('[role=tab]')], sel = root.querySelector('.sel'), stageEl = root.querySelector('.stage');
    const cv = document.createElement('canvas'), ctx = cv.getContext('2d'); if (!ctx || !groups.length || !sel || !stageEl) return;
    const COL = [[34, 211, 238], [167, 139, 250], [244, 114, 182], [251, 191, 36]], calm = matchMedia('(prefers-reduced-motion: reduce)').matches, PI2 = Math.PI * 2;
    const rgba = (c, a) => 'rgba(' + c[0] + ',' + c[1] + ',' + c[2] + ',' + a + ')', mix = (c, k) => [Math.round(c[0] + (255 - c[0]) * k), Math.round(c[1] + (255 - c[1]) * k), Math.round(c[2] + (255 - c[2]) * k)], dark = (c, k) => [Math.round(c[0] * k), Math.round(c[1] * k), Math.round(c[2] * k)];
    const box = document.createElement('div'); box.className = 'gstage'; cv.tabIndex = 0; cv.setAttribute('role', 'application'); cv.setAttribute('aria-label', 'Interactive 3D map. Drag to orbit, click a node to select it, click it again or press Enter to open the full details. Arrow keys move between nodes.');
    box.append(cv); root.insertBefore(box, stageEl);
    let GLR = null, glc = null, raf = 0, awake = 0;
    const failGL = () => { try { if (GLR) GLR.dispose(); } catch {} GLR = null; if (glc) glc.remove(); glc = null; cv.classList.remove('g3hud'); root.dataset.gl = '2d'; try { rs(); } catch {} };
    if (window.IXGL && IXGL.galaxy && IXGL.supported()) { try { glc = document.createElement('canvas'); glc.className = 'g3gl'; glc.setAttribute('aria-hidden', 'true'); box.insertBefore(glc, cv); GLR = IXGL.galaxy(glc, { onFail: failGL }); cv.classList.add('g3hud'); root.dataset.gl = 'webgl2'; } catch { GLR = null; if (glc) glc.remove(); glc = null; root.dataset.gl = '2d'; } } else root.dataset.gl = '2d';
    const tip = document.createElement('p'); tip.className = 'tip gtip'; tip.textContent = 'Drag to orbit. One click on a sphere (or a button below the map) opens its full details underneath. Arrow keys move between nodes, Enter opens.'; sel.after(tip);
    const chips = document.createElement('div'); chips.className = 'gchips'; chips.setAttribute('role', 'group'); chips.setAttribute('aria-label', 'Quick select: choose an item'); box.after(chips);
    const hh = sel.querySelector('h3'), pp = sel.querySelector('p'), bb = sel.querySelector('.btn');
    const dtls = root.querySelector('.dtls'), arts = dtls ? [...dtls.querySelectorAll('.dtl')] : [];
    root.dataset.g3 = '1'; root.classList.add('ongal'); arts.forEach((a) => { a.hidden = true; });
    const FL = 215, R0 = 200;
    let lw = [], over = false, spx = 0, spy = 0, g = 0, selI = 0, W = 0, H = 0, yaw = 0.6, pitch = GLR ? 0.3 : 0.22, vy = 0, vp = 0, drag = null, hover = -1, tr = 1, fly = null, t0 = 0, on = true, P = [], pos = [], prev = [], nodes = groups[0], punch = 0, px = 0, py = 0, cur = '';
    const clamp = (v) => (GLR ? Math.max(0.05, Math.min(0.8, v)) : Math.max(-0.75, Math.min(0.75, v))), md = (a) => ((a % PI2) + PI2) % PI2;
    const fib = (n, R) => Array.from({ length: n }, (_, i) => { const y = n === 1 ? 0 : 1 - (2 * i) / (n - 1), r = Math.sqrt(Math.max(0, 1 - y * y)), a = i * 2.399963; return [Math.cos(a) * r * R, y * R * 0.72, Math.sin(a) * r * R]; });
    const motes = Array.from({ length: 46 }, () => [(Math.random() - 0.5) * 520, (Math.random() - 0.5) * 760, (Math.random() - 0.5) * 520, Math.random() * 6.28, Math.random()]);
    const stars = Array.from({ length: 170 }, () => [(Math.random() - 0.5) * 1100, (Math.random() - 0.5) * 800, (Math.random() - 0.5) * 1000, Math.random() * 6.28]);
    const rs = () => { const r = box.getBoundingClientRect(), d = Math.min(2, window.devicePixelRatio || 1); W = r.width; H = r.height; cv.width = Math.round(W * d); cv.height = Math.round(H * d); ctx.setTransform(d, 0, 0, d, 0, 0); if (GLR) GLR.resize(W, H); wake(); };
    const proj = (p) => { if (GLR) return GLR.project(p); const Y = yaw + spx * 0.16, Q = pitch + spy * 0.1, cy = Math.cos(Y), sy = Math.sin(Y), cp = Math.cos(Q), sp = Math.sin(Q); const x = p[0] * cy + p[2] * sy, z1 = -p[0] * sy + p[2] * cy, y = p[1] * cp - z1 * sp, z = p[1] * sp + z1 * cp, f = (700 / (700 - z)) * (1 + 0.1 * punch) * Math.min(1.1, Math.max(0.62, W / 760)); return { x: W / 2 + x * f, y: H / 2 + 10 + y * f, z, f }; };
    const setBtn = (n) => { bb.hidden = !(n.h || n.det); if (n.det) { bb.href = '#' + n.det; bb.textContent = 'Show full details'; } else if (n.h) { bb.href = n.h; bb.textContent = 'Open ' + n.t; } };
    const choose = (i, doFly) => { selI = i; const n = nodes[i]; hh.textContent = n.t; pp.textContent = n.d; setBtn(n); punch = 1; markChips(); if (doFly && pos[i]) { const [x, y, z] = pos[i], R = Math.hypot(x, z) || 1; fly = { yaw: -Math.atan2(x, z), pitch: clamp(GLR ? 0.3 - Math.atan2(y, R) * 0.35 : Math.atan2(y, R) * 0.8 + 0.12) }; vy = vp = 0; } if (GLR && pos[i]) GLR.burst(pos[i]); wake(); };
    const buildChips = () => { chips.replaceChildren(...nodes.map((n, i) => { const b = document.createElement('button'); b.type = 'button'; b.textContent = n.t; b.addEventListener('click', () => { choose(i, true); if (n.det) showDet(n.det); }); return b; })); };
    const markChips = () => [...chips.children].forEach((b, i) => b.setAttribute('aria-pressed', String(i === selI)));
    const hideDet = () => { arts.forEach((a) => { a.hidden = true; a.classList.remove('enter'); }); root.classList.remove('hasdet'); cur = ''; };
    const showDet = (id, quiet) => {
      const a = arts.find((x) => x.id === id); if (!a) return;
      arts.forEach((x) => { x.hidden = x !== a; x.classList.remove('enter'); }); void a.offsetWidth; a.classList.add('enter'); root.classList.add('hasdet'); cur = id;
      a.querySelectorAll('.scene svg.main').forEach((v) => { try { v.setCurrentTime(0); v.unpauseAnimations(); } catch {} });
      const inn = a.querySelector('.dtl-in'); if (!calm && inn && !a.dataset.tl) { a.dataset.tl = '1'; a.addEventListener('pointermove', (e) => { if (e.pointerType === 'touch') return; const r = inn.getBoundingClientRect(); inn.style.setProperty('--ry', (((e.clientX - r.left) / r.width - 0.5) * 3).toFixed(2) + 'deg'); inn.style.setProperty('--rx', ((0.5 - (e.clientY - r.top) / r.height) * 2).toFixed(2) + 'deg'); }); a.addEventListener('pointerleave', () => { inn.style.setProperty('--ry', '0deg'); inn.style.setProperty('--rx', '0deg'); }); }
      if (!quiet) { try { history.replaceState(null, '', '#' + id); } catch {} const top = a.getBoundingClientRect().top; if (top > innerHeight * 0.8 || top < 60) window.scrollBy({ top: top - innerHeight * 0.18, behavior: calm ? 'auto' : 'smooth' }); const h = a.querySelector('h3'); if (h) h.focus({ preventScroll: true }); }
    };
    const setGroup = (k) => { g = k; nodes = groups[k]; prev = pos.length ? pos.map((q) => q.slice()) : []; pos = fib(nodes.length, R0); tr = 0; tabs.forEach((t, i) => t.setAttribute('aria-selected', String(i === k))); hideDet(); buildChips(); choose(0, true); };
    const hit = (mx, my) => { let b = -1, bd = 1e9; P.forEach((p, i) => { const r = Math.max(34, 27 * p.f + 10); let d = Math.hypot(p.x - mx, p.y - my); if (lw[i] && Math.abs(mx - p.x) < lw[i] / 2 + 4 && my > p.y + r * 0.5 && my < p.y + r * 0.9 + 32) d = Math.min(d, r * 0.9); d -= p.z * 0.03; if (d < r && d < bd) { bd = d; b = i; } }); return b; };
    const xy = (e) => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    const open = (i) => { const n = nodes[i]; if (!n) return; if (n.det) showDet(n.det); else if (typeof n.h === 'string' && /^\/(?!\/)/.test(n.h)) location.href = n.h; };
    bb.addEventListener('click', (e) => { const n = nodes[selI]; if (n && n.det) { e.preventDefault(); showDet(n.det); } });
    if (dtls) dtls.addEventListener('click', (e) => {
      const b = e.target.closest ? e.target.closest('button[data-a]') : null; if (!b) return; const a = b.closest('.dtl'), gi = +a.dataset.g, xi = +a.dataset.i, act = b.dataset.a;
      if (act === 'map') { hideDet(); try { history.replaceState(null, '', location.pathname); } catch {} box.scrollIntoView({ behavior: calm ? 'auto' : 'smooth', block: 'center' }); cv.focus({ preventScroll: true }); return; }
      if (gi !== g) setGroup(gi); const n = groups[gi].length, ni = (xi + (act === 'next' ? 1 : n - 1)) % n; choose(ni, true); showDet(nodes[ni].det);
    });
    const fromHash = () => { const id = decodeURIComponent((location.hash || '').slice(1)); const a = id && arts.find((x) => x.id === id); if (!a) return; const gi = +a.dataset.g, xi = +a.dataset.i; if (gi !== g) setGroup(gi); choose(xi, true); showDet(id, true); setTimeout(() => a.scrollIntoView({ block: 'start' }), 60); };
    cv.addEventListener('pointerdown', (e) => { wake(); drag = { x: e.clientX, y: e.clientY, m: 0 }; fly = null; try { cv.setPointerCapture(e.pointerId); } catch {} });
    cv.addEventListener('pointermove', (e) => { const [mx, my] = xy(e); px = (mx / W - 0.5); py = (my / H - 0.5); if (drag) { const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.m += Math.abs(dx) + Math.abs(dy); drag.x = e.clientX; drag.y = e.clientY; yaw += dx * 0.007; pitch = clamp(pitch + dy * 0.005); vy = dx * 0.0009; vp = dy * 0.0006; return; } hover = hit(mx, my); cv.style.cursor = hover >= 0 ? 'pointer' : ''; wake(); });
    cv.addEventListener('pointerup', (e) => { if (drag && drag.m < 6) { const [mx, my] = xy(e), h = hit(mx, my); if (h >= 0) { const same = h === selI, n = nodes[h]; if (!same) choose(h, true); if (!calm && navigator.vibrate && matchMedia('(pointer: coarse)').matches) { try { navigator.vibrate(8); } catch {} } if (n.det) showDet(n.det); else if (same) open(h); } } drag = null; });
    cv.addEventListener('pointerenter', () => { over = true; });
    cv.addEventListener('pointerleave', () => { hover = -1; px = py = 0; over = false; });
    cv.addEventListener('keydown', (e) => { wake(); const n = nodes.length; if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); choose((selI + (e.key === 'ArrowRight' ? 1 : n - 1)) % n, true); } else if (e.key === 'Enter') { e.preventDefault(); open(selI); } });
    tabs.forEach((t, i) => t.addEventListener('click', () => setGroup(i)));
    if ('IntersectionObserver' in window) new IntersectionObserver((es) => { on = es[0].isIntersecting; if (on) wake(); }).observe(box);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) wake(); });
    if ('ResizeObserver' in window) new ResizeObserver(() => rs()).observe(box); else addEventListener('resize', rs);
    addEventListener('hashchange', fromHash);
    const flr = R0 * 0.92;
    const kick = () => { if (!raf) raf = requestAnimationFrame(loop); };
    const wake = (ms) => { awake = performance.now() + (ms || 1500); kick(); };
    const hud = (C) => {
      ctx.clearRect(0, 0, W, H); lw = [];
      const order = P.map((_, i) => i).sort((a, b) => P[a].z - P[b].z);
      order.forEach((i) => {
        const p = P[i], n = nodes[i], r = (i === hover || i === selI ? 23 : 19) * p.f, depth = Math.max(0.35, Math.min(1, (p.z + 300) / 500));
        ctx.globalAlpha = depth; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.font = '800 ' + Math.round(r * 0.95) + 'px system-ui,sans-serif'; ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(2,12,40,.55)'; ctx.strokeText(n.t[0], p.x, p.y + 1); ctx.fillStyle = '#fff'; ctx.fillText(n.t[0], p.x, p.y + 1);
      });
      // labels: selected and hovered first, then nearest first; a label that would overlap one already placed is skipped
      const taken = [], lab = P.map((_, i) => i).sort((a, b) => ((b === selI) - (a === selI)) || ((b === hover) - (a === hover)) || (P[b].z - P[a].z));
      lab.forEach((i) => {
        const p = P[i], n = nodes[i], isS = i === selI, isH = i === hover, r = (isH || isS ? 23 : 19) * p.f, depth = Math.max(0.35, Math.min(1, (p.z + 300) / 500));
        if (!(p.z > -110 || isS || isH)) { lw[i] = 0; return; }
        ctx.font = (isS || isH ? '700 ' : '600 ') + Math.round(Math.max(11, 12.5 * p.f)) + 'px system-ui,sans-serif'; const w = ctx.measureText(n.t).width + 16, ly = p.y + r + 17, rc = [p.x - w / 2 - 3, ly - 14, w + 6, 28];
        if (!isS && !isH && taken.some((t) => rc[0] < t[0] + t[2] && rc[0] + rc[2] > t[0] && rc[1] < t[1] + t[3] && rc[1] + rc[3] > t[1])) { lw[i] = 0; return; }
        taken.push(rc); lw[i] = w; ctx.globalAlpha = isS || isH ? 1 : depth; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillStyle = 'rgba(6,12,36,.84)'; ctx.fillRect(p.x - w / 2, ly - 11, w, 22); ctx.strokeStyle = rgba(C, isS ? 0.9 : 0.35); ctx.lineWidth = 1; ctx.strokeRect(p.x - w / 2, ly - 11, w, 22); ctx.fillStyle = '#fff'; ctx.fillText(n.t, p.x, ly + 1);
      });
      ctx.globalAlpha = 1; ctx.strokeStyle = 'rgba(140,190,255,.55)'; ctx.lineWidth = 2;
      [[14, 14, 1, 1], [W - 14, 14, -1, 1], [14, H - 14, 1, -1], [W - 14, H - 14, -1, -1]].forEach(([x, y, a, b]) => { ctx.beginPath(); ctx.moveTo(x, y + 22 * b); ctx.lineTo(x, y); ctx.lineTo(x + 22 * a, y); ctx.stroke(); });
      ctx.fillStyle = 'rgba(190,215,255,.9)'; ctx.font = '12px ui-monospace,Menlo,Consolas,monospace'; ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic'; ctx.fillText(((tabs[g] && tabs[g].textContent) || '').toUpperCase() + '  //  ' + nodes.length + ' NODES  //  SELECTED ' + (selI + 1), 28, 32);
      const gi = GLR.info(); if (gi.frames < 12 || gi.frames % 10 === 0) { root.dataset.fps = gi.fps; root.dataset.q = gi.q; root.dataset.frames = gi.frames; root.dataset.dc = gi.dc; root.dataset.err = gi.err; }
      if (W > 520) { ctx.fillStyle = 'rgba(150,185,235,.72)'; ctx.textAlign = 'right'; ctx.fillText('WEBGL2  //  ' + gi.fps + ' FPS  //  Q' + gi.q, W - 28, 32); }
    };
    const glFrame = (dt, e, C) => {
      GLR.cam(yaw + spx * 0.16, pitch + spy * 0.1, punch);
      const wn = nodes.map((_, i) => { const a = prev[i] || [0, 0, 0], b = pos[i], bob = calm ? 0 : Math.sin(T * 1.3 + i * 1.7) * 7; return [a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e + bob, a[2] + (b[2] - a[2]) * e]; });
      P = wn.map((q) => GLR.project(q));
      try { GLR.draw({ T: calm ? 2 : T, dt, nodes: wn, sel: selI, hover, col: C, tr: e, yaw, pitch, px: spx, py: spy }); } catch (err) { failGL(); return; }
      hud(C);
    };
    const loop = (ts) => {
      raf = 0; if (!on || document.hidden || !W) return; if (!calm || ts < awake) kick(); const dt = Math.min(0.05, (ts - t0) / 1000 || 0.016); t0 = ts, T = ts / 1000;
      if (!drag) { yaw += vy; pitch = clamp(pitch + vp); vy *= 0.94; vp *= 0.94; if (!calm && !fly && !over && Math.abs(vy) < 0.0006) yaw += 0.0018; }
      if (fly) { const dy = md(fly.yaw - yaw + Math.PI) - Math.PI; yaw += dy * 0.1; pitch += (fly.pitch - pitch) * 0.1; if (Math.abs(dy) < 0.008 && Math.abs(fly.pitch - pitch) < 0.008) fly = null; }
      spx += (px - spx) * 0.08; spy += (py - spy) * 0.08; if (tr < 1) tr = Math.min(1, tr + dt * 1.5); punch = Math.max(0, punch - dt * 1.8);
      const e = 1 - Math.pow(1 - tr, 3), C = COL[g % COL.length]; if (GLR) { glFrame(dt, e, C); return; } ctx.clearRect(0, 0, W, H);
      // nebula parallax
      [[0.3, 0.35, 0.5, C, 0.16], [0.75, 0.7, 0.45, [99, 102, 241], 0.18]].forEach(([nx, ny, nr, nc, na]) => { const cx = W * nx - Math.sin(yaw) * 60 - px * 24, cy = H * ny - pitch * 40 - py * 18, rr = Math.max(W, H) * nr, gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, rr); gr.addColorStop(0, rgba(nc, na)); gr.addColorStop(1, rgba(nc, 0)); ctx.globalAlpha = 1; ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H); });
      // volumetric light shafts
      [[0.2, 0.11], [0.5, 0.15], [0.8, 0.1]].forEach(([bx, ba], k) => { const x0 = W * bx - Math.sin(yaw + k) * 70 - px * 30, w = W * 0.1 * (1 + 0.3 * Math.sin(T * 0.5 + k)), lg2 = ctx.createLinearGradient(x0, 0, x0 + 40, H); lg2.addColorStop(0, rgba(mix(C, 0.7), ba)); lg2.addColorStop(1, rgba(C, 0)); ctx.globalAlpha = 1; ctx.fillStyle = lg2; ctx.beginPath(); ctx.moveTo(x0 - w * 0.2, 0); ctx.lineTo(x0 + w * 0.2, 0); ctx.lineTo(x0 + w * 1.6 + 40, H); ctx.lineTo(x0 - w * 1.2 + 40, H); ctx.closePath(); ctx.fill(); });
      // stars (twinkle, depth sized)
      stars.forEach((s) => { const q = proj(s); if (q.f > 3 || q.f < 0.25) return; ctx.globalAlpha = Math.max(0.06, Math.min(0.85, 0.5 * q.f * (0.7 + 0.3 * Math.sin(T * 1.6 + s[3])))); ctx.fillStyle = '#cfe0ff'; const z = 1.6 * q.f; ctx.fillRect(q.x, q.y, z, z); });
      // drifting dust motes (depth parallax)
      motes.forEach((m) => { if (!calm) { m[1] -= dt * 14 * (0.4 + m[4]); if (m[1] < -400) m[1] = 400; m[0] += Math.sin(T * 0.4 + m[3]) * dt * 6; } const q = proj(m); if (q.f > 2.6 || q.f < 0.3) return; ctx.globalAlpha = Math.max(0.05, Math.min(0.55, 0.3 * q.f * (0.6 + 0.4 * Math.sin(T * 1.2 + m[3])))); ctx.fillStyle = rgba(mix(C, 0.8), 1); ctx.beginPath(); ctx.arc(q.x, q.y, (0.8 + m[4] * 1.4) * q.f, 0, PI2); ctx.fill(); });
      // perspective floor grid
      ctx.lineWidth = 1; for (let k = -5; k <= 5; k++) { const v = k * 70; [[[v, flr, -350], [v, flr, 350]], [[-350, flr, v], [350, flr, v]]].forEach(([a, b]) => { const A = proj(a), B = proj(b); ctx.globalAlpha = Math.max(0.03, 0.2 - Math.abs(k) * 0.03); ctx.strokeStyle = rgba(C, 1); ctx.beginPath(); ctx.moveTo(A.x, A.y); ctx.lineTo(B.x, B.y); ctx.stroke(); }); }
      // orbit rings in 3D
      [[0, 1], [0.5, 0.0]].forEach(([tilt, solid], ri) => { ctx.strokeStyle = rgba(C, 1); ctx.lineWidth = ri ? 1 : 1.4; let lp = null; for (let k = 0; k <= 72; k++) { const a = (k / 72) * PI2 + (ri ? T * 0.1 : 0), x = Math.cos(a) * R0 * (ri ? 1.12 : 1), z = Math.sin(a) * R0 * (ri ? 1.12 : 1), y = ri ? Math.sin(a) * R0 * 0.35 : 0, q = proj([x, y, z]); if (lp) { ctx.globalAlpha = 0.08 + 0.22 * ((q.z + 260) / 520); ctx.beginPath(); ctx.moveTo(lp.x, lp.y); ctx.lineTo(q.x, q.y); ctx.stroke(); } lp = q; } });
      P = nodes.map((_, i) => { const a = prev[i] || [0, 0, 0], b = pos[i], bob = calm ? 0 : Math.sin(T * 1.3 + i * 1.7) * 7; return proj([a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e + bob, a[2] + (b[2] - a[2]) * e]); });
      const hub = proj([0, 0, 0]);
      // energy links from core with travelling pulses
      P.forEach((p, i) => { const depth = Math.max(0.1, Math.min(1, (p.z + 280) / 520)); ctx.globalAlpha = 0.1 + 0.4 * depth * (i === selI ? 1.6 : 1); const lg = ctx.createLinearGradient(hub.x, hub.y, p.x, p.y); lg.addColorStop(0, rgba(mix(C, 0.5), 0.9)); lg.addColorStop(1, rgba(C, 0.25)); ctx.strokeStyle = lg; ctx.lineWidth = i === selI ? 2 : 1.1; ctx.beginPath(); ctx.moveTo(hub.x, hub.y); ctx.lineTo(p.x, p.y); ctx.stroke(); if (!calm) { const k = (T * 0.45 + i * 0.23) % 1; ctx.globalAlpha = 0.9 * depth; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(hub.x + (p.x - hub.x) * k, hub.y + (p.y - hub.y) * k, 2 * p.f, 0, PI2); ctx.fill(); } const q = P[(i + 1) % P.length]; if (q !== p) { ctx.globalAlpha = 0.1 + 0.18 * depth; ctx.strokeStyle = rgba(C, 1); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); } });
      // core
      const pulse = 1 + 0.12 * Math.sin(T * 2.2), hg = ctx.createRadialGradient(hub.x, hub.y, 0, hub.x, hub.y, 90 * hub.f * pulse); hg.addColorStop(0, rgba(mix(C, 0.6), 0.95)); hg.addColorStop(0.25, rgba(C, 0.45)); hg.addColorStop(1, rgba(C, 0)); ctx.globalAlpha = 1; ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(hub.x, hub.y, 90 * hub.f * pulse, 0, PI2); ctx.fill();
      [0, 1].forEach((ri) => { ctx.strokeStyle = rgba(mix(C, 0.6), 1); ctx.lineWidth = 1.4; let lp = null; for (let k = 0; k <= 40; k++) { const a = (k / 40) * PI2, r = 34, x = ri ? Math.cos(a) * r * Math.cos(T * 0.8) : Math.cos(a) * r, y = ri ? Math.sin(a) * r : Math.sin(a) * r * Math.cos(T * 0.9), z = ri ? Math.cos(a) * r * Math.sin(T * 0.8) : Math.sin(a) * r * Math.sin(T * 0.9), q = proj([x, y, z]); if (lp) { ctx.globalAlpha = 0.25 + 0.5 * ((q.z + 40) / 80); ctx.beginPath(); ctx.moveTo(lp.x, lp.y); ctx.lineTo(q.x, q.y); ctx.stroke(); } lp = q; } });
      ctx.globalAlpha = 1; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(hub.x, hub.y, 6 * hub.f, 0, PI2); ctx.fill();
      // nodes: shadows first, then shaded spheres back to front
      const order = P.map((_, i) => i).sort((a, b) => P[a].z - P[b].z);
      order.forEach((i) => { const p = P[i], bw = pos[i], a = prev[i] || [0, 0, 0], X = a[0] + (bw[0] - a[0]) * e, Z = a[2] + (bw[2] - a[2]) * e, s = proj([X, flr, Z]), h = Math.max(0, (s.y - p.y) / 260); ctx.globalAlpha = Math.max(0.05, 0.38 - h * 0.25); const sg = ctx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 26 * p.f); sg.addColorStop(0, 'rgba(0,0,0,.75)'); sg.addColorStop(1, 'rgba(0,0,0,0)'); ctx.fillStyle = sg; ctx.save(); ctx.translate(s.x, s.y); ctx.scale(1, 0.36); ctx.translate(-s.x, -s.y); ctx.beginPath(); ctx.arc(s.x, s.y, 26 * p.f, 0, PI2); ctx.fill(); ctx.restore(); ctx.save(); ctx.translate(s.x, s.y); ctx.scale(1, 0.36); const pool = ctx.createRadialGradient(0, 0, 0, 0, 0, 58 * p.f); pool.addColorStop(0, rgba(C, i === selI ? 0.5 : 0.22)); pool.addColorStop(1, rgba(C, 0)); ctx.globalAlpha = 0.9; ctx.fillStyle = pool; ctx.beginPath(); ctx.arc(0, 0, 58 * p.f, 0, PI2); ctx.fill(); if (i === selI) { const k2 = (T * 0.7) % 1; ctx.globalAlpha = 0.6 * (1 - k2); ctx.strokeStyle = rgba(mix(C, 0.5), 1); ctx.lineWidth = 2 / 0.36 * 0.5; ctx.beginPath(); ctx.arc(0, 0, (24 + k2 * 60) * p.f, 0, PI2); ctx.stroke(); } ctx.restore(); if (i === selI) { ctx.globalAlpha = 0.35; const bg = ctx.createLinearGradient(p.x, p.y, s.x, s.y); bg.addColorStop(0, rgba(C, 0.7)); bg.addColorStop(1, rgba(C, 0)); ctx.strokeStyle = bg; ctx.lineWidth = 3 * p.f; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(s.x, s.y); ctx.stroke(); } });
      order.forEach((i) => {
        const p = P[i], n = nodes[i], isS = i === selI, isH = i === hover, r = (isH || isS ? 23 : 19) * p.f * (isS ? 1 + 0.05 * Math.sin(T * 3) : 1), depth = Math.max(0.35, Math.min(1, (p.z + 300) / 500));
        const blurOn = p.z < -150 && W > 520 && 'filter' in ctx; if (blurOn) ctx.filter = 'blur(1.6px)';
        const aura = ctx.createRadialGradient(p.x, p.y, r * 0.8, p.x, p.y, r * 3.4); aura.addColorStop(0, rgba(C, isS ? 0.7 : 0.38)); aura.addColorStop(1, rgba(C, 0)); ctx.globalAlpha = depth; ctx.fillStyle = aura; ctx.beginPath(); ctx.arc(p.x, p.y, r * 3.4, 0, PI2); ctx.fill();
        const sp = ctx.createRadialGradient(p.x - r * 0.4, p.y - r * 0.45, r * 0.05, p.x, p.y, r); sp.addColorStop(0, rgba(mix(C, 0.8), 1)); sp.addColorStop(0.35, rgba(C, 1)); sp.addColorStop(1, rgba(dark(C, 0.32), 1)); ctx.fillStyle = sp; ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, PI2); ctx.fill();
        ctx.save(); ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, PI2); ctx.clip(); const rim = ctx.createRadialGradient(p.x, p.y, r * 0.55, p.x, p.y, r); rim.addColorStop(0, 'rgba(255,255,255,0)'); rim.addColorStop(1, 'rgba(255,255,255,.42)'); ctx.fillStyle = rim; ctx.fillRect(p.x - r, p.y - r, r * 2, r * 2); const cau = ctx.createRadialGradient(p.x + r * 0.2, p.y + r * 0.62, 0, p.x + r * 0.2, p.y + r * 0.62, r * 0.7); cau.addColorStop(0, rgba(mix(C, 0.85), 0.55)); cau.addColorStop(1, rgba(C, 0)); ctx.fillStyle = cau; ctx.fillRect(p.x - r, p.y - r, r * 2, r * 2); ctx.restore();
        ctx.lineWidth = isS ? 2.5 : 1.4; ctx.strokeStyle = rgba(mix(C, 0.55), isS ? 1 : 0.7); ctx.stroke();
        ctx.globalAlpha = depth * 0.75; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.ellipse(p.x - r * 0.35, p.y - r * 0.42, r * 0.22, r * 0.12, -0.6, 0, PI2); ctx.fill();
        ctx.globalAlpha = depth; ctx.fillStyle = '#071029'; ctx.font = '800 ' + Math.round(r * 0.95) + 'px system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(n.t[0], p.x, p.y + 1);
        if (isS && !calm) { for (let k3 = 0; k3 < 3; k3++) { const a3 = T * 1.7 + k3 * 2.094, sx = p.x + Math.cos(a3) * r * 1.9, sy = p.y + Math.sin(a3) * r * 0.62, sr = r * (0.13 + 0.05 * Math.sin(a3)); ctx.globalAlpha = depth * (0.55 + 0.45 * Math.sin(a3)); const sg2 = ctx.createRadialGradient(sx - sr * 0.3, sy - sr * 0.3, 0, sx, sy, sr); sg2.addColorStop(0, '#fff'); sg2.addColorStop(1, rgba(C, 1)); ctx.fillStyle = sg2; ctx.beginPath(); ctx.arc(sx, sy, sr, 0, PI2); ctx.fill(); } }
        if (isS) { const k = (T * 0.9) % 1; ctx.globalAlpha = depth * (1 - k); ctx.strokeStyle = rgba(mix(C, 0.4), 1); ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(p.x, p.y, r * (1.2 + k * 1.4), 0, PI2); ctx.stroke(); }
        if (p.z > -110 || isS || isH) { ctx.globalAlpha = isS || isH ? 1 : depth; ctx.font = (isS || isH ? '700 ' : '600 ') + Math.round(Math.max(11, 12.5 * p.f)) + 'px system-ui,sans-serif'; const w = ctx.measureText(n.t).width + 16; lw[i] = w; const ly = p.y + r + 17; ctx.fillStyle = 'rgba(6,12,36,.82)'; ctx.fillRect(p.x - w / 2, ly - 11, w, 22); ctx.strokeStyle = rgba(C, isS ? 0.9 : 0.35); ctx.lineWidth = 1; ctx.strokeRect(p.x - w / 2, ly - 11, w, 22); ctx.fillStyle = '#fff'; ctx.fillText(n.t, p.x, ly + 1); } else lw[i] = 0;
        if (blurOn) ctx.filter = 'none';
      });
      ctx.globalAlpha = 1; ctx.strokeStyle = 'rgba(140,190,255,.55)'; ctx.lineWidth = 2;
      [[14, 14, 1, 1], [W - 14, 14, -1, 1], [14, H - 14, 1, -1], [W - 14, H - 14, -1, -1]].forEach(([x, y, a, b]) => { ctx.beginPath(); ctx.moveTo(x, y + 22 * b); ctx.lineTo(x, y); ctx.lineTo(x + 22 * a, y); ctx.stroke(); });
      ctx.fillStyle = 'rgba(190,215,255,.9)'; ctx.font = '12px ui-monospace,Menlo,Consolas,monospace'; ctx.textAlign = 'left'; ctx.fillText(((tabs[g] && tabs[g].textContent) || '').toUpperCase() + '  //  ' + nodes.length + ' NODES  //  SELECTED ' + (selI + 1), 28, 32);
    };
    let T = 0;
    rs(); setGroup(0); fromHash(); wake();
  } catch (err) { try { if (typeof GLR !== 'undefined' && GLR) GLR.dispose(); } catch {} root.classList.remove('ongal'); delete root.dataset.g3; root.querySelectorAll('.gstage,.gtip').forEach((x) => x.remove()); root.querySelectorAll('.dtl').forEach((a) => { a.hidden = false; }); }
});
/*G3END*/
document.querySelectorAll('.ring3d').forEach((root) => {
  if (root.dataset.g3) return;
  const rings = [...root.querySelectorAll('.ring')], tabs = [...root.querySelectorAll('[role=tab]')], stage = root.querySelector('.stage'), sel = root.querySelector('.sel');
  const [hh, pp, bb] = [sel.querySelector('h3'), sel.querySelector('p'), sel.querySelector('.btn')];
  root.classList.add('on3d'); let act = 0, drag = null, moved = 0;
  const mod = (a, n) => ((a % n) + n) % n;
  const lay = (r) => { const cs = [...r.querySelectorAll('.c3')], n = cs.length; r._cs = cs; r._n = n; r._step = 360 / n; const w = cs[0].offsetWidth || 210; r._R = n > 2 ? Math.round(w / 2 / Math.tan(Math.PI / n)) + 36 : 0; cs.forEach((c, i) => { c.style.transform = `rotateY(${i * r._step}deg) translateZ(${r._R}px)`; }); if (r._cur === undefined) r._cur = 0; };
  const show = (r, cur) => { r._cur = cur; const f = mod(cur, r._n); r.style.transform = `translateZ(${-r._R}px) rotateY(${-cur * r._step}deg)`; r._cs.forEach((c, i) => { const d = Math.min(mod(i - f, r._n), mod(f - i, r._n)); c.classList.toggle('front', d === 0); c.style.opacity = d === 0 ? 1 : d === 1 ? 0.8 : 0.4; c.tabIndex = d === 0 ? 0 : -1; if (d === 0) { hh.textContent = c.dataset.t; pp.textContent = c.dataset.d; const h = c.getAttribute('href'); bb.hidden = !h; if (h) { bb.href = h; bb.textContent = 'Open ' + c.dataset.t; } } }); };
  const go = (r, i) => { let d = mod(i - mod(r._cur, r._n), r._n); if (d > r._n / 2) d -= r._n; show(r, r._cur + d); };
  const pick = (g) => { act = g; rings.forEach((r, i) => r.classList.toggle('on', i === g)); tabs.forEach((t, i) => t.setAttribute('aria-selected', String(i === g))); lay(rings[g]); show(rings[g], rings[g]._cur); };
  tabs.forEach((t, i) => t.addEventListener('click', () => pick(i)));
  root.querySelector('.prev').addEventListener('click', () => show(rings[act], rings[act]._cur - 1));
  root.querySelector('.next').addEventListener('click', () => show(rings[act], rings[act]._cur + 1));
  root.addEventListener('keydown', (e) => { if (e.key === 'ArrowLeft') { e.preventDefault(); show(rings[act], rings[act]._cur - 1); } if (e.key === 'ArrowRight') { e.preventDefault(); show(rings[act], rings[act]._cur + 1); } });
  rings.forEach((r) => r.querySelectorAll('.c3').forEach((c, i) => c.addEventListener('click', (e) => { if (moved > 6 || !c.classList.contains('front') || !c.getAttribute('href')) { e.preventDefault(); if (moved <= 6) go(r, i); } })));
  stage.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, off: 0 }; moved = 0; stage.classList.add('drag'); });
  addEventListener('pointermove', (e) => { if (!drag) return; const r = rings[act]; drag.off = (e.clientX - drag.x) * 0.3; moved = Math.max(moved, Math.abs(e.clientX - drag.x)); r.style.transition = 'none'; r.style.transform = `translateZ(${-r._R}px) rotateY(${-r._cur * r._step + drag.off}deg)`; });
  addEventListener('pointerup', () => { if (!drag) return; const r = rings[act]; r.style.transition = ''; const off = drag.off; drag = null; stage.classList.remove('drag'); show(r, r._cur - Math.round(off / r._step)); });
  pick(0);
});
addEventListener('keydown', (e) => { if (/INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return; const ctl = document.querySelector('.scene .ctl'); if (!ctl) return; const n = +e.key; if (n >= 1 && n <= 4 && ctl.children[n]) ctl.children[n].click(); if (e.key === 'p' || e.key === 'P') ctl.children[0].click(); });
/*FX*/
(() => { try {
  const SEL = '.btn,button,.card,nav#nav a,.chips a,.logo,.foot a,.tabs button,.ctl button';
  const st = { get: (k) => { try { return localStorage.getItem(k); } catch { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch {} } };
  let fxon = st.get('fx') !== 'off' && !calm; const html = document.documentElement;
  if (!fxon) html.classList.add('nofx');
  const cv = document.createElement('canvas'); cv.className = 'fxc'; cv.setAttribute('aria-hidden', 'true'); document.body.append(cv); const c = cv.getContext('2d');
  let W = 0, H = 0, parts = [], rings = [], run = false;
  const rs = () => { const d = window.devicePixelRatio || 1; W = innerWidth; H = innerHeight; cv.width = W * d; cv.height = H * d; c.setTransform(d, 0, 0, d, 0, 0); }; rs(); addEventListener('resize', rs);
  const cs = (v, f) => (getComputedStyle(document.body).getPropertyValue(v).trim() || f);
  const tick = () => { c.clearRect(0, 0, W, H); parts = parts.filter((p) => p.l > 0); parts.forEach((p) => { p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.vx *= 0.98; p.l -= p.d; c.globalAlpha = Math.max(0, p.l); c.fillStyle = p.c; c.beginPath(); c.arc(p.x, p.y, p.r * p.l + 0.5, 0, 6.283); c.fill(); }); rings = rings.filter((r) => r.l > 0); rings.forEach((r) => { r.r += 4; r.l -= 0.045; c.globalAlpha = Math.max(0, r.l); c.strokeStyle = r.c; c.lineWidth = 2; c.beginPath(); c.arc(r.x, r.y, r.r, 0, 6.283); c.stroke(); }); if (parts.length || rings.length) requestAnimationFrame(tick); else { run = false; c.clearRect(0, 0, W, H); } };
  const go = () => { if (!run) { run = true; requestAnimationFrame(tick); } };
  const burst = (x, y, big) => { const a = cs('--indigo', '#3b4cca'), b = cs('--teal', '#0e9aa7'), n = big ? 26 : 14; for (let i = 0; i < n; i++) { const an = Math.random() * 6.283, s = 2 + Math.random() * (big ? 7 : 5); parts.push({ x, y, vx: Math.cos(an) * s, vy: Math.sin(an) * s, l: 1, d: 0.022, c: i % 2 ? a : b, r: 2 + Math.random() * 3 }); } rings.push({ x, y, r: 6, l: 1, c: a }); go(); };
  let lastT = 0, cur = null;
  const reset = (t) => { if (!t) return; t.style.transition = ''; t.style.transform = ''; t.style.filter = ''; };
  const xp = { v: +st.get('xp') || 0 }; const hud = document.createElement('div'); hud.className = 'hud'; hud.setAttribute('aria-hidden', 'true'); const mkEl = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt) e.textContent = txt; return e; }; const lvb = mkEl('b', '', 'LV '); lvb.append(mkEl('span', 'lv', '1')); const bar = mkEl('i'); bar.append(mkEl('u')); hud.append(lvb, bar, mkEl('span', 'xt'));
  const toast = document.createElement('div'); toast.className = 'toast'; toast.setAttribute('role', 'status'); const fb = document.createElement('button'); fb.type = 'button'; fb.className = 'fxbtn'; fb.setAttribute('aria-label', 'Toggle special effects');
  document.body.append(hud, toast, fb);
  const draw = () => { const lv = Math.floor(xp.v / 100) + 1; hud.querySelector('.lv').textContent = lv; hud.querySelector('u').style.width = xp.v % 100 + '%'; hud.querySelector('.xt').textContent = xp.v + ' XP'; fb.textContent = fxon ? 'FX on' : 'FX off'; fb.setAttribute('aria-pressed', String(fxon)); hud.hidden = !fxon; };
  let tt = 0; const say = (m) => { toast.textContent = m; toast.classList.add('on'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('on'), 2600); };
  const add = (n, msg) => { if (!fxon) return; const l0 = Math.floor(xp.v / 100); xp.v += n; st.set('xp', xp.v); draw(); if (Math.floor(xp.v / 100) > l0) say('Level up! You reached level ' + (Math.floor(xp.v / 100) + 1)); else if (msg) say(msg); };
  let vis = []; try { vis = JSON.parse(st.get('vis') || '[]'); } catch {}
  draw(); if (!vis.includes(location.pathname)) { vis.push(location.pathname); st.set('vis', JSON.stringify(vis)); add(10, '+10 XP: new area discovered' + (vis.length === 5 ? '. Achievement: Explorer (5 areas)' : vis.length === 12 ? '. Achievement: Cartographer (12 areas)' : '')); }
  fb.addEventListener('click', () => { fxon = !fxon; st.set('fx', fxon ? 'on' : 'off'); html.classList.toggle('nofx', !fxon); draw(); if (!fxon) say('Special effects off'); });
  document.addEventListener('pointerdown', (e) => { if (!fxon) return; const t = e.target.closest ? e.target.closest(SEL) : null; burst(e.clientX, e.clientY, !!t); if (t) { add(1); t.style.transition = 'transform .08s'; t.style.transform = 'perspective(700px) translateZ(-8px) scale(.95)'; t.style.filter = 'none'; } });
  document.addEventListener('pointerup', () => { if (cur) { cur.style.transition = ''; cur.style.transform = ''; } });
  document.addEventListener('pointermove', (e) => {
    if (!fxon || e.pointerType === 'touch') return;
    const tg = e.target.closest ? e.target : null, t = tg && tg.closest(SEL);
    if (!/INPUT|TEXTAREA|SELECT/.test((tg || {}).tagName || '') && e.timeStamp - lastT > 38 && !(e.buttons)) { lastT = e.timeStamp; parts.push({ x: e.clientX, y: e.clientY, vx: (Math.random() - 0.5) * 0.8, vy: (Math.random() - 0.5) * 0.8, l: 0.8, d: 0.04, c: cs('--teal', '#0e9aa7'), r: 2.4 }); go(); }
    if (t !== cur) { reset(cur); cur = t; }
    if (!t || t.classList.contains('dragging') || (t.classList.contains('rv') && !t.classList.contains('in') && html.classList.contains('js')) || e.buttons) return;
    const r = t.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5, k = r.width > 420 ? 3 : r.width > 220 ? 8 : 14;
    t.style.transition = 'transform .1s ease-out'; t.style.transform = 'perspective(700px) rotateX(' + (-py * k).toFixed(2) + 'deg) rotateY(' + (px * k).toFixed(2) + 'deg) translateZ(14px)'; t.style.filter = 'drop-shadow(' + (-px * 14).toFixed(1) + 'px ' + (-py * 14 + 10).toFixed(1) + 'px 14px rgba(20,33,61,.28))';
  });
  document.addEventListener('pointerleave', () => { reset(cur); cur = null; });
  // rubber-band drag on cards
  let dg = null, moved = 0;
  document.addEventListener('pointerdown', (e) => { if (!fxon || e.pointerType === 'touch' || e.button) return; const t = e.target.closest ? e.target.closest('.card') : null; if (!t || e.target.closest('input,textarea,select')) return; dg = { t, x: e.clientX, y: e.clientY }; moved = 0; });
  addEventListener('pointermove', (e) => { if (!dg) return; const dx = e.clientX - dg.x, dy = e.clientY - dg.y; moved = Math.max(moved, Math.abs(dx) + Math.abs(dy)); if (moved < 6) return; dg.t.classList.add('dragging'); dg.t.style.transition = 'none'; dg.t.style.filter = 'drop-shadow(0 22px 22px rgba(20,33,61,.3))'; dg.t.style.transform = 'perspective(700px) translate3d(' + dx * 0.6 + 'px,' + dy * 0.6 + 'px,50px) rotateZ(' + dx * 0.02 + 'deg) rotateX(' + -dy * 0.05 + 'deg) rotateY(' + dx * 0.05 + 'deg)'; });
  addEventListener('pointerup', () => { if (!dg) return; const t = dg.t; dg = null; if (moved >= 6) { burst(t.getBoundingClientRect().left + t.offsetWidth / 2, t.getBoundingClientRect().top + t.offsetHeight / 2, true); t.style.transition = 'transform .6s cubic-bezier(.34,1.56,.64,1),filter .4s'; t.style.transform = ''; t.style.filter = ''; setTimeout(() => t.classList.remove('dragging'), 620); } });
  document.addEventListener('click', (e) => { if (moved >= 6) { e.preventDefault(); e.stopPropagation(); moved = 0; return; } const a = e.target.closest ? e.target.closest('a[href]') : null; if (!a || !fxon || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || a.target || a.hasAttribute('download')) return; const h = a.getAttribute('href'); if (/^(mailto:|tel:|#)/.test(h)) return; const u = new URL(a.href, location.href); if (u.origin !== location.origin || (u.pathname === location.pathname && u.hash)) return; e.preventDefault(); html.classList.add('leaving'); setTimeout(() => { location.href = a.href; }, 230); }, true);
  addEventListener('pageshow', (e) => { if (e.persisted) html.classList.remove('leaving'); });
} catch (err) { /* effects are optional */ } })();
/*FXEND*/

/*VER*/
(() => {
  const sel = document.getElementById('vsel'), panels = [...document.querySelectorAll('.vpanel')];
  if (sel && panels.length) { const show = () => panels.forEach((p) => { p.hidden = p.dataset.v !== sel.value; }); sel.addEventListener('change', show); show(); }
  const ls = document.getElementById('lversion');
  if (ls) { const v = new URLSearchParams(location.search).get('v'); if (v) { const o = [...ls.options].find((x) => x.dataset.v === v.toLowerCase()); if (o) ls.value = o.value; } }
})();
/*VEREND*/

/*F3 v3.0.0: 3D flow stage controller. Progressive enhancement over the .f3list step cards: needs WebGL2, otherwise the cards stay as they are. */
(() => {
  const els = [...document.querySelectorAll('.flow3d')];
  if (!els.length || !window.IXGL || !IXGL.flowHost || !IXGL.supported()) return;
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  let host = null;
  const mk = (tag, cls, txt) => { const n = document.createElement(tag); if (cls) n.className = cls; if (txt) n.textContent = txt; return n; };
  const btn = (label, cls, aria) => { const b = mk('button', cls, label); b.type = 'button'; if (aria) b.setAttribute('aria-label', aria); return b; };
  const sync = (st, step, playing) => {
    st.chips.forEach((c, i) => c.setAttribute('aria-pressed', String(i === step + 1)));
    const s = st.data.s[step];
    st.capB.textContent = s ? 'Step ' + (step + 1) + ' of ' + st.data.s.length + ': ' + s[0] + '.' : 'Overview.';
    st.capT.textContent = s ? s[1] : 'All ' + st.data.s.length + ' steps of this flow. Pick a step, or press play to walk through it.';
    if (st.list) [...st.list.children].forEach((li, i) => li.classList.toggle('on', i === step));
    st.play.textContent = playing ? 'Pause' : 'Play'; st.play.setAttribute('aria-pressed', String(!!playing));
  };
  const setup = (el) => {
    if (el._f3) return el._f3;
    let data; try { data = JSON.parse(el.dataset.f); } catch { return null; }
    if (!data || !Array.isArray(data.n) || !Array.isArray(data.s) || !data.s.length) return null;
    const title = el.dataset.ttl || data.t || 'flow', wrap = mk('div', 'f3'), stage = mk('div', 'f3stage'), bar = mk('div', 'f3bar'), cap = mk('p', 'f3cap'), capB = mk('b'), capT = mk('span');
    stage.tabIndex = 0; stage.setAttribute('role', 'group'); stage.setAttribute('aria-label', 'Interactive 3D diagram: ' + title + '. Use the left and right arrow keys to change step. The steps are also written out as text.');
    cap.setAttribute('aria-live', 'polite'); cap.append(capB, document.createTextNode(' '), capT);
    const prev = btn('\u2039', 'f3b', 'Previous step'), next = btn('\u203A', 'f3b', 'Next step'), play = btn('Play', 'f3b f3play'), reset = btn('Reset view', 'f3b f3reset'), all = btn('All', 'f3c', 'Show the whole flow'), chips = mk('span', 'f3chips');
    play.setAttribute('aria-pressed', 'false'); if (calm) play.hidden = true;
    chips.append(all); data.s.forEach((s, i) => chips.append(btn(String(i + 1), 'f3c', 'Step ' + (i + 1) + ': ' + s[0])));
    bar.append(prev, chips, next, play, reset); wrap.append(stage, bar, cap);
    const list = el.querySelector('.f3list'); el.insertBefore(wrap, el.firstChild); if (list) list.classList.add('live');
    const st = { wrap, stage, data, ctl: null, chips: [...chips.children], list, capB, capT, play, timer: 0, touched: false };
    const go = (i) => { st.touched = true; if (st.ctl) st.ctl.goto(i, true); };
    st.chips.forEach((c, i) => c.addEventListener('click', () => go(i - 1)));
    prev.addEventListener('click', () => { st.touched = true; if (st.ctl) st.ctl.prev(true); });
    next.addEventListener('click', () => { st.touched = true; if (st.ctl) st.ctl.next(true); });
    play.addEventListener('click', () => { st.touched = true; if (st.ctl) st.ctl.play(!st.ctl.playing); });
    reset.addEventListener('click', () => { if (st.ctl) st.ctl.resetView(); });
    if (list) [...list.children].forEach((li, i) => li.addEventListener('click', () => go(i)));
    stage.addEventListener('keydown', (e) => { const c = st.ctl; if (!c) return; if (e.key === 'ArrowRight') { st.touched = true; c.next(true); e.preventDefault(); } else if (e.key === 'ArrowLeft') { st.touched = true; c.prev(true); e.preventDefault(); } else if (e.key === ' ' || e.key === 'Enter') { st.touched = true; c.play(!c.playing); e.preventDefault(); } else if (e.key === 'Home') { go(-1); e.preventDefault(); } });
    stage.addEventListener('pointerdown', () => { st.touched = true; if (st.ctl && st.ctl.playing) st.ctl.play(false); });
    el._f3 = st; el.classList.add('f3on'); sync(st, -1, false); return st;
  };
  const hide = (el) => { const st = el._f3; if (!st) return; clearInterval(st.timer); if (st.ctl) { st.ctl.destroy(); st.ctl = null; } };
  const fail = (el) => { const st = el._f3; hide(el); if (st) { st.wrap.remove(); if (st.list) st.list.classList.remove('live'); } el._f3 = null; el._dead = true; el.classList.remove('f3on'); el.dataset.gl = 'off'; };
  const show = (el) => {
    const st = setup(el); if (!st) { el._dead = true; return; }
    if (st.ctl) return;
    try { if (!host) host = IXGL.flowHost(); st.ctl = host.attach(st.stage, st.data, {}); } catch { fail(el); return; }
    st.ctl.onStep = (i, p) => sync(st, i, p);
    sync(st, -1, false); st.ctl.play(!calm && !st.touched);
    el.dataset.gl = 'webgl2'; clearInterval(st.timer);
    st.timer = setInterval(() => { if (!host) return; const i = host.info(); el.dataset.frames = i.frames; el.dataset.fps = i.fps; el.dataset.q = i.q; el.dataset.err = i.err; }, 1000);
  };
  // Build every stage skeleton now so the page layout is final (no jump when a stage mounts); only the WebGL mount is lazy.
  els.forEach((el) => { if (!setup(el)) el._dead = true; });
  const io = new IntersectionObserver((es) => es.forEach((e) => { const el = e.target; if (el._dead) return; if (e.isIntersecting) show(el); else hide(el); }), { rootMargin: '320px', threshold: 0 });
  els.forEach((el) => { if (!el._dead) io.observe(el); });
})();
