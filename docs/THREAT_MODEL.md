# InfoXteK Threat Model (v2.6.0, updated v3.0.0)
Assets: domain infoXtek.com, GitHub repo/Actions, visitor trust, license-request data typed by visitors.
Trust boundaries: visitor browser; GitHub Pages (static host); Namecheap DNS; GitHub account; optional third-party form provider.

| Threat | Vector | Mitigation | Residual |
|---|---|---|---|
| Account takeover of GitHub/Namecheap | phishing, weak 2FA | Owner enables 2FA/passkeys, no shared tokens | Owner-dependent |
| Malicious commit/Action | compromised action tag | least-privilege permissions; no secrets | Tags not SHA-pinned |
| XSS | injected HTML/JS | static output, escaped build, CSP script-src 'self', banned-sink check | Low |
| Open redirect | location.href from data | same-site path validation | Low |
| Data leak via form | misconfigured endpoint | CSP limits connect-src; mailto fallback; honeypot; no secrets client-side | Provider risk once chosen |
| Subdomain/DNS takeover | dangling DNS | no wildcard DNS, only A + www CNAME | Owner must keep records tidy |
| Clickjacking | iframe embedding | not enforceable on Pages | Accepted |
| Spam/abuse of license form | bots | honeypot, corporate-email rule | No server-side rate limit |
| IDOR / broken access control | guessing ids or URLs | no backend, no private data, no per-user objects; URL hash/query only matched to existing ids | N/A for a static public site |
| Malicious or corrupt 3D flow data (v3.0.0) | bad `data-f` JSON or flows3d.mjs change | validated in the build (`validateFlow`) and again from final HTML by `check.mjs`; runtime `JSON.parse` in try/catch; text only via `textContent`/`fillText`; failure removes the stage and keeps the text steps | Needs repo write access first |
| GPU / driver bug or resource exhaustion via the 3D scenes | heavy scene, driver crash, context loss | bounded geometry and instance counts, DPR caps, quality governor steps down, rendering paused off-screen/hidden, one shared flow context, context-loss recovery then 2D fallback | Real-GPU behaviour unverified |
| Fingerprinting through 3D code | WebGL renderer strings, canvas readback | never read (enforced by `check.mjs`); `deviceMemory`/`hardwareConcurrency` used locally only for a starting quality tier | Standard browser surface remains |
