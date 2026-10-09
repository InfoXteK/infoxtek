# InfoXteK: Complete Claude Reference (v1.7.0, port 3007)
Living record from the start of the project. Update on every change. Repository and docs are the source of truth.

## 1. Identity
- Company/brand: **InfoXteK** (capital X and K). Domain infoXtek.com (case-insensitive). Company email: infoxtekcorp@gmail.com. Phone/address: not provided (null in config).
- Owner/builder: Mohamed Abdullah Khan (IT systems/security engineer, Dubai). Resume used only to shape service capabilities; personal contact, employers, certifications and resume metrics are NOT on the site.
- Source site (Wix): https://infoxtekcorp.wixsite.com/infoxtek. Wix photos/testimonial ("John Smith, ABC Company") are template content and not reused.
- GitHub: account/org InfoXteK, repo `infoxtek` (public). Namecheap holds the domain.

## 2. Timeline
1. Master prompt, CLAUDE.md and reference supplied: rebuild Wix site as secure static site on GitHub Pages at infoXtek.com. Conflicts resolved: port 3000 start, docs path docs/CLAUDE_FUTURE_REFERENCE.md, CNAME kept but not relied on, `/godmode` = autonomy within limits.
2. v1.0.0 built: zero-dependency Node generator (no network for Astro), 13 pages, SEO, CSP, Actions workflow, beginner guide.
3. Owner deployed via browser upload only (no GitHub Desktop). Issues fixed: hidden `.github` folder missing (created deploy.yml by hand); build failed on unquoted email in site.mjs; site unstyled at github.io/infoxtek/ (expected, absolute paths); DNS check failed until Namecheap records set. Site later seen live at infoxtek.com (HTTP, "Not secure": Enforce HTTPS still to tick).
4. v1.1.0 richer design: icons, animated hero, vendor strip, Cyber Security added (7 services), technical detail per service.
5. v1.2.0 resume-based "What we do" lists; removed invented AVD/Windows 365/WorkSpaces and Microsoft Sentinel (resume says SentinelOne).
6. v1.3.0 Tools & Tips placeholder replaced by 16 tips; AI/cyber backdrop (neural pattern, scan line, floating chips).
7. v1.4.0 logo mark + favicons; brand spelled InfoXteK; supplied wordmark image reads "iFiNeX" so not used.
8. v1.5.0 eight digital services added (15 total), per-service scenario animations (SVG SMIL + log ticker, config in scenes.mjs, labelled illustrative), hue per service header.
9. v1.6.0 per-page design styles; logo X and K blue (earlier Xt was a mistake).
10. v1.7.0 Products page (Net-Monit, PC Admin Tools, iFiNeX) with download placeholders; this reference.

## 3. Rules and decisions
- Light, premium theme by default. Dark only on Cyber Security (holographic/cyberpunk) and Full Stack (OLED), explicitly requested.
- No analytics/telemetry/tracking; CSP allows only self (+ form endpoint origin if set); no remote fonts/scripts; all config text HTML-escaped.
- Unknown company data stays null; never invent contact data. Vendors are text only, no logos or partnership claims (trademark footnote). AWS, Alibaba, CrowdStrike, Proofpoint, FortiDLP kept at owner request though not in resume: verify.
- Contact form is not connected (no backend); set `contact.formEndpoint` to an approved https provider.
- Never claim tests/audits/deploys/DNS happened unless run. Browser rendering has never been visually verified by Claude.
- Every code change bumps version and port and updates this file and CLAUDE.md.

## 4. Structure
package.json | scripts/build.mjs (templates, styleMap, scenes renderer), serve.mjs, check.mjs | src/config/site.mjs (all content: site, contact, nav, platforms, services, reasons, industries, bookings, resources, testimonials, tips, products) | src/config/scenes.mjs | src/assets/{site.css,site.js,logo.png} | public/{CNAME,favicon.png,favicon-32.png,downloads/} | .github/workflows/deploy.yml | docs/ (this file, SETUP_GUIDE_NAMECHEAP.md).

