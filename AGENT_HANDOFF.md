# Agent handoff

## Current state

The English academic CV website is implemented and ready for GitHub Pages.

- Main page: `app/page.tsx`
- Visual system: `app/globals.css`
- Baseline Scopus data: `public/data/scopus.json`
- Daily API updater: `scripts/update-scopus.mjs`
- GitHub workflows: `.github/workflows/`
- Static Pages output command: `npm run build:pages`

## Important decisions

- The Elsevier API key is never stored in the project. The workflow expects the
  GitHub Actions secret `ELSEVIER_API_KEY`.
- The schedule runs at 03:07 in `Europe/Sofia` to avoid peak scheduler load.
- The January 2026 CV export is used as safe fallback data until the first live
  API refresh.
- Scopus Search uses the `STANDARD` view so a regular Elsevier developer key can
  refresh the public metadata without an institutional subscription token.
- GitHub-hosted API calls use Scopus Search only because Author Retrieval views
  are entitlement-restricted from public runners. Total citations and h-index
  are calculated from each indexed document's live `citedby-count`, while the
  document total comes from the same Scopus response.
- Scopus Search is paginated in batches of 25 records, matching the regular
  developer-key service limit while still retrieving the complete publication
  list.
- Personal birth date, gender, street address and telephone are not displayed
  on the public page. The original PDF remains available through the CV download.
- The project supports both the local vinext preview and a standard Next.js
  static export for GitHub Pages.

## Repository and automation

The project is connected to `vebaev/CV` and has been pushed to `main`.
GitHub Pages is enabled, and the `ELSEVIER_API_KEY` Actions secret is configured.
The Pages deployment listens for both regular pushes and successful completion
of the Scopus workflow, because commits made with GitHub's workflow token do not
emit another push-triggered workflow.
