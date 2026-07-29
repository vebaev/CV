# Recent Tools & Code Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a bilingual section 05 after Projects that presents the
book-figure-skill Zenodo release with direct GitHub and DOI actions.

**Architecture:** Extend the existing localized copy object and navigation in
`app/page.tsx`, then render one semantic affiliation-style section using the
site's existing numbered layout. Add only narrowly scoped action styling in
`app/globals.css`; keep the citation static and identical in both languages.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS, Node test runner, GitHub
Pages static export.

## Global Constraints

- Place the section immediately after Projects and before Contact.
- Use section number `05` and target id `tools-code`.
- Use `Recent Tools & Code` in English and `Инструменти и код` in Bulgarian.
- Use `Tools & Code` for the English navigation label.
- Keep the complete citation in English in both language modes.
- Link GitHub to `https://github.com/vebaev/book-figure-skill/`.
- Link DOI to `https://doi.org/10.5281/zenodo.21669810`.
- Open both external links in a new tab with `rel="noreferrer"`.
- Preserve the existing compact editorial visual system and mobile layout.
- Add no new dependency.

---

### Task 1: Section content, localization, and links

**Files:**
- Modify: `tests/rendered-html.test.mjs`
- Modify: `app/page.tsx`

**Interfaces:**
- Consumes: `siteCopy.en`, `siteCopy.bg`, `copy.nav`, and the existing
  `affiliations section-grid` section structure.
- Produces: `copy.nav.toolsCode: string`, `copy.toolsCode: string`, the
  `#tools-code` navigation target, and a rendered semantic section with
  `.tools-code-entry` and `.tools-code-actions`.

- [ ] **Step 1: Write the failing rendered-content tests**

Add these assertions to `server-renders the academic CV` after the Projects
assertions:

```js
assert.match(html, /href="#tools-code">Tools &amp; Code<\/a>/);
assert.match(html, /id="tools-code"/);
assert.match(html, /<span>05<\/span>[\s\S]*Recent Tools &amp; Code/);
assert.match(html, /Baev, V\. \(2026\)\./);
assert.match(
  html,
  /<em>vebaev\/book-figure-skill: Codex Skill for Molecular Biology Textbook Figures<\/em>/,
);
assert.match(html, /Version 1\.3\.0/);
assert.match(
  html,
  /href="https:\/\/github\.com\/vebaev\/book-figure-skill\/" target="_blank" rel="noreferrer"/,
);
assert.match(
  html,
  /href="https:\/\/doi\.org\/10\.5281\/zenodo\.21669810" target="_blank" rel="noreferrer"/,
);
assert.match(
  html,
  /id="projects"[\s\S]*id="tools-code"[\s\S]*id="contact"/,
);
```

Add these assertions to `ships publication data, CV and social preview` near
the other localization checks:

```js
assert.match(pageSource, /toolsCode: "Tools & Code"/);
assert.match(pageSource, /toolsCode: "Инструменти и код"/);
assert.match(pageSource, /toolsCode: "Recent Tools & Code"/);
assert.match(
  pageSource,
  /href="#projects"[\s\S]*\{copy\.nav\.projects\}[\s\S]*href="#tools-code"[\s\S]*\{copy\.nav\.toolsCode\}[\s\S]*href="#contact"/,
);
```

- [ ] **Step 2: Run the test to verify RED**

Run:

```bash
npm test
```

Expected: FAIL because `#tools-code`, `Tools & Code`, the citation, and the two
external links are not rendered.

- [ ] **Step 3: Add localized labels and navigation**

In both `siteCopy` language objects, add `toolsCode` to `nav` after `projects`:

```ts
toolsCode: "Tools & Code",
```

```ts
toolsCode: "Инструменти и код",
```

Add the standalone section label beside `memberships` and `projects`:

```ts
toolsCode: "Recent Tools & Code",
```

```ts
toolsCode: "Инструменти и код",
```

Insert the navigation link after Projects and before Contact:

```tsx
<a href="#tools-code" onClick={closeMenu}>{copy.nav.toolsCode}</a>
```

- [ ] **Step 4: Render the section after Projects**

Insert this section after the closing Projects section and before Contact:

