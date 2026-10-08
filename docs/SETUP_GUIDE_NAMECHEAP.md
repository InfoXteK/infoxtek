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

## Part 3. Install two free programs (10 minutes)

1. **Node.js** (needed to build the site): go to nodejs.org, download the version marked **LTS**, run the installer, click Next until it finishes.
2. **GitHub Desktop** (uploads the site without typing commands): go to desktop.github.com, download, install.

---

## Part 4. Create a free GitHub account (5 minutes)

1. Go to github.com and click **Sign up**. Use your email, choose a username, and verify your email.
2. **Write down your username.** You need it in Part 6. Example: if it is `infoxtek-corp`, your address is `infoxtek-corp.github.io`.

---

## Part 5. Upload the site to GitHub (10 minutes)

1. Open **GitHub Desktop** and sign in with your GitHub account.
2. Menu **File, Add local repository**. Click **Choose...** and select the `infoxtek` folder.
3. It says "this directory does not appear to be a Git repository". Click the blue link **create a repository**, then click **Create repository**.
4. In the left list you will see all the files. Bottom left, type `First version` in the Summary box and click **Commit to main**.
5. Click **Publish repository** (top bar).
   - Name: `infoxtek`
   - **Untick** "Keep this code private". (GitHub Pages is free only for public repositories. The site is public anyway. Never put passwords in these files.)
   - Click **Publish repository**.
6. In your browser, go to `https://github.com/YOUR-USERNAME/infoxtek`. You should see your files, including the `.github` folder.

---

## Part 6. Turn on GitHub Pages (5 minutes)

1. On your repository page click **Settings** (top tab), then **Pages** (left menu).
2. Under **Build and deployment**, find **Source** and choose **GitHub Actions**.
3. Click the **Actions** tab at the top. A run called "Deploy to GitHub Pages" appears. Wait until it shows a **green tick** (1 to 3 minutes). If it shows a red cross, see Troubleshooting.
4. Back in Settings, Pages, find **Custom domain**. Type `infoXtek.com` and click **Save**.
   - A warning that DNS is not ready yet is normal. Continue to Part 7.

Do not judge the site by opening `YOUR-USERNAME.github.io/infoxtek`. It will look broken until your domain is connected. To preview earlier, open a terminal in the folder and run `npm run dev`.

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

## Part 9. Changing the website later

1. Edit `src/config/site.mjs` and save.
2. Open GitHub Desktop. Your change appears in the list. Type a short summary (e.g. `Update phone number`), click **Commit to main**, then **Push origin**.
3. Wait 2 minutes. The site updates itself (watch the Actions tab for a green tick).

To add a service, copy one `{ slug: ..., title: ..., ... }` block inside `services`, paste it below, and change the words. The new page appears automatically.

**Contact form:** it does not send messages until you connect a form service (for example Formspree). Create an account there, copy the `https://` link it gives you, and paste it into `formEndpoint: '...'`. Until then, visitors see a message that the form is not connected, so make sure your email or phone is filled in.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Red cross in Actions tab | Click it, then the red step, and read the message. Most common: the `.github` folder was not uploaded. Check it appears in your repository on github.com. |
| "Enforce HTTPS" is greyed out | DNS is not ready or the certificate is still being created. Wait a few hours. Re-check Part 7. |
| Site shows a Namecheap parking page | Old records not deleted (Part 7, step 5), or Nameservers not set to BasicDNS. |
| 404 "There isn't a GitHub Pages site here" | Settings, Pages, Source must be **GitHub Actions**. Re-run the workflow in Actions. |
| `www` works but the plain domain does not (or the reverse) | One of the five records is missing or has a typo. |
| Site has no styling | You opened the `github.io/infoxtek` address. Use infoXtek.com. |
| Domain still not working after 24 hours | Remove the custom domain in GitHub Pages, save, add it back, and recheck DNS records. |

If you get stuck, copy the exact error message and ask for help.
