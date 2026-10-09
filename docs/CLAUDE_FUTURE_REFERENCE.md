# InfoXteK: Complete Claude Reference (v2.0.0, port 3010)
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
10. v2.0.0 owner supplied the Net-Monit V11.0 and PC Admin Tools READMEs and GitHub links (https://github.com/InfoXteK/Net-monit-V11.0, https://github.com/InfoXteK/PC_Admin_Tools): product detail pages with unique scenes (Net-Monit escalation L1/L2/L3, PC Admin remote fan-out over WinRM) and styles (cyber, brutal); /platforms/ with 4 platform pages (Entra ID sequence, Veeam restore points, Forcepoint DLP policy gate, SentinelOne process tree) each with its own animation and style; home chips are now draggable (mouse, touch, arrow keys) and clickable platform chips; contact page has a Net-Monit license request form (Device ID + Activation Code).
11. v1.9.0 owner said backgrounds/UI/animations still felt the same and wanted each page themed to its topic (AI = AI lab, cyber = cyber lab, DR = data centre): added 16th service AI Solutions; src/config/envs.mjs themed backdrops (one per service and most pages) drawn behind each page header and inside the scenario panel; per-service accent colours (`accents` in build.mjs, body[data-svc]); AI Solutions scene (prompt, policy/DLP guardrail, model, RAG from company docs).
11. v1.8.0 owner said all animations looked the same: replaced generic engine with a scene kit (src/config/kit.mjs: zones, boxes, cylinders, lamps, ECG heartbeat, packets, rings, bars, moves, all on one 12s loop) and 12 bespoke scenarios in scenes.mjs `custom`. Still generic (to redo): support-consulting, mobile-applications, full-stack-apps. Added per-style header/nav/band chrome in CSS so every style looks distinct.
12. v1.7.0 Products page (Net-Monit, PC Admin Tools, iFiNeX) with download placeholders; this reference.

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

## 12. Scene system (v1.8.0)
- Service page = band + "See it in action" scene + How we deliver + What we do + Technology. Scene SVG is built in build.mjs (customScene for `custom[slug]`, else sceneSvg from `scenes[slug]`).
- Each custom scene is `{l:[4 log lines], d:(K)=>svg string}`; time ranges are fractions of a shared 12s loop; log ticker runs 4 x 3s in the same loop. SMIL only (no JS); reduced-motion pauses via site.js.
- Disaster Recovery: Primary DC (Node A active, Node B HA, SAN) and DR site (DR node, replica); ECG heartbeat across sites 0-31%, heartbeat lost 33-50% (primary lamp red), HA/GSLB director promotes DR 50-84% and redirects users, failback 85-100%. Cyber: attacker vs 4 layers (email, firewall, EDR/XDR, DLP) with SIEM alerts. Network: 802.1X + ClearPass, rogue device to quarantine VLAN, VPN tunnel. Cloud Solutions: wave migration + cost bar. Cloud Desktop: Entra ID/Intune/conditional access vs unmanaged phone. Managed IT: lamps, alert, ticket, patch bar. SEO: rank climb. Marketing: funnel. E-commerce: WAF, tokenised payment, delivery truck. Hosting: edge/CDN, backup, failover to standby. Web apps: WAF, LB, cache, DB, 429. Web design: stage lamps and responsive resize.
- Verified: XML well-formed and keyTimes valid for all service SVGs. NOT verified: visual layout/overlaps and animation timing in a real browser (no renderer available); expect small text/position fixes after the owner's first look.

## 13. Themed backdrops (v1.9.0)
- Map (envs.mjs): disaster-recovery server racks with blinking LEDs + ECG heartbeat (data centre); cyber-security falling hex matrix + radar sweep (cyber lab/SOC); network-solutions switch topology with flowing links; cloud-solutions drifting clouds; cloud-desktop and managed-it monitor walls (managed-it adds heartbeat line); ai-solutions neural network (nn in kit.mjs); web-applications code typing; mobile-applications phones with notification; web-design and support-consulting wireframe + palette; seo rising bars + magnifier; digital-marketing broadcast waves; full-stack-apps layered stack; ecommerce shelves + moving cart; hosting-maintenance globe with edge nodes. Pages: why-choose-us bars, industries globe, products stack, tools-tips code, contact clouds, book-online racks, services topology. Home keeps its own hero.
- Still using the generic packet scene (themed backdrop only): support-consulting, mobile-applications, full-stack-apps. XML validity of all SVGs verified; visuals and motion not verified in a browser.

## 14. v2.0.0 details
- Net-Monit license form: fields name, email, company (optional), Device ID, Activation Code. No backend: if `contact.formEndpoint` is set it POSTs there, otherwise opens a prefilled mailto to contact.email (user must press Send). A real endpoint is needed for automatic "once they submit" handling. "Sub" in the owner's message was read as subscription/subject: only a fixed subject "Net-Monit License Request" is used; confirm.
- Deliberately NOT published: Net-Monit default login from its README, the owner's personal email abuabdullah.be@outlook.com (company email used instead), license key generator details.
- Products: Net-Monit V11.0 (Flask+SQLite, port 50110, Ed25519 offline keys, free key, 30-day trial); PC Admin Tools editions Python GUI v2.1, Web-Service v2.1 (port 3030), PowerShell GUI v2.7; iFiNeX unchanged (no details yet).
- Platform pages built: entra-id, veeam, forcepoint-dlp, sentinelone. Still plain chips (no page): Azure, AWS, Alibaba Cloud, Microsoft 365, Intune, VMware, Hyper-V, Acronis, Quorum, HPE 3PAR, NetApp, Taegis, Sophos, Kaspersky, CrowdStrike, Defender, Check Point, Proofpoint, FortiGate, Forcepoint NGFW, ClearPass, BeyondTrust, React, Next.js, Node.js, Flutter, Shopify, WordPress. Platform descriptions written by Claude from general knowledge: verify against vendor docs.
- Styles: net-monit Holographic/Cyberpunk, pc-admin-tools Neo-brutalism, platforms index Flat, entra-id Fluent, veeam Skeuomorphism, forcepoint-dlp Glass, sentinelone OLED.
- Verified: build, check.mjs, SVG XML and keyTimes. Not verified: any visual/motion in a browser, drag behaviour on touch devices.
