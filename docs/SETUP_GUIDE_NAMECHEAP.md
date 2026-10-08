# InfoXtek Setup Guide for Beginners (Namecheap + GitHub Pages)

Goal: make https://infoXtek.com show your new website.
Time: about 45 minutes of work, then up to 24 hours of waiting for the internet to catch up.
You need: a computer, an email address, and your Namecheap login.

---

## Part 1. Understand the folder (2 minutes)

Unzip `infoxtek-web-v1.0.0.zip`. You get one folder called `infoxtek`. **Keep everything inside it exactly where it is.** Do not move or rename files.

```
infoxtek/
├── .github/workflows/deploy.yml   <- auto-publisher. Must stay in this exact place.
├── public/
│   ├── CNAME                      <- contains the text infoXtek.com. Leave it.
│   └── favicon.svg                <- the small browser-tab icon
├── src/
│   ├── config/site.mjs            <- THE FILE YOU EDIT (all text, phone, email)
│   └── assets/                    <- site.css (look) and site.js (menu, form)
├── scripts/                       <- build tools. Do not edit.
├── docs/                          <- notes and this guide
├── package.json                   <- project info. Do not edit.
├── CLAUDE.md, README.md
└── .gitignore
```

Only one file is meant for editing: **`src/config/site.mjs`**.

Tip: the folder `.github` starts with a dot, so your computer may hide it.
- Windows: File Explorer, View menu, tick **Hidden items**.
- Mac: in Finder press **Command + Shift + .** (period).

---

## Part 2. Add your real company details (5 minutes)

1. Right-click `src/config/site.mjs`, choose Open with, then Notepad (Windows) or TextEdit (Mac).
2. Find the block that starts with `export const contact = {`.
3. Replace each `null` with your real detail **inside quotes**. Example:
   ```
   email: 'hello@infoxtek.com',
   phone: '+1 555 000 0000',
   address: '12 Example Street, City, Country',
   ```
4. Leave `formEndpoint: null` for now (see Part 8).
5. Save the file. Do not delete the commas or quote marks.

Do not invent details. Anything you leave as `null` is simply not shown.

---

## Part 3. Nothing to install

Everything runs on GitHub and in your web browser. You do **not** need Node.js, GitHub Desktop, or any program. GitHub builds and hosts the site for you.

---

## Part 4. Create a free GitHub account (5 minutes)

1. Go to github.com and click **Sign up**. Use your email, choose a username, and verify your email.
2. **Write down your username.** You need it in Part 7. Example: if it is `infoxtek-corp`, your address is `infoxtek-corp.github.io`.

---

## Part 5. Upload the site using only your browser (10 minutes)

1. On github.com click the **+** (top right), then **New repository**.
   - Repository name: `infoxtek`
   - Choose **Public**. (GitHub Pages is free only for public repositories. Never put passwords in these files.)
   - Leave all the other boxes empty. Click **Create repository**.
2. On the empty repository page click the link **uploading an existing file**.
3. On your computer open the unzipped `infoxtek` folder and make hidden files visible (see Part 1 tip). Go **inside** the folder, press **Ctrl + A** (Windows) or **Command + A** (Mac) to select everything inside, and **drag it all into the browser window**.
4. Wait until every file shows as uploaded. Scroll down, leave "Commit directly to the main branch" selected, and click the green **Commit changes**.
5. Check the repository page. You must see these items: `.github`, `public`, `scripts`, `src`, `docs`, `package.json`.

**If `.github` is missing** (the most common problem, because it is a hidden folder), add that one file by hand:
1. Click **Add file**, then **Create new file**.
2. In the name box type exactly `.github/workflows/deploy.yml` (typing each `/` creates the folder).
3. Open `deploy.yml` from your computer in Notepad/TextEdit, copy everything, and paste it into the big box. Or paste the text from the box below.
4. Click **Commit changes**, then **Commit changes** again.

```
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
  workflow_dispatch:
permissions:
  contents: read
concurrency:
  group: pages
  cancel-in-progress: true
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - run: npm run build
      - run: npm run check
      - uses: actions/configure-pages@v5
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist
  deploy:
    needs: build
    runs-on: ubuntu-latest
    permissions:
      pages: write
      id-token: write
    environment:
      name: github-pages
      url: ${{ steps.d.outputs.page_url }}
    steps:
      - id: d
        uses: actions/deploy-pages@v4
```

Spaces at the start of lines matter. Paste it exactly.

---

## Part 6. Turn on GitHub Pages (5 minutes)

1. On your repository page click **Settings** (top tab), then **Pages** (left menu).
2. Under **Build and deployment**, find **Source** and choose **GitHub Actions**.
3. Click the **Actions** tab at the top. A run called "Deploy to GitHub Pages" appears. Wait until it shows a **green tick** (1 to 3 minutes). If it shows a red cross, see Troubleshooting.
4. Back in Settings, Pages, find **Custom domain**. Type `infoXtek.com` and click **Save**.
   - A warning that DNS is not ready yet is normal. Continue to Part 7.

Do not judge the site by opening `YOUR-USERNAME.github.io/infoxtek`. It will look broken until your domain is connected. Your real preview is https://infoXtek.com once Part 7 and 8 are done.

**Recommended (1 minute): verify your domain** so nobody else can claim it.
GitHub profile picture (top right), **Settings**, **Pages** (left menu), **Add a domain**, type `infoXtek.com`. GitHub shows a TXT record: a host starting with `_github-pages-challenge-` and a value. Add it in Namecheap exactly like Part 7 step 6, then click **Verify** on GitHub (can take a few minutes to hours).

