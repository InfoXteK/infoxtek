# InfoXteK Threat Model (v2.6.0)
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
