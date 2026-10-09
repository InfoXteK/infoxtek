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
  const req = { lname: 'Enter your name.', lemail: 'Enter a valid email address.', ldevice: 'Enter your Device ID.', lactivation: 'Enter your Activation Code.' };
  f.addEventListener('submit', async (e) => {
    e.preventDefault(); let bad = null;
    for (const k in req) {
      const el = f.elements[k], er = document.getElementById(k + '-e'), v = el.value.trim();
      const m = !v || (k === 'lemail' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) ? req[k] : '';
      er.hidden = !m; er.textContent = m; el.setAttribute('aria-invalid', String(!!m)); if (m && !bad) bad = el;
    }
    if (bad) { bad.focus(); st.textContent = ''; return; }
    if (f.elements.lwebsite.value) return;
    const d = Object.fromEntries(new FormData(f)), ep = f.dataset.endpoint, to = f.dataset.mailto;
    if (ep) {
      st.textContent = 'Sending...';
      try { const r = await fetch(ep, { method: 'POST', headers: { Accept: 'application/json' }, body: new FormData(f) }); if (!r.ok) throw 0; f.reset(); st.textContent = 'Request received. We will email your license key.'; } catch { st.textContent = 'Sending failed. Please try again.'; }
    } else if (to) {
      const body = `Net-Monit license request\n\nName: ${d.lname}\nEmail: ${d.lemail}\nCompany: ${d.lcompany || '-'}\nDevice ID: ${d.ldevice}\nActivation Code: ${d.lactivation}\n`;
      location.href = 'mailto:' + to + '?subject=' + encodeURIComponent('Net-Monit License Request') + '&body=' + encodeURIComponent(body);
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