---

## Part 7. Point your Namecheap domain to GitHub (10 minutes)

1. Log in at namecheap.com. Click **Domain List** (left menu).
2. Next to `infoxtek.com` click **Manage**.
3. Open the **Domain** tab. Find **Nameservers** and make sure it says **Namecheap BasicDNS**. If not, choose it from the dropdown and click the green tick.
4. Open the **Advanced DNS** tab.
5. Under **Host Records**, **delete the old records** (click the trash icon): any `URL Redirect Record`, and any `CNAME` pointing to `parkingpage.namecheap.com`. Leave nothing that points your site somewhere else.
6. Click **Add New Record** and add these five exactly:

| Type | Host | Value | TTL |
|---|---|---|---|
| A Record | `@` | `185.199.108.153` | Automatic |
| A Record | `@` | `185.199.109.153` | Automatic |
| A Record | `@` | `185.199.110.153` | Automatic |
| A Record | `@` | `185.199.111.153` | Automatic |
| CNAME Record | `www` | `YOUR-USERNAME.github.io` | Automatic |

   Replace `YOUR-USERNAME` with your GitHub username. Do **not** type the repository name `infoxtek` there. Click the green tick after each row.
7. If you have email on this domain through Namecheap, do **not** delete `MX` records.
8. Do not add any record with `*` as the host.

---

## Part 8. Wait, then switch on HTTPS (up to 24 hours)

1. DNS changes usually work in 15 to 60 minutes, sometimes up to 24 hours.
2. To check: go to dnschecker.org, type `infoxtek.com`, choose **A**, click Search. You want the four 185.199.x.153 numbers to show.
3. In GitHub, Settings, Pages, you will see "DNS check successful". GitHub then creates a security certificate by itself (can take up to an hour more).
4. When the box **Enforce HTTPS** becomes clickable, **tick it**.
5. Open https://infoXtek.com and https://www.infoXtek.com. Both should show your site with a padlock.

---

## Part 9. Changing the website later (browser only)

1. Go to `github.com/YOUR-USERNAME/infoxtek`, open `src`, then `config`, then click `site.mjs`.
2. Click the **pencil icon** (Edit), change the text, and click **Commit changes**, then **Commit changes** again.
3. Wait 2 minutes. The site updates itself (watch the **Actions** tab for a green tick).

To add a service, copy one `{ slug: ..., title: ..., ... }` block inside `services`, paste it below, and change the words. The new page appears automatically.

**Contact form:** it does not send messages until you connect a form service (for example Formspree). Create an account there, copy the `https://` link it gives you, and paste it into `formEndpoint: '...'`. Until then, visitors see a message that the form is not connected, so make sure your email or phone is filled in.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Red cross in Actions tab | See the section "If the Actions run fails" below. The GitHub email never says why; you must open the log. |
| "Enforce HTTPS" is greyed out | DNS is not ready or the certificate is still being created. Wait a few hours. Re-check Part 7. |
| Site shows a Namecheap parking page | Old records not deleted (Part 7, step 5), or Nameservers not set to BasicDNS. |
| 404 "There isn't a GitHub Pages site here" | Settings, Pages, Source must be **GitHub Actions**. Re-run the workflow in Actions. |
| `www` works but the plain domain does not (or the reverse) | One of the five records is missing or has a typo. |
| Site has no styling | You opened the `github.io/infoxtek` address. Use infoXtek.com. |
| Domain still not working after 24 hours | Remove the custom domain in GitHub Pages, save, add it back, and recheck DNS records. |

If you get stuck, copy the exact error message and ask for help.

---

## If the Actions run fails (red cross)

The email from GitHub only says "build failed". The reason is in the log:

1. Repository, **Actions** tab, click the failed run (top of the list).
2. Scroll to the bottom of the page: **Annotations** lists the error messages. Read them.
3. Click **build** (left side), then click the step marked with a red cross to open it. The last 5 to 10 lines say what is wrong.

| Message in the red step | Meaning | Fix |
|---|---|---|
| `SyntaxError` and `site.mjs` | A typo when you edited your details | Open `src/config/site.mjs`. Each detail needs quotes and a comma, e.g. `email: 'hello@infoxtek.com',` Straight quotes only, not curly quotes. |
| `Cannot find module` or `ENOENT` | A file or folder was not uploaded | Make sure the repo has: `package.json`, `scripts/build.mjs`, `scripts/check.mjs`, `src/config/site.mjs`, `src/assets/site.css`, `src/assets/site.js`, `public/favicon.svg`, `public/CNAME`. Upload what is missing (Add file, Upload files). |
| `FAIL` lines from `npm run check` | The safety check found a problem | Send the FAIL lines for help. |
| `Get Pages site failed` or `Pages is not enabled` | Pages setting not saved | Settings, Pages, Source: choose **GitHub Actions** again. Then Actions, the failed run, **Re-run all jobs**. |
| `Resource not accessible by integration` | Workflow permission blocked | Settings, Actions, General, Workflow permissions: choose **Read and write permissions**, Save, then re-run. |

After any fix, re-run: Actions, the failed run, **Re-run all jobs**.

**"The .github folder shows as one folder `.github/workflows`":** this is normal. GitHub joins a folder and its only subfolder into one row. Click it and you should see `deploy.yml`.
