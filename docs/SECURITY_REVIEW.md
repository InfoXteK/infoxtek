# InfoXteK Security Review (v2.6.0)
Scope: repo as uploaded (infoxtek-web-v2_5_1.zip), reviewed by static inspection plus build and check runs in the Claude sandbox. No network in the sandbox: no live site, DNS, GitHub or npm registry checks were done.

## Results
| Area | Result |
|---|---|
| Dependencies | Zero runtime/dev dependencies, no lockfile needed, no install scripts. `npm audit` not applicable and not run. |
| External hosts in source/dist | Only infoXtek.com, github.com/InfoXteK/*, schema.org/w3.org/sitemaps.org namespace strings. No CDN, fonts, scripts, embeds. |
| Telemetry/exfil | No analytics, beacons, XHR, WebSocket, cookies. Only network calls: `fetch` to the optional form endpoint (not configured; CSP `connect-src` restricts it to that origin). Pointer/key listeners are local UI effects only; nothing recorded or sent. |
| Storage | localStorage used for FX on/off and XP/level only (local, no personal data). |
| Obfuscation | None found. License CC emails are base64 in a data attribute: trivially reversible anti-scrape, not a security control. |
| CSP | Meta CSP: default/script/style/img/font/connect 'self', object-src none, base/form-action self. No inline scripts except JSON-LD. `frame-ancestors` cannot be set via meta (GitHub Pages sends no custom headers). |
| Secrets | None in src, scripts, workflow. |
| Workflow | `contents: read` for build; `pages: write` + `id-token: write` only on deploy job. Actions pinned to major tags, NOT commit SHAs. |

## Fixed in v2.6.0
1. `location.href = nodes[i].h` in the galaxy now accepts only same-site absolute paths (`/x`, not `//x` or schemes).
2. Dev server path check now `root + sep` (prevents sibling-directory prefix match).
3. Workflow jobs have `timeout-minutes: 10`.
4. `npm run check` now fails the build on: banned sinks (eval, new Function, document.write, innerHTML=, insertAdjacentHTML, sendBeacon, XHR, WebSocket, cookie, dynamic import), missing CSP/referrer meta, inline event handlers, inline scripts, `target=_blank` without noopener, non-HTTPS CSP hosts. Negative-tested with an injected `onclick`.

## Open items
- Pin GitHub Actions to full commit SHAs (needs network to look up SHAs; not done, not guessed).
- Form provider not chosen. Before setting `formEndpoint`, review the provider's privacy terms and use HTTPS only.
- Clickjacking protection not possible via meta CSP on GitHub Pages.
- Not performed: live-site check, Lighthouse/axe accessibility run, real-browser visual test, DNS/HTTPS verification, GitHub Dependabot/Actions settings review.

## v2.7.0 addendum
- check.mjs now also fails on inline `style=` attributes (CSP `style-src 'self'` blocks them; a first draft of the detail panels used one and produced console errors, caught by browser test).
- New content file src/config/details.mjs is static text, rendered with HTML escaping in the build. No new hosts, dependencies, storage or network calls. URL hash is read to open a panel: the value is only matched against existing element ids, never inserted into the page.
