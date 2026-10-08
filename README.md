Beginner? Follow `docs/SETUP_GUIDE_NAMECHEAP.md` instead of the short steps below.

# InfoXtek website (v1.0.0)

## Edit the content
Open `src/config/site.mjs`. Change text there. Put real email, phone and address into the `contact` block (they are `null` until you add them).

## Preview on your computer (optional, developers only)
1. Install Node.js 20 or newer from nodejs.org.
2. Open a terminal in this folder.
3. Run `npm run dev`. Open the address it prints (starts at http://127.0.0.1:3000).

## Put it online with GitHub Pages and infoXtek.com
1. Create a free account at github.com. Click New repository, name it `infoxtek`, leave it empty.
2. In this folder run:
   `git init`, `git add .`, `git commit -m "InfoXtek v1.0.0"`, `git branch -M main`,
   `git remote add origin https://github.com/YOUR-USERNAME/infoxtek.git`, `git push -u origin main`.
3. On GitHub: Settings, Pages, Source: choose **GitHub Actions**. Wait for the "Deploy to GitHub Pages" run (Actions tab) to turn green.
4. Settings, Pages, Custom domain: type `infoXtek.com`, Save. The `CNAME` file in `public/` is included as a backup.
5. At the company that sells your domain, open DNS settings and add:
   - Four **A** records, host `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - One **CNAME** record, host `www`, value `YOUR-USERNAME.github.io`
   - Do not add wildcard (`*`) records.
6. Wait up to 24 hours. In Settings, Pages, tick **Enforce HTTPS** once it becomes available.
7. Check it worked by opening https://infoXtek.com.

Updating later: edit, then `git add .`, `git commit -m "update"`, `git push`. The site rebuilds itself.
