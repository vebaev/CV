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
- Separate About me section with five-step language scales for English, French,
  Russian and Japanese.
- Research directions for tool/workflow development and AI models in
  bioinformatics.
- Crossref author enrichment for complete author lists on Scopus publications.
- Rate-limit retries, paced author requests and publisher metadata fallback for
  DOI records not available through Crossref.
- Verified author override for the legacy book chapter DOI
  `10.1201/b16675-40`, whose DOI metadata omits authors.
- User-provided Tokyo portrait as the hero profile photograph.
- Direct telephone and iMessage contact links.
- English University of Plovdiv Faculty of Biology address above the contact
  links.
- Circular English and Bulgarian flag controls before the About navigation
  item.
- Complete Bulgarian localization for the static CV interface and content.
- Projects section for the EU ITN Marie Skłodowska-Curie ELBA grant agreement
  765492 (2018–2023).
- Localized Memberships and Projects links in the main navigation.
- Search-engine discovery files for sitemap and crawler guidance.
- Canonical, explicit indexing, author and publisher metadata.
- JSON-LD `WebSite`, `ProfilePage` and `Person` entities linking the verified
  Scopus, ORCID, University of Plovdiv, ResearchGate and Frontiers profiles.
- Google Search Console HTML verification metadata for the canonical URL-prefix
  property.
- Verified Google Search Console ownership, submitted `/CV/sitemap.xml` and
  requested priority indexing for the canonical homepage.
- Responsive SVG browser favicon with a `VB` monogram in the site's deep blue
  and gold palette.
- Global Simple Analytics tracking script for privacy-friendly visitor
  statistics on the published CV.

### Changed

- Removed the repeated `Prof. Dr. Vesselin Baev` line from the hero after the
  Professor of Bioinformatics label and promoted the editorial science
  statement to the semantic `h1`.
- Reworked the desktop and mobile visual scale into a compact editorial CV
  layout with smaller display type, tighter section spacing and denser cards.
- Refined the hero hierarchy with the full `Prof. Dr. Vesselin Baev` name,
  larger Professor and Vice Dean labels, and a smaller main statement.
- Increased the Scopus profile update label for improved readability.
- Merged the About copy and research cards into one `Research focus` section.
- Renamed Networks to Memberships and renumbered the remaining profile sections.
- Replaced the Academic leadership membership row with EU COST AI-GUIDE
  CA25157.
- Added tool development, Illumina/ONT analysis and AI bioinformatics
  solutions to Teaching.
- Redesigned Research focus as a six-card light section matching the Academic
  career background.
- Reduced the VB hero panel and removed the CV download button.
- Replaced the VB hero monogram with the user portrait, preserving the arch
  shape and adding a gold-edged text treatment for contrast.
- Replaced the first Tokyo portrait with the revised 1043 × 931 image and
  widened the arch to the photograph's natural aspect ratio.
- Updated the hero coordinates from Plovdiv to Tokyo.
- Reduced the revised portrait arch from 510 px to 400 px so its height aligns
  with the hero copy, and changed the asset filename to invalidate the previous
  browser cache.
- Hid the Gmail address from the visible iMessage button while preserving the
  direct iMessage target.
- Changed publication pagination from eight to five records per batch.
- Set English as the default language while enabling instant client-side
  switching to Bulgarian.
- Kept publication records and EU COST membership names in their original
  language in both interface modes.
- Added a localized Projects/Проекти heading after Memberships while preserving
  the official English EU ITN grant record in both language modes.
- Moved the English and Bulgarian flag controls after Contact in the header and
  added direct anchors for the Memberships and Projects sections.
- Changed the English section 01 heading from `reproducible biological insight`
  to `reproducible biological insights`.
- Promoted the full academic name to the page's visible semantic `h1` and kept
  the editorial science statement as a supporting `h2`.
- Refined the Bulgarian Vice Dean, About and Teaching wording and changed
  French proficiency from 4/5 to 3/5 in both languages.
- Standardized Professor, Associate Professor and Assistant Professor
  affiliations to Department of Molecular Biology, University of Plovdiv.
- Split Tool development, Illumina/ONT analysis and AI bioinformatics solutions
  into separate Teaching entries.
- Moved AI-GUIDE CA25157 to the first Memberships position.
- Allowed publication author lists to wrap over multiple lines without
  truncation.
- Increased small metadata text for better balance and readability.
- Reduced the measured 1280 px desktop page height from about 6,694 px to
  4,787 px while preserving all content and interactions.
- Updated the Scopus data test to accept current and future automated metric
  increases instead of locking the original h-index value.

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
- Compact responsive layout was visually inspected at desktop size.
- The updated hero and merged Research focus section were visually inspected at
  1280 × 720; the resulting page height is 4,740 px.
- Rendered-content tests cover the full name, Teaching addition, Memberships,
  AI-GUIDE and removal of Academic leadership.
- Rendered-content tests cover About me, all four languages, the two new
  research directions, separate Teaching entries and removal of the CV button.
- Rendered-content and asset tests cover the portrait, telephone, iMessage link
  and removal of the hero monogram.
- Rendered-content tests cover the Tokyo latitude and longitude.
- Tests cover the English address, hidden iMessage email label, versioned
  portrait asset and five-record publication pagination.
- Tests cover both flag controls, English default state, Bulgarian copy and
  circular language-control styling.
- Tests cover the Projects section, EU ITN label, ELBA grant agreement and
  Bulgarian section heading.
- Tests cover the new Memberships and Projects navigation links, their section
  anchors and the placement of the language controls after Contact.
- Tests cover the plural `insights` wording in the English section 01 heading.
- Tests cover the canonical URL, index/follow directives, JSON-LD identity
  graph, verified researcher identifiers, sitemap and crawler guidance.
- Tests cover the persistent Google Search Console verification marker.
- Confirmed the verification marker and sitemap return HTTP 200 on the public
  site before completing ownership verification and the indexing request.
- The Crossref enrichment endpoint returned five complete author records for a
  live DOI test.
- Desktop page height was reduced by approximately 28%.
- Live Scopus refresh passed with 58 documents, h-index 16 and 1,266 citations.
- The successful Scopus workflow triggered and completed a subsequent GitHub
  Pages deployment.
