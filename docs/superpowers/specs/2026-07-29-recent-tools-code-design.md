# Recent Tools & Code section design

## Goal

Add a fifth numbered profile section immediately after Projects to present
recently released scientific tools and source code without changing the compact
editorial character of the CV.

## Navigation and localization

- Add a top-navigation link immediately after Projects and before Contact.
- Use `Tools & Code` in English and `Инструменти и код` in Bulgarian.
- The link targets `#tools-code`.
- Use `Recent Tools & Code` as the English section heading and `Инструменти и
  код` as the Bulgarian section heading.
- Keep the bibliographic record and product metadata in English in both
  language modes, matching the treatment of Projects and Memberships records.

## Section structure

- Place the section immediately after the existing Projects section.
- Number it `05`.
- Reuse the gold affiliation-row visual language used by Memberships and
  Projects.
- Display one entry with the category label `GitHub`.
- Display this complete citation:
  `Baev, V. (2026). vebaev/book-figure-skill: Codex Skill for Molecular Biology
  Textbook Figures (Version 1.3.0). Zenodo.`
- Render the work title in italics.

## Links

- Provide two distinct, keyboard-accessible external links:
  - `GitHub` → `https://github.com/vebaev/book-figure-skill/`
  - `DOI` → `https://doi.org/10.5281/zenodo.21669810`
- Open both links in a new tab and use safe external-link relationship
  attributes.
- Present the links as compact actions aligned with the citation rather than
  embedding long raw URLs in the visible text.

## Responsive behavior

- Preserve the current two-column numbered-section layout on larger screens.
- Follow the existing single-column affiliation-row layout on small screens.
- Allow the full citation to wrap naturally without truncation.
- Keep both actions large enough for touch use and allow them to wrap below the
  citation when horizontal space is limited.

## Accessibility

- Use a semantic section with `id="tools-code"`.
- Use the existing section heading hierarchy.
- Include visible link labels and external-link indicators that do not replace
  accessible link text.
- Preserve adequate blue/gold contrast and visible keyboard focus behavior.

## Verification

- Add rendered-content checks for the new navigation labels, section anchor,
  number, title, version, Zenodo DOI, GitHub URL and bilingual heading.
- Verify the section appears after Projects and before Publications in the
  rendered source.
- Run the full site tests, lint, and GitHub Pages static build before
  publishing.

## Publishing

- Commit the implementation to the existing `main` branch and push it to
  `vebaev/CV`.
- Confirm the GitHub Pages deployment workflow completes successfully.
