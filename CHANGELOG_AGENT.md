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
- Removed unused starter icons and illustration assets.
- Reset publication pagination directly in filter handlers to satisfy React
  lint rules.
- Enabled automatic GitHub Pages activation for a newly created repository.
- Switched the Scopus Search request to the API-key-compatible `STANDARD` view
  after Elsevier rejected the subscription-only `COMPLETE` view.
- Paginated Scopus Search in batches of 25 after the regular developer-key
  service rejected the previous 200-record request.
- Switched Author Retrieval from the restricted `ENHANCED` view to the public
  `METRICS` view while retaining document, citation and h-index values.
- Removed the still-entitlement-restricted Author Retrieval call for public
  GitHub runners; metrics are now derived from the complete live Scopus Search
  result set.
- Triggered Pages deployment after every successful Scopus workflow, including
  data commits made with GitHub's workflow token.

### Verification

- `npm run build` passed.
- `npm run build:pages` passed.
- `npm test` passed with 2 tests.
- `npm run lint` passed.
- Live Scopus refresh passed with 58 documents, h-index 16 and 1,266 citations.
- The successful Scopus workflow triggered and completed a subsequent GitHub
  Pages deployment.
