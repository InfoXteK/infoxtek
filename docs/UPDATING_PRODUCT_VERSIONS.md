# How to add or change a Net-Monit version

Everything lives in ONE place: `src/config/site.mjs`, the list `netMonitVersions` (search for "NET-MONIT VERSIONS").

## Add a new version (example: V11.3)
1. Open `src/config/site.mjs`.
2. Copy one block inside `netMonitVersions` and paste it at the TOP of the list (newest first):
   `{ id: 'v11.3', label: 'V11.3', status: 'latest', repo: 'https://github.com/InfoXteK/Net-Monit-V11_3', note: 'One or two plain sentences about this version.' },`
3. Change the old newest entry's `status: 'latest'` to `status: 'previous'`. Only one entry may be `latest`.
4. Save, run `npm run build` then `npm run check`, then upload to GitHub as usual.

That single edit updates automatically:
- the version selector on /products/net-monit/ (with Get on GitHub and Request license buttons per version)
- the "Net-Monit versions" table on /products/
- the Products card "GitHub" button (points to the latest repo)
- the "Net-Monit version" drop-down in the Contact page license form (and the email body the requester sends)
- deep links `/contact/?v=v11.3#license` that preselect that version

## Fields
| Field | Rule |
|---|---|
| id | lowercase, unique, no spaces (used in links) |
| label | what visitors see, e.g. V11.3 |
| status | `latest` (one only) or `previous` |
| repo | full GitHub URL of that version |
| note | plain text, no HTML |

## Retire a version
Delete its block. Old `?v=` links to it simply fall back to the default option.

## Change the "older versions" choice
Edit `netMonitOlderOption` in the same file (the last option in the license drop-down).

## Other products
PC Admin Tools and iFiNeX are in the `products` list in the same file (`download` = link).
To give another product a version selector, ask for the same pattern to be applied.
