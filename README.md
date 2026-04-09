# Muhammad Faraz Kazmi — Personal Portfolio

A modern, dark-themed personal portfolio built with **React + Vite + Tailwind CSS + Framer Motion**.

## ✨ Features
- Dark theme with green (`#059669`) & purple accent colors
- Smooth Framer Motion animations on all sections
- Filterable project cards by ML category
- Responsive — mobile, tablet, desktop
- Contact form (frontend-only, swap in EmailJS/Formspree for real email)
- Vercel-ready single-page app

## 📁 Project Structure
```
faraz-portfolio/
├── public/
│   └── favicon.svg
│   └── Muhammad_Faraz_CV.pdf   ← Add your CV PDF here
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── About.jsx
│   │   ├── Skills.jsx
│   │   ├── Projects.jsx
│   │   ├── Education.jsx
│   │   ├── Contact.jsx
│   │   └── Footer.jsx
│   ├── data/
│   │   └── cvData.js       ← All your CV content lives here
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
└── package.json
```

## 🚀 Local Development

### 1. Install dependencies
```bash
npm install
```

### 2. Start dev server
```bash
npm run dev
```
Open http://localhost:5173

### 3. Build for production
```bash
npm run build
```

## 📤 Deploy on Vercel (Recommended)

### Option A — Vercel CLI (fastest)
```bash
npm install -g vercel
vercel
```
Follow the prompts. Vercel auto-detects Vite.

### Option B — Vercel Dashboard (drag & drop)
1. Run `npm run build` to generate the `dist/` folder
2. Go to https://vercel.com/new
3. Drag and drop the `dist/` folder
4. Done — your site is live!

### Option C — GitHub + Vercel (recommended for ongoing updates)
1. Push this folder to a GitHub repo
2. Go to https://vercel.com/new → Import Git Repository
3. Select your repo
4. Framework preset: **Vite** (auto-detected)
5. Click Deploy

## 📧 Enable Real Email (Contact Form)
Replace the `setTimeout` mock in `Contact.jsx` with **EmailJS**:

```bash
npm install @emailjs/browser
```

```js
import emailjs from "@emailjs/browser";

emailjs.send(
  "YOUR_SERVICE_ID",
  "YOUR_TEMPLATE_ID",
  { name: form.name, email: form.email, message: form.message },
  "YOUR_PUBLIC_KEY"
);
```
Sign up free at https://emailjs.com

## 🎨 Customisation
- All CV content: `src/data/cvData.js`
- Colors: `tailwind.config.js` → `colors.primary`
- Fonts: `index.html` Google Fonts link + `tailwind.config.js` fontFamily
- Add CV PDF: place `Muhammad_Faraz_CV.pdf` in `/public/`

## 🔍 SEO
- Meta title, description, og:tags already set in `index.html`
- Update `og:url` with your live Vercel URL after deployment
