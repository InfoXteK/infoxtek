# Getting the InfoXteK logo into Google search results

What Google shows next to a result is the site FAVICON (the small icon), taken from the home page. A blank icon means Google has not fetched a valid one yet, or it fetched the old transparent one.

## What v2.9.0 changed (in the code)
- `/favicon.ico` (16/32/48) plus `/favicon-48.png`, `-96`, `-144`, `-192`, `-512` (Google needs a square icon whose size is a multiple of 48 px).
- The logo now sits on a white rounded tile, so it is visible on light and dark result pages (the old file was transparent and dark).
- `/apple-touch-icon.png`, `/site.webmanifest`, `og:image` and `Organization` structured data with `logo` = `/logo-512.png`.
- robots.txt allows everything, so Google can fetch the icons.
- To regenerate after a logo change: replace `src/assets/logo.png`, run `python3 tools/make-icons.py`, rebuild.

## What YOU must do after deploying (I cannot do this or verify it from here)
1. Deploy v2.9.0 and open `https://infoXtek.com/favicon.ico` and `https://infoXtek.com/favicon-48.png` in a browser: you must see the logo.
2. In Google Search Console (https://search.google.com/search-console) add the property `https://infoXtek.com` and verify ownership (DNS TXT record in Namecheap is easiest).
3. Use URL Inspection on `https://infoXtek.com/`, click "Test live URL", then "Request indexing".
4. Wait. Google refreshes favicons on its own schedule: days to a few weeks. There is no way to force it. Do not change the icon URL repeatedly.
5. Keep the same icon URLs permanently, and keep the home page crawlable (no noindex, no blocking).
6. Also search `site:infoxtek.com` to see whether pages are indexed at all. If the home page is not indexed, the icon cannot show.
Note: the larger site logo shown in some knowledge panels is a separate Google decision; the `Organization.logo` data helps but does not guarantee it.