## 5. Pages and design styles
/ Bento | /why-choose-us/ Minimalist | /industries/ Flat | /products/ Glassmorphism | /tools-tips/ Claymorphism | /book-online/ Material | /contact/ Neumorphism | /services/ Fluent.
Services (slug: style): cloud-solutions Glass; cloud-desktop Fluent; managed-it Material; network-solutions Bento; disaster-recovery Skeuomorphism; cyber-security Holographic/Cyberpunk dark; support-consulting Minimalist; web-applications Neumorphism; mobile-applications Liquid glass; web-design-development Maximalism; seo Flat; digital-marketing Neo-brutalism; full-stack-apps OLED dark; ecommerce Clay; hosting-maintenance Material.
Change a page's style in `styleMap` (build.mjs).

## 6. Services (15)
IT & Security: Cloud Solutions (Azure, AWS, Alibaba, M365), Cloud Desktop (Intune, Entra ID, Hyper-V, VMware), Managed IT (ManageEngine, CVSS patching, AD/DNS/DHCP, helpdesk), Network (FortiGate, Forcepoint NGFW, Check Point, ClearPass, VPN), Disaster Recovery (Veeam, Acronis, Quorum onQ, HPE 3PAR, NetApp, RMAN), Cyber Security (Forcepoint DLP, FortiDLP, Taegis, Sophos, SentinelOne, Kaspersky, CrowdStrike, Defender, Proofpoint, AIP, BeyondTrust), Support Consulting.
Digital & Software: Web Applications, Mobile Applications, Website Design & Development, SEO, Digital Marketing, Full Stack Applications, E-commerce Development, Hosting & Maintenance.
Other content: 5 "why choose us" reasons, 5 industries (Agriculture, Banking & Financial Services, Education, Energy & Utilities, Government), 4 booking items (no pricing), 16 tips (generic, owner to review).

## 7. Products (owner's own software)
- **Net-Monit**: complete network monitoring tool, multi-level escalation alerts by email, SMS and phone call; web application for Windows and Linux.
- **PC Admin Tools**: complete admin operations performed remotely across the network; web edition and PowerShell edition.
- **iFiNeX** (formerly Squad Split): mobile and web app: expense tracker, card payment tracker, squad splitter; public app. Database work for it follows master-prompt rule 4 (Supabase SQL, schema-only and seed versions, RLS), not started.
- Download links: owner will supply later and upload files to the repo. Put files in `public/downloads/` and set `download: '/downloads/file.zip'` in `products`, or use an `https://github.com/InfoXteK/...` release URL. Browser uploads are limited to 25 MB per file: use GitHub Releases for larger files.

## 8. Brand and logo
Mark: owner's file 99x128 RGBA (src/assets/logo.png), header height 44px. Header wordmark is live text Info[X]te[K], blue #2b86d1 on X and K. Generated lockups in outputs/brand (transparent and white, 2731x1000) plus mark upscaled to 792x1024: upscaled from a tiny source, so soft. Needed: original vector or 2000px+ mark. The supplied wordmark image (reads iFiNeX) is unused; supply a corrected one to replace live text.

## 9. Deployment and DNS
Workflow deploy.yml (checkout v4, setup-node v4 Node 22, build, check, configure-pages v5, upload-pages-artifact v3, deploy-pages v4; least-privilege). Pages source = GitHub Actions; custom domain infoXtek.com saved. DNS (Namecheap BasicDNS): A @ 185.199.108.153, .109.153, .110.153, .111.153; CNAME www to infoxtek.github.io; no wildcard. Pending: confirm DNS check green, tick Enforce HTTPS, pin Actions to commit SHAs, add real phone/address, form endpoint.

## 10. Security status
Grep-level review only: no innerHTML/eval/document.write, no inline handlers, no external hosts, no secret strings; check.mjs passes (links, SEO tags, one h1, no external refs; allows github.com/InfoXteK links). Not done: Lighthouse, accessibility tooling, contrast measurement, cross-browser test, formal threat model/SAST document, npm audit (no dependencies).

## 11. Next session
Read CLAUDE.md and this file; ask owner for logo original, phone/address, form provider, product download files and descriptions; verify HTTPS; consider product detail pages, iFiNeX SQL schema, SEO sitemap submission.
