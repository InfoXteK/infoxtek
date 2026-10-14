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
  el.tabIndex = 0; el.setAttribute('role', 'button'); el.setAttribute('aria-label', el.textContent + ' skill chip: drag, or use the arrow keys');
  let on = false, sx, sy, ox, oy;
  el.addEventListener('pointerdown', (e) => { on = true; el.setPointerCapture(e.pointerId); el.classList.add('drag'); ox = el.offsetLeft; oy = el.offsetTop; sx = e.clientX; sy = e.clientY; e.preventDefault(); });
  el.addEventListener('pointermove', (e) => { if (!on) return; el.style.left = Math.max(0, Math.min(hero.clientWidth - el.offsetWidth, ox + e.clientX - sx)) + 'px'; el.style.top = Math.max(0, Math.min(hero.clientHeight - el.offsetHeight, oy + e.clientY - sy)) + 'px'; });
  const end = () => { on = false; el.classList.remove('drag'); };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
  el.addEventListener('keydown', (e) => { const d = { ArrowLeft: [-14, 0], ArrowRight: [14, 0], ArrowUp: [0, -14], ArrowDown: [0, 14] }[e.key]; if (!d) return; e.preventDefault(); el.style.left = el.offsetLeft + d[0] + 'px'; el.style.top = el.offsetTop + d[1] + 'px'; });
});
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll('.scene').forEach((sc) => {
  const svg = sc.querySelector('svg.main'), deep = sc.querySelector('.deep'); if (!svg || !deep) return;
  const logs = [...sc.querySelectorAll('.logs li')].map((l) => l.textContent), T = (sc.dataset.t || '').split(',').map(Number);
  sc.classList.add('ix');
  const ctl = document.createElement('div'); ctl.className = 'ctl';
  const cap = document.createElement('p'); cap.className = 'cap'; cap.setAttribute('aria-live', 'polite'); cap.textContent = 'Click a step to freeze the scene at that moment, or move your pointer over it to tilt it in 3D.';
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
