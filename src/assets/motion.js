/* v3.4.0: motion override. Browsers/OS with "reduce motion" (also many remote desktops, VMs and battery-saver modes) switch off every 2D scene and 3D flow by design. This lets the visitor turn them back on with one click; the choice is remembered. Loaded first so every later script sees the result. */
(() => {
  const KEY = 'ix-motion', mm = window.matchMedia.bind(window), re = /prefers-reduced-motion\s*:\s*reduce/;
  let sys = false, on = false;
  try { sys = mm('(prefers-reduced-motion: reduce)').matches; } catch (e) { return; }
  try {
    if (/[?&]motion=on\b/.test(location.search)) localStorage.setItem(KEY, 'on');
    if (/[?&]motion=off\b/.test(location.search)) localStorage.removeItem(KEY);
    on = localStorage.getItem(KEY) === 'on';
  } catch (e) { on = /[?&]motion=on\b/.test(location.search); }
  if (sys && on) {
    document.documentElement.classList.add('motion-on');
    window.matchMedia = (q) => {
      const r = mm(q);
      if (!re.test(String(q))) return r;
      return { matches: false, media: String(q), onchange: null, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}, dispatchEvent() { return false; } };
    };
  }
  if (!sys) return;
  const make = () => {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'motionbtn';
    b.textContent = on ? 'Animations on. Click to pause them' : 'Your system pauses animations. Click to play them';
    b.addEventListener('click', () => { try { if (on) localStorage.removeItem(KEY); else localStorage.setItem(KEY, 'on'); } catch (e) {} location.reload(); });
    document.body.appendChild(b);
  };
  if (document.body) make(); else document.addEventListener('DOMContentLoaded', make);
})();
