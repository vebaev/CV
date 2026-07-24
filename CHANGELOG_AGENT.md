# Agent changelog

## 2026-07-24

### Added

- Modern responsive English academic CV website using the University of Plovdiv
  blue and gold palette.
- Research profile, academic timeline, teaching, networks and contact sections.
- Scopus metrics and searchable, year-filterable publication list.
- January 2026 fallback dataset with h-index, citations and recent publications.
- Elsevier Author Retrieval and Scopus Search API updater.
- Daily 03:07 Europe/Sofia GitHub Actions schedule.
- GitHub Pages build and deployment workflow.
- Downloadable English CV PDF and custom social-preview image.
- Automated rendered-content and asset tests.

### Fixed

- Excluded Cloudflare-only starter files from the GitHub Pages type check.
- Removed starter loading preview, starter metadata and unused dependency.
- Reset publication pagination directly in filter handlers to satisfy React
  lint rules.

### Verification

- `npm run build` passed.
- `npm run build:pages` passed.
- `npm test` passed with 2 tests.
- `npm run lint` passed.
