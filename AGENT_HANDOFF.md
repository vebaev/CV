# Agent handoff

## Current state

The English academic CV website is implemented and ready for GitHub Pages.

- Live site: `https://vebaev.github.io/CV/`
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
- Personal birth date, gender and street address are not displayed on the
  public page. The user explicitly approved the public contact telephone
  `+359 32 261 560`. The original PDF remains in the static assets but is no
  longer linked from the hero.
- The project supports both the local vinext preview and a standard Next.js
  static export for GitHub Pages.
- The visual system uses a compact editorial scale: a 72 px desktop header,
  restrained 42–60 px hero display type, 58–80 px section spacing, denser
  research cards and bibliography-style publication rows.
- About me is a separate profile section with a five-step visual language
  scale. The numbered content flow remains Research focus, Academic career and
  Memberships.
- Research focus uses the same light background as Academic career and a
  six-card layout covering NGS, non-coding RNAs, microbial genomics,
  multi-omics, tool/workflow development and AI models in bioinformatics.
- The header uses the full `Prof. Dr. Vesselin Baev` name. Professor, Vice Dean
  and the Scopus update label have stronger type hierarchy than supporting copy.
- The hero panel is intentionally smaller than the text column and uses
  `public/Vesselin-Baev-Tokyo.jpg` inside the existing arch shape. The VB
  monogram and CV download button have been removed. A dark lower gradient and
  subtle gold text strokes preserve the role text over the photograph.
- Contact links list the institutional email, telephone and an iMessage link to
  `vebaev@gmail.com` before the institutional and Scopus links.
- Memberships lists AI-GUIDE CA25157 first, followed by BM1006 and FA1407.
- Teaching lists tool development, Illumina/ONT analysis and AI bioinformatics
  solutions as separate entries.
- The daily updater keeps the publication set and metrics sourced from Scopus,
  then enriches each DOI with Crossref author metadata so all available authors
  are shown. Crossref calls are paced and retried on rate limits; a publisher
  page metadata fallback covers DOIs without a Crossref record. The author text
  wraps instead of being truncated. The legacy chapter DOI
  `10.1201/b16675-40`, which exposes no author metadata through either source,
  has a verified four-author override.
- The verified live Scopus snapshot contains 58 documents, h-index 16 and 1,266
  citations as of 24 July 2026.

## Repository and automation

The project is connected to `vebaev/CV` and has been pushed to `main`.
GitHub Pages is enabled, and the `ELSEVIER_API_KEY` Actions secret is configured.
The Pages deployment listens for both regular pushes and successful completion
of the Scopus workflow, because commits made with GitHub's workflow token do not
emit another push-triggered workflow.
