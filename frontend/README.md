# Muhammad Faraz Kazmi Portfolio

A modern personal portfolio built with React, Vite, Tailwind CSS, and Framer Motion.

## Project Structure

```text
portfolio/
├── public/
│   ├── assets/
│   │   └── images/
│   │       └── faraz-profile.jpg
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Footer.jsx
│   │   │   └── Navbar.jsx
│   │   └── sections/
│   │       ├── About.jsx
│   │       ├── Contact.jsx
│   │       ├── Education.jsx
│   │       ├── Hero.jsx
│   │       ├── Projects.jsx
│   │       └── Skills.jsx
│   ├── content/
│   │   └── cvData.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vercel.json
└── vite.config.js
```

## Local Development

Use `npm.cmd` in PowerShell if `npm` is blocked by execution policy.

```powershell
cd "D:\Smester 7th\Projects\Portfolio\portfolio"
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:5173/`.

## Production Build

```powershell
npm.cmd run build
```

The production files are generated in `dist/`.

## Deploy On Vercel

Recommended settings:

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

The included `vercel.json` rewrites all routes to `index.html`, which is correct for a single-page React app.

## Edit Content

- Portfolio text and links: `src/content/cvData.js`
- Hero portrait: `public/assets/images/faraz-profile.jpg`
- Global styles: `src/index.css`
- Theme colors and fonts: `tailwind.config.js`
