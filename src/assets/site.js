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
if (matchMedia('(prefers-reduced-motion: reduce)').matches) document.querySelectorAll('.scene svg').forEach((s) => s.pauseAnimations && s.pauseAnimations());
