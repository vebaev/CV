# Agent handoff

## Current state

The bilingual English/Bulgarian academic CV website is implemented and ready
for GitHub Pages.

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
- The canonical public URL is `https://vebaev.github.io/CV/`. The static export
  includes `/CV/sitemap.xml`, `/CV/robots.txt`, explicit index/follow metadata
  and large image/snippet permissions for Googlebot.
- The browser favicon is `public/favicon.svg`: a compact `VB` monogram using the
  site's deep blue `#07164f`, gold `#b48d3b` and pale gold `#efe5cc`.
- Simple Analytics is loaded globally from
  `https://scripts.simpleanalyticscdn.com/latest.js` immediately after the page
  content and before the closing body tag in `app/layout.tsx`. Because React
  hoists async scripts into the document head during static export,
  `scripts/place-simple-analytics.mjs` moves the generated tag back immediately
  before `</body>` as the final step of `npm run build:pages`.
- The homepage permanently retains the Google Search Console HTML verification
  meta tag for the URL-prefix property `https://vebaev.github.io/CV/`.
- The URL-prefix property is verified in Google Search Console under the user's
  University of Plovdiv Google account. `/CV/sitemap.xml` was submitted and the
  homepage was added to Google's priority crawl queue on 24 July 2026. Search
  Console initially reported `Couldn't fetch` for the newly submitted sitemap
  even though a Googlebot-style public request returned HTTP 200 with valid XML;
  recheck after Google's first processing cycle.
- The page includes JSON-LD `WebSite`, `ProfilePage` and `Person` entities with
  verified Scopus Author ID `12789511400`, ORCID `0000-0002-5224-9145`, the
  official University of Plovdiv profile, ResearchGate and Frontiers Loop.
- English is the default language on every new page load. Two circular flag
  buttons after Contact in the main navigation switch the client-rendered
  interface between English and Bulgarian and update the document language and
  title.
- Static CV copy, navigation, metrics, filters, contact details and
  accessibility labels are localized. Scopus publication titles, authors,
  journals and types, the three EU COST membership names and the EU ITN project
  record remain in their original language.
- The Bulgarian hero role is `Научноизследователска дейност` and uses a
  smaller language-specific overlay size so it stays on one line; the About
  statement begins `Мостове между`, and the Teaching introduction uses
  `Обучаване на биолози да прилагат изчислителни подходи`.
- The visual system uses a compact editorial scale: a 72 px desktop header,
  restrained 42–60 px hero display type, 58–80 px section spacing, denser
  research cards and bibliography-style publication rows.
- About me is a separate profile section with a five-step visual language
  scale. The numbered content flow remains Research focus, Academic career,
  Memberships, Projects and Recent Tools & Code. French proficiency is 3/5 and
  Japanese proficiency is 2/5 in both language modes.
- Research focus uses the same light background as Academic career and a
  six-card layout covering NGS, non-coding RNAs, microbial genomics,
  multi-omics, tool/workflow development and AI models in bioinformatics.
- The English Research focus heading uses the plural phrase `reproducible
  biological insights`.
- The header uses the full `Prof. Dr. Vesselin Baev` name. Professor, Vice Dean
  and the Scopus update label have stronger type hierarchy than supporting copy.
  The Scopus update label shows the date and 24-hour time in `Europe/Sofia`.
- The gold timeline dot for the current `Professor of Bioinformatics` role in
  Academic career pulses subtly. The hero label remains static, and the
  timeline animation is disabled when the visitor prefers reduced motion.
- The hero no longer repeats `Prof. Dr. Vesselin Baev` after the Professor of
  Bioinformatics label. The editorial science statement is the semantic `h1`;
  the full name remains prominent in the fixed header and in all SEO metadata.
- The hero actions contain the primary Publications anchor and a secondary
  external GitHub button linking to `https://github.com/vebaev`. The primary
  Publications anchor uses a down-right arrow to indicate its on-page target.
- The hero includes a decorative neural-network field between the copy and
  portrait. Fourteen softly drifting nodes retain local connectivity while
  18–21 links fade out and re-form at randomized 4.8–7.2 second intervals.
  Link geometry follows the moving node centers. The field is hidden on small
  phones and becomes static when reduced motion is preferred.
- The hero panel is intentionally smaller than the text column and uses
  `public/Vesselin-Baev-Tokyo-2026.jpg` inside the existing arch shape. The VB
  monogram and CV download button have been removed. A dark lower gradient and
  subtle gold text strokes preserve the role text over the photograph. The
  current portrait is 1043 × 931 px; the desktop arch uses the same aspect ratio
  at up to 400 px wide so its height aligns with the adjacent text. The versioned
  filename prevents browsers from retaining the previous portrait.
- The decorative hero coordinates are for Tokyo: `35.6762° N, 139.6503° E`.
- Contact links list the institutional email, telephone and an iMessage link to
  `vebaev@gmail.com` before the institutional and Scopus links. The Gmail
  address remains in the link target but is hidden from the visible iMessage
  label. The Faculty address above the contact buttons follows the selected
  interface language.
- Memberships lists AI-GUIDE CA25157 first, followed by BM1006, FA1407 and the
  CIMB Editorial Board, Bioinformatics and Systems Biology Section. The CIMB
  entry uses the same regular text weight throughout.
- Projects follows Memberships as section 04 in the same gold row style. It
  lists the EU ITN Marie Skłodowska-Curie ELBA grant agreement 765492
  (2018–2023); only the section heading is localized.
- Recent Tools & Code follows Projects as section 05 and is available from the
  bilingual top navigation. It includes the English Zenodo citation for
  `vebaev/book-figure-skill` version 1.3.0 and the 2026 PROBEAT toolkit article,
  with both rows labeled `GitHub` and separate documentation or repository and
  DOI actions for each entry.
- Memberships, Projects and Recent Tools & Code are available as localized
  top-navigation links with direct anchors to their numbered sections.
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
- Publications initially show five records and reveal five more per request.

## Repository and automation

The project is connected to `vebaev/CV` and has been pushed to `main`.
GitHub Pages is enabled, and the `ELSEVIER_API_KEY` Actions secret is configured.
The Pages deployment listens for both regular pushes and successful completion
of the Scopus workflow, because commits made with GitHub's workflow token do not
emit another push-triggered workflow.
