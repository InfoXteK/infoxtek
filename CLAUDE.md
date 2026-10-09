# InfoXtek: Project Memory
- Project: InfoXtek corporate site rebuild (source: https://infoxtekcorp.wixsite.com/infoxtek). Target: https://infoXtek.com on GitHub Pages via Actions.
- Version: v1.9.0. Dev port: 3009 (verified free in build env; auto-increments, skips 80/443/3306/5432/8080).
- Stack: zero-dependency Node static generator (`scripts/build.mjs`), content in `src/config/site.mjs`. Astro migration is a later option (see docs).
- Design: light enterprise theme, indigo/teal, system fonts. No dark/black-primary theme.
- Never publish placeholder contact data. Unknown values stay `null` in config.
- No analytics/telemetry. CSP is built from config; form endpoint origin is the only allowed external host.
- Read `docs/CLAUDE_FUTURE_REFERENCE.md` first in new sessions. Update both docs on every change.
- Brand name is written InfoXteK (capital X and K). Logo mark: src/assets/logo.png (from owner, 99x128 RGBA). Supplied wordmark image reads "iFiNeX" so it is NOT used; header wordmark is live text with blue X and K. Replace with a corrected wordmark image if one is supplied.
- v1.7.0 (port 3007). Products page: Net-Monit, PC Admin Tools, iFiNeX (downloads pending, owner will upload to repo). Owner wants docs/CLAUDE_FUTURE_REFERENCE.md updated on every change and kept in memory.
