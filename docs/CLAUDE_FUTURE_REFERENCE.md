# InfoXtek Future Reference (v1.1.0)

## State
Built and checked locally: 13 pages + 404, sitemap, robots, CSP, JSON-LD, GitHub Actions workflow, dev server.
NOT done: live deployment, DNS, HTTPS, visual/browser testing, Lighthouse, form backend, real contact data, real testimonials/resources, dependency audit (no dependencies exist), pinning Actions to commit SHAs.

## Requirements
SEO-friendly, scalable under traffic, upgradeable. Static output served by GitHub Pages CDN (no origin server to overload).

## Architecture
- `src/config/site.mjs`: all content (site, contact, nav, services, reasons, industries, bookings, resources, testimonials).
- `scripts/build.mjs`: templates and page generation to `dist/`. Adding a service = add one object to `services`; page, nav card, sitemap entry and contact option appear automatically.
- `src/assets/` (CSS/JS), `public/` (favicon, CNAME) copied to `dist/`.
- `scripts/check.mjs`: verifies SEO tags, one h1, internal links, no external resource URLs.
- `scripts/serve.mjs`: local server, starts at 3000, skips reserved ports, increments if busy.
- `.github/workflows/deploy.yml`: build, check, upload, deploy; least-privilege permissions.

## Routes
/, /why-choose-us/, /services/, /services/{cloud-solutions,cloud-desktop,managed-it,network-solutions,disaster-recovery,support-consulting}/, /industries/, /tools-tips/, /book-online/, /contact/, /404.html

## SEO
Unique title/description, canonical to https://infoXtek.com, Open Graph, JSON-LD (Organization, WebSite, BreadcrumbList with name/url only), sitemap.xml, robots.txt, semantic landmarks, one h1 per page, cache-busting asset versions.

## Scalability
Static files on GitHub's CDN; no server code or database; small CSS/JS, no web fonts or third-party scripts. If traffic or features outgrow Pages (headers control, redirects, forms), move `dist/` unchanged to Cloudflare Pages or Netlify.

## Upgrade path
1. Content growth: add entries to config; for a blog, add a `posts` array and a template.
2. Framework: content is separated from templates, so migrating to Astro means turning each template function into a component and importing the same config.
3. Forms: set `contact.formEndpoint` to an approved https provider. CSP and form-action update automatically.
4. Images: add to `src/assets/` and reference with width/height and alt text.

## Security
No dependencies, no remote scripts/fonts/analytics. All config text is HTML-escaped at build. JSON-LD escapes `<`. CSP via meta (no frame-ancestors via meta; set headers if moving to a host that supports them). Form: client validation, honeypot, endpoint must be https. Actions use version tags; pin to SHAs before launch.

## Known issues / decisions
- Astro was preferred but the build environment had no network, so a dependency-free generator was used.
- Contact form is disabled-by-design until an endpoint is configured; it says so to the user.
- No testimonials or resources published (none verified).

## Docs
- `docs/SETUP_GUIDE_NAMECHEAP.md`: beginner guide (folder map, GitHub Desktop upload, Pages, Namecheap DNS, HTTPS, later edits, troubleshooting). Namecheap UI steps written from general knowledge, not verified against the live Namecheap site.

## Version log
- v1.0.0 initial build, port 3000.
- v1.0.0 (docs only) added beginner setup guide; no code change.

## Next session
Read CLAUDE.md, check git status, ask for real contact details, GitHub username, form provider; then deploy and verify DNS.

- v1.1.0 (port 3001): services expanded to 7 (added Cyber Security) with intro, delivery steps, outcomes and vendor groups per service; icons, animated hero (CSS only), scroll reveal (respects reduced motion), vendor strip. Vendor names are text only (no logos, no partnership claims; footnote on trademarks). Owner-provided email set in config.
- Not matched to Wix: Wix photos/graphics not copied (stock/licensed); no per-service diagrams or imagery yet; Wix testimonial (John Smith, ABC Company) is template text and was not used.
- Verify vendor list and capability wording with the business before launch.
- v1.2.0 (port 3002): per-service "What we do" capability lists written from the owner's resume (responsibilities rephrased as company services); vendor strip now driven by `platforms` in config; removed unsupported AVD/Windows 365/WorkSpaces and Microsoft Sentinel (resume lists SentinelOne). Not published: personal contact details, employer names, resume metrics (98% leakage cut, 100% backup success, RTO -40%), certifications. AWS, Alibaba, CrowdStrike, Proofpoint, FortiDLP kept at owner's request though absent from resume: verify before launch.
- v1.3.0 (port 3003): Tools & Tips now shows 16 written tips (security, backup, AI, cloud) instead of a developer placeholder; AI/cyber backdrop: neural-network pattern, scan line, floating keyword chips (CSS only, light theme, reduced-motion safe). Tips are generic best practice authored by Claude: owner to review.
- v1.4.0 (port 3004): official logo mark in header and favicons; brand renamed InfoXteK in config; wordmark image not used (wrong name).
