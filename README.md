# Prof. Dr. Vesselin Baev - Academic CV

A modern, responsive academic CV website for Prof. Dr. Vesselin Baev, Professor
of Bioinformatics and Vice Dean for Science and Research at the Faculty of
Biology, University of Plovdiv.

## What is included

- English academic profile based on the 2026 CV
- research areas, teaching and academic career timeline
- Scopus h-index, citation count and indexed-document count
- searchable and filterable publication list
- daily Scopus refresh through the official Elsevier APIs
- static GitHub Pages deployment
- downloadable PDF CV and social sharing preview

## Local preview

Requires Node.js 22 or newer.

```bash
npm install
npm run dev
```

The local site is available at `http://localhost:3000`.

## Verification

```bash
npm run build
npm run build:pages
npm test
```

`npm run build:pages` writes the GitHub Pages package to `out/`.

## GitHub setup

1. Create a public GitHub repository and push this project to its `main` branch.
2. Open **Settings → Pages** and select **GitHub Actions** as the source.
3. Open **Settings → Secrets and variables → Actions**.
4. Add the Elsevier developer key as `ELSEVIER_API_KEY`.
5. If Elsevier supplied an institutional token, add it as
   `ELSEVIER_INST_TOKEN`.
6. Run **Update Scopus data** manually once from the Actions tab.

The scheduled workflow runs daily at 03:07 in the `Europe/Sofia` timezone. It
updates `public/data/scopus.json`; a successful change automatically triggers a
new GitHub Pages deployment.

Never commit the Elsevier API key to this repository.
