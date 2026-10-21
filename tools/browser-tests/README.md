# Browser tests (optional, not part of the build)
Playwright scripts used to verify the 3D engine. They need `npm i -g playwright` and a Chromium, and a running site: `PORT=3021 node scripts/serve.mjs`.
Run with `NODE_PATH=$(npm root -g) node tools/browser-tests/<file>.cjs` (set `BASE=http://127.0.0.1:3021` if the port differs).
- `map-smoke.cjs`: galaxy renders in WebGL, chip and canvas click open a panel in one click, no console errors.
- `flow-functional.cjs`: flow stage on a service page (steps, keyboard, play/pause, list sync), panel switching on /services/, generated flow on a reasons panel.
- `fallback-recovery-mobile.cjs`: `ONLY=D|E|F|G` selects no-WebGL fallback, context loss and recovery, reduced motion, phone viewport.
Software WebGL (SwiftShader flags are in the scripts) is slow: run one `ONLY=` scenario per command and keep each under about 4 minutes. Screenshots are written to /tmp.