```tsx
<section className="affiliations tools-code section-grid" id="tools-code">
  <div className="section-label">
    <span>05</span>
    <p>{copy.toolsCode}</p>
  </div>
  <div className="section-content">
    <div className="affiliation-row tools-code-entry">
      <span>GitHub</span>
      <div className="tools-code-body">
        <p>
          Baev, V. (2026).{" "}
          <em>
            vebaev/book-figure-skill: Codex Skill for Molecular Biology
            Textbook Figures
          </em>{" "}
          (Version 1.3.0). Zenodo.
        </p>
        <div className="tools-code-actions">
          <a
            href="https://github.com/vebaev/book-figure-skill/"
            target="_blank"
            rel="noreferrer"
          >
            GitHub <span aria-hidden="true">↗</span>
          </a>
          <a
            href="https://doi.org/10.5281/zenodo.21669810"
            target="_blank"
            rel="noreferrer"
          >
            DOI <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 5: Run the tests to verify GREEN**

Run:

```bash
npm test
```

Expected: all rendered-content tests PASS.

- [ ] **Step 6: Commit the content task**

```bash
git add app/page.tsx tests/rendered-html.test.mjs
git commit -m "Add recent tools section content"
```

---

### Task 2: Compact actions and responsive styling

**Files:**
- Modify: `tests/rendered-html.test.mjs`
- Modify: `app/globals.css`

**Interfaces:**
- Consumes: `.tools-code-entry`, `.tools-code-body`, and
  `.tools-code-actions` from Task 1.
- Produces: compact pill actions with visible focus, wrapping citation text,
  and a single-column mobile arrangement.

- [ ] **Step 1: Write the failing style-source tests**

Add these assertions to `ships publication data, CV and social preview`:

```js
assert.match(
  styleSource,
  /\.tools-code-actions\s*\{[\s\S]*display: flex[\s\S]*flex-wrap: wrap/,
);
assert.match(
  styleSource,
  /\.tools-code-actions a\s*\{[\s\S]*min-height: 38px[\s\S]*border-radius: 999px/,
);
assert.match(
  styleSource,
  /\.tools-code-actions a:focus-visible\s*\{[\s\S]*outline:/,
);
assert.match(
  styleSource,
  /@media \(max-width: 640px\)[\s\S]*\.tools-code-entry\s*\{[\s\S]*grid-template-columns: 1fr/,
);
assert.match(
  styleSource,
  /@media \(max-width: 1100px\) and \(min-width: 901px\)[\s\S]*nav a\s*\{[\s\S]*font-size: 12px/,
);
```

- [ ] **Step 2: Run the test to verify RED**

Run:

```bash
npm test
```

Expected: FAIL because the tools-code action and mobile selectors are absent.

- [ ] **Step 3: Add the minimal section styling**

Add after the existing `.affiliation-row p` rules:

```css
.tools-code-entry {
  align-items: start;
}

.tools-code-body {
  min-width: 0;
}

.tools-code-body p {
  margin: 0;
}

.tools-code-body em {
  color: var(--blue-deep);
}

.tools-code-actions {
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tools-code-actions a {
  min-height: 38px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--blue);
  background: rgba(255, 255, 255, 0.62);
  border: 1px solid rgba(11, 35, 121, 0.22);
  border-radius: 999px;
  font-size: 12px;
  font-weight: 750;
  transition:
    color 180ms ease,
    background 180ms ease,
    border-color 180ms ease,
    transform 180ms ease;
}

.tools-code-actions a:hover {
  color: var(--blue-deep);
  background: var(--gold-pale);
  border-color: var(--gold);
  transform: translateY(-1px);
}

.tools-code-actions a:focus-visible {
  outline: 2px solid var(--blue);
  outline-offset: 2px;
}
```

Within the existing `@media (max-width: 640px)` block, add:

```css
.tools-code-entry {
  grid-template-columns: 1fr;
}
```

Within the existing
`@media (max-width: 1100px) and (min-width: 901px)` block, compact the expanded
navigation:

```css
.site-header {
  padding-inline: 24px;
}

nav {
  gap: 10px;
}

nav a {
  font-size: 12px;
}
```

- [ ] **Step 4: Run the tests to verify GREEN**

Run:

```bash
npm test
```

Expected: all tests PASS.

- [ ] **Step 5: Run lint**

Run:

```bash
npm run lint
```

Expected: exit code 0 with no ESLint errors.

- [ ] **Step 6: Commit the styling task**

```bash
git add app/globals.css tests/rendered-html.test.mjs
git commit -m "Style recent tools actions"
```

---

### Task 3: Documentation, static build, and publication

**Files:**
- Modify: `AGENT_HANDOFF.md`
- Modify: `CHANGELOG_AGENT.md`

**Interfaces:**
- Consumes: the completed section, tests, and styles from Tasks 1–2.
- Produces: current project handoff notes, verified GitHub Pages output, and a
  successful deployment on `main`.

- [ ] **Step 1: Update project documentation**

Add to `AGENT_HANDOFF.md`:

```markdown
- Recent Tools & Code follows Projects as section 05 and is available from the
  bilingual top navigation. Its first entry is the English Zenodo citation for
  `vebaev/book-figure-skill` version 1.3.0, with separate GitHub and DOI links.
```

Add a `2026-07-29` entry to `CHANGELOG_AGENT.md`:

```markdown
## 2026-07-29

### Added

- Bilingual Recent Tools & Code / Инструменти и код navigation and section 05.
- Zenodo citation for book-figure-skill version 1.3.0 with GitHub and DOI
  actions.
```

- [ ] **Step 2: Run the full verification gate**

Run:

```bash
npm test
npm run lint
npm run build:pages
git diff --check
git status --short --branch
```

Expected: all four tests pass with zero failures, lint exits 0, the Next.js
static export completes, `git diff --check` emits no errors, and only the
intended documentation files remain uncommitted.

- [ ] **Step 3: Commit documentation**

```bash
git add AGENT_HANDOFF.md CHANGELOG_AGENT.md
git commit -m "Document recent tools section"
```

- [ ] **Step 4: Confirm final scope**

Run:

```bash
git status --short --branch
git log --oneline origin/main..HEAD
```

Expected: clean working tree and only the design, plan, content, styling, and
documentation commits are ahead of `origin/main`.

- [ ] **Step 5: Push and verify deployment**

Run:

```bash
git push origin main
```

Expected: the remote `main` branch advances successfully. Check the workflow
run for the pushed HEAD commit and confirm `Deploy CV to GitHub Pages` reaches
`completed` with conclusion `success`.
