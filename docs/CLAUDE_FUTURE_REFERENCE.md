# InfoXteK: Complete Claude Reference (v3.2.0, port 3023)
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
10. v2.5.1 owner asked for 3D, interactive, gaming-style effects on ALL pages and clickable areas, and sent the iFiNeX mobile repo (https://github.com/InfoXteK/iFiNeX-Mobile/releases, download via the Releases option on the right of the repo page). Added a site-wide game layer (site.js between /*FX*/ and /*FXEND*/): click/tap spark bursts + shock ring, cursor glow trail, 3D tilt with moving drop-shadow and press-in depth on every button, card, nav link, chip, tab and step button, rubber-band drag (cards can be picked up and snap back with a spring), page-leave/enter 3D transitions, chip fling physics on the Home hero (throw a skill chip, it bounces off the edges), form field focus lift, an XP/level HUD with toast achievements (progress stored only in the visitor's browser localStorage, never sent anywhere) and an FX on/off button. iFiNeX card now shows a Download from GitHub Releases button with instructions.
11. v2.4.0 owner feedback on v2.3.0: a stray `)}` printed under the ring on Home, Industries and Platforms (my build edit left part of a template expression; fixed) and the CSS 3D ring still did not feel like a proper 3D/gaming experience. The ring is now only a fallback: every `.ring3d` becomes a canvas 3D 'service galaxy' (hand-written perspective projection, no library): glowing orbs on a sphere around a core hub, data pulses along links, star field, drag to orbit with inertia, auto-orbit, hover highlight, click to select and fly the camera to the node, click again or Enter to open, arrow keys, tabs morph nodes between groups, HUD corner brackets and readout, detail panel + Open button below. Same data as the ring, so it appears on Home, Services, Industries, Why Choose Us, Tools & Tips, Products and Platforms.
- v3.1.0 (latest): see section 25. Per-flow choreography, easier navigation, Net-Monit V11.3.
- v3.0.0: see section 24. WebGL2 3D engine, logical 3D flow for every service/product/platform/reason/industry/tip.
11. v2.3.0 owner feedback on v2.2.0 (screenshots): connector lines ran straight through boxes and struck out text, and the home 3D stack hid labels and made services impossible to choose. Fixes: all connector lines are now drawn behind boxes in every custom scene (`layered`), cyber scene redesigned so each attack arrives by its own vector over the top and is stopped by its own layer (no line crosses other layers); home 3D stack removed and replaced by a 3D selector ring (`ring3d`): tabs (IT & Security / Digital & Software), drag, arrows, left/right keys, click a card to bring it front, click the front card to open, detail panel shows title/summary/Open button. Same ring on /services/, /industries/, /why-choose-us/, /tools-tips/ (4 tip groups), /products/ (Products + Platforms), /platforms/. Without JS the rings fall back to plain card grids. Scene hotkeys: 1-4 steps, P play/pause.
11. v2.2.0 owner asked for a 3D-based, interactive site with logical graphical explanations (3D and XD): home hero is now a draggable 3D layer stack (CSS 3D: Backup & DR, Network, Cloud, Cyber Security, AI, Apps & Web; hover explodes the stack, click opens the service); every scenario panel has real depth (backdrop layer behind, scene in front, tilts toward the pointer) and a Play/Pause + Step 1-4 control that freezes the SVG animation at that step (setCurrentTime) with the step text; cards tilt in 3D on hover; page header art has pointer parallax. All plain CSS 3D + SVG + JS (no WebGL/three.js).
11. v2.1.0 owner shared 4 stock images (AI chip on circuit board, cyber padlock HUD over a night city, Disaster Recovery dotted world map + cloud sync, gears with icons) as IDEAS ONLY (not used or copied): new original backdrops circuit (AI), HUD padlocks + hex matrix (Cyber), dotted world map with links + cloud sync (DR), rotating gears + heartbeat (Managed IT); service headers now tinted with each service accent and taller. License form now requires corporate email (free webmail domains rejected client-side), company, Net-Monit version, OS, Device ID, Activation Code; mailto copies (CC) abuabdullah.be@outlook.com and jamilsyed77@gmail.com (config contact.licenseCc, base64 in HTML to deter scrapers). Brand name in page text now renders Info[X]te[K] with blue X and K everywhere (build-time `brandize`).
11. v2.0.0 owner supplied the Net-Monit V11.0 and PC Admin Tools READMEs and GitHub links (https://github.com/InfoXteK/Net-monit-V11.0, https://github.com/InfoXteK/PC_Admin_Tools): product detail pages with unique scenes (Net-Monit escalation L1/L2/L3, PC Admin remote fan-out over WinRM) and styles (cyber, brutal); /platforms/ with 4 platform pages (Entra ID sequence, Veeam restore points, Forcepoint DLP policy gate, SentinelOne process tree) each with its own animation and style; home chips are now draggable (mouse, touch, arrow keys) and clickable platform chips; contact page has a Net-Monit license request form (Device ID + Activation Code).
11. v1.9.0 owner said backgrounds/UI/animations still felt the same and wanted each page themed to its topic (AI = AI lab, cyber = cyber lab, DR = data centre): added 16th service AI Solutions; src/config/envs.mjs themed backdrops (one per service and most pages) drawn behind each page header and inside the scenario panel; per-service accent colours (`accents` in build.mjs, body[data-svc]); AI Solutions scene (prompt, policy/DLP guardrail, model, RAG from company docs).
11. v1.8.0 owner said all animations looked the same: replaced generic engine with a scene kit (src/config/kit.mjs: zones, boxes, cylinders, lamps, ECG heartbeat, packets, rings, bars, moves, all on one 12s loop) and 12 bespoke scenarios in scenes.mjs `custom`. Still generic (to redo): support-consulting, mobile-applications, full-stack-apps. Added per-style header/nav/band chrome in CSS so every style looks distinct.
12. v1.7.0 Products page (Net-Monit, PC Admin Tools, iFiNeX) with download placeholders; this reference.

## 3. Rules and decisions
- Light, premium theme by default. Dark only on Cyber Security (holographic/cyberpunk) and Full Stack (OLED), explicitly requested.
- No analytics/telemetry/tracking; CSP allows only self (+ form endpoint origin if set); no remote fonts/scripts; all config text HTML-escaped.
- Unknown company data stays null; never invent contact data. Vendors are text only, no logos or partnership claims (trademark footnote). AWS, Alibaba, CrowdStrike, Proofpoint, FortiDLP kept at owner request though not in resume: verify.
- Contact form is not connected (no backend); set `contact.formEndpoint` to an approved https provider.
- Never claim tests/audits/deploys/DNS happened unless run. Browser rendering was checked by looking at screenshots from headless Chromium with software WebGL (v3.0.0 session); it has never been verified on a real GPU, a real phone, Safari or Firefox.
- Every code change bumps version and port and updates this file and CLAUDE.md.

## 4. Structure
package.json | scripts/build.mjs (templates, styleMap, scenes renderer, 3D flow blocks, engine script loader), serve.mjs, check.mjs (links, SEO, security, 3D data/privacy/size checks) | src/config/site.mjs (all content: site, contact, nav, platforms, services, reasons, industries, bookings, resources, testimonials, tips, products) | src/config/scenes.mjs, kit.mjs, envs.mjs, svcdetails.mjs, details.mjs | src/config/flows3d.mjs (3D flow definitions, autoFlow, validateFlow) | src/assets/{site.css,site.js,logo.png,gl-core.js,gl-galaxy.js,gl-flow.js} | tools/{make-icons.py,browser-tests/} | public/{CNAME,favicon.png,favicon-32.png,downloads/} | .github/workflows/deploy.yml | docs/ (this file, SETUP_GUIDE_NAMECHEAP.md).

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
(See also section 24.) Read CLAUDE.md, docs/3D_ENGINE.md and this file; ask owner for logo original, phone/address, form provider, product download files and descriptions; verify HTTPS; consider product detail pages, iFiNeX SQL schema, SEO sitemap submission.

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

## 15. v2.1.0 notes
- Corporate-email rule is client-side only: it can be bypassed, so check the sender's domain when issuing keys. CC addresses are visible to the requester in their email draft (inherent to mailto). A form provider with server-side CC would be the proper fix.
- The owner's personal-looking addresses are used only as CC per the owner's instruction; they are not displayed as text on the site.
- Backdrop ids (#dots, #land) are duplicated when the DR env appears in header and scene: identical content, harmless.
- Verified: build, check.mjs, SVG XML. Not verified: visuals/motion in a browser, mailto behaviour with CC in the owner's mail client, free-domain list coverage.

## 16. v2.2.0 notes
- Why no three.js/WebGL: CSP allows only same-origin scripts and the build environment had no network to fetch a library; CSS 3D covers the layer stack, depth and tilt. A real WebGL scene would need a self-hosted three.js file in src/assets (about 600 KB) and a CSP review.
- Step buttons map to fractions of the 12s loop in `data-t` (scene spec field `t`; DR and Cyber have custom values, others default 0.12/0.37/0.62/0.87). Step timing for other scenes is approximate.
- Reduced-motion visitors get paused scenes, no tilt, no spin. Touch devices: drag rotates the home stack; tilt effects are pointer-only.
- Verified: build, check.mjs, SVG XML, whole-page div balance. NOT verified: 3D rendering, drag/step behaviour, performance on low-end phones (many animated SVGs per page).

## 17. v2.3.0 notes
- Ring geometry: radius = (card width / 2) / tan(pi / n) + 36, so cards never overlap whatever the count; side cards fade, back cards hidden (backface-visibility).
- Drag threshold 6px separates a drag from a click; arrow keys work when focus is inside the ring.
- Not yet 3D: Book Online and Contact (forms kept simple), product/platform detail pages beyond scene tilt, card grids on the products page (still flat below the ring). "Gaming-like" scope so far: draggable ring, hotkeys, step scrubbing, tilt, parallax; no scoring/sound/WebGL.
- Verified: build, check.mjs, SVG XML, div balance, JS syntax, lines-before-boxes ordering. NOT verified: any rendering or interaction in a browser (owner's screenshots of v2.2.0 are the only visual feedback so far).

## 18. v2.4.0 notes
- Galaxy code lives in site.js between /*G3*/ and /*G3END*/; wrapped in try/catch so any failure restores the CSS ring (and, without JS, the plain card grid). Canvas 2D, ~150 stars + nodes: light enough for phones; pauses when scrolled off-screen (IntersectionObserver); reduced-motion stops auto-orbit.
- The galaxy stage is a dark navy 'holographic' panel inside the light page (owner asked for a gaming feel); the rest of the page keeps its own style.
- Verified: build, check.mjs, JS syntax, a Node smoke test with a stubbed DOM (240 frames, drag, click, arrow key; no exceptions) and no stray text left in dist. NOT verified: real rendering, frame rate, touch behaviour, label overlap with many nodes (16-node groups on a small phone may crowd).

## 19. v2.5.1 notes
- FX is optional and safe to disable: respects prefers-reduced-motion, FX toggle (localStorage key `fx`), wrapped in try/catch. HUD hidden on phones. XP keys: `xp`, `vis` (visited paths). No analytics or network calls.
- Click handler intercepts same-origin link clicks to play a 0.23s exit transition; external links, mailto, hash-only and modified clicks are left alone. After a drag (>6px) the following click is suppressed.
- Remediation done: removed the only innerHTML (HUD now built with createElement); audit grep on site.js shows none of innerHTML/eval/new Function/document.write.
- Only external text found in dist: http://localhost in Net-Monit quick-start text (not a resource). Product links to github.com/InfoXteK are the only outbound links.
- Verified: build, check.mjs, JS syntax, Node smoke tests with stubbed DOM for the galaxy and FX blocks (no exceptions). NOT verified: real rendering, feel/performance of the effects, mobile behaviour, whether tilt on large `.card`s feels right.

## 20. v2.6.0 notes (security hardening, port 3017)
- Trigger: owner re-sent master prompt V2 + memory + reference with the full command list (/security-review, /exfil-check, /Repo-audit, /Supply-chain, /Deobfuscate, /Vul-scan, /Threat-model, /Remediate, /Compliance) and the v2.5.1 ZIP. Commands were executed as an audit of the ZIP; no feature changes.
- Verified in sandbox: build (31 pages + 404), `npm run check` 0 problems, dev server on 3017 returns 200, path traversal returns 404, negative test (injected onclick) correctly fails check.
- Code changes: galaxy `open()` validates same-site path; serve.mjs path-prefix fix; workflow timeout-minutes; check.mjs security assertions (list in docs/SECURITY_REVIEW.md).
- New docs: docs/SECURITY_REVIEW.md, docs/THREAT_MODEL.md.
- Master prompt V2 asks for a WebGL 3D hub; the site already has a canvas 3D galaxy (v2.4.0) + CSS 3D and no Three.js. Not changed here; adding a WebGL library would add a dependency and needs an explicit decision.
- NOT done: npm audit (no dependencies), live site/DNS/HTTPS verification, Lighthouse, axe, real-browser visual tests, SHA-pinning of Actions.
- Next session: read CLAUDE.md and this file, then continue from open items.

## 21. v2.7.0 notes (detail panels + realistic 3D, port 3018)
- Owner feedback: on Why Choose Us, Industries and Tools & Tips the galaxy "Open" button did nothing (nodes had no page to open) and the 3D looked too simple; wants selecting an item to show everything about it, with more realistic 3D/XD.
- Content: `src/config/details.mjs` (reasonDetails, industryDetails, tipDetails). Shape `{intro, points:[[title,text]], example, links:[[label,href]]}`. Examples are labelled "Illustrative"; no invented clients, figures or guarantees. Every reason (5), industry (5) and tip (16) has an entry.
- Build: `dtls()` in scripts/build.mjs renders one `<article class="dtl" id="d-<ring>-<group>-<index>">` per item inside the `.ring3d` container. Nodes get `data-det`; href is the `#d-...` anchor, so without JS all panels are visible and anchors work.
- Runtime (site.js /*G3*/ block): with the galaxy active all panels start hidden. Click a selected node, press Enter, or press the "Show full details" button to open its panel (3D flip-in animation, staggered cards). Panel buttons: Previous, Next (wrap within the group, sync the map selection), Back to 3D map. Deep links `#d-ind-0-2` open the panel on load; hashchange supported. Opening updates the URL hash with replaceState.
- Renderer: sphere shading with specular highlight, perspective floor grid, 2 orbit rings, per-node ground shadows and selection beam, core glow with travelling pulses, nebula and star parallax with twinkle, node bobbing, selection punch zoom, hover parallax. DPR capped at 2, paused off-screen (IntersectionObserver), bob and rotation disabled for reduced motion.
- Bug found by browser test and fixed: `style="--n:.."` attributes were blocked by CSP (style-src 'self'). Replaced with nth-child CSS; check.mjs now fails on any inline `style=` attribute.
- Tested (headless Chromium via Playwright in the sandbox): why-choose-us, industries, tools-tips: button shows "Show full details", click opens exactly one panel, Next moves to the next item, Back hides panels; Enter on canvas opens panel; hash deep link opens correct panel; 0 console errors; no horizontal overflow at 390px width before/after opening; `npm run check` 0 problems.
- NOT tested: real touch devices, Safari/Firefox, screen readers, Lighthouse, performance on low-end phones, live deployment.
- Not changed: services, platforms and products ring items still open their own pages (they have real URLs). Say if you want the same detail panel there too.

## 22. v2.8.0 notes (Net-Monit versions, port 3019)
- Owner request: several Net-Monit versions/repos exist; wants a version control in the Products area, a version drop-down in the Contact license request, and a guide for adding future versions.
- Data: `netMonitVersions` (newest first; id, label, status latest|previous, repo, note) and `netMonitOlderOption` in src/config/site.mjs. Known: V11.2 -> https://github.com/InfoXteK/Net-Monit-V11_2 (description supplied by owner); V11.0 -> https://github.com/InfoXteK/Net-monit-V11.0. Assumption: V11.2 is the latest because of its higher number; flip `status` if wrong. Owner mentioned "multiple versions" but supplied only these two links; add others per docs/UPDATING_PRODUCT_VERSIONS.md.
- Product title is now plain "Net-Monit" (was "Net-Monit V11.0"); the products entry `download` follows the latest repo automatically.
- Build helpers in scripts/build.mjs: `vOpt`, `verPanels` (selector + per-version panels, all visible without JS), `verTable` (/products/ table). License select options come from the same list; option `data-v` = id.
- JS (/*VER*/ block in site.js): selector shows one panel; `/contact/?v=<id>` preselects the matching option, unknown values ignored (matched against existing options only).
- The license key's validity across versions is NOT stated anywhere on the site because it is unknown; the requester's chosen version goes in the email body.
- Tested (headless Chromium, sandbox): default panel V11.2, switching to V11.0 changes link, license link preselects V11.0, bad `?v=` ignored, versions table 2 rows, 0 console errors. Also simulated adding V11.3 in config: selector, drop-down and product page all updated; reverted. check.mjs 0 problems.
- NOT tested: real mailto delivery, mobile layout of the table, other browsers.

## 23. v2.9.0 notes (one-click stacks, 3D flow, favicon, port 3020)
- Owner feedback: choosing a service (e.g. Disaster Recovery) in the 3D map was hard and needed two clicks; wants one click to show everything below the map with graphics and a live animation; wants more realistic 3D/XD; Google shows no logo; asks for logical professional 3D flow explanations everywhere; no vulnerabilities / IDOR.
- One-click: any ring item with `panel` (services, products, platforms) or `det` (reasons, industries, tips) opens its panel on a single click of the sphere, a chip button under the map, Enter, or the sel-card button. Items without a panel keep select-then-open. Panel scrolls into view only if off-screen. Prev/Next/Back buttons and `#d-...` deep links work for all.
- Hit testing: radius >= 34 px, label area clickable, front nodes preferred; auto-rotation pauses while the pointer is over the map. Chips guarantee selection by keyboard/touch.
- Panels: `svcPanel`, `prodPanel`, `platPanel` in scripts/build.mjs; copy in src/config/svcdetails.mjs (`svcExtra`: why/without/special per service; `prodExtra` for products). Scenes (animated SVG, step buttons) are reused inline on /services/ and /products/ and /platforms/; the home page uses text-only panels (no scenes) to stay light. /services/ is about 180 KB of HTML (static, compressible).
- 3D flow: `.flow` (steps) and `.dtl-grid` (needs/risks/help, do/then/check) render as numbered, perspective-tilted cards joined by arrows with a travelling signal animation; reduced-motion disables it.
- Renderer: glass spheres with rim light and caustic, depth-of-field blur on far nodes (where ctx.filter exists and width > 520), light shafts, dust motes, gyro rings at the core, floor light pools and ripple, selected-node satellites, pointer parallax.
- Bugs found and fixed: duplicate SVG ids (`dots`, `land`) via scopeIds(); panel scenes stayed transparent because of the reveal-on-scroll class (CSS override); inline `style` previously fixed in v2.7.0.
- Favicon/logo: tools/make-icons.py generates public/favicon.ico, favicon-48/96/144/192/512.png, apple-touch-icon.png, logo-512.png (logo on white rounded tile); head links, site.webmanifest, og:image and Organization.logo added. What Google shows cannot be verified from here; steps in docs/GOOGLE_LOGO_FAVICON.md.
- Tested (headless Chromium, sandbox): /services/ chip click opens Disaster Recovery in one click with scene (clock advancing), 8 sections, 4-step flow; canvas single click opens a panel; /products/, /platforms/ and home open panels (home without scene); mobile 390px no overflow; earlier regression tests (why/industries/tools panels, version selector, license preselect) pass; 0 console errors; check.mjs 0 problems.
- NOT tested: touch devices, Safari/Firefox, screen readers, Lighthouse/performance on low-end phones, live site, Google's actual display of the logo.

## 24. v3.0.0 notes (WebGL2 3D engine + logical 3D flows, port 3021)

### 24.1 Owner request, diagnosis, decision
- Owner re-sent every file (v2.9.0 ZIP, master prompt, memory and reference files) plus the whole slash-command list, repeated several times, and said "continue and complete my request": wants a **logical, professional 3D flow explanation for everything**, **higher-performance and more realistic 3D/XD graphics**, an **interactive, live, gaming-like feel**. This is the same ask as the v2.9.0 feedback, so v2.9.0 evidently did not satisfy it.
- Direct diagnosis: v2.9.0 drew the map with Canvas 2D (CPU, no real lighting, depth, reflection or bloom) and its "3D flow" was CSS-tilted cards. Realism and speed both need the GPU, so more Canvas 2D polish could not fix it.
- Decision: a hand-written **WebGL2 engine, no library** (Three.js not added: keeps zero dependencies, the strict `script-src 'self'` CSP and a small payload; no supply-chain surface). The v2.9.0 Canvas 2D map and the CSS step cards stay as automatic fallbacks.
- The slash commands (`/godmode`, `/ghost`, `L99`, `/Model ...` and so on) are not features of this environment. They were treated as the workflow in the master prompt: inspect, plan, build, audit, remediate, test, document. Nothing was bypassed.
- Version/port: **v3.0.0, port 3021** (next after 3020). v3.0.0 rather than v2.10.0 because the renderer is replaced and 2.10 reads as lower than 2.9 to non-developers. Port 3021 was bound successfully in the build sandbox only; it is not on the browser blocked-port list as far as known (list recalled, not re-checked). Check on the owner's PC (Windows: `netstat -ano | findstr :3021`; `serve.mjs` also auto-increments).

### 24.2 Features
1. **GPU service map** (`.ring3d`): lit glass-metal orbs (Fresnel rim, environment reflection, specular, latitude scan lines, per-node hue variation), glowing core with gyro rings, reflective floor with grid, shadows and light pools, orbit rings, links with moving pulses, GPU stars, dust and selection bursts, light shafts, nebula, MSAA, 2-level bloom, vignette, dither. Selected node scales with a spring, gets 3 satellites, a beam to the floor and a floor ripple. Labels and HUD are a 2D overlay; label collision avoidance; hit-testing shared with the 2D fallback. Touch: tap selects, vibrates 8 ms where supported.
2. **3D flow stage** (`.flow3d`): typed 3D nodes (24 kinds) on pedestals, dashed zones, links with direction chevrons and travelling packets, mirror reflection, bloom. Camera glides to the active nodes of each step and dims the rest; step badge on the focus node. Controls: All, 1..n, previous, next, play/pause (attract mode starts automatically unless reduced motion; any user input stops it), reset view; drag to orbit (yaw +-1.25 rad, pitch 0.35 to 1.2), click a node to jump to its step; Left/Right/Space/Enter/Home on the focused stage. Narrow (portrait) stages read the flow top to bottom, labels wrap to two lines and try right, left, below, above before being skipped.
3. **Flows for everything**: 23 hand-written flows (16 services, 3 products, 4 platforms) in `src/config/flows3d.mjs`, plus generated flows for all 5 reasons, 5 industries and 16 tips from their existing points (`autoFlow`). Panels (on /services/, /products/, /platforms/, home, reasons, industries, tips) and dedicated pages (services, products, platforms) all show one.
4. **Performance and resilience**: quality tiers, governor, off-screen/hidden pause, reduced-motion on-demand rendering, context-loss recovery, shared flow context, preallocated buffers (see 24.6).
5. **Build safety**: flows validated at build and again from the final HTML; engine privacy/size/order checks in `npm run check`.

### 24.3 Files, functions, API
| File | Contents |
|---|---|
| `src/assets/gl-core.js` | `IXGL.supported()`, `IXGL.forcedQ` (`?q=`), `IXGL.GL(canvas)` (program, use, set, seti, buf, sub, vao, tex, reset, dispose), `IXGL.geo` (sphere, box, frustum, torus), `IXGL.Post` (size, bind, finish: MSAA resolve, bright pass, blur, composite), `IXGL.Gov` (quality governor), `IXGL.shaders` (sprite and ribbon sources), quad and strip buffers |
| `src/assets/gl-galaxy.js` | `IXGL.galaxy(canvas, {onFail})` returns `{resize(w,h), cam(yaw,pitch,punch), project([x,y,z]), draw(frame), burst([x,y,z]), info(), dispose(), q, fps}` |
| `src/assets/gl-flow.js` | `IXGL.flowHost()` returns `{attach(el, data), root, info(), canvas, wake()}`; `attach` returns the controller `{goto(i,byUser), next(), prev(), play(bool), resetView(), setVisible(b), focusNode(i), destroy(), onStep(step,playing), step, playing, portrait}`; internals: `REC` (24 node recipes), `build`, `fitPts` (exact camera fit), `overlay` (labels), `draw`, input handlers |
| `src/assets/site.js` | `/*G3*/` galaxy glue: creates `.g3gl` WebGL canvas under the 2D interaction canvas, `failGL()`, `glFrame()`, `hud()`, `kick()/wake()` loop control; the 2D renderer is the fallback. `/*F3*/` controller: builds each `.flow3d` skeleton at load, mounts lazily through IntersectionObserver (rootMargin 320 px), syncs buttons/caption/list, `fail()` removes the stage and leaves the step cards |
| `src/config/flows3d.mjs` | `flows` (23), `autoFlow(set, title, points, example)`, `validateFlow(f, name)`, `KINDS`, `TONES` |
| `scripts/build.mjs` | `flowBlock`, `flowSec` (panels), `flowPage` (dedicated pages), `autoSec` (reasons/industries/tips), `glScripts` (script loader), flow validation loop |
| `scripts/check.mjs` | adds the 3D assertions (flow data, script order and need, privacy regex, size budget) |
| `docs/3D_ENGINE.md` | architecture, performance, fallbacks, how to edit a flow, testing |
| `tools/browser-tests/` | Playwright scripts used in this session (+ README) |

### 24.4 App flow
- **Build**: `build.mjs` validates all flows, renders `<div class="flow3d" data-f="{escaped JSON}" data-ttl="...">` (with `<ol class="flow f3list">` as the text alternative for hand-written flows), picks scripts per page (`gl-core`, then `gl-galaxy` and/or `gl-flow`, then `site.js`).
- **Load**: deferred scripts run in order. Map: `IXGL.supported()` then `IXGL.galaxy()`; any error or no WebGL2 sets `data-gl="2d"` and the 2D renderer runs. Flows: skeletons are built immediately (layout final), the GL stage mounts only when the element is within 320 px of the viewport, the shared host re-parents its canvases into the active stage, leaving the viewport detaches it.
- **Map frame** (`site.js loop` then `glFrame`): update camera and morph, compute world positions (morph + bob), `GLR.cam`, `GLR.project` for hit-testing, `GLR.draw`, `hud()`. The loop stops when off-screen, hidden or (reduced motion) idle.
- **Flow frame** (`gl-flow.js frame`): advance autoplay, ease camera/dim/focus/link activity, fill instance buffers, draw, overlay labels.
- **Fallbacks**: no WebGL2 or init error: 2D map and CSS step cards. Context lost: wait up to 2.5 s for restore, else 2D. Flow mount error: stage removed, step cards stay.

### 24.5 Payloads and data
- **Flow JSON** (`data-f`): `{t, z?:[[label,c0,r0,c1,r1,tone?]], n:[[id,kind,label,col,row,tone?]], l?:[[from,to,tone?]], s:[[title,caption,[nodeIds],['from>to',...]]]}`. Limits (`validateFlow`): title 80 chars; 2 to 12 nodes; id `[a-z0-9]{1,4}`; label 40; col 0 to 6, row 0 to 3, unique cells; 20 links; 1 to 6 steps (title 40, caption 240); 3 zones; known kinds and tones only.
- **Kinds**: user device phone server db cloud shield lock key gear globe doc mail bell chart code router firewall ai package goal threat clock admin. **Tones**: info (cyan), good (green), warn (amber), bad (red), ai (violet), mute (steel).
- **Galaxy `draw(frame)`**: `{T seconds, dt seconds, nodes [[x,y,z]...] (map coordinates, y down), sel, hover (-1 none), col [r,g,b 0-255], tr (morph 0-1), yaw, pitch, px, py}`. `cam()` flips the pitch sign so the camera sits above the floor; `project()` mirrors the shader maths.
- **Instance layouts (floats)**: sphere 12 `[cx,cy,cz,r | r,g,b,sel | hover,phase,core,alpha]`; decal 12 `[x,z,hx,hz | rgba | kind,phase,0,0]`; ribbon 16 `[A.xyz,width | B.xyz,startLen | rgba | kind,segLen,0,0]`; sprite 12 `[pos.xyz,size | rgba | kind,phase,p1,p2]`; solid 16 `[pos.xyz,ry | scale.xyz,rx | rgb,emissive | dim,focus,hover,0]`. Sprite kinds 0 glow, 1 star, 2 ring, 3 hot dot, 5 dust, 6 burst, 7 pulse. Ribbon kinds 0 plain, 1 pulses, 2 chevrons, 3 shimmer.
- **Debug attributes**: `.ring3d[data-gl="webgl2"|"2d", data-fps, data-q, data-frames (every 10 frames), data-dc, data-err]`; `.flow3d[data-gl="webgl2"|"off", data-frames, data-fps, data-q, data-err (every second)]`. URL `?q=0|1|2` pins the quality tier (testing only).

### 24.6 Performance design and measurements
- Tiers: 0 (DPR <= 1.25, no MSAA/bloom/reflection, 700 stars), 1 (DPR <= 1.5, MSAA 4x, 1-level bloom, reflection, 1200 stars, 120 dust), 2 (DPR <= 2, MSAA 4x, 2-level bloom, 1800 stars, 220 dust, nebula noise). Start: 2 on desktop, 1 for coarse pointer, deviceMemory <= 4 or <= 4 cores. Governor steps down only (after 30 warm-up frames, average frame > 27 ms for 40 frames).
- Draw calls per frame (counted in the page): map 9 (tier 0), 14 (tier 1), 17 (tier 2); flow stage about 13.
- **Measured here (headless Chromium 141, SwiftShader software WebGL2, 1100x900, CDP metrics over 8 s)**: main-thread JavaScript per frame about 1.6 ms (tier 0), 1.3 ms (tier 1), 1.5 ms (tier 2; the map's frame counter ticks every 10 frames so these are upper bounds) and 1.0 ms for the flow stage; JS heap flat at about 3 MB (no growth); map idle frames with reduced motion: 0 in 2.5 s. **GPU time and real frame rates were not measured**: software rendering ran at only a few fps in the sandbox, which says nothing about real GPUs.
- Payload: engine 75 KB raw, about 25 KB gzipped, loaded only on pages with 3D content; `site.js` grew to 54 KB. /services/ HTML grew from about 180 KB to about 215 KB (flow JSON; compresses well).

### 24.7 Design and UI
- Visual language: dark navy "3D lab" panels (same family as the v2.9.0 holographic map) inside the light pages; semantic tone colours; pedestal rings and pills; dashed zone borders; chevrons show direction; packets show activity; reflection and bloom for depth. Page theme colours apply to the buttons and caption only.
- Components: `.f3stage` (focusable group, aria-label), `.f3bar` (buttons), `.f3chips`, `.f3cap` (aria-live), `.f3list` (step cards, highlighted `.on`, clickable). Mobile: taller stage (clamp 340 to 470 px), chips on their own first row, 44 px targets.
- Accessibility: keyboard (arrows, Space/Enter, Home), names on all buttons, text alternative always present, reduced motion honoured. Not verified with a screen reader.

### 24.8 Defects found and fixed during this build (by looking at renders)
1. First map render was blown out (white core, every orb clipped to flat cyan): rebalanced lighting, added a tone curve, switched bloom to a luma threshold, calmed halos and core.
2. Floor reflection invisible: floor made more transparent, mirror stronger. Floor ripple was cropped: scene raised 14 px.
3. Stripe pattern on orbs too heavy: softened. Core looked grey without bloom: brightened.
4. Flow too small and links only 0.9 units long (no room for chevrons): exact bounding-box camera fit, spacing 6.2, model scale 1.15.
5. Chevron shader pointed both ways: rewritten as a directional chevron with a length-scale uniform.
6. Shield model read as a flat hexagon: rebuilt with a dark body, accent core and ring.
7. Phone: diagram tiny, labels covering nodes, controls wrapped badly, two labels dropped: portrait orientation, two-line labels, multi-position label placement, taller stage, chip row first.
8. Stage inserted on scroll shifted the page by about 500 px: skeletons are built at load, GL mount stays lazy with a 320 px preload margin.
9. Per-frame allocations in both render loops: replaced by preallocated buffers; `getError()` sync reduced to every 900 frames (every 90 with `?q=`); data attributes throttled.
10. Process notes: browser tests under software WebGL are slow, so run one scenario per command (300 s tool limit), start the dev server detached (`setsid nohup`), and never `pkill -f` a pattern that appears in your own command line.

### 24.9 Tests run in this session (headless Chromium 141, software WebGL2) and results
- Standalone galaxy harness at tiers 0, 1, 2: shaders compile, no GL errors, screenshots reviewed. Standalone flow harness: overview and step views reviewed.
- In page `/services/`: WebGL2 active, tier 2, 17 draw calls, 0 GL errors, chip click and canvas click both open the panel in one click, 0 console messages, no overflow.
- Flow functional (`flow-functional.cjs`): Disaster Recovery page (caption and list sync per step, aria-pressed on chips, ArrowLeft/ArrowRight, play toggles to Pause, All view), panel switching on /services/ (exactly one shared GL canvas, moves with the open panel), generated flow in a reasons panel (5 chips). 0 console errors. Passed.
- No WebGL (`--disable-3d-apis`): map falls back to 2D, step cards remain, panels work, 0 console errors. Passed.
- Context loss: restore resumes rendering (frames advance); permanent loss falls back to 2D within about 3.6 s and the page stays interactive. Passed (galaxy only; the flow host's recovery path is written the same way but was not exercised).
- Reduced motion: Play hidden, no autoplay, map idle with 0 frames in 2.5 s. Passed.
- Phone viewport 390x844 DPR 2 with touch emulation: starts at tier 1, no horizontal overflow, flow readable (reviewed screenshot), 0 console errors. Passed.
- Smoke over all 31 pages: desktop, 31/31 returned 200 with 0 console errors or warnings and no overflow; phone viewport (390x844, DPR 2, touch emulation) 31/31 returned 200 with 0 console errors or warnings. A first metric (`scrollWidth - clientWidth`) flagged 14 pages by 2 to 51 px; the causes are decorative backdrop SVGs (Contact, Book online, Services, platform pages) and the Net-Monit versions table (which sits in its own horizontal scroller), all older than v3.0.0. A real `scrollTo(600,0)` test on all 31 pages in phone emulation and in a 390 px desktop window shows **none can scroll sideways**. Not checked on real iOS Safari or Android Chrome.
- `npm run build` and `npm run check`: 32 HTML files, 0 problems; 91 flow blocks validated; engine 75 KB in 3 files; banned-sink and privacy scans pass.
- **Not tested**: any real GPU or real FPS; the 8 ms vibration on touch selection; Safari, Firefox, Edge; real phones and touch gestures; low-end Android; screen readers; Lighthouse; long-session memory growth beyond 8 s; flow-host context-loss recovery; 3x DPR; the live site and DNS; Windows port check.

### 24.10 Open items and next session
- Owner: upload v3.0.0 to GitHub (browser upload as before), then look at it on the real PC and phone and report what feels slow or wrong (give device, browser, page). If frame rate is poor on some device, lower the tier table in `gl-galaxy.js` (`QS`) or `gl-flow.js` (`QF`).
- Still open from earlier: pin GitHub Actions to commit SHAs, choose a form provider, verify DNS/HTTPS, Lighthouse and accessibility runs, phone/address/logo originals.
- Ideas not built (ask first): sound effects (opt-in), more flow nodes per service, 3D flows on Book Online, a "tour" that walks the whole map.
- Read `docs/3D_ENGINE.md` before touching the engine. Never claim a GPU or device result that was not measured.

## 25. v3.1.0 notes (animation choreography, easier navigation, Net-Monit V11.3, port 3022)

### 25.1 Owner feedback this round
1. "Why all the animations look same; each animation should be unique and a proper graphical animated explanation of each."
2. Add Net-Monit V11.3 to the license request.
3. Do not show the map status line (`IT & SECURITY // 7 NODES // SELECTED 6`), the `WEBGL2 // 60 FPS // Q2` line or the hint "Drag the floating skills around".
4. Moving or clicking from one skill, service or project to another is really difficult.

### 25.2 Diagnosis (direct)
- (1) was my defect. v3.0.0 generated the 26 reasons, industries and tips flows from one template (all five industries used "Typical needs / Typical risks / How we help", all 16 tips "Do this / Then / Check / Common mistake"), and the 23 hand-written flows shared one visual grammar (same pedestals, same white dots). It was the same animation 49 times.
- (4) had four causes: the globe auto-rotated, every node bobbed, the pointer shifted the camera while aiming, and a click swung the globe away; and the open panel's Previous/Next buttons were at the bottom of panels about 2600 px tall.
- Version and port: v3.1.0, port 3022. Port 3022 reported EADDRINUSE once in the sandbox, but that was my own second dev server auto-incrementing; a later check showed 3022 and 3023 free, so nothing was skipped. Verify on the owner's PC.

### 25.3 What changed
- **Choreography engine** (`src/assets/gl-flow.js`, now 57 KB): per-flow environment (7 floor styles grid/hex/circ/ring/dot/wave/rows, ambient particles rain/bits/sparks/embers/snow/bubbles/leaves/stars, decor props); node idle animation (blinking LEDs, spinning gears and globes, swaying bells, growing chart bars, orbiting satellites, ticking clock, turbine blades); node states fail, ok, alert, scan, block, hot, build, ghost; distinct objects on links (dot, bit, heart, mail, tok, warn, cube, coin, bad, doc) that can be stopped part way and burst (blocked); node effects ring, radar, burst, smoke, beam, spark; callouts with glyphs and progress bars; 17 new prop kinds (tree turbine bank school gov sensor field plant pylon shop radar vault eye usb wifi coin book). New sprite shapes in `gl-core.js` (diamond, triangle, envelope, smoke).
- **Content** (`src/config/flows3d.mjs`): all 23 service/product/platform flows rewritten with a theme and per-step effects; 26 bespoke panel flows in `panelFlows` (5 industries from their own examples, 5 reasons, 16 tips that keep their own four step texts and add a scene specific to each tip). `autoFlow` remains only as a fallback. Schema and limits are in `validateFlow`, `docs/3D_ENGINE.md` documents the format.
- **Removed**: map status line, FPS line (data attributes for tests remain), hero hint.
- **Easier navigation**: no pointer parallax; auto-rotation waits 6 s after the last interaction and never runs while a node is hovered; hovered and selected nodes do not bob (others bob 3 instead of 7); larger hit targets (46 px, 58 px on touch) with depth preference and hover hysteresis; a click on a node already in view no longer rotates the globe; previous/next arrows on the stage; every open panel has a sticky switcher (all items of the group plus group buttons) so any item is one click away.
- **Net-Monit V11.3**: first entry of `netMonitVersions` (status latest), V11.2 now previous. The repo URL `https://github.com/InfoXteK/Net-Monit-V11_3` is assumed from the V11.2 pattern and could not be checked (no network access): owner to confirm. The note text is neutral and invents no features. The Contact license dropdown, the product page selector and the products table update automatically.

### 25.4 Tests run for v3.1.0 (headless Chromium 141, software WebGL)
- `npm run build` and `npm run check`: 0 problems; 49 flows valid (23 + 26); 91 flow blocks in the generated HTML; engine 98 KB raw.
- Focused browser test (`tools/browser-tests/v3.1-requests.cjs`): V11.3 is the preselected option for `/contact/?v=v11.3#license` and appears on the product page (1 repo link) and the products table; the home page has no hint text; 2 stage arrows; each open panel has the switcher (7 items, 2 group buttons, sticky); one click switches item (Cyber Security to Disaster Recovery), group (to Web Applications) and, with a panel open, the stage arrow moves to the next item; Disaster Recovery flow step 3 and 4 render, caption updates, 0 GL errors, 0 console messages.
- Sticky check (`sticky-switcher.cjs`): the switcher stays at 72 px from the viewport top at three scroll depths inside a long panel.
- Regression (`flow-functional.cjs`, unchanged from v3.0.0): step buttons, list sync, aria-pressed, ArrowLeft/ArrowRight, play/Pause, All view, one shared GL canvas across panel switches, bespoke reasons flow (5 chips): passed, 0 console messages.
- Phone viewport 390: switcher usable by tap (switched panels), no horizontal overflow, 0 console messages, screenshot reviewed.
- Visual review: contact sheet of services 0 to 11 at low quality, and the Disaster Recovery failure step on the real page (primary systems turn red with a ring and a "Health check fails" callout, storm clouds, other nodes dimmed).

### 25.5 Not tested / known gaps (do not claim otherwise)
- **37 of the 49 flows were validated but their renders were not looked at** (only services 0 to 11 and Disaster Recovery were viewed). Props may overlap labels or sit oddly in some; the owner's feedback on specific ones is the fastest way to fix them.
- Not re-run for v3.1.0: no-WebGL fallback, context loss, reduced motion, 31-page smoke test, phone screenshot of the flow stage (a screenshot timed out in the test harness), performance measurement (the new engine does more per frame; its cost was not measured), Lighthouse, any real GPU, phone, Safari or Firefox.
- The 2D "See it in motion" SVG scenes were not changed; four items (support consulting, mobile applications, full stack, iFiNeX) still use a generic SVG scene on their own pages.
- The sticky switcher is 106 px tall on a phone.

### 25.6 Next session
Read CLAUDE.md, docs/3D_ENGINE.md and this file. Do not start a long session: open a fresh chat with only the v3.1.0 zip and this file, because every step in a long chat re-reads the whole conversation. First tasks: view the remaining 37 flow scenes (render one flow per command with `tools/browser-tests`-style scripts), re-run the fallback and reduced-motion tests, measure per-frame cost, fix what the owner reports.

## 26. v3.2.0 notes (live demos inside the site, new-tab links, port 3023)
- Request: Live demo and GitHub/download links must open in a new tab so visitors stay on infoxtek.com; the three product demo simulations (Net-Monit, PC Admin Tools, iFiNeX) must live inside the site on the product pages, with each demo's operations, functions and explanation shown on the site.
- New: `demos/<slug>/` source folders copied by the build to `dist/demos/<slug>/` (Net-Monit demo V11.4, PC Admin Tools Web demo v4.0 with 113 operations in 9 categories, iFiNeX web v9.6 demo). Build injects per-page CSP meta (same origin only), noindex, no-referrer and `/demos/_shared/links.js`; Net-Monit `speedtest.html` alone may call speed.cloudflare.com and api.ipify.org when the visitor starts the browser speed test.
- New pages `/products/net-monit/demo/`, `/products/pc-admin-tools/demo/`, `/products/ifinex/demo/`: InfoXteK header, view buttons that load demo pages in a sandboxed frame (`allow-same-origin`, no top navigation), "What to try", full operations/functions list (`<details>` groups). Text in `src/config/demos.mjs`; PC ops list is read from `demos/pc-admin-tools/ops-data.js` at build.
- iFiNeX now has its own product page (features, quick start, Releases download, scene `custom['ifinex']`). PC Admin Tools text changed from "36 operations" to "113 operations in 9 categories" (taken from the demo data); edition version numbers in site.mjs were NOT changed and may be outdated.
- New-tab rule: build function `newTab()` adds `target="_blank" rel="noopener noreferrer"` plus a screen-reader note to every external link and every `/demos/` or `/products/*/demo/` link; `site.js` does the same for the 3D map Open button; `check.mjs` fails the build otherwise. Demo links to `target="demoframe"` are exempt.
- `check.mjs` also verifies: demo entry and view files exist, every demo page has CSP/noindex/links.js, no external script or stylesheet in demos, iframes are sandboxed without top navigation.
- `robots.txt` disallows `/demos/`. Guide: docs/LIVE_DEMOS.md.
- Standalone owner pages (infoxtek.github.io/Net-Monit, /PC-AdminTools, /PC_Admin_Tools_Demo, /iFiNeX-Demo; mohamedabdullahkhan.github.io/Net-Monit, /PC-AdminTools, /PC_Admin_Tools-old; squadsplit.github.io/iFiNeX-Demo) are in `demoStandalone`, not linked.
- Not tested: no real browser available in the build sandbox. Build and static checks pass (36 html, 0 problems); the demos running inside the frame, the iFiNeX service worker under the infoxtek.com origin, and the new-tab behaviour were not exercised in a browser. iFiNeX Google Fonts requests are blocked by the demo CSP, so it falls back to system fonts.
- Demos run on the infoxtek.com origin; fine while the site has no login or secrets.
