# Live demos inside InfoXteK (v3.2.0)

## What visitors get
- Products page and each product page have a **Live demo** button. It opens `/products/<slug>/demo/` in a **new tab**. That page keeps the InfoXteK header and menu, so the visitor never leaves infoxtek.com.
- The demo page shows the simulation in a frame, view buttons (for example Dashboard, Devices, Alerts), a "What to try" list and the full list of operations and functions.
- Every link that leaves InfoXteK (GitHub repos, Releases) opens in a **new tab** with `rel="noopener noreferrer"`. Build and `npm run check` enforce this on every page.

## Where things live
| Product | Source folder | Built to | Page |
|---|---|---|---|
| Net-Monit | `demos/net-monit/` (GitHub Pages demo V11.4 with Explain mode and scenarios) | `/demos/net-monit/` | `/products/net-monit/demo/` |
| PC Admin Tools | `demos/pc-admin-tools/` (Web edition demo v4.0, 113 operations) | `/demos/pc-admin-tools/` | `/products/pc-admin-tools/demo/` |
| iFiNeX | `demos/ifinex/` (web v9.6 demo) | `/demos/ifinex/` | `/products/ifinex/demo/` |

Text shown on the pages (what to try, function groups, limits) is in `src/config/demos.mjs`. For PC Admin Tools the operation list is read from `demos/pc-admin-tools/ops-data.js` at build time, so replacing that file updates the site.

## Replace a demo with a newer one
1. Delete the old folder contents in `demos/<slug>/` on GitHub, upload the new demo files (same folder, same entry file names).
2. Edit `src/config/demos.mjs` if pages, steps or limits changed (`views` must list files that exist).
3. Push to `main`. The workflow runs `npm run build` and `npm run check`; a missing view or entry file fails the build.

## How demos are protected
- Each demo page gets its own Content-Security-Policy meta tag (same origin only, no external scripts, styles, fonts or calls), `noindex`, and no referrer. The single exception: Net-Monit `speedtest.html` may call speed.cloudflare.com and api.ipify.org, only when the visitor starts the browser speed test.
- The frame uses `sandbox` without `allow-top-navigation`, so a demo cannot redirect the InfoXteK page.
- `robots.txt` disallows `/demos/`.
- Demos run on the infoxtek.com origin (needed for their browser storage). InfoXteK has no login, cookies or private data, so the exposure is limited. Do not add accounts or secrets to this origin without moving demos to their own subdomain.
- Standalone repo pages (infoxtek.github.io/..., mohamedabdullahkhan.github.io/...) are listed in `demoStandalone` for reference and are not linked from the site.

## Demo page content (v3.3.0)
Sections on `/products/net-monit/demo/` and `/products/pc-admin-tools/demo/` come from `src/config/demodetail.mjs` plus the demo data (`demos/net-monit/static/js/guide-data.js`, `demos/pc-admin-tools/ops-data.js`). Replace those files with newer ones and rebuild; counts update automatically. Edit text in demodetail.mjs.
