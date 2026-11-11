# v3.4.0 redesign: audit, assets to supply, how to measure

## Audit of v3.3.1 (top 10, ranked by impact)
1. Home page was 118 KB of HTML with the whole 3D service map and 16 detail panels, so the first screen waited on heavy markup and JS. Fixed: home is 19.5 KB and loads no 3D engine.
2. No full-screen hero or image; first view was a text block with floating chips. Fixed: 100svh hero with AVIF/WebP/JPEG, blurred placeholder, preload, `fetchpriority="high"`.
3. Home structure was a service ring, a reasons list and a CTA. Fixed: hero, trust bar, platform marquee, two category cards, why, process, industries, products with live demos, final CTA, footer.
4. Platform names were plain chips. Fixed: grayscale auto-scrolling marquee (colour on hover); real SVG logos need to be supplied (see below).
5. Footer was one paragraph and showed "Version 3.3.1". Fixed: 4-column footer with contact, sitemap, products; version removed.
6. Repeated "Illustrative ..." notes on service, product and platform pages. Fixed: one note per page (build step `dedupeNotes`).
7. Social sharing: og:image was the 512 px logo and twitter:card was `summary`. Fixed: branded 1200x630 `og-image.png`, `summary_large_image`.
8. System font stack only. Fixed: self-hosted Inter subset (WOFF, 3 weights, about 75 KB), `font-display: swap`, metric-matched fallback, two preloads.
9. Header was static height and "Book Online" was hidden in the mobile menu. Fixed: fixed header that shrinks on scroll, Book Online visible on phones.
10. Remaining (not done): 55 KB `site.js` includes the game layer (sparks, tilt, XP HUD) that runs on every page; inner pages still load the 3D engine with `defer` instead of on visibility; no critical-CSS inlining; no Brotli/long cache headers (GitHub Pages does not allow custom headers).

## Commit-sized steps (use these as commit messages if you upload in stages)
1. `perf: self-host Inter subset, preload, metric-matched fallback` (public/fonts, site.css, layout)
2. `feat(hero): full-screen hero with AVIF/WebP/JPEG, placeholder, preload` (tools/make-assets.py, public/img, heroph.mjs, home)
3. `feat(home): trust bar, platform marquee, category cards, why, process, industries, products, final CTA`
4. `feat(header): fixed shrinking header, mobile Book Online`
5. `feat(footer): contact, sitemap, products; remove version`
6. `seo: 1200x630 og-image, summary_large_image, Organization and Service JSON-LD`
7. `content: single illustrative note per page`
8. `test: redesign assertions in scripts/check.mjs`

## Assets you need to supply or license
- **Platform SVG logos** for the marquee. Get each from the vendor's brand/press kit (or Simple Icons where the licence fits your use). Save as `public/logos/<slug>.svg` where slug is the lowercase name with dashes: `microsoft-azure.svg`, `aws.svg`, `fortigate.svg`, `veeam.svg`, `sentinelone.svg`, `forcepoint-dlp.svg`, etc. A file that exists replaces the text wordmark automatically; others stay text. Logos are trademarks: check each vendor's usage rules and keep the trademark line in the footer. I did not draw or copy any brand logo.
- **Hero photo or video (optional).** The current hero is an original procedural illustration made by `tools/make-assets.py` (no third-party artwork, nothing to license). To use a real Unsplash/Pexels data-centre photo instead, replace the 9 files `public/img/hero-{640,1280,1920}.{avif,webp,jpg}` (16:9, keep the same names) and the placeholder in `src/config/heroph.mjs`. Keep each AVIF under 60 KB. A looping video is not included: add it only if you accept the extra weight.
- **Phone, address, social links.** `contact.phone`, `contact.address`, `contact.social` in `src/config/site.mjs`; the footer shows them automatically when set. Add `LocalBusiness` JSON-LD only after a real address exists.
- **Real client quotes or case studies.** `testimonials` is empty, so the home page shows your three own products with live demos instead. Add real, permitted quotes and the quote section replaces it.
- **Original logo file** (still open from earlier versions).

## Measuring (nothing here is a Lighthouse score)
Lighthouse is not installed in the build sandbox, so no Lighthouse before/after numbers exist. Run it yourself on the live site: Chrome DevTools > Lighthouse > Mobile > Navigation, on https://infoXtek.com/ in a private window. Use PageSpeed Insights for the Core Web Vitals field data.
Measured locally in headless Chromium (no throttling, localhost, not comparable to Lighthouse): home LCP 588 ms desktop and 176 ms at 390 px, CLS 0, no horizontal overflow, 0 console errors.
Static sizes: home HTML 118.7 KB before, 19.5 KB after (5.1 KB gzipped); site.css 64 KB (15 KB gzipped); site.js 56 KB (16.5 KB gzipped); hero AVIF 9.7 KB at 640 w, 25 KB at 1280 w, 39 KB at 1920 w.

## Not possible on GitHub Pages
Custom response headers (Brotli choice, `Cache-Control: immutable`) cannot be set. GitHub Pages serves gzip and its own cache lifetime. Put Cloudflare (free) in front if you want Brotli and long caching.
