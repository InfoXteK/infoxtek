# InfoXteK 3D engine (v3.0.0)

Zero dependencies. Hand-written WebGL2. No network, storage or tracking code. Files are served from the same origin and the CSP is unchanged.

## What it does

1. **Service galaxy** (`.ring3d` on Home, Services, Industries, Why Choose Us, Tools & Tips, Products, Platforms): a real-time 3D scene of glossy orbs around a core, with a reflective floor, light shafts, dust, orbit rings, a selection beam, bursts on selection, bloom and vignette.
2. **3D flow stage** (`.flow3d` in every service, product and platform panel and page, and in every reasons, industries and tips panel): a logical pipeline shown as typed 3D nodes on pedestals, dashed zones, links with direction chevrons and travelling packets. A camera moves step by step and dims everything that is not part of the step.

## Files

| File | Role | Size (raw / gzip) |
|---|---|---|
| `src/assets/gl-core.js` | context wrapper, geometry (box, cylinder/cone/hex, sphere, torus), post-processing (MSAA, 2-level bloom, vignette, dither), quality governor, shared sprite and ribbon shaders | 18 KB / 6 KB |
| `src/assets/gl-galaxy.js` | `IXGL.galaxy(canvas, opts)` renderer for the map | 23 KB / 8 KB |
| `src/assets/gl-flow.js` | `IXGL.flowHost()` shared context and flow controller | 32 KB / 11 KB |
| `src/assets/site.js` | galaxy glue (interaction, labels, HUD, 2D fallback renderer) and the `F3` flow UI controller | |
| `src/config/flows3d.mjs` | all flow definitions, `autoFlow()`, `validateFlow()` | |

`scripts/build.mjs` loads only the scripts a page needs, always before `site.js`: map pages get `gl-core` + `gl-galaxy`, pages with flows get `gl-core` + `gl-flow`, other pages (Contact, Book online, 404) get none. `npm run check` enforces this.

## Rendering pipeline (per frame)

Galaxy at quality 2: background shader, stars (GPU), mirrored spheres (floor reflection), floor, decals (shadows, light pools, ripple), lit spheres (one instanced draw for all nodes, core and satellites), ribbons (links, rings, gyro, beam), sprites (halos, pulses, dust, burst) and then post: MSAA resolve, bright pass, blur, composite. Roughly 10 to 18 draw calls. Stars, dust, pulses and bursts are animated in the vertex shader from a time uniform, so they cost no CPU per frame.

Flow stage: background, mirrored solids, floor, decals (zones, shadows, pools), solids (8 instanced draws, one per primitive type), ribbons (links), sprites (packets, glow), then the same post stack.

The camera maths of the galaxy mirror the 2D fallback (`proj()`), so hit-testing, fly-to and labels are shared.

## Performance design

- Quality tiers, chosen once from the device and then only ever stepped **down**: tier 2 (DPR up to 2, MSAA 4x, 2-level bloom, reflection, 1800 stars, 220 dust, nebula noise), tier 1 (DPR up to 1.5, MSAA 4x, 1-level bloom, reflection), tier 0 (DPR up to 1.25, no MSAA, no bloom, no reflection).
- Start tier: 2 on desktop, 1 if the pointer is coarse, `deviceMemory` is 4 GB or less, or there are 4 cores or fewer. Governor: after a 30-frame warm-up, an average frame time above 27 ms for 40 frames drops one tier. It never steps up, so it cannot flap.
- No work when nothing is visible: the loop stops when the canvas is off-screen (IntersectionObserver) or the tab is hidden, and restarts on return. With reduced motion the galaxy renders only for about 1.5 s after an interaction.
- Flow stages mount lazily only while on screen and share **one** WebGL context for the whole page. Leaving the screen or switching panels detaches the stage (no context is created or destroyed per panel).
- Buffers are preallocated and reused, so frames allocate no large typed arrays. `gl.getError()` (a pipeline sync) runs every 900 frames in production and every 90 frames when `?q=` is set.
- Context loss: `webglcontextlost` is handled, the context is rebuilt on `webglcontextrestored`, and if it does not return within 2.5 s the galaxy falls back to the 2D renderer.
- Size budget enforced by `npm run check`: each engine file under 70 KB, total under 150 KB.

## Fallback chain

1. WebGL2 available: GL galaxy plus GL flow stage.
2. No WebGL2, or init error, or context never restored: the 2D canvas galaxy from v2.9.0 and the CSS 3D step cards (`.f3list`). Nothing else changes.
3. No JavaScript: panels are static HTML (steps are an ordered list), the map becomes a list of links.

## Accessibility

- The flow stage is a focusable group with a text label; Left/Right change step, Space/Enter toggle play, Home shows the whole flow. Step buttons (All, 1..n, previous, next, play, reset view) are real buttons with names; the caption is an `aria-live` region; the full step text is always in the page as a list.
- Reduced motion: no autoplay (Play is hidden), camera moves are near-instant, packets and pulses are frozen at a fixed time.
- Colour is never the only signal: nodes have text labels, steps are numbered.
- Not yet verified with a screen reader or on real assistive technology.

## Privacy and security (see also `docs/SECURITY_REVIEW.md`)

