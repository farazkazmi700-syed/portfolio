# Muhammad Faraz Kazmi Portfolio

A modern personal portfolio built with React, Vite, Tailwind CSS, and Framer Motion,
with an automated **LinkedIn → portfolio sync system** (Flask backend).

## LinkedIn Auto-Sync System

Everything you add on LinkedIn — experience, education, certifications, projects,
skills — can be pulled into this website with one command or one API call.

### How it works

```text
LinkedIn profile  ──fetch──►  provider chain (ScrapingDog / RapidAPI / direct)
                                     │
                                     ▼
                              parser (normalize to portfolio schema)
                                     │
                                     ▼
                              merger ──► backend/data/profile.json (source of truth)
                              • matched items KEEP their old dates
                              • new items are added with their dates
                              • sections sorted newest-first
                                     │
                                     ▼
                              generator ──► src/content/cvData.js
                                             frontend/src/content/cvData.js
                                     │
                                     ▼
                          commit + push ► Vercel rebuilds with updated data
```

The website also live-updates at runtime when the Flask API is reachable
(`VITE_API_URL=http://localhost:5000` in `frontend/.env.local`) via `GET /api/portfolio`.

### Ways to sync

**1. API-provider fetch (recommended)** — get a key from scrapingdog.com/linkedin
or any RapidAPI LinkedIn-profile provider and put it in `backend/.env`
(copy from `backend/.env.example`):

```powershell
SCRAPINGDOG_API_KEY=your_key        # or RAPIDAPI_KEY=... / RAPIDAPI_HOST=...
```

Then either run the CLI or start the server:

```powershell
npm.cmd run sync                    # CLI: fetches & merges & regenerates cvData.js
# or: POST http://localhost:5000/api/linkedin/sync   { "url": "https://www.linkedin.com/in/muhammad-faraz-kazmi/" }
```

**2. Manual import (works without any API key)** — paste normalized JSON into a file
(same fields ScrapingDog returns: experiences, education, certifications, skills)
and import it:

```powershell
backend\venv\Scripts\python.exe backend\scripts\sync.py --import myprofile.json
# or: POST http://localhost:5000/api/linkedin/import  with that JSON as body
```

> Direct anonymous scraping of linkedin.com is attempted as a last resort but is
> usually blocked by LinkedIn's auth wall — that's why the key/import paths exist.

### Merging rules

- Existing entries (matched by title/company/name) are refreshed but **keep their
  original period/date**, so established history never changes.
- New entries are added with their LinkedIn dates.
- Every section is sorted **newest first**; undated entries keep their order last.
- Manual scalar edits (name, title, bio...) are never overwritten by empty values.
- Every sync is recorded in `backend/data/profile.json → meta.updates`.
- Re-running a sync is idempotent — nothing duplicates.

## Project Structure

```text
portfolio/
├── backend/                     # Flask LinkedIn-sync service
│   ├── app/
│   │   ├── routes.py            # /api/health /api/portfolio /api/linkedin/*
│   │   ├── middleware.py        # error handlers
│   │   └── services/
│   │       ├── linkedin_fetcher.py  # provider chain
│   │       ├── parser.py            # normalize payloads
│   │       ├── merger.py            # merge + sort + date-keeping rules
│   │       ├── store.py             # data/profile.json persistence
│   │       ├── generator.py         # rewrites cvData.js files
│   │       └── helpers.py
│   ├── scripts/sync.py          # CLI: python scripts/sync.py [--import x.json]
│   ├── tests/test_api.py        # in-process endpoint tests
│   ├── data/profile.json        # merged snapshot (source of truth)
│   ├── requirements.txt
│   └── .env.example
├── frontend/                    # Vite React app (deployed by Vercel)
│   ├── src/components/sections/ # Hero About Skills Projects Experience Education Contact
│   ├── src/hooks/useLiveSync.js # runtime overlay from GET /api/portfolio
│   └── src/content/cvData.js    # AUTO-GENERATED on every sync
├── src/                         # legacy dark-theme mirror of frontend/src
├── package.json                 # npm workspaces: ["frontend"] + dev/sync scripts
└── vercel.json
```

## Local Development

Use `npm.cmd` in PowerShell if `npm` is blocked by execution policy.

```powershell
npm.cmd install                  # includes venv bootstrap for the backend
npm.cmd run dev                  # Flask API (5000) + Vite dev server together
```

Open `http://localhost:5173/`. Backend endpoints:
`GET /api/health`, `GET /api/portfolio`, `POST /api/linkedin/sync`, `POST /api/linkedin/import`.

## Production Build

```powershell
npm.cmd run build                # builds frontend/dist via the workspace
```

## Deploy On Vercel

Recommended settings:

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `frontend/dist`
- Install Command: `npm install`

The included `vercel.json` rewrites all routes to `index.html` for the SPA.

## Edit Content

- Preferred: update your LinkedIn profile and run **one of the sync methods above**.
- Manual: edit `backend/data/profile.json` then run
  `backend\venv\Scripts\python.exe -c "import sys; sys.path.insert(0,'backend'); from app.services import store, generator; generator.generate(store.load())"`
- Global styles/theme: `tailwind.config.js`

