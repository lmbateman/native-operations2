# Connector Operations Prototype

Static demo (HTML, CSS, JS) for connector discoverability and selection. No build step.

## Run locally

Open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Push to a Git repo

1. **Create a new repo on GitHub** (e.g. `connector-prototype`) with no README, .gitignore, or license.

2. **From this folder**, init and push:

```bash
cd connector-prototype-deploy
git init
git add index.html styles.css prototype.js vercel.json README.md .gitignore
git commit -m "Initial commit: Connector Operations prototype"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git push -u origin main
```

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your GitHub user and repo name.

## Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (e.g. with GitHub).
2. **Import** your GitHub repo (the one you pushed above).
3. Leave **Root Directory** as `.` (repo root).
4. **Build**: leave “Build Command” empty; **Output Directory**: `.` (or leave default).
5. Click **Deploy**. Vercel will serve `index.html` as the entry point.

After the first deploy, every push to `main` will trigger a new deployment.
