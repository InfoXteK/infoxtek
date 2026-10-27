/* InfoXteK 3D flow stage (v3.1.0). One shared WebGL2 context renders a logical flow and acts out its story:
   typed 3D nodes with idle animation, node states (fail, heal, scan, block...), distinct objects travelling along links
   (threats, tokens, workloads, coins, mail...), per-flow environment (floor, particles, props), callouts and a step camera.
   Data comes from the page (data-f JSON, validated at build time). */
(() => {
  'use strict';
  const IX = window.IXGL; if (!IX || !IX.GL) return;
  const TAU = Math.PI * 2, PI = Math.PI, U = 6.2, NS = 1.15, FOV = 0.66, calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const QF = [{ dpr: 1.25, ms: 0, bloom: 0, mirror: false }, { dpr: 1.5, ms: 4, bloom: 1, mirror: true }, { dpr: 2, ms: 4, bloom: 1, mirror: true }];
  const TONES = { info: [0.13, 0.83, 0.93], good: [0.22, 0.86, 0.55], warn: [1, 0.7, 0.2], bad: [1, 0.33, 0.4], ai: [0.67, 0.56, 0.98], mute: [0.55, 0.68, 0.9] };
  const KTONE = { threat: 'bad', firewall: 'warn', ai: 'ai', shield: 'info', lock: 'info', key: 'warn', bell: 'warn', goal: 'good', db: 'info', cloud: 'info', globe: 'info', chart: 'good', package: 'warn', tree: 'good', turbine: 'warn', bank: 'warn', school: 'ai', gov: 'info', sensor: 'good', plant: 'warn', pylon: 'warn', shop: 'warn', radar: 'info', vault: 'warn', eye: 'good', wifi: 'info', coin: 'warn', field: 'good', book: 'ai' };
  const FLOORS = ['grid', 'hex', 'circ', 'ring', 'dot', 'wave', 'rows'];
  const STCODE = { fail: 1, ok: 2, alert: 3, scan: 4, block: 5, hot: 6, build: 7, ghost: 8 };
  const GLYPH = { ok: [0.22, 0.86, 0.55], no: [1, 0.4, 0.45], warn: [1, 0.74, 0.2], lock: [0.3, 0.85, 0.95], up: [0.22, 0.86, 0.55], down: [0.3, 0.85, 0.95] };
  const TINT = [[0.8, 0.86, 0.96], null, [0.17, 0.21, 0.32], null, [0.96, 0.98, 1], [0.25, 0.72, 0.35], [0.5, 0.34, 0.2], [1, 0.8, 0.28], [0.9, 0.28, 0.28], [0.5, 0.58, 0.72], [0.45, 0.78, 1]];
  // prims: 0 box, 1 cylinder, 2 sphere, 3 thin torus, 4 cone, 5 hex prism, 6 hex cone, 7 thick torus
  const B = 0, C = 1, S = 2, T = 3, K = 4, X = 5, Y = 6, TK = 7;
  // recipe part: [prim, x, y, z, sx, sy, sz, ry, rx, tint, emissive, anim, speed, phase, pivotY]
  // anim: 1 spin, 2 sway, 3 bob, 4 pulse, 5 blink, 6 orbit (xz), 7 orbit (xy, pivot y), 8 grow from floor, 10 orbit (yz, pivot y)
  const m = (p, x, y, z, sx, sy, sz, ry, rx, t, e, a, k, ph, py) => [p, x, y, z, sx, sy, sz, ry || 0, rx || 0, t || 0, e || 0, a || 0, k || 0, ph || 0, py || 0];
  const around = (n, r, f) => Array.from({ length: n }, (_, i) => f(i, (i / n) * TAU, Math.sin((i / n) * TAU) * r, Math.cos((i / n) * TAU) * r));
  const REC = {
    user: () => [m(S, 0, 1.4, 0, 0.34, 0.34, 0.34, 0, 0, 4, 0, 3, 2.2), m(C, 0, 0.66, 0, 0.46, 0.85, 0.46, 0, 0, 1), m(S, 0, 1.02, 0, 0.5, 0.26, 0.5, 0, 0, 1)],
    device: () => [m(B, 0, 0.22, 0, 1.5, 0.12, 1, 0, 0, 2), m(B, 0, 0.72, -0.42, 1.5, 0.95, 0.08, 0, -0.28, 2), m(B, 0, 0.72, -0.37, 1.36, 0.8, 0.02, 0, -0.28, 3, 1)],
    phone: () => [m(B, 0, 0.85, 0, 0.62, 1.3, 0.1, 0, 0, 2), m(B, 0, 0.85, 0.06, 0.52, 1.14, 0.02, 0, 0, 3, 1)],
    server: () => [0, 1, 2].flatMap((i) => [m(B, 0, 0.34 + i * 0.44, 0, 1.6, 0.38, 1.1, 0, 0, 0), m(B, -0.55, 0.34 + i * 0.44, 0.56, 0.2, 0.08, 0.02, 0, 0, 3, 1, 5, 2, i * 1.7), m(B, 0.25, 0.34 + i * 0.44, 0.56, 0.7, 0.07, 0.02, 0, 0, 2)]),
    db: () => [0, 1, 2].flatMap((i) => [m(C, 0, 0.36 + i * 0.46, 0, 0.85, 0.38, 0.85, 0, 0, 0), m(T, 0, 0.56 + i * 0.46, 0, 0.87, 0.87, 0.87, 0, 0, 3, 1), m(S, 0.3, 0.36 + i * 0.46, 0.8, 0.06, 0.06, 0.06, 0, 0, 3, 1, 5, 2.4, i * 2.1)]),
    cloud: () => [m(S, -0.5, 0.86, 0, 0.5, 0.42, 0.5, 0, 0, 4, 0, 4, 1.3), m(S, 0.1, 1.06, 0, 0.66, 0.56, 0.62, 0, 0, 4, 0, 4, 1.1, 1), m(S, 0.65, 0.84, 0, 0.48, 0.4, 0.48, 0, 0, 4, 0, 4, 1.5, 2), m(C, 0.05, 0.62, 0, 0.9, 0.2, 0.55, 0, 0, 4), m(S, 0.05, 0.98, 0, 0.26, 0.26, 0.26, 0, 0, 3, 1, 4, 2.4)],
    shield: () => [m(Y, 0, 1.0, 0, 0.9, 1.3, 0.9, 0, 0, 2), m(Y, 0, 1.02, 0, 0.62, 1.34, 0.62, 0, 0, 1), m(S, 0, 1.25, 0, 0.3, 0.3, 0.3, 0, 0, 3, 1, 4, 3), m(T, 0, 1.66, 0, 0.9, 0.9, 0.9, 0, 0, 3, 1), m(S, 0.88, 1.3, 0, 0.08, 0.08, 0.08, 0, 0, 3, 1, 6, 1.4)],
    lock: () => [m(B, 0, 0.62, 0, 1.0, 0.8, 0.62, 0, 0, 1), m(TK, 0, 1.28, 0, 0.36, 0.36, 0.36, 0, PI / 2, 4), m(B, 0, 0.62, 0.32, 0.12, 0.3, 0.02, 0, 0, 3, 1, 4, 3)],
    key: () => [m(TK, -0.5, 0.8, 0, 0.42, 0.42, 0.42, 0, PI / 2, 1, 0, 3, 1.6), m(B, 0.3, 0.8, 0, 1.2, 0.12, 0.12, 0, 0, 4, 0, 3, 1.6), m(B, 0.62, 0.66, 0, 0.12, 0.22, 0.12, 0, 0, 4, 0, 3, 1.6), m(B, 0.9, 0.68, 0, 0.12, 0.18, 0.12, 0, 0, 4, 0, 3, 1.6)],
    gear: () => [m(C, 0, 0.5, 0, 0.78, 0.3, 0.78, 0, 0, 0, 0, 1, 0.9), ...around(8, 0.86, (i, a, x, z) => m(B, x, 0.5, z, 0.3, 0.3, 0.3, a, 0, 0, 0, 6, 0.9)), m(C, 0, 0.5, 0, 0.3, 0.42, 0.3, 0, 0, 3, 1)],
    globe: () => [m(C, 0, 0.22, 0, 0.8, 0.16, 0.8, 0, 0, 2), m(S, 0, 1.1, 0, 0.78, 0.78, 0.78, 0, 0, 2), m(T, 0, 1.1, 0, 0.95, 0.95, 0.95, 0, 0, 3, 1), m(T, 0, 1.1, 0, 0.95, 0.95, 0.95, 0, PI / 2, 3, 0.8, 1, 0.7), m(T, 0, 1.1, 0, 0.95, 0.95, 0.95, PI / 2, PI / 2, 3, 0.8, 1, 0.7)],
    doc: () => [m(B, 0, 0.9, 0, 0.98, 1.3, 0.08, 0, 0, 4), m(B, 0, 1.2, 0.05, 0.66, 0.07, 0.02, 0, 0, 3, 1), m(B, 0, 0.95, 0.05, 0.66, 0.07, 0.02, 0, 0, 3, 1), m(B, -0.1, 0.7, 0.05, 0.46, 0.07, 0.02, 0, 0, 3, 1)],
    mail: () => [m(B, 0, 0.75, 0, 1.45, 0.95, 0.12, 0, 0, 4), m(B, 0, 0.98, 0.07, 1.2, 0.07, 0.02, 0, 0, 3, 1), m(B, 0, 0.68, 0.07, 1.2, 0.05, 0.02, 0, 0, 1)],
    bell: () => [m(K, 0, 0.82, 0, 0.62, 1.2, 0.62, 0, 0, 1, 0, 2, 3.2), m(S, 0, 1.5, 0, 0.16, 0.16, 0.16, 0, 0, 3, 1), m(S, 0, 0.3, 0, 0.18, 0.18, 0.18, 0, 0, 3, 1, 2, 3.2, 0.8)],
    chart: () => [m(B, -0.55, 0.52, 0, 0.32, 0.76, 0.32, 0, 0, 1, 0, 8, 1.3, 0), m(B, 0, 0.72, 0, 0.32, 1.16, 0.32, 0, 0, 1, 0, 8, 1.3, 2), m(B, 0.55, 0.98, 0, 0.32, 1.68, 0.32, 0, 0, 1, 0, 8, 1.3, 4)],
    code: () => [m(B, 0, 0.95, 0, 1.55, 1.1, 0.1, 0, 0, 2), m(B, -0.2, 1.28, 0.06, 0.8, 0.07, 0.02, 0, 0, 3, 1, 5, 0.7, 0), m(B, 0.05, 0.98, 0.06, 1.0, 0.07, 0.02, 0, 0, 3, 0.7, 5, 0.7, 1), m(B, -0.15, 0.68, 0.06, 0.6, 0.07, 0.02, 0, 0, 3, 0.7, 5, 0.7, 2)],
    router: () => [m(B, 0, 0.3, 0, 1.6, 0.3, 1.0, 0, 0, 2), m(C, -0.55, 0.85, -0.2, 0.05, 0.8, 0.05, 0, 0, 0, 0, 2, 2.5), m(C, 0.55, 0.85, -0.2, 0.05, 0.8, 0.05, 0, 0, 0, 0, 2, 2.5, 1), m(B, -0.5, 0.31, 0.5, 0.14, 0.07, 0.02, 0, 0, 3, 1, 5, 2.2, 0), m(B, -0.2, 0.31, 0.5, 0.14, 0.07, 0.02, 0, 0, 3, 1, 5, 2.2, 1.3), m(B, 0.1, 0.31, 0.5, 0.14, 0.07, 0.02, 0, 0, 3, 1, 5, 2.2, 2.6)],
    firewall: () => [0, 1, 2].flatMap((r) => [0, 1, 2].map((c) => m(B, -0.58 + c * 0.58 + (r % 2 ? 0.29 : 0), 0.3 + r * 0.38, 0, 0.54, 0.34, 0.5, 0, 0, 1))).concat([m(S, 0, 1.55, 0, 0.3, 0.38, 0.3, 0, 0, 3, 1, 4, 7)]),
    ai: () => [m(S, 0, 1.05, 0, 0.5, 0.5, 0.5, 0, 0, 3, 1, 4, 3), m(T, 0, 1.05, 0, 0.95, 0.95, 0.95, 0, 0.4, 4, 0.5, 1, 1.1), m(T, 0, 1.05, 0, 0.95, 0.95, 0.95, 1.1, 1.2, 4, 0.5, 1, -0.8), m(T, 0, 1.05, 0, 0.95, 0.95, 0.95, 2.2, 2.0, 4, 0.5, 1, 1.5), ...around(5, 0.95, (i, a, x, z) => m(S, x, 1.05 + Math.sin(i * 1.7) * 0.4, z, 0.1, 0.1, 0.1, 0, 0, 3, 1, 6, 1.2))],
    package: () => [m(B, 0, 0.62, 0, 1.1, 0.95, 1.1, 0, 0, 0, 0, 3, 1.5), m(B, 0, 0.62, 0, 0.2, 0.97, 1.12, 0, 0, 1, 0, 3, 1.5), m(B, 0, 0.62, 0, 1.12, 0.97, 0.2, 0, 0, 1, 0, 3, 1.5)],
    goal: () => [m(C, 0, 0.2, 0, 1.15, 0.12, 1.15, 0, 0, 0), m(C, 0, 0.28, 0, 0.82, 0.12, 0.82, 0, 0, 1), m(C, 0, 0.36, 0, 0.5, 0.12, 0.5, 0, 0, 4), m(C, 0, 0.44, 0, 0.22, 0.12, 0.22, 0, 0, 3, 1), m(C, 0, 1.0, 0, 0.04, 1.2, 0.04, 0, 0, 0), m(B, 0.28, 1.4, 0, 0.55, 0.32, 0.03, 0, 0, 3, 0.9, 2, 2)],
    threat: () => [m(S, 0, 0.95, 0, 0.55, 0.55, 0.55, 0, 0, 1, 0, 4, 5), m(S, 0, 0.95, 0.4, 0.14, 0.14, 0.14, 0, 0, 4), ...around(8, 0.62, (i, a, x, z) => m(K, x, 0.95, z, 0.14, 0.42, 0.14, a, PI / 2, 1, 0, 4, 7, i))],
    clock: () => [m(C, 0, 0.98, 0, 0.92, 0.14, 0.92, 0, PI / 2, 4), m(S, 0, 1.34, 0.12, 0.07, 0.07, 0.07, 0, 0, 3, 1, 7, 1.7, 0, 0.98), m(S, 0, 1.18, 0.12, 0.09, 0.09, 0.09, 0, 0, 3, 1, 7, 0.28, 0, 0.98), m(C, 0, 0.35, 0, 0.3, 0.5, 0.3, 0, 0, 2)],
    admin: () => [m(S, 0, 1.4, 0, 0.34, 0.34, 0.34, 0, 0, 4), m(C, 0, 0.66, 0, 0.46, 0.85, 0.46, 0, 0, 1), m(S, 0, 1.02, 0, 0.5, 0.26, 0.5, 0, 0, 1), m(S, 0.75, 1.0, 0.2, 0.13, 0.13, 0.13, 0, 0, 3, 1, 6, 1.6)],
    // props and industry kinds
    tree: () => [m(C, 0, 0.5, 0, 0.12, 1, 0.12, 0, 0, 6), m(K, 0, 1.1, 0, 0.7, 0.9, 0.7, 0, 0, 5, 0, 2, 1.2), m(K, 0, 1.6, 0, 0.55, 0.8, 0.55, 0, 0, 5, 0, 2, 1.2, 0.6), m(K, 0, 2.0, 0, 0.4, 0.7, 0.4, 0, 0, 5, 0, 2, 1.2, 1.2)],
    turbine: () => [m(C, 0, 1.4, 0, 0.12, 2.6, 0.12, 0, 0, 4), m(B, 0.05, 2.75, 0, 0.5, 0.22, 0.2, 0, 0, 4), m(S, 0.35, 2.75, 0, 0.12, 0.12, 0.12, 0, 0, 3, 1), ...[0, 1, 2].map((i) => m(B, 0.4, 3.3, 0, 0.07, 1.1, 0.14, 0, 0, 4, 0, 10, 1.8, i * 2.094, 2.75))],
    bank: () => [m(B, 0, 0.2, 0, 1.9, 0.2, 1.3, 0, 0, 4), ...[-0.7, -0.25, 0.25, 0.7].map((x) => m(C, x, 0.85, 0.35, 0.12, 1.1, 0.12, 0, 0, 4)), m(B, 0, 1.5, 0, 1.9, 0.22, 1.3, 0, 0, 0), m(B, 0, 1.75, 0, 1.4, 0.2, 1.0, 0, 0, 7), m(B, 0, 0.6, -0.1, 1.5, 0.9, 0.6, 0, 0, 2)],
    school: () => [m(B, 0, 0.6, 0, 1.7, 1, 1.1, 0, 0, 7), m(B, 0, 1.2, 0, 1.9, 0.14, 1.3, 0, 0, 8), m(B, 0, 0.4, 0.56, 0.4, 0.6, 0.02, 0, 0, 2), m(C, 0.85, 1.4, 0.4, 0.03, 1.2, 0.03, 0, 0, 0), m(B, 1.05, 1.85, 0.4, 0.35, 0.2, 0.02, 0, 0, 3, 0.8, 2, 2.5)],
    gov: () => [m(B, 0, 0.25, 0, 2.0, 0.2, 1.3, 0, 0, 4), ...[-0.7, -0.25, 0.25, 0.7].map((x) => m(C, x, 0.85, 0.4, 0.11, 1.0, 0.11, 0, 0, 4)), m(B, 0, 1.45, 0, 1.9, 0.2, 1.1, 0, 0, 4), m(S, 0, 1.55, 0, 0.6, 0.6, 0.6, 0, 0, 9), m(C, 0, 2.2, 0, 0.03, 0.5, 0.03, 0, 0, 0), m(B, 0.18, 2.35, 0, 0.3, 0.16, 0.02, 0, 0, 8, 0, 2, 2.2)],
    sensor: () => [m(C, 0, 0.7, 0, 0.06, 1.4, 0.06, 0, 0, 0), m(B, 0, 1.45, 0, 0.3, 0.22, 0.2, 0, 0, 2), m(K, 0, 1.75, 0, 0.3, 0.22, 0.3, 0, PI, 4), m(S, 0, 1.5, 0.12, 0.05, 0.05, 0.05, 0, 0, 3, 1, 5, 2.5), m(T, 0, 1.5, 0, 0.7, 0.7, 0.7, 0, PI / 2, 3, 0.8, 4, 2.2)],
    field: () => [0, 1, 2, 3, 4].map((i) => m(B, -0.8 + i * 0.4, 0.12, 0, 0.22, 0.24, 1.7, 0, 0, 5)),
    plant: () => [m(B, 0, 0.5, 0, 1.6, 0.9, 1.1, 0, 0, 9), m(C, -0.5, 1.4, 0, 0.16, 1.2, 0.16, 0, 0, 2), m(C, 0.15, 1.5, 0, 0.14, 1.4, 0.14, 0, 0, 2), m(B, 0.55, 0.9, 0.56, 0.3, 0.4, 0.02, 0, 0, 3, 0.9, 5, 1.8)],
    pylon: () => [m(K, 0, 1.3, 0, 0.45, 2.6, 0.45, 0, 0, 9), m(B, 0, 2.1, 0, 1.5, 0.07, 0.07, 0, 0, 9), m(B, 0, 1.6, 0, 1.1, 0.07, 0.07, 0, 0, 9), ...[-0.7, 0.7].map((x, i) => m(S, x, 2.0, 0, 0.07, 0.07, 0.07, 0, 0, 3, 1, 5, 2, i * 3)), m(S, 0.5, 1.5, 0, 0.07, 0.07, 0.07, 0, 0, 3, 1), m(S, -0.5, 1.5, 0, 0.07, 0.07, 0.07, 0, 0, 3, 1)],
    shop: () => [m(B, 0, 0.6, 0, 1.7, 1.0, 1.1, 0, 0, 4), m(B, 0, 1.2, 0.6, 1.8, 0.12, 0.5, 0, 0.4, 8), m(B, 0, 0.45, 0.56, 0.5, 0.8, 0.02, 0, 0, 3, 0.8), m(B, 0.6, 0.8, 0.56, 0.4, 0.3, 0.02, 0, 0, 10, 0.5)],
    radar: () => [m(C, 0, 0.5, 0, 0.08, 1, 0.08, 0, 0, 0), m(K, 0, 1.3, 0.1, 0.8, 0.3, 0.8, 0, PI * 0.6, 0, 0, 1, 1.2), m(S, 0, 1.2, 0.1, 0.08, 0.08, 0.08, 0, 0, 3, 1, 5, 2)],
    vault: () => [m(B, 0, 0.7, 0, 1.6, 1.3, 1.1, 0, 0, 9), m(C, 0, 0.7, 0.56, 0.5, 0.1, 0.5, 0, PI / 2, 0), m(TK, 0, 0.7, 0.62, 0.3, 0.3, 0.3, 0, 0, 7), m(B, 0, 0.7, 0.6, 0.04, 0.5, 0.03, 0, 0, 7)],
    eye: () => [m(S, 0, 1.1, 0, 0.6, 0.6, 0.6, 0, 0, 4, 0, 3, 1.4), m(S, 0, 1.1, 0.36, 0.32, 0.32, 0.2, 0, 0, 10, 0.5, 3, 1.4), m(S, 0, 1.1, 0.5, 0.14, 0.14, 0.1, 0, 0, 2, 0, 3, 1.4)],
    usb: () => [m(B, 0, 0.4, 0, 0.7, 0.35, 1.3, 0, 0, 2), m(B, 0, 0.4, 0.8, 0.45, 0.22, 0.4, 0, 0, 9), m(B, 0, 0.6, -0.3, 0.1, 0.08, 0.1, 0, 0, 3, 1, 5, 2)],
    wifi: () => [m(B, 0, 0.25, 0, 1.1, 0.25, 0.8, 0, 0, 2), ...[0, 1, 2].map((i) => m(T, 0, 0.9, 0, 0.45 + i * 0.35, 0.45 + i * 0.35, 0.45 + i * 0.35, 0, PI / 2, 3, 0.9, 4, 2.2, i * 0.7))],
    coin: () => [0, 1, 2].map((i) => m(C, 0, 0.2 + i * 0.16, 0, 0.7, 0.14, 0.7, 0, 0, 7, 0.3)).concat([m(S, 0, 0.95, 0, 0.12, 0.12, 0.12, 0, 0, 3, 1, 3, 2)]),
    book: () => [m(B, 0, 0.15, 0, 1.1, 0.2, 0.8, 0, 0, 8), m(B, 0, 0.35, 0, 1.0, 0.2, 0.75, 0.1, 0, 10), m(B, 0, 0.55, 0, 0.95, 0.2, 0.7, -0.1, 0, 7)],
  };
  const PEDESTAL = () => [m(C, 0, 0.07, 0, 1.5, 0.14, 1.5, 0, 0, 2), m(T, 0, 0.15, 0, 1.5, 1.5, 1.5, 0, 0, 3, 0.9)];

  const PRE = `
uniform mat4 uV,uP;
vec3 toView(vec3 p){return (uV*vec4(p,1.0)).xyz;}
vec4 viewToClip(vec3 v){return uP*vec4(v,1.0);}
`;
  const SOLID_VS = `#version 300 es
precision highp float;
${PRE}
layout(location=0) in vec3 aP;layout(location=1) in vec3 aN;
layout(location=2) in vec4 aT0;layout(location=3) in vec4 aT1;layout(location=4) in vec4 aT2;layout(location=5) in vec4 aT3;
uniform float uMir;
out vec3 vN;out vec3 vV;out vec4 vC;out vec4 vF;out float vH;
mat3 rY(float a){float c=cos(a),s=sin(a);return mat3(c,0.0,-s,0.0,1.0,0.0,s,0.0,c);}
mat3 rX(float a){float c=cos(a),s=sin(a);return mat3(1.0,0.0,0.0,0.0,c,s,0.0,-s,c);}
void main(){
  mat3 R=rY(aT0.w)*rX(aT1.w);vec3 wp=aT0.xyz+R*(aP*aT1.xyz);vec3 n=normalize(R*(aN/aT1.xyz));vH=wp.y;
  if(uMir>0.5){wp.y=-wp.y;n.y=-n.y;}
  vec3 v=toView(wp);vV=v;vN=mat3(uV)*n;vC=aT2;vF=aT3;gl_Position=viewToClip(v);
}`;
  const SOLID_FS = `#version 300 es
precision highp float;
in vec3 vN;in vec3 vV;in vec4 vC;in vec4 vF;in float vH;
uniform vec3 uLv,uUp;uniform float uT,uMir;
out vec4 o;
void main(){
  vec3 N=normalize(vN);vec3 V=normalize(-vV);vec3 L=normalize(uLv);
  float ndl=max(dot(N,L),0.0);vec3 base=vC.rgb;
  vec3 hemi=mix(vec3(0.07,0.09,0.17),vec3(0.46,0.56,0.82),dot(N,uUp)*0.5+0.5);
  vec3 c=base*(hemi*0.95+ndl*vec3(1.0,0.96,0.9)*0.85);
  float fres=pow(1.0-max(dot(N,V),0.0),3.0);
  c+=vec3(pow(max(dot(N,normalize(L+V)),0.0),70.0)*0.7)+fres*0.32*mix(base,vec3(1.0),0.4);
  c+=base*vC.a*(0.85+0.3*vF.y+0.15*sin(uT*3.0+vV.x*0.7));
  c+=fres*base*vF.y*0.9+base*vF.z*0.18;
  float stc=floor(vF.w+0.001),stw=clamp(fract(vF.w+0.001)/0.99,0.0,1.0);
  if(stw>0.001){
    float fl=0.5+0.5*sin(uT*(stc>4.5&&stc<5.5?18.0:10.0)+vV.x);
    if(stc<1.5)c=mix(c,vec3(1.0,0.16,0.12)*(0.5+0.7*fl),0.72*stw);
    else if(stc<2.5)c+=vec3(0.1,1.0,0.45)*0.4*stw*(0.55+0.45*sin(uT*5.0));
    else if(stc<3.5)c=mix(c,vec3(1.0,0.74,0.15)*(0.6+0.5*fl),0.55*stw);
    else if(stc<4.5)c+=vec3(0.1,0.75,1.0)*0.6*stw*smoothstep(0.85,1.0,sin(vH*5.0-uT*4.0));
    else if(stc<5.5)c=mix(c,vec3(1.0,0.2,0.2)*(0.5+0.8*fl),0.6*stw);
    else if(stc<6.5)c+=base*0.55*stw*(0.6+0.4*sin(uT*6.0));
    else if(stc>7.5)c=mix(c,vec3(dot(c,vec3(0.3,0.59,0.11)))*vec3(0.5,0.85,1.2)+0.05,0.75*stw);
  }
  c=mix(c*0.3+vec3(0.012,0.018,0.04),c,vF.x);
  c=c/(1.0+0.28*c);
  float a=1.0;if(uMir>0.5)a=0.42*exp(-max(vH,0.0)/2.4);
  o=vec4(c*a,a);
}`;
  const FLOOR_VS = `#version 300 es
precision highp float;
${PRE}
layout(location=0) in vec2 aQ;
out vec3 vW;
void main(){vec3 p=vec3(aQ.x*70.0,0.0,aQ.y*70.0);vW=p;gl_Position=viewToClip(toView(p));}`;
  const FLOOR_FS = `#version 300 es
precision highp float;
in vec3 vW;uniform float uFl,uT;uniform vec3 uTc;out vec4 o;
float lnAA(vec2 g){vec2 d=abs(fract(g-0.5)-0.5)/max(fwidth(g),vec2(0.0001));return 1.0-min(min(d.x,d.y),1.0);}
float hs(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
void main(){
  vec2 q=vW.xz;float r=length(q);float pat=0.0;
  vec3 base=mix(vec3(0.02,0.035,0.085),vec3(0.05,0.09,0.2),exp(-r*r/260.0));
  if(uFl<0.5){pat=lnAA(q)*0.05+lnAA(q/6.2)*0.22;}
  else if(uFl<1.5){vec2 p=q*0.5;vec2 rr=vec2(1.0,1.7320508);vec2 h=rr*0.5;vec2 a=mod(p,rr)-h;vec2 b=mod(p-h,rr)-h;vec2 gv=dot(a,a)<dot(b,b)?a:b;float d=max(dot(abs(gv),vec2(0.5,0.8660254)),abs(gv.x));float w=fwidth(d)*1.5+0.015;pat=smoothstep(0.5-w*3.0,0.5-w,d)*0.55;}
  else if(uFl<2.5){vec2 g=q/1.55;vec2 id=floor(g);vec2 f=fract(g);float h1=hs(id),h2=hs(id+7.3),h3=hs(id+3.1);float wl=0.05;float hz=step(0.45,h1)*smoothstep(wl,wl*0.4,abs(f.y-0.5));float vt=step(0.55,h2)*smoothstep(wl,wl*0.4,abs(f.x-0.5));float pad=step(0.62,h3)*smoothstep(0.18,0.12,length(f-0.5));pat=(hz+vt)*0.3+pad*0.6;}
  else if(uFl<3.5){float wd=fwidth(r)/4.0*1.5+0.01;float ring=smoothstep(wd*2.0,0.0,min(fract(r/4.0),1.0-fract(r/4.0)));float an=atan(q.y,q.x);float sp=an/6.2831853*12.0;float spoke=smoothstep(fwidth(sp)*1.5+0.01,0.0,abs(fract(sp+0.5)-0.5));float sw=exp(-mod(uT*1.1-an,6.2831853)*1.4)*smoothstep(32.0,3.0,r);pat=ring*0.4+spoke*0.14*smoothstep(26.0,2.0,r)+sw*0.5;}
  else if(uFl<4.5){vec2 g=q/1.55;float dd=length(fract(g)-0.5);pat=smoothstep(0.11,0.06,dd)*0.55;}
  else if(uFl<5.5){float ph=sin(q.y*1.3+sin(q.x*0.45+uT*0.7)*1.4+uT*0.5);float ph2=sin(q.y*1.3+2.6+sin(q.x*0.45+uT*0.7)*1.4+uT*0.5);pat=smoothstep(0.92,1.0,ph)*0.4+smoothstep(0.93,1.0,ph2)*0.16;}
  else{float s=0.5+0.5*sin(q.x*3.4);pat=s*0.1+smoothstep(0.9,1.0,s)*0.18;base=mix(base,vec3(0.03,0.1,0.06),0.65);}
  float edge=smoothstep(34.0,6.0,r);
  vec3 col=base+uTc*pat*edge;
  float a=0.66*edge;o=vec4(col*a,a);
}`;
  const DECAL_VS = `#version 300 es
precision highp float;
${PRE}
layout(location=0) in vec2 aQ;layout(location=1) in vec4 aD0;layout(location=2) in vec4 aD1;layout(location=3) in vec4 aD2;
out vec2 vQ;out vec4 vC;out vec4 vD;out vec2 vS;
void main(){vec3 p=vec3(aD0.x+aQ.x*aD0.z,0.035,aD0.y+aQ.y*aD0.w);vQ=aQ;vC=aD1;vD=aD2;vS=aD0.zw;gl_Position=viewToClip(toView(p));}`;
  const DECAL_FS = `#version 300 es
precision highp float;
in vec2 vQ;in vec4 vC;in vec4 vD;in vec2 vS;out vec4 o;
float sdr(vec2 p,vec2 b,float r){vec2 d=abs(p)-b+r;return length(max(d,0.0))+min(max(d.x,d.y),0.0)-r;}
void main(){
  if(vD.x<0.5){float r=length(vQ);if(r>1.0)discard;float a=pow(1.0-r,1.5)*vC.a;o=vec4(0.0,0.0,0.0,a);}
  else if(vD.x<1.5){float r=length(vQ);if(r>1.0)discard;float a=pow(1.0-r,2.0)*vC.a;o=vec4(vC.rgb*a,0.0);}
  else if(vD.x<2.5){vec2 p=vQ*vS;float d=sdr(p,vS-0.02,0.7);float fill=smoothstep(0.0,-0.5,d)*0.09;float line=smoothstep(0.09,0.0,abs(d+0.06))*0.9;float dash=0.55+0.45*step(0.5,fract((p.x+p.y)*0.9+vD.y));float a=(fill+line*dash)*vC.a;o=vec4(vC.rgb*a,0.0);}
  else if(vD.x<3.5){float r=length(vQ);float a=smoothstep(0.14,0.0,abs(r-0.9))*vC.a;o=vec4(vC.rgb*a,0.0);}
  else{float r=length(vQ);if(r>1.0)discard;float an=atan(vQ.y,vQ.x);float d=mod(vD.y-an,6.2831853);float sw=exp(-d*1.7)*smoothstep(1.0,0.15,r);float rim=smoothstep(0.07,0.0,abs(r-0.95));float ring2=smoothstep(0.05,0.0,abs(r-0.5))*0.35;float a=(sw*0.85+rim*0.6+ring2)*vC.a;o=vec4(vC.rgb*a,0.0);}
}`;
  const BG_VS = '#version 300 es\nout vec2 vUv;void main(){vec2 p=vec2((gl_VertexID<<1)&2,gl_VertexID&2);vUv=p;gl_Position=vec4(p*2.0-1.0,0.9999,1.0);}';
  const BG_FS = `#version 300 es
precision highp float;
in vec2 vUv;uniform vec2 uVP;uniform vec2 uPar;uniform vec3 uSky;out vec4 o;
void main(){
  vec2 uv=vUv;vec2 c=(uv-vec2(0.5,0.55))*vec2(uVP.x/uVP.y,1.0);float r=length(c);
  vec3 col=mix(vec3(0.11,0.19,0.46),vec3(0.035,0.06,0.16),smoothstep(0.0,0.8,r));col=mix(col,vec3(0.02,0.032,0.09),smoothstep(0.55,1.2,r));
  col*=mix(vec3(1.0),0.55+uSky*1.0,0.55);
  col+=uSky*0.14*exp(-dot(c-uPar*0.05,c-uPar*0.05)*3.0);
  o=vec4(col,1.0);
}`;

  const mat = {
    persp(f, a, n, fa) { const t = 1 / Math.tan(f / 2), r = new Float32Array(16); r[0] = t / a; r[5] = t; r[10] = (fa + n) / (n - fa); r[11] = -1; r[14] = (2 * fa * n) / (n - fa); return r; },
    look(e, t) {
      let zx = e[0] - t[0], zy = e[1] - t[1], zz = e[2] - t[2]; const zl = Math.hypot(zx, zy, zz) || 1; zx /= zl; zy /= zl; zz /= zl;
      let xx = zz, xy = 0, xz = -zx; const xl = Math.hypot(xx, xz) || 1; xx /= xl; xz /= xl; // up = +y: x = up x z
      const yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;
      const r = new Float32Array(16); r[0] = xx; r[1] = yx; r[2] = zx; r[4] = xy; r[5] = yy; r[6] = zy; r[8] = xz; r[9] = yz; r[10] = zz;
      r[12] = -(xx * e[0] + xy * e[1] + xz * e[2]); r[13] = -(yx * e[0] + yy * e[1] + yz * e[2]); r[14] = -(zx * e[0] + zy * e[1] + zz * e[2]); r[15] = 1; return r;
    },
    mulv(M, p) { return [M[0] * p[0] + M[4] * p[1] + M[8] * p[2] + M[12], M[1] * p[0] + M[5] * p[1] + M[9] * p[2] + M[13], M[2] * p[0] + M[6] * p[1] + M[10] * p[2] + M[14], M[3] * p[0] + M[7] * p[1] + M[11] * p[2] + M[15]]; },
  };

  // exact camera fit: smallest distance at which every point stays inside the frustum for the given camera angles
  const fitPts = (pts, t, yaw, pitch, aspect, margin) => {
    const cp = Math.cos(pitch), z = [Math.sin(yaw) * cp, Math.sin(pitch), Math.cos(yaw) * cp]; let x = [z[2], 0, -z[0]]; const xl = Math.hypot(x[0], x[2]) || 1; x = [x[0] / xl, 0, x[2] / xl];
    const y = [z[1] * x[2] - z[2] * x[1], z[2] * x[0] - z[0] * x[2], z[0] * x[1] - z[1] * x[0]], ht = Math.tan(FOV / 2) / margin, wt = ht * aspect; let d = 6;
    for (const p of pts) { const dx = p[0] - t[0], dy = p[1] - t[1], dz = p[2] - t[2], rx = x[0] * dx + x[1] * dy + x[2] * dz, ry = y[0] * dx + y[1] * dy + y[2] * dz, rz = z[0] * dx + z[1] * dy + z[2] * dz; d = Math.max(d, rz + Math.abs(rx) / wt, rz + Math.abs(ry) / ht); }
    return d;
  };
  const boxPts = (list, hx, hz, h) => list.flatMap((n) => [[n.x - hx, 0, n.z - hz], [n.x + hx, 0, n.z - hz], [n.x - hx, 0, n.z + hz], [n.x + hx, 0, n.z + hz], [n.x - hx, h, n.z - hz], [n.x + hx, h, n.z - hz], [n.x - hx, h, n.z + hz], [n.x + hx, h, n.z + hz]]);
  let host = null;
  IX.flowHost = () => {
    if (host) return host;
    const root = document.createElement('div'); root.className = 'f3gl';
    const gc = document.createElement('canvas'), hc = document.createElement('canvas'); gc.className = 'f3c'; hc.className = 'f3h'; gc.setAttribute('aria-hidden', 'true'); root.append(gc, hc);
    const hx = hc.getContext('2d'); if (!hx) throw new Error('2d');
    const G = IX.GL(gc), gl = G.gl;
    const PB = 0, PC = 1, PS = 2, PK = 4;
    const SC = { per: Array.from({ length: 8 }, () => []), fper: Array.from({ length: 8 }, () => new Float32Array(360 * 16)), dd: [], fdd: new Float32Array(160 * 12), rb: [], frb: new Float32Array(520 * 16), sp: [], fsp: new Float32Array(480 * 12) }, errEvery = IX.forcedQ >= 0 ? 90 : 900;
    let q = 2, W = 2, H = 2, cw = 2, ch = 2, dead = false, lost = false, cur = null, raf = 0, last = 0, T = 0, frames = 0, dc = 0, err = 0, R = null;
    const gov = IX.Gov((nq) => { q = nq; size(); });
    q = gov.q;
    const mk = () => {
      G.reset(); const r = {}; r.post = IX.Post(G);
      r.solid = G.program(SOLID_VS, SOLID_FS); r.floor = G.program(FLOOR_VS, FLOOR_FS); r.decal = G.program(DECAL_VS, DECAL_FS);
      r.spr = G.program(IX.shaders.SPR_VS(PRE), IX.shaders.SPR_FS); r.rib = G.program(IX.shaders.RIB_VS(PRE), IX.shaders.RIB_FS); r.bg = G.program(BG_VS, BG_FS);
      const quad = IX.quad(G), strip = IX.strip(G);
      const geos = [IX.geo.box(), IX.geo.frustum(28, 1, 1), IX.geo.sphere(24, 16), IX.geo.torus(1, 0.075, 40, 8), IX.geo.frustum(24, 0, 1), IX.geo.frustum(6, 1, 1), IX.geo.frustum(6, 1, 0.45), IX.geo.torus(1, 0.2, 28, 10)];
      r.prims = geos.map((g) => { const idx = G.buf(g.i, gl.STATIC_DRAW, gl.ELEMENT_ARRAY_BUFFER), v = G.buf(g.v), inst = G.buf(new Float32Array(360 * 16), gl.DYNAMIC_DRAW); const vao = G.vao([[v, 0, 3, 6, 0, 0], [v, 1, 3, 6, 3, 0], [inst, 2, 4, 16, 0, 1], [inst, 3, 4, 16, 4, 1], [inst, 4, 4, 16, 8, 1], [inst, 5, 4, 16, 12, 1]], idx); return { n: g.i.length, inst, vao }; });
      r.fVao = G.vao([[quad, 0, 2, 2, 0, 0]]);
      r.dInst = G.buf(new Float32Array(160 * 12), gl.DYNAMIC_DRAW); r.dVao = G.vao([[quad, 0, 2, 2, 0, 0], [r.dInst, 1, 4, 12, 0, 1], [r.dInst, 2, 4, 12, 4, 1], [r.dInst, 3, 4, 12, 8, 1]]);
      r.rInst = G.buf(new Float32Array(520 * 16), gl.DYNAMIC_DRAW); r.rVao = G.vao([[strip, 0, 2, 2, 0, 0], [r.rInst, 1, 4, 16, 0, 1], [r.rInst, 2, 4, 16, 4, 1], [r.rInst, 3, 4, 16, 8, 1], [r.rInst, 4, 4, 16, 12, 1]]);
      r.sInst = G.buf(new Float32Array(480 * 12), gl.DYNAMIC_DRAW); r.sVao = G.vao([[quad, 0, 2, 2, 0, 0], [r.sInst, 1, 4, 12, 0, 1], [r.sInst, 2, 4, 12, 4, 1], [r.sInst, 3, 4, 12, 8, 1]]);
      R = r;
    };
    const size = () => { if (!R) return; const s = QF[q], dpr = Math.min(window.devicePixelRatio || 1, s.dpr); cw = Math.max(2, Math.round(W * dpr)); ch = Math.max(2, Math.round(H * dpr)); if (gc.width !== cw || gc.height !== ch) { gc.width = cw; gc.height = ch; } const d2 = Math.min(2, window.devicePixelRatio || 1); hc.width = Math.round(W * d2); hc.height = Math.round(H * d2); hx.setTransform(d2, 0, 0, d2, 0, 0); R.post.size(cw, ch, { samples: s.ms, bloom: s.bloom }); };

    /* ---------- building a scene from data ---------- */
    const mkPath = (A, Bn, lift) => {
      const dx = Bn.x - A.x, dz = Bn.z - A.z, L = Math.hypot(dx, dz) || 1, ux = dx / L, uz = dz / L, off = 1.9, N = 14, path = [];
      const x0 = A.x + ux * off, z0 = A.z + uz * off, x1 = Bn.x - ux * off, z1 = Bn.z - uz * off;
      for (let i = 0; i <= N; i++) { const t = i / N; path.push([x0 + (x1 - x0) * t, 0.3 + lift * Math.sin(PI * t), z0 + (z1 - z0) * t]); }
      let len = 0; const cum = [0]; for (let i = 1; i <= N; i++) { len += Math.hypot(path[i][0] - path[i - 1][0], path[i][1] - path[i - 1][1], path[i][2] - path[i - 1][2]); cum.push(len); }
      return { path, cum, len };
    };
    const build = (data) => {
      const ns = data.n.map(([id, kind, label, c, r, tone]) => ({ id, kind: REC[kind] ? kind : 'gear', label, c, r, tone: TONES[tone] ? tone : (KTONE[kind] || 'mute') }));
      const cs = ns.map((n) => n.c), rs = ns.map((n) => n.r), cx = (Math.min(...cs) + Math.max(...cs)) / 2, cz = (Math.min(...rs) + Math.max(...rs)) / 2;
      const scaleP = (p, s, dy) => p.map((v, k) => ((k >= 1 && k <= 6) || k === 14 ? v * NS * s : v)).map((v, k) => (k === 2 || k === 14 ? v + (dy || 0) : v));
      ns.forEach((n) => { n.x = (n.c - cx) * U; n.z = (n.r - cz) * U; n.col = TONES[n.tone]; n.prims = [...PEDESTAL(), ...REC[n.kind]()].map((p) => scaleP(p, 1, 0)); });
      const byId = Object.fromEntries(ns.map((n, i) => [n.id, i]));
      const links = (data.l || []).map(([a, b, tone]) => {
        const A = ns[byId[a]], Bn = ns[byId[b]], P = mkPath(A, Bn, 0.5);
        return { key: a + '>' + b, a: byId[a], b: byId[b], path: P.path, cum: P.cum, len: P.len, col: TONES[tone] || TONES[Bn.tone === 'mute' ? 'info' : Bn.tone] };
      });
      const lk = Object.fromEntries(links.map((l, i) => [l.key, i]));
      const th = data.th || [], fl = Math.max(0, FLOORS.indexOf(th[0])), tc = TONES[th[1]] || TONES.info;
      const pc = new Map();
      const parseFx = (arr) => {
        const o = { s: [], n: [], f: [], c: [], b: [] };
        (arr || []).forEach((e) => {
          const op = e[0];
          if (op === 's') { const [a, b2] = String(e[1]).split('>'), ai = byId[a], bi = byId[b2]; if (ai === undefined || bi === undefined) return; const key = a + '>' + b2; let P = lk[key] !== undefined ? links[lk[key]] : pc.get(key); if (!P) { P = mkPath(ns[ai], ns[bi], 0.7); pc.set(key, P); } o.s.push({ a: ai, b: bi, key, P, st: e[2] || 'dot', n: Math.max(1, Math.min(8, e[3] | 0 || 3)), e: e[4] > 0 && e[4] <= 1 ? e[4] : 1, ar: +e[5] || 0 }); }
          else if (op === 'n') { const i = byId[e[1]]; if (i !== undefined && STCODE[e[2]]) o.n.push([i, STCODE[e[2]]]); }
          else if (op === 'f') { const i = byId[e[1]]; if (i !== undefined) o.f.push([i, e[2]]); }
          else if (op === 'c') { const i = byId[e[1]]; if (i !== undefined) o.c.push([i, String(e[2]), GLYPH[e[3]] ? e[3] : 'ok']); }
          else if (op === 'b') { const i = byId[e[1]]; if (i !== undefined) o.b.push([i, String(e[2])]); }
        });
        return o;
      };
      const steps = (data.s || []).map(([t, d, nn, ll, fx]) => ({ t, d, n: nn.map((id) => byId[id]).filter((v) => v !== undefined), l: (ll || []).map((k) => lk[k]).filter((v) => v !== undefined), fx: parseFx(fx) }));
      const ov = { s: [], n: [], f: [], c: [], b: [] }, seen = new Set(); steps.forEach((s) => s.fx.s.forEach((x) => { const id = x.key + x.st; if (!seen.has(id)) { seen.add(id); ov.s.push(x); } }));
      const zones = (data.z || []).map(([label, c0, r0, c1, r1, tone]) => ({ label, x: ((c0 + c1) / 2 - cx) * U, z: ((r0 + r1) / 2 - cz) * U, hx: ((c1 - c0) / 2) * U + 2.7, hz: ((r1 - r0) / 2) * U + 2.7, col: TONES[tone] || TONES.mute }));
      let ex = 0, ez = 0; ns.forEach((n) => { ex = Math.max(ex, Math.abs(n.x)); ez = Math.max(ez, Math.abs(n.z)); });
      zones.forEach((z) => { ex = Math.max(ex, Math.abs(z.x) + z.hx); ez = Math.max(ez, Math.abs(z.z) + z.hz); });
      const list = []; ns.forEach((n, i) => n.prims.forEach((p) => list.push({ p, i })));
      (th[3] || []).forEach(([kind, c, r, s, el]) => { if (!REC[kind]) return; const x = (c - cx) * U, z = (r - cz) * U; REC[kind]().forEach((p) => list.push({ p: scaleP(p, s || 1, (el || 0) * NS), i: -1, x, z })); });
      const seeds = Array.from({ length: 44 }, (_, i) => [Math.random(), Math.random(), Math.random(), i]);
      return { ns, links, steps, ov, zones, ex: ex + 2, ez: ez + 2, list, fl, tc, part: th[2] || 'none', seeds, dim: ns.map(() => 1), foc: ns.map(() => 0), hov: ns.map(() => 0), act: links.map(() => 0.6), stc: ns.map(() => 0), stw: ns.map(() => 0), st0: ns.map(() => 0) };
    };

    // narrow (portrait) stages read the flow top to bottom so the long axis uses the height
    const orient = (c) => { c.portrait = W / H < 0.95; c.dy = c.portrait ? 1.12 : -0.55; c.dp = c.portrait ? 1.0 : 0.78; };
    /* ---------- controller ---------- */
    const attach = (el, data, opt) => {
      opt = opt || {};
      const sc = build(data);
      const ctl = { sc, step: -1, lastStep: -2, stepT: 0, playing: false, visible: true, yaw: -0.55, pitch: 0.78, dy: -0.55, dp: 0.78, portrait: false, vyaw: 0, vpitch: 0, cam: null, hover: -1, selNode: -1, tAdv: 0, drag: null, onStep: null, el, title: data.t || '' };
      let user = false;
      const zonePts = sc.zones.flatMap((z) => [[z.x - z.hx, 0, z.z - z.hz], [z.x + z.hx, 0, z.z - z.hz], [z.x - z.hx, 0, z.z + z.hz], [z.x + z.hx, 0, z.z + z.hz]]);
      const target = () => {
        const full = fitPts([...boxPts(sc.ns, 2.4, 2.4, 3.4), ...zonePts], [0, 0.6, 0], ctl.dy, ctl.dp, W / H, 1.08), s = sc.steps[ctl.step];
        if (!s || !s.n.length) return { t: [0, 0.6, 0], d: full };
        const an = s.n.map((i) => sc.ns[i]); let sx = 0, sz = 0; an.forEach((n) => { sx += n.x; sz += n.z; }); sx /= an.length; sz /= an.length;
        const d = fitPts(boxPts(an, 2.7, 2.7, 3.6), [sx, 0.9, sz], ctl.dy, ctl.dp, W / H, 1.05);
        return { t: [sx, 0.9, sz], d: Math.min(full, Math.max(d, full * 0.5, 9)) };
      };
      ctl.cam = { t: [0, 0.6, 0], d: 20 };
      const setStep = (i, byUser) => { const n = sc.steps.length; ctl.step = Math.max(-1, Math.min(n - 1, i)); ctl.tAdv = 0; if (byUser) { ctl.playing = false; user = true; } if (ctl.onStep) ctl.onStep(ctl.step, ctl.playing); wake(); };
      ctl.goto = (i, byUser) => setStep(i, byUser !== false);
      ctl.next = (byUser) => { const n = sc.steps.length; setStep(ctl.step + 1 >= n ? -1 : ctl.step + 1, byUser !== false); };
      ctl.prev = (byUser) => { const n = sc.steps.length; setStep(ctl.step <= -1 ? n - 1 : ctl.step - 1, byUser !== false); };
      ctl.play = (b) => { ctl.playing = !!b && !calm; ctl.tAdv = 0; if (ctl.onStep) ctl.onStep(ctl.step, ctl.playing); wake(); };
      ctl.resetView = () => { ctl.yaw = ctl.dy; ctl.pitch = ctl.dp; ctl.vyaw = ctl.vpitch = 0; wake(); };
      ctl.setVisible = (b) => { ctl.visible = b; if (b) wake(); };
      ctl.focusNode = (i) => { const k = sc.steps.findIndex((s) => s.n.includes(i)); if (k >= 0) setStep(k, true); };
      ctl.destroy = () => { if (cur === ctl) { cur = null; if (root.parentNode) root.remove(); } };
      ctl.target = target; ctl.user = () => user;
      cur = ctl; el.append(root); W = Math.max(2, el.clientWidth); H = Math.max(2, el.clientHeight); size();
      orient(ctl); ctl.yaw = ctl.dy; ctl.pitch = ctl.dp;
      { const tg = target(); ctl.cam = { t: tg.t.slice(), d: tg.d }; }
      wake(); return ctl;
    };

    /* ---------- frame ---------- */
    const wake = () => { if (cur) cur.until = performance.now() + 1600; if (!raf && cur && cur.visible && !document.hidden) raf = requestAnimationFrame(frame); };
    const eye = (c) => { const cp = Math.cos(c.pitch), d = c.cam.d; return [c.cam.t[0] + d * Math.sin(c.yaw) * cp, c.cam.t[1] + d * Math.sin(c.pitch), c.cam.t[2] + d * Math.cos(c.yaw) * cp]; };
    let V = null, P = null;
    const project = (p) => { const v = mat.mulv(V, p), c = mat.mulv(P, [v[0], v[1], v[2]]); const w = c[3] || 1; return { x: (c[0] / w * 0.5 + 0.5) * W, y: (0.5 - c[1] / w * 0.5) * H, z: v[2], w }; };
    const setViewport = (c) => { const e = eye(c); V = mat.look(e, c.cam.t); P = mat.persp(FOV, W / H, 0.5, 400); };
    const frame = (ts) => {
      raf = 0; const c = cur; if (!c || !c.visible || dead || lost || document.hidden || !R) return;
      const dt = Math.min(0.05, (ts - last) / 1000 || 0.016); gov.tick(ts - last); last = ts; T += dt; const sc = c.sc;
      // resize check (container may have changed)
      const el = c.el; if (el.clientWidth && (Math.abs(el.clientWidth - W) > 1 || Math.abs(el.clientHeight - H) > 1)) { W = Math.max(2, el.clientWidth); H = Math.max(2, el.clientHeight); size(); const pt = W / H < 0.95; if (pt !== c.portrait) { orient(c); c.yaw = c.dy; c.pitch = c.dp; c.vyaw = c.vpitch = 0; } }
      // autoplay and camera easing
      if (c.playing && !calm) { c.tAdv += dt; if (c.tAdv > 4.8) { c.tAdv = 0; const n = sc.steps.length; c.step = c.step + 1 >= n ? -1 : c.step + 1; if (c.onStep) c.onStep(c.step, c.playing); } }
      if (c.lastStep !== c.step) { c.lastStep = c.step; c.stepT = T; }
      const tg = c.target(), k = 1 - Math.exp(-dt * (calm ? 30 : 4.2));
      for (let i = 0; i < 3; i++) c.cam.t[i] += (tg.t[i] - c.cam.t[i]) * k; c.cam.d += (tg.d - c.cam.d) * k;
      if (!c.drag) { c.yaw += c.vyaw; c.pitch = Math.max(0.35, Math.min(1.2, c.pitch + c.vpitch)); c.vyaw *= 0.93; c.vpitch *= 0.93; if (!calm && !c.user() && Math.abs(c.vyaw) < 0.0006) c.yaw += Math.sin(T * 0.25) * 0.0009; }
      c.yaw = Math.max(-1.25, Math.min(1.25, c.yaw));
      const st = sc.steps[c.step], act = new Set(st ? st.n : sc.ns.map((_, i) => i)), actL = new Set(st ? st.l : sc.links.map((_, i) => i));
      const k2 = 1 - Math.exp(-dt * 7), k3 = 1 - Math.exp(-dt * 6);
      sc.ns.forEach((n, i) => {
        sc.dim[i] += ((act.has(i) ? 1 : 0.2) - sc.dim[i]) * k2; sc.foc[i] += (((st && st.n[0] === i) ? 1 : (st && act.has(i) ? 0.35 : 0)) - sc.foc[i]) * k2; sc.hov[i] += ((c.hover === i ? 1 : 0) - sc.hov[i]) * k2;
        let code = 0; if (st) st.fx.n.forEach(([ni, cd]) => { if (ni === i) code = cd; });
        if (code) { if (sc.stc[i] !== code) { sc.stc[i] = code; sc.stw[i] = Math.min(sc.stw[i], 0.25); sc.st0[i] = T; } sc.stw[i] += (1 - sc.stw[i]) * k3; } else { sc.stw[i] += (0 - sc.stw[i]) * k3; if (sc.stw[i] < 0.02) { sc.stw[i] = 0; sc.stc[i] = 0; } }
      });
      sc.links.forEach((l, i) => { sc.act[i] += ((actL.has(i) ? 1 : (st ? 0.1 : 0.5)) - sc.act[i]) * k2; });
      setViewport(c); draw(c);
      overlay(c);
      frames++; if (frames % errEvery === 0 && gl.getError() !== gl.NO_ERROR) err++;
      if ((!calm || performance.now() < (c.until || 0)) && !raf) raf = requestAnimationFrame(frame);
    };

    /* ---------- choreography helpers ---------- */
    const along = (Pn, u) => { const n = Pn.path.length - 1, f = Math.max(0, Math.min(1, u)) * n, j = Math.min(n - 1, Math.floor(f)), t = f - j, a = Pn.path[j], b = Pn.path[j + 1]; return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t, Math.atan2(b[0] - a[0], b[2] - a[2])]; };
    const ease = (t) => 1 - Math.pow(1 - Math.max(0, Math.min(1, t)), 3);
    const lerp3 = (a, b, t) => [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
    const GOLD = [1, 0.8, 0.28], REDC = [0.95, 0.2, 0.2], WHITE = [1, 1, 1];

    const draw = (c) => {
      const sc = c.sc, s = QF[q], TA = calm ? 1.7 : T; dc = 0;
      const Lw = [-0.45, 0.85, 0.55], vl = [V[0] * Lw[0] + V[4] * Lw[1] + V[8] * Lw[2], V[1] * Lw[0] + V[5] * Lw[1] + V[9] * Lw[2], V[2] * Lw[0] + V[6] * Lw[1] + V[10] * Lw[2]], up = [V[4], V[5], V[6]];
      const per = SC.per; per.forEach((a) => { a.length = 0; });
      const dd = SC.dd; dd.length = 0; const rb = SC.rb; rb.length = 0; const sp = SC.sp; sp.length = 0;
      const solid = (prim, x, y, z, ry, sx, sy, sz, rx, col, em) => { per[prim].push(x, y, z, ry, sx, sy, sz, rx, col[0], col[1], col[2], em, 1, 0, 0, 0); };
      const spr = (x, y, z, size, col, a, kind) => { sp.push(x, y, z, size, col[0], col[1], col[2], a, kind, 0, 0, 0); };
      const st = sc.steps[c.step], fx = st ? st.fx : sc.ov, age = st ? TA - c.stepT : 99;
      // ---- nodes and props, with idle animation and states
      sc.list.forEach((e) => {
        const p = e.p, i = e.i, n = i >= 0 ? sc.ns[i] : null, tn = n ? n.col : sc.tc;
        let x = p[1], y = p[2], z = p[3], sx = p[4], sy = p[5], sz = p[6], ry = p[7], rx = p[8], em = p[10];
        const a = p[11], k = p[12], ph = p[13];
        switch (a) {
          case 1: ry += TA * k + ph; break;
          case 2: rx += Math.sin(TA * k + ph) * (0.14 + (n && sc.stc[i] === 3 ? 0.4 * sc.stw[i] : 0)); break;
          case 3: y += Math.sin(TA * k + ph) * 0.1; break;
          case 4: { const f = 1 + 0.09 * Math.sin(TA * k + ph); sx *= f; sy *= f; sz *= f; break; }
          case 5: em *= 0.35 + 0.65 * (Math.sin(TA * k * 3 + ph * 7) > 0.1 ? 1 : 0); break;
          case 6: { const A = TA * k + ph, c2 = Math.cos(A), s2 = Math.sin(A), ox = x, oz = z; x = ox * c2 + oz * s2; z = -ox * s2 + oz * c2; ry += A; break; }
          case 7: { const A = TA * k + ph, c2 = Math.cos(A), s2 = Math.sin(A), dy = y - p[14], nx = x * c2 - dy * s2, ny = x * s2 + dy * c2; x = nx; y = p[14] + ny; break; }
          case 8: { const f = 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(TA * k + ph)), bot = y - sy / 2; sy *= f; y = bot + sy / 2; break; }
          case 10: { const A = TA * k + ph, c2 = Math.cos(A), s2 = Math.sin(A), dy = y - p[14], ny = dy * c2 - z * s2, nz = dy * s2 + z * c2; y = p[14] + ny; z = nz; rx += A; break; }
          default: break;
        }
        let stv = 0;
        if (n) { const code = sc.stc[i], w = sc.stw[i]; if (code) stv = code + 0.99 * Math.min(w, 1); if (code === 7 && w > 0.01) { const f = ease((TA - sc.st0[i]) / 0.9); sx *= f; sy *= f; sz *= f; x *= f; y *= f; z *= f; } }
        const t = p[9], col = t === 1 ? tn : t === 3 ? [Math.min(1, tn[0] * 1.15), Math.min(1, tn[1] * 1.15), Math.min(1, tn[2] * 1.15)] : TINT[t];
        per[p[0]].push((n ? n.x : e.x) + x, y, (n ? n.z : e.z) + z, ry, sx, sy, sz, rx, col[0], col[1], col[2], em, n ? sc.dim[i] : 0.9, n ? sc.foc[i] : 0, n ? sc.hov[i] : 0, stv);
      });
      // ---- ambient particles (per-flow environment)
      const ZB = sc.ex + 3, ZD = sc.ez + 3;
      if (sc.part !== 'none') sc.seeds.forEach(([sa, sb, sc2, idx]) => {
        const x = (sa * 2 - 1) * ZB, z = (sb * 2 - 1) * ZD;
        switch (sc.part) {
          case 'rain': { const ph = (TA * 7.5 + sc2 * 9) % 9; spr(x, 9 - ph, z, 0.08, [0.6, 0.8, 1], 0.55, 3); spr(x, 9.5 - ph, z, 0.06, [0.6, 0.8, 1], 0.28, 3); break; }
          case 'bits': { const ph = (TA * 1.2 + sc2 * 8) % 8; spr(x, 8 - ph, z, 0.16, sc.tc, 0.55 * (0.5 + 0.5 * Math.sin(TA * 3 + idx)), 4); break; }
          case 'sparks': { const ph = (TA * 1.5 + sc2 * 5) % 5; spr(x + Math.sin(TA + idx) * 0.4, 0.3 + ph, z, 0.1, [1, 0.62, 0.2], (1 - ph / 5) * 0.8, 3); break; }
          case 'embers': { const ph = (TA * 0.55 + sc2 * 6) % 6; spr(x + Math.sin(TA * 0.7 + idx) * 0.5, 0.2 + ph, z, 0.26, [1, 0.4, 0.2], (1 - ph / 6) * 0.45, 0); break; }
          case 'snow': { const ph = (TA * 0.9 + sc2 * 8) % 8; spr(x + Math.sin(TA * 0.8 + idx) * 0.6, 8 - ph, z, 0.11, [1, 1, 1], 0.6, 3); break; }
          case 'bubbles': { const ph = (TA * 0.7 + sc2 * 6) % 6; spr(x + Math.sin(TA * 0.9 + idx) * 0.4, 0.2 + ph, z, 0.2 + sc2 * 0.2, sc.tc, (1 - ph / 6) * 0.7, 2); break; }
          case 'leaves': { const ph = (TA * 0.8 + sc2 * 7) % 7; spr(x + Math.sin(TA * 0.9 + idx) * 0.9, 7 - ph, z + Math.cos(TA * 0.7 + idx) * 0.6, 0.14, [0.35, 0.8, 0.35], 0.75, 4); break; }
          case 'stars': spr(x, 3 + sc2 * 6, z, 0.07 + sc2 * 0.07, [0.85, 0.92, 1], 0.35 + 0.5 * Math.abs(Math.sin(TA * 1.5 + idx)), 3); break;
          default: break;
        }
      });
      // ---- streams: distinct objects travelling along links
      const hasStream = new Set(); fx.s.forEach((x) => hasStream.add(x.key));
      fx.s.forEach((sm, si) => {
        const tone = sc.ns[sm.b].col, e = sm.e, v = sm.st === 'heart' ? 0.22 : sm.st === 'bad' ? 0.26 : sm.st === 'bit' ? 0.4 : 0.3;
        for (let k = 0; k < sm.n; k++) {
          const ph = (TA * v + k / sm.n + si * 0.37) % 1; if (e < 1 && ph > e + 0.18) continue;
          const dying = e < 1 && ph >= e, u = dying ? 1 : Math.min(1, ph / e), pos = along(sm.P, u), x = pos[0], y = pos[1] + sm.ar * Math.sin(PI * u), z = pos[2], head = pos[3];
          if (dying) {
            const qd = (ph - e) / 0.18, fcol = sm.st === 'bad' ? REDC : tone, ex2 = sm.P.path[sm.P.path.length - 1];
            for (let j = 0; j < 6; j++) { const ang = j / 6 * TAU + k; spr(x + Math.cos(ang) * qd * 1.1, y + 0.3 + qd * 0.6 - qd * qd * 0.5, z + Math.sin(ang) * qd * 1.1, 0.16 * (1 - qd), fcol, (1 - qd) * 0.95, 3); }
            dd.push(x, z, 0.8 + qd * 2.2, 0.8 + qd * 2.2, fcol[0], fcol[1], fcol[2], (1 - qd) * 0.9, 3, 0, 0, 0); if (ex2) spr(x, y + 0.4, z, 1.1 * (1 - qd), fcol, 0.5 * (1 - qd), 0);
            continue;
          }
          const al = Math.min(1, u * 6, e >= 1 ? (1 - u) * 6 : 1); if (al <= 0.02) continue;
          switch (sm.st) {
            case 'bit': spr(x, y + 0.08, z, 0.17, tone, 0.9 * al, 3); break;
            case 'heart': spr(x, y + 0.1, z, 0.25 + u * 1.1, tone, 0.85 * al * (1 - u * 0.5), 2); break;
            case 'mail': spr(x, y + 0.3, z, 0.52, WHITE, 0.95 * al, 9); break;
            case 'tok': spr(x, y + 0.25, z, 0.42, GOLD, al, 4); spr(x, y + 0.25, z, 0.95, GOLD, 0.45 * al, 0); break;
            case 'warn': spr(x, y + 0.3, z, 0.5, [1, 0.74, 0.2], al, 8); break;
            case 'cube': solid(PB, x, y + 0.35, z, TA * 1.4 + k * 2, 0.52 * al, 0.52 * al, 0.52 * al, TA * 1.1, lerp3(tone, WHITE, 0.25), 0.35); break;
            case 'coin': solid(PC, x, y + 0.35, z, head, 0.4 * al, 0.08, 0.4 * al, TA * 5 + k, GOLD, 0.45); break;
            case 'bad': solid(PK, x, y + 0.35, z, head, 0.26 * al, 0.6 * al, 0.26 * al, PI / 2, REDC, 0.6); spr(x, y + 0.35, z, 0.9, REDC, 0.5 * al, 0); break;
            case 'doc': solid(PB, x, y + 0.4, z, head, 0.52 * al, 0.66 * al, 0.05, 0, WHITE, 0.15); break;
            default: spr(x, y + 0.05, z, 0.3, WHITE, 0.95 * al, 3); spr(x, y + 0.05, z, 0.8, tone, 0.5 * al, 0); break;
          }
        }
      });
      // default packets on active links that have no stream of their own
      sc.links.forEach((l, i) => { const a = sc.act[i]; if (a < 0.2 || hasStream.has(l.key)) return; for (let k = 0; k < 3; k++) { const u = (TA * 0.32 + k / 3 + i * 0.13) % 1, pos = along(l, u), al = Math.sin(u * PI) * a; spr(pos[0], pos[1] + 0.05, pos[2], 0.34, WHITE, 0.95 * al, 3); spr(pos[0], pos[1] + 0.05, pos[2], 0.8, l.col, 0.55 * al, 0); } });
      // ---- node effects loop while their step is shown
      if (st) fx.f.forEach(([i, name]) => {
        const n = sc.ns[i], code = sc.stc[i], col = code === 1 || code === 5 ? REDC : code === 3 ? [1, 0.74, 0.2] : n.col;
        switch (name) {
          case 'ring': for (let j = 0; j < 2; j++) { const ph = (TA * 0.7 + j * 0.5) % 1; dd.push(n.x, n.z, 1.6 + ph * 4.4, 1.6 + ph * 4.4, col[0], col[1], col[2], (1 - ph) * 0.95, 3, 0, 0, 0); } break;
          case 'radar': dd.push(n.x, n.z, 3.7, 3.7, col[0], col[1], col[2], 0.95, 4, (TA * 2.4) % TAU, 0, 0); break;
          case 'burst': { const ph = (TA * 0.8) % 1; for (let j = 0; j < 10; j++) { const ang = j / 10 * TAU, dist = ph * 2.6; spr(n.x + Math.cos(ang) * dist, 1.3 + ph * 1.3 - ph * ph * 1.6, n.z + Math.sin(ang) * dist, 0.15 * (1 - ph), col, (1 - ph) * 0.95, 3); } break; }
          case 'smoke': for (let j = 0; j < 6; j++) { const ph = (TA * 0.35 + j / 6) % 1; sp.push(n.x + Math.sin(j * 2.1) * 0.35 * ph, 1.7 + ph * 2.8, n.z + Math.cos(j * 3.3) * 0.35 * ph, 0.5 + ph * 1.3, 0.3, 0.32, 0.38, 0.55 * (1 - ph), 10, 0, 0, 0); } break;
          case 'spark': for (let j = 0; j < 6; j++) { const ph = (TA * 1.7 + j * 0.37) % 1, ang = j * 1.9 + Math.floor(TA * 1.7 + j * 0.37) * 2.3; spr(n.x + Math.cos(ang) * ph * 1.5, 1.2 + ph * (1 - ph) * 3.6, n.z + Math.sin(ang) * ph * 1.5, 0.11, [1, 0.72, 0.25], (1 - ph) * 0.95, 3); } break;
          case 'beam': rb.push(n.x, 0.3, n.z, 18, n.x, 7.5, n.z, 0, col[0] * 0.5 + 0.5, col[1] * 0.5 + 0.5, col[2] * 0.5 + 0.5, 0.75, 3, 7.2, 0, 0); spr(n.x, 7.5, n.z, 1.8, col, 0.6 * (0.6 + 0.4 * Math.sin(TA * 4)), 0); break;
          default: break;
        }
      });
      // ---- zones, shadows and light pools
      sc.zones.forEach((z, zi) => dd.push(z.x, z.z, z.hx, z.hz, z.col[0], z.col[1], z.col[2], 0.8, 2, -TA * 0.25 + zi, 0, 0));
      sc.ns.forEach((n, i) => { dd.push(n.x, n.z, 2.3, 2.3, 0, 0, 0, 0.55, 0, 0, 0, 0); dd.push(n.x, n.z, 3.7, 3.7, n.col[0], n.col[1], n.col[2], 0.1 + 0.4 * Math.max(0, sc.dim[i] - 0.2) * (0.5 + sc.foc[i]) + 0.25 * sc.hov[i], 1, 0, 0, 0); });
      // ---- node glow sprites
      sc.ns.forEach((n, i) => { const g = 0.12 + 0.5 * sc.foc[i] + 0.2 * sc.hov[i]; if (sc.dim[i] > 0.5) spr(n.x, 1.1, n.z, 2.7 + 0.6 * sc.foc[i], n.col, g * sc.dim[i] * 0.6, 0); });
      // ---- links as ribbons
      sc.links.forEach((l, i) => { const a = sc.act[i], w = 4 + 6 * a; for (let j = 0; j < l.path.length - 1; j++) { const p0 = l.path[j], p1 = l.path[j + 1]; rb.push(p0[0], p0[1], p0[2], w, p1[0], p1[1], p1[2], l.cum[j], l.col[0] * 0.5 + 0.5, l.col[1] * 0.5 + 0.5, l.col[2] * 0.5 + 0.5, 0.12 + 0.88 * a, 2, l.cum[j + 1] - l.cum[j], 0, 0); } });
      // ---- upload
      per.forEach((arr, k) => { if (arr.length) { const t = SC.fper[k]; t.set(arr.length > t.length ? arr.slice(0, t.length) : arr); G.sub(R.prims[k].inst, t.subarray(0, Math.min(arr.length, t.length))); } });
      SC.fdd.set(dd.length > SC.fdd.length ? dd.slice(0, SC.fdd.length) : dd); G.sub(R.dInst, SC.fdd.subarray(0, Math.min(dd.length, SC.fdd.length)));
      SC.frb.set(rb.length > SC.frb.length ? rb.slice(0, SC.frb.length) : rb); G.sub(R.rInst, SC.frb.subarray(0, Math.min(rb.length, SC.frb.length)));
      SC.fsp.set(sp.length > SC.fsp.length ? sp.slice(0, SC.fsp.length) : sp); G.sub(R.sInst, SC.fsp.subarray(0, Math.min(sp.length, SC.fsp.length)));
      // ---- render
      R.post.bind(); gl.clearColor(0.03, 0.05, 0.12, 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.disable(gl.DEPTH_TEST); gl.disable(gl.BLEND); gl.disable(gl.CULL_FACE); gl.bindVertexArray(null);
      G.use(R.bg); G.set(R.bg, 'uVP', [W, H]); G.set(R.bg, 'uPar', [c.yaw, c.pitch]); G.set(R.bg, 'uSky', sc.tc); gl.drawArrays(gl.TRIANGLES, 0, 3); dc++;
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL);
      const drawSolids = (mir) => { G.use(R.solid); G.set(R.solid, 'uV', V); G.set(R.solid, 'uP', P); G.set(R.solid, 'uLv', vl); G.set(R.solid, 'uUp', up); G.set(R.solid, 'uT', TA); G.set(R.solid, 'uMir', mir); gl.frontFace(mir ? gl.CW : gl.CCW); per.forEach((arr, k) => { if (!arr.length) return; gl.bindVertexArray(R.prims[k].vao); gl.drawElementsInstanced(gl.TRIANGLES, R.prims[k].n, gl.UNSIGNED_SHORT, 0, Math.min(arr.length, SC.fper[k].length) / 16); dc++; }); };
      gl.enable(gl.CULL_FACE); gl.depthMask(true);
      if (s.mirror) drawSolids(1);
      gl.disable(gl.CULL_FACE); G.use(R.floor); G.set(R.floor, 'uV', V); G.set(R.floor, 'uP', P); G.set(R.floor, 'uFl', sc.fl); G.set(R.floor, 'uTc', sc.tc); G.set(R.floor, 'uT', TA); gl.bindVertexArray(R.fVao); gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4); dc++;
      gl.depthMask(false); G.use(R.decal); G.set(R.decal, 'uV', V); G.set(R.decal, 'uP', P); gl.bindVertexArray(R.dVao); gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, Math.min(dd.length, SC.fdd.length) / 12); dc++;
      gl.enable(gl.CULL_FACE); gl.depthMask(true); drawSolids(0); gl.disable(gl.CULL_FACE); gl.frontFace(gl.CCW); gl.depthMask(false);
      G.use(R.rib); G.set(R.rib, 'uV', V); G.set(R.rib, 'uP', P); G.set(R.rib, 'uVP', [W, H]); G.set(R.rib, 'uT', TA); G.set(R.rib, 'uLS', 4.5); gl.bindVertexArray(R.rVao); gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, Math.min(rb.length, SC.frb.length) / 16); dc++;
      G.use(R.spr); G.set(R.spr, 'uV', V); G.set(R.spr, 'uP', P); G.set(R.spr, 'uT', TA); G.set(R.spr, 'uBurst', [0, 0, 0, -1]); gl.bindVertexArray(R.sVao); gl.drawArraysInstanced(gl.TRIANGLE_STRIP, 0, 4, Math.min(sp.length, SC.fsp.length) / 12); dc++;
      gl.depthMask(true); gl.bindVertexArray(null);
      R.post.finish({ cw, ch, bloom: 0.55, vig: 0.45, ab: s.bloom ? 0.002 : 0, time: TA * 60 % 997, thr: 0.66 });
      void age;
    };

    /* ---------- 2D overlay: zone names, node labels, callouts, progress bars ---------- */
    const rr = (x, y, w, h, r) => { hx.beginPath(); hx.moveTo(x + r, y); hx.arcTo(x + w, y, x + w, y + h, r); hx.arcTo(x + w, y + h, x, y + h, r); hx.arcTo(x, y + h, x, y, r); hx.arcTo(x, y, x + w, y, r); hx.closePath(); };
    const rgba = (c, a) => 'rgba(' + Math.round(c[0] * 255) + ',' + Math.round(c[1] * 255) + ',' + Math.round(c[2] * 255) + ',' + a + ')';
    const glyph = (g, x, y) => {
      const col = rgba(GLYPH[g], 1); hx.save(); hx.strokeStyle = col; hx.fillStyle = col; hx.lineWidth = 2; hx.lineCap = 'round'; hx.lineJoin = 'round'; hx.beginPath();
      if (g === 'ok') { hx.moveTo(x - 5, y); hx.lineTo(x - 1.5, y + 3.8); hx.lineTo(x + 5, y - 4); hx.stroke(); }
      else if (g === 'no') { hx.moveTo(x - 4, y - 4); hx.lineTo(x + 4, y + 4); hx.moveTo(x + 4, y - 4); hx.lineTo(x - 4, y + 4); hx.stroke(); }
      else if (g === 'warn') { hx.moveTo(x, y - 5.5); hx.lineTo(x + 6, y + 4.5); hx.lineTo(x - 6, y + 4.5); hx.closePath(); hx.stroke(); hx.fillRect(x - 0.8, y - 2, 1.6, 3.4); hx.fillRect(x - 0.8, y + 2, 1.6, 1.5); }
      else if (g === 'lock') { hx.rect(x - 4.5, y - 1, 9, 6.5); hx.stroke(); hx.beginPath(); hx.arc(x, y - 1, 3, PI, 0); hx.stroke(); }
      else if (g === 'up') { hx.moveTo(x, y + 5); hx.lineTo(x, y - 5); hx.moveTo(x - 4, y - 1); hx.lineTo(x, y - 5); hx.lineTo(x + 4, y - 1); hx.stroke(); }
      else { hx.moveTo(x, y - 5); hx.lineTo(x, y + 5); hx.moveTo(x - 4, y + 1); hx.lineTo(x, y + 5); hx.lineTo(x + 4, y + 1); hx.stroke(); }
      hx.restore();
    };
    const overlay = (c) => {
      const sc = c.sc, st = sc.steps[c.step], TA = calm ? 1.7 : T; hx.clearRect(0, 0, W, H); hx.textBaseline = 'middle'; hx.textAlign = 'center';
      const small = W < 520, taken = [];
      sc.zones.forEach((z) => { const p = project([z.x - z.hx + 0.6, 0, z.z + z.hz - 0.4]); hx.font = '600 ' + (small ? 11 : 12) + 'px system-ui,sans-serif'; hx.textAlign = 'left'; hx.fillStyle = rgba(z.col, 0.95); hx.fillText(z.label, Math.max(8, p.x), Math.min(H - 10, p.y)); });
      const order = sc.ns.map((_, i) => i).sort((a, b) => (sc.foc[b] + sc.hov[b]) - (sc.foc[a] + sc.hov[a]) || project([sc.ns[b].x, 0, sc.ns[b].z]).z - project([sc.ns[a].x, 0, sc.ns[a].z]).z);
      hx.textAlign = 'center';
      const wrap2 = (t) => { if (!small || t.length < 15) return [t]; const mid = Math.floor(t.length / 2); let i = t.indexOf(' ', mid - 3); if (i < 0 || i > t.length - 3) i = t.lastIndexOf(' ', mid + 3); return i > 2 ? [t.slice(0, i), t.slice(i + 1)] : [t]; };
      const hit = (r) => r[0] < 4 || r[0] + r[2] > W - 4 || r[1] < 4 || r[1] + r[3] > H - 4 || taken.some((t) => r[0] < t[0] + t[2] + 2 && r[0] + r[2] > t[0] - 2 && r[1] < t[1] + t[3] && r[1] + r[3] > t[1]);
      order.forEach((i) => {
        const n = sc.ns[i], p = project([n.x, c.portrait ? 0.9 : 2.55, n.z]), base = project([n.x, 0.9, n.z]), isF = sc.foc[i] > 0.5, on = sc.dim[i] > 0.5, ls = wrap2(n.label); hx.font = (isF || c.hover === i ? '700 ' : '600 ') + (small ? 11 : 12.5) + 'px system-ui,sans-serif';
        const w = Math.max(...ls.map((t) => hx.measureText(t).width)) + (small ? 12 : 16), h = ls.length > 1 ? 34 : 24, off = 1.95 * ((H / 2) / (Math.tan(FOV / 2) * base.w)) + 8;
        const cx2 = (x) => Math.max(w / 2 + 4, Math.min(W - w / 2 - 4, x)), cand = c.portrait ? [[base.x + off + w / 2, base.y], [base.x - off - w / 2, base.y], [cx2(base.x), base.y + off * 0.9 + h / 2], [cx2(base.x), base.y - off * 0.9 - h / 2]] : [[p.x, p.y], [base.x, base.y + off + h / 2 - 6], [cx2(p.x), p.y - h - 4]];
        let rc = null, lx = 0, ly = 0; for (const [cx, cy] of cand) { const r = [cx - w / 2, cy - h / 2, w, h]; if (!hit(r)) { rc = r; lx = cx; ly = cy; break; } }
        if (!rc) { if (!isF && c.hover !== i) return; lx = cand[0][0]; ly = cand[0][1]; rc = [lx - w / 2, ly - h / 2, w, h]; }
        taken.push(rc); hx.globalAlpha = on ? 1 : 0.45; hx.fillStyle = 'rgba(6,12,36,.86)'; rr(rc[0], rc[1], w, h, 7); hx.fill(); hx.strokeStyle = rgba(n.col, isF ? 1 : 0.45); hx.lineWidth = isF ? 1.6 : 1; hx.stroke(); hx.fillStyle = '#fff';
        ls.forEach((t, k) => hx.fillText(t, lx, ly + 1 + (k - (ls.length - 1) / 2) * 13));
        if (st && st.n.includes(i) && on && st.n.indexOf(i) === 0) { hx.fillStyle = rgba(n.col, 1); hx.beginPath(); hx.arc(rc[0] - 4, ly, 11, 0, TAU); hx.fill(); hx.fillStyle = '#04122e'; hx.font = '800 12px system-ui,sans-serif'; hx.fillText(String(c.step + 1), rc[0] - 4, ly + 1); }
      });
      // callouts and progress bars of the current step
      if (st) {
        const age = TA - c.stepT, items = [...st.fx.c.map(([i, text, g]) => ({ i, text, g })), ...st.fx.b.map(([i, text]) => ({ i, text, bar: true }))];
        items.forEach((it, idx) => {
          const n = sc.ns[it.i], al = ease((age - idx * 0.25) / 0.5); if (al <= 0.02) return;
          const p = project([n.x, 3.8, n.z]); hx.font = '600 11.5px system-ui,sans-serif'; hx.textAlign = 'left';
          const tw = hx.measureText(it.text).width, gw = it.g ? 20 : 0, bw = it.bar ? 50 : 0, w = tw + gw + bw + 18, h = 24;
          let rc = null; for (const dy of [0, -30, 30, -60, 60]) { const r = [Math.max(4, Math.min(W - w - 4, p.x - w / 2)), p.y - 22 + dy - h / 2, w, h]; if (!hit(r)) { rc = r; break; } }
          if (!rc) return; taken.push(rc);
          hx.globalAlpha = al; const y0 = rc[1] + (1 - al) * 8, col = it.bar ? n.col : GLYPH[it.g];
          hx.fillStyle = 'rgba(6,12,36,.92)'; rr(rc[0], y0, w, h, 8); hx.fill(); hx.strokeStyle = rgba(col, 0.9); hx.lineWidth = 1.2; hx.stroke();
          if (it.g) glyph(it.g, rc[0] + 14, y0 + h / 2);
          hx.fillStyle = '#fff'; hx.textBaseline = 'middle'; hx.fillText(it.text, rc[0] + 9 + gw, y0 + h / 2 + 1);
          if (it.bar) { const bx = rc[0] + w - bw - 8, by = y0 + h / 2 - 3, fill = Math.max(0, Math.min(1, age / 3.4)); hx.fillStyle = 'rgba(255,255,255,.16)'; rr(bx, by, bw, 6, 3); hx.fill(); hx.fillStyle = rgba(col, 1); rr(bx, by, Math.max(4, bw * fill), 6, 3); hx.fill(); }
          hx.textAlign = 'center';
        });
      }
      hx.globalAlpha = 1;
    };

    /* ---------- input ---------- */
    const pick = (mx, my) => { const c = cur; if (!c || !V) return -1; let b = -1, bd = 1e9; c.sc.ns.forEach((n, i) => { const p = project([n.x, 1.0, n.z]), d = Math.hypot(p.x - mx, p.y - my), r = Math.max(30, 190 / Math.max(0.4, p.w) * 0.55); if (d < r && d < bd) { bd = d; b = i; } }); return b; };
    const xy = (e) => { const r = hc.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; };
    hc.addEventListener('pointerdown', (e) => { const c = cur; if (!c) return; c.drag = { x: e.clientX, y: e.clientY, m: 0 }; try { hc.setPointerCapture(e.pointerId); } catch (x) { /* ignore */ } wake(); });
    hc.addEventListener('pointermove', (e) => { const c = cur; if (!c) return; if (c.drag) { const dx = e.clientX - c.drag.x, dy = e.clientY - c.drag.y; c.drag.m += Math.abs(dx) + Math.abs(dy); c.drag.x = e.clientX; c.drag.y = e.clientY; c.yaw -= dx * 0.006; c.pitch = Math.max(0.35, Math.min(1.2, c.pitch + dy * 0.004)); c.vyaw = -dx * 0.0007; c.vpitch = dy * 0.0004; wake(); return; } const [mx, my] = xy(e), h = pick(mx, my); if (h !== c.hover) { c.hover = h; hc.style.cursor = h >= 0 ? 'pointer' : 'grab'; wake(); } });
    hc.addEventListener('pointerup', (e) => { const c = cur; if (!c) return; const d = c.drag; c.drag = null; if (d && d.m < 6) { const [mx, my] = xy(e), h = pick(mx, my); if (h >= 0) c.focusNode(h); } wake(); });
    hc.addEventListener('pointerleave', () => { if (cur && !cur.drag) { cur.hover = -1; wake(); } });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) wake(); });
    gc.addEventListener('webglcontextlost', (e) => { e.preventDefault(); lost = true; });
    gc.addEventListener('webglcontextrestored', () => { try { mk(); size(); lost = false; wake(); } catch (x) { dead = true; } });
    mk();
    host = { attach, root, info: () => ({ q, fps: gov.fps, dc, err, frames, lost, dead }), canvas: hc, wake };
    return host;
  };
})();