- Engine files make no requests, use no storage, never read pixels back (`readPixels`, `toDataURL`) and never read GPU vendor or renderer strings. `npm run check` fails the build if any of these appear.
- Flow data is generated at build time from `src/config/flows3d.mjs`, validated there (`validateFlow`) and validated again from the final HTML by `scripts/check.mjs`. At runtime it is parsed with `JSON.parse` in a try/catch and shown with `textContent` or canvas `fillText`, never as HTML.
- The only input is the optional `?q=0|1|2` URL parameter (regex `[012]`) that pins a quality tier for testing.
- `navigator.deviceMemory`, `hardwareConcurrency` and `(pointer: coarse)` are read once to pick a starting tier. They are not stored or sent anywhere.

## Add or edit a 3D flow

Open `src/config/flows3d.mjs`. Each service, product or platform has an entry keyed by its slug:

```js
'disaster-recovery': {
  t: 'Disaster recovery',                       // title (also the screen-reader name)
  z: [['Primary site', 2, 0, 3, 0, 'info']],    // optional zones: label, col0, row0, col1, row1, tone
  n: [['us', 'user', 'Users', 0, 1],            // nodes: id (1-4 chars), kind, label, column, row, optional tone
      ['tm', 'globe', 'Traffic manager', 1, 1]],
  l: [['us', 'tm']],                            // links: from, to (arrow direction), optional tone
  s: [['Normal service', 'Users reach the primary site.', ['us', 'tm'], ['us>tm']]],  // steps: title, caption, active nodes, active links
}
```

Rules: columns 0 to 6 (keep to 0 to 4 so it stays readable on a phone), rows 0 to 3 (keep to 0 to 2), at most 12 nodes, 20 links, 6 steps, 3 zones. Two nodes cannot share a cell. Keep links straight and do not route them through other nodes. Captions must be true statements about a typical setup, never customer data or vendor-partnership claims. Run `npm run build && npm run check`: a wrong id, kind, link or step fails the build with the flow name and the problem.

Kinds: `user device phone server db cloud shield lock key gear globe doc mail bell chart code router firewall ai package goal threat clock admin`. Tones: `info good warn bad ai mute`. To add a new 3D shape, add a recipe to `REC` in `gl-flow.js` and the kind to `KINDS` in `flows3d.mjs`.

Reasons, industries and tips flows are generated from the points already in `src/config/details.mjs` (`autoFlow()`), so editing a point updates its 3D flow too.

## Testing

`tools/browser-tests/` has the Playwright scripts used for v3.0.0 (they need `npm i -g playwright` and a Chromium; they are not part of the build or deployment). Start the site with `PORT=3021 node scripts/serve.mjs`, then for example `NODE_PATH=$(npm root -g) node tools/browser-tests/t2.cjs`. Chromium flags `--use-angle=swiftshader --enable-unsafe-swiftshader` give software WebGL when there is no GPU. Software GL is far slower than a real GPU, so frame rates measured that way say nothing about real devices.

## Known limits

- Never run on a real GPU, a real phone, Safari or Firefox by the builder. Shader behaviour on other drivers is unverified.
- Labels are a 2D overlay: a label can cover a node behind it, and labels that would overlap another label are skipped.
- Touch: horizontal drag orbits the flow; vertical drag scrolls the page (pitch cannot be changed by touch).
- The map supports up to 28 nodes per group; flows up to 12 nodes.

## v3.1.0: choreography (what makes each flow different)
A flow may now carry a theme and per-step effects. Both are optional and validated (build and `npm run check`).
```js
th: ['circ', 'info', 'bits', [['cloud', 0, 2, 0.9, 3.3]]],        // floor, tone, ambient particles, decor [kind, col, row, scale, height]
s: [['Fail over', 'Caption text.', ['us','tm','d'], ['us>tm'],     // title, caption, active nodes, active links, then effects:
     [['s','tm>d','cube',3,1,1.2],                                   //   objects travel a>b: dot bit heart mail tok warn cube coin bad doc (count, end fraction, arc)
      ['n','d','ok'],                                                //   node state: fail ok alert scan block hot build ghost
      ['f','d','ring'],                                              //   node effect: ring radar burst smoke beam spark
      ['c','d','Service restored','ok'],                             //   callout (glyph ok no warn lock up down)
      ['b','r','Replicating']]]]                                     //   progress bar
```
End fraction below 1 stops the objects part way and bursts them (a blocked attack). Floors: grid hex circ ring dot wave rows. Particles: none rain bits sparks embers snow bubbles leaves stars. New prop kinds: tree turbine bank school gov sensor field plant pylon shop radar vault eye usb wifi coin book. Reasons, industries and tips live in `panelFlows` (tips take their four step texts from `details.mjs` and only add the scene).
Map usability (v3.1.0): no status or FPS text, no pointer parallax, auto-rotation waits 6 s after the last interaction and never runs while a node is hovered, the hovered and selected node do not bob, hit targets are larger with hover hysteresis, a click on a node already in view does not rotate the globe, previous/next arrows sit on the stage, and every open panel has a sticky switcher (all items, plus group buttons).
