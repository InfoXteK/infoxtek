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
    const groups = [...root.querySelectorAll('.ring')].map((r) => [...r.querySelectorAll('.c3')].map((c) => ({ t: c.dataset.t, d: c.dataset.d, h: c.getAttribute('href') })));
    const tabs = [...root.querySelectorAll('[role=tab]')], sel = root.querySelector('.sel'), stageEl = root.querySelector('.stage');
    const cv = document.createElement('canvas'), ctx = cv.getContext('2d'); if (!ctx || !groups.length || !sel || !stageEl) return;
    const COL = ['#22d3ee', '#a78bfa', '#f472b6', '#fbbf24'], calm = matchMedia('(prefers-reduced-motion: reduce)').matches, PI2 = Math.PI * 2;
    const box = document.createElement('div'); box.className = 'gstage'; cv.tabIndex = 0; cv.setAttribute('role', 'application'); cv.setAttribute('aria-label', 'Interactive 3D map. Drag to orbit, click a node to select it, arrow keys move between nodes, Enter opens.');
    box.append(cv); root.insertBefore(box, stageEl);
    const tip = document.createElement('p'); tip.className = 'tip gtip'; tip.textContent = 'Drag to orbit. Click a glowing node to select it, click it again to open. Arrow keys move between nodes, Enter opens.'; sel.after(tip);
    const hh = sel.querySelector('h3'), pp = sel.querySelector('p'), bb = sel.querySelector('.btn');
    root.dataset.g3 = '1'; root.classList.add('ongal');
    let g = 0, selI = 0, W = 0, H = 0, yaw = 0.6, pitch = 0.2, vy = 0, vp = 0, drag = null, hover = -1, tr = 1, fly = null, t0 = 0, on = true, P = [], pos = [], prev = [], nodes = groups[0];
    const clamp = (v) => Math.max(-0.7, Math.min(0.7, v)), md = (a) => ((a % PI2) + PI2) % PI2;
    const fib = (n, R) => Array.from({ length: n }, (_, i) => { const y = n === 1 ? 0 : 1 - (2 * i) / (n - 1), r = Math.sqrt(Math.max(0, 1 - y * y)), a = i * 2.399963; return [Math.cos(a) * r * R, y * R * 0.8, Math.sin(a) * r * R]; });
    const stars = Array.from({ length: 150 }, () => [(Math.random() - 0.5) * 900, (Math.random() - 0.5) * 700, (Math.random() - 0.5) * 800]);
    const rs = () => { const r = box.getBoundingClientRect(), d = window.devicePixelRatio || 1; W = r.width; H = r.height; cv.width = Math.round(W * d); cv.height = Math.round(H * d); ctx.setTransform(d, 0, 0, d, 0, 0); };
    const proj = (p) => { const cy = Math.cos(yaw), sy = Math.sin(yaw), cp = Math.cos(pitch), sp = Math.sin(pitch); const x = p[0] * cy + p[2] * sy, z1 = -p[0] * sy + p[2] * cy, y = p[1] * cp - z1 * sp, z = p[1] * sp + z1 * cp, f = 700 / (700 - z); return { x: W / 2 + x * f, y: H / 2 + y * f, z, f }; };
    const choose = (i, doFly) => { selI = i; const n = nodes[i]; hh.textContent = n.t; pp.textContent = n.d; bb.hidden = !n.h; if (n.h) { bb.href = n.h; bb.textContent = 'Open ' + n.t; } if (doFly && pos[i]) { const [x, y, z] = pos[i], R = Math.hypot(x, z) || 1; fly = { yaw: -Math.atan2(x, z), pitch: clamp(Math.atan2(y, R)) }; vy = vp = 0; } };
    const setGroup = (k) => { g = k; nodes = groups[k]; prev = pos.length ? pos.map((q) => q.slice()) : []; pos = fib(nodes.length, 200); tr = 0; tabs.forEach((t, i) => t.setAttribute('aria-selected', String(i === k))); choose(0, true); };
    const hit = (mx, my) => { let b = -1, bd = 1e9; P.forEach((p, i) => { const d = Math.hypot(p.x - mx, p.y - my); if (d < Math.max(26, 18 * p.f + 8) && d < bd) { bd = d; b = i; } }); return b; };
    const xy = (e) => { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    const open = (i) => { const h = nodes[i] && nodes[i].h; if (typeof h === 'string' && /^\/(?!\/)/.test(h)) location.href = h; };
    cv.addEventListener('pointerdown', (e) => { drag = { x: e.clientX, y: e.clientY, m: 0 }; fly = null; try { cv.setPointerCapture(e.pointerId); } catch {} });
    cv.addEventListener('pointermove', (e) => { const [mx, my] = xy(e); if (drag) { const dx = e.clientX - drag.x, dy = e.clientY - drag.y; drag.m += Math.abs(dx) + Math.abs(dy); drag.x = e.clientX; drag.y = e.clientY; yaw += dx * 0.007; pitch = clamp(pitch + dy * 0.005); vy = dx * 0.0009; vp = dy * 0.0006; return; } hover = hit(mx, my); cv.style.cursor = hover >= 0 ? 'pointer' : ''; });
    cv.addEventListener('pointerup', (e) => { if (drag && drag.m < 6) { const [mx, my] = xy(e), h = hit(mx, my); if (h >= 0) { if (h === selI) open(h); else choose(h, true); } } drag = null; });
    cv.addEventListener('pointerleave', () => { hover = -1; });
    cv.addEventListener('keydown', (e) => { const n = nodes.length; if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { e.preventDefault(); choose((selI + (e.key === 'ArrowRight' ? 1 : n - 1)) % n, true); } else if (e.key === 'Enter') { e.preventDefault(); open(selI); } });
    tabs.forEach((t, i) => t.addEventListener('click', () => setGroup(i)));
    if ('IntersectionObserver' in window) new IntersectionObserver((es) => { on = es[0].isIntersecting; }).observe(box);
    addEventListener('resize', rs);
    const loop = (ts) => {
      requestAnimationFrame(loop); if (!on || !W) return; const dt = Math.min(0.05, (ts - t0) / 1000 || 0.016); t0 = ts;
      if (!drag) { yaw += vy; pitch = clamp(pitch + vp); vy *= 0.94; vp *= 0.94; if (!calm && !fly && Math.abs(vy) < 0.0006) yaw += 0.0022; }
      if (fly) { const dy = md(fly.yaw - yaw + Math.PI) - Math.PI; yaw += dy * 0.1; pitch += (fly.pitch - pitch) * 0.1; if (Math.abs(dy) < 0.008 && Math.abs(fly.pitch - pitch) < 0.008) fly = null; }
      if (tr < 1) tr = Math.min(1, tr + dt * 1.5);
      const e = 1 - Math.pow(1 - tr, 3), col = COL[g % COL.length]; ctx.clearRect(0, 0, W, H);
      stars.forEach((s) => { const q = proj(s); if (q.f > 3) return; ctx.globalAlpha = Math.max(0.08, Math.min(0.7, 0.45 * q.f)); ctx.fillStyle = '#cfe0ff'; ctx.fillRect(q.x, q.y, 1.7 * q.f, 1.7 * q.f); });
      P = nodes.map((_, i) => { const a = prev[i] || [0, 0, 0], b = pos[i]; return proj([a[0] + (b[0] - a[0]) * e, a[1] + (b[1] - a[1]) * e, a[2] + (b[2] - a[2]) * e]); });
      const hub = proj([0, 0, 0]); ctx.strokeStyle = col; ctx.lineWidth = 1.2;
      P.forEach((p, i) => { const q = P[(i + 1) % P.length], depth = (p.z + q.z + 520) / 1040; if (q !== p) { ctx.globalAlpha = 0.12 + 0.3 * depth; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke(); } ctx.globalAlpha = 0.22; ctx.beginPath(); ctx.moveTo(hub.x, hub.y); ctx.lineTo(p.x, p.y); ctx.stroke(); const k = (ts / 2200 + i * 0.173) % 1; ctx.globalAlpha = 0.9; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(hub.x + (p.x - hub.x) * k, hub.y + (p.y - hub.y) * k, 2.2 * p.f, 0, PI2); ctx.fill(); });
      const hg = ctx.createRadialGradient(hub.x, hub.y, 0, hub.x, hub.y, 70 * hub.f); hg.addColorStop(0, col + 'aa'); hg.addColorStop(1, col + '00'); ctx.globalAlpha = 0.9 + 0.1 * Math.sin(ts / 500); ctx.fillStyle = hg; ctx.beginPath(); ctx.arc(hub.x, hub.y, 70 * hub.f, 0, PI2); ctx.fill();
      ctx.globalAlpha = 1; ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(hub.x, hub.y, 6 * hub.f, 0, PI2); ctx.fill();
      P.map((_, i) => i).sort((a, b) => P[a].z - P[b].z).forEach((i) => {
        const p = P[i], n = nodes[i], isS = i === selI, isH = i === hover, r = (isH || isS ? 20 : 16) * p.f, depth = Math.max(0.3, Math.min(1, (p.z + 260) / 460));
        const gr = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r * 3.2); gr.addColorStop(0, col + (isS ? 'cc' : '77')); gr.addColorStop(1, col + '00');
        ctx.globalAlpha = depth; ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(p.x, p.y, r * 3.2, 0, PI2); ctx.fill();
        ctx.fillStyle = '#0b1230'; ctx.strokeStyle = col; ctx.lineWidth = isS ? 3 : 2; ctx.beginPath(); ctx.arc(p.x, p.y, r, 0, PI2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#fff'; ctx.font = '700 ' + Math.round(r * 0.95) + 'px system-ui,sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(n.t[0], p.x, p.y + 1);
        if (isS) { const k = (ts / 1000) % 1; ctx.globalAlpha = depth * (1 - k); ctx.beginPath(); ctx.arc(p.x, p.y, r * (1.25 + k * 1.3), 0, PI2); ctx.stroke(); }
        if (p.z > -90 || isS || isH) { ctx.globalAlpha = isS || isH ? 1 : depth; ctx.font = (isS || isH ? '700 ' : '600 ') + Math.round(Math.max(11, 12 * p.f)) + 'px system-ui,sans-serif'; const w = ctx.measureText(n.t).width + 14, ly = p.y + r + 15; ctx.fillStyle = 'rgba(8,14,40,.78)'; ctx.fillRect(p.x - w / 2, ly - 10, w, 20); ctx.fillStyle = '#fff'; ctx.fillText(n.t, p.x, ly); }
      });
      ctx.globalAlpha = 1; ctx.strokeStyle = 'rgba(140,190,255,.55)'; ctx.lineWidth = 2;
      [[14, 14, 1, 1], [W - 14, 14, -1, 1], [14, H - 14, 1, -1], [W - 14, H - 14, -1, -1]].forEach(([x, y, a, b]) => { ctx.beginPath(); ctx.moveTo(x, y + 22 * b); ctx.lineTo(x, y); ctx.lineTo(x + 22 * a, y); ctx.stroke(); });
      ctx.fillStyle = 'rgba(190,215,255,.9)'; ctx.font = '12px ui-monospace,Menlo,Consolas,monospace'; ctx.textAlign = 'left'; ctx.fillText(((tabs[g] && tabs[g].textContent) || '').toUpperCase() + '  //  ' + nodes.length + ' NODES  //  SELECTED ' + (selI + 1), 28, 32);
    };
    rs(); setGroup(0); requestAnimationFrame(loop);
  } catch (err) { root.classList.remove('ongal'); delete root.dataset.g3; root.querySelectorAll('.gstage,.gtip').forEach((x) => x.remove()); }
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
