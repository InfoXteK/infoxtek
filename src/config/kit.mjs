// SVG scene kit. All animations share one 12s loop; ranges are fractions of that loop.
const D = 'dur="12s" repeatCount="indefinite"';
export const vis = (r) => { const kt = [0], v = [0]; for (const [a, b] of r) { if (a === 0) v[0] = 1; else { kt.push(a); v.push(1); } if (b < 1) { kt.push(b); v.push(0); } } return `<animate attributeName="opacity" values="${v.join(';')}" keyTimes="${kt.join(';')}" calcMode="discrete" ${D}/>`; };
const sh = (o) => (o && o.show ? vis(o.show) : '');
export const K = {
  zone: (x, y, w, h, t) => `<rect class="zn" x="${x}" y="${y}" width="${w}" height="${h}" rx="14"/><text class="tx m" x="${x + 12}" y="${y + 16}">${t}</text>`,
  box: (x, y, w, h, t, o = {}) => `<g class="nd ${o.k || ''}"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="9"/><text x="${x + w / 2}" y="${y + h / 2 + 4}" text-anchor="middle">${t}</text>${sh(o)}</g>`,
  cyl: (x, y, w, h, t) => `<g class="nd"><path d="M${x} ${y + 8}v${h - 16}a${w / 2} 8 0 0 0 ${w} 0v${-(h - 16)}z"/><ellipse cx="${x + w / 2}" cy="${y + 8}" rx="${w / 2}" ry="8"/><text x="${x + w / 2}" y="${y + h / 2 + 8}" text-anchor="middle">${t}</text></g>`,
  txt: (x, y, s, o = {}) => `<text class="tx ${o.c || ''}" x="${x}" y="${y}" text-anchor="${o.a || 'middle'}">${s}${sh(o)}</text>`,
  line: (x1, y1, x2, y2, o = {}) => `<line class="ln ${o.c || ''}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${sh(o)}</line>`,
  pkt: (pts, c, s, l, r = 5) => { s = Math.max(s, 0.001); return `<circle r="${r}" fill="${c}" opacity="0"><animateMotion path="M${pts.map((p) => p.join(',')).join(' L')}" keyPoints="0;0;1;1" keyTimes="0;${s};${+(s + l).toFixed(3)};1" calcMode="linear" ${D}/>${vis([[s, +(s + l).toFixed(3)]])}</circle>`; },
  ring: (x, y, c, a, b) => `<circle cx="${x}" cy="${y}" r="20" fill="none" stroke="${c}" stroke-width="3" opacity="0">${vis([[a, b]])}</circle>`,
  lamp: (x, y, st) => `<circle cx="${x}" cy="${y}" r="6" fill="${st[0][1]}"><animate attributeName="fill" values="${st.map((s) => s[1]).join(';')}" keyTimes="${st.map((s) => s[0]).join(';')}" calcMode="discrete" ${D}/></circle>`,
  beat: (x1, x2, y, show, c = '') => { const h = (x2 - x1 - 19) / 2; return `<path class="ecg ${c}" d="M${x1} ${y}h${h}l5-12 8 24 6-12h${h}">${vis(show)}</path>`; },
  bar: (x, y, w, a, b, c = '#3b4cca') => `<rect class="bk" x="${x}" y="${y}" width="${w}" height="8" rx="4"/><rect x="${x}" y="${y}" height="8" rx="4" fill="${c}" width="0"><animate attributeName="width" values="0;0;${w};${w}" keyTimes="0;${a};${b};1" ${D}/></rect>`,
  move: (inner, dx, dy, a, b) => `<g>${inner}<animateTransform attributeName="transform" type="translate" values="0 0;0 0;${dx} ${dy};${dx} ${dy}" keyTimes="0;${a};${b};1" ${D}/></g>`,
};
export const nn = (x0, y0, L = [3, 5, 5, 3], dx = 60, dy = 34) => { const P = L.map((n, i) => Array.from({ length: n }, (_, j) => [x0 + i * dx, y0 + (j - (n - 1) / 2) * dy])); let o = ''; P.slice(1).forEach((l, i) => P[i].forEach((a) => l.forEach((b) => { o += `<line x1="${a[0]}" y1="${a[1]}" x2="${b[0]}" y2="${b[1]}" stroke="currentColor" stroke-opacity=".25"/>`; }))); P.flat().forEach((p, i) => { o += `<circle cx="${p[0]}" cy="${p[1]}" r="4" fill="currentColor"><animate attributeName="r" values="3;6;3" dur="${(1.6 + (i % 5) * 0.4).toFixed(1)}s" begin="-${i % 7}s" repeatCount="indefinite"/></circle>`; }); return o; };
