import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the academic CV", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Prof\. Dr\. Vesselin Baev \| Bioinformatics<\/title>/i);
  assert.match(html, /Science at the/);
  assert.match(html, /Research impact/);
  assert.match(html, /Prof\. Dr\. Vesselin Baev/);
  assert.doesNotMatch(html, /class="hero-name"/);
  assert.match(html, /<h1 class="hero-statement">Science at the/);
  assert.match(
    html,
    /<link rel="canonical" href="https:\/\/vebaev\.github\.io\/CV\/"/,
  );
  assert.match(html, /<meta name="robots" content="index, follow"/);
  assert.match(
    html,
    /<meta name="google-site-verification" content="s9kurQRjRr4wko5MR_T46vzil5lP4sFkzGqaAjXbDfg"/,
  );
  assert.match(html, /application\/ld\+json/);
  assert.match(html, /https:\/\/schema\.org/);
  assert.match(html, /ProfilePage/);
  assert.match(html, /0000-0002-5224-9145/);
  assert.match(html, /12789511400/);
  assert.match(html, /🇬🇧/);
  assert.match(html, /🇧🇬/);
  assert.match(html, /About me/);
  assert.match(html, /English/);
  assert.match(html, /French/);
  assert.match(html, /Russian/);
  assert.match(html, /Japanese/);
  assert.match(html, /Research focus/);
  assert.match(
    html,
    /From sequencing data to reproducible biological insights\./,
  );
  assert.doesNotMatch(
    html,
    /From sequencing data to reproducible biological insight\./,
  );
  assert.match(html, /Tool and Workflow Development/);
  assert.match(html, /AI Models in Bioinformatics/);
  assert.match(html, /Tool development/);
  assert.match(html, /Illumina\/ONT analysis/);
  assert.match(html, /AI bioinformatics solutions/);
  assert.match(html, /Memberships/);
  assert.match(html, /href="#memberships">Memberships<\/a>/);
  assert.match(html, /AI-Governance, Use, and Impact/);
  assert.match(html, /Projects/);
  assert.match(html, /href="#projects">Projects<\/a>/);
  assert.match(html, /EU ITN/);
  assert.match(
    html,
    /Marie Skłodowska-Curie Grant agreement ID: ELBA 765492/,
  );
  assert.match(html, /2018–2023/);
  assert.match(html, /Publications/);
  assert.match(html, /Vice Dean/);
  assert.match(html, /baev@uni-plovdiv\.bg/);
  assert.match(html, /tel:\+35932261560/);
  assert.match(html, /imessage:\/\/vebaev@gmail\.com/);
  assert.doesNotMatch(html, /iMessage · vebaev@gmail\.com/);
  assert.match(html, /Paisii Hilendarski University of Plovdiv/);
  assert.match(html, /Faculty of Biology/);
  assert.match(html, /2 Todor Samodumov Street/);
  assert.match(html, /4000 Plovdiv, Bulgaria/);
  assert.match(html, /Prof\. Dr\. Vesselin Baev in Tokyo/);
  assert.match(html, /35\.6762° N/);
  assert.match(html, /139\.6503° E/);
  assert.doesNotMatch(html, /Download CV/);
  assert.doesNotMatch(html, /hero-monogram/);
  assert.doesNotMatch(html, /Academic leadership/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|Starter Project/);
});

test("ships publication data, CV and social preview", async () => {
  const [data, pageSource, styleSource] = await Promise.all([
    readFile(new URL("../public/data/scopus.json", import.meta.url), "utf8"),
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    access(new URL("../public/Vesselin-Baev-CV-2026.pdf", import.meta.url)),
    access(new URL("../public/Vesselin-Baev-Tokyo-2026.jpg", import.meta.url)),
    access(new URL("../public/og.png", import.meta.url)),
  ]);

  const scopus = JSON.parse(data);
  assert.equal(scopus.authorId, "12789511400");
  assert.ok(scopus.metrics.hIndex >= 15);
  assert.ok(scopus.metrics.citations >= 1193);
  assert.ok(scopus.metrics.documents >= scopus.publications.length);
  assert.ok(scopus.publications.length >= 20);
  assert.ok(
    scopus.publications.filter((publication) =>
      publication.authors.includes(","),
    ).length >= 50,
  );
  assert.equal(
    scopus.publications.find(
      (publication) => publication.doi === "10.1201/b16675-40",
    )?.authors,
    "Galina Yahubyan, Elena Apostolova, Ivan Minkov, Vesselin Baev",
  );
  assert.match(pageSource, /const \[visible, setVisible\] = useState\(5\)/);
  assert.match(pageSource, /setVisible\(\(count\) => count \+ 5\)/);
  assert.match(
    pageSource,
    /const \[language, setLanguage\] = useState<SiteLanguage>\("en"\)/,
  );
  assert.match(pageSource, /aria-label="English"/);
  assert.match(pageSource, /aria-label="Български"/);
  assert.match(pageSource, /Научни интереси/);
  assert.match(pageSource, /projects: "Проекти"/);
  assert.match(pageSource, /memberships: "Членства"/);
  assert.match(
    pageSource,
    /href="#contact"[\s\S]*\{copy\.nav\.contact\}[\s\S]*className="language-switcher"/,
  );
  assert.match(pageSource, /id="memberships"/);
  assert.match(pageSource, /id="projects"/);
  assert.match(pageSource, /Пловдивски университет „Паисий Хилендарски“/);
  assert.match(pageSource, /Научноизследователската дейност/);
  assert.match(pageSource, /statementBefore: "Мостове между"/);
  assert.match(pageSource, /\{ name: "French", level: 3 \}/);
  assert.match(pageSource, /\{ name: "Френски", level: 3 \}/);
  assert.match(
    pageSource,
    /Обучаване на биолози да прилагат изчислителни подходи\./,
  );
  assert.match(styleSource, /\.language-toggle\s*\{[\s\S]*border-radius: 50%/);
});

test("ships search-engine discovery metadata", async () => {
  const [layoutSource, robotsSource, sitemapSource, siteSource] =
    await Promise.all([
      readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
      readFile(new URL("../app/robots.ts", import.meta.url), "utf8"),
      readFile(new URL("../app/sitemap.ts", import.meta.url), "utf8"),
      readFile(new URL("../lib/site.ts", import.meta.url), "utf8"),
    ]);

  assert.match(siteSource, /https:\/\/vebaev\.github\.io\/CV\//);
  assert.match(layoutSource, /alternates:\s*\{\s*canonical: SITE_URL/);
  assert.match(
    layoutSource,
    /google: "s9kurQRjRr4wko5MR_T46vzil5lP4sFkzGqaAjXbDfg"/,
  );
  assert.match(layoutSource, /ProfilePage/);
  assert.match(layoutSource, /"@type": "Person"/);
  assert.match(layoutSource, /"@type": "WebSite"/);
  assert.match(layoutSource, /0000-0002-5224-9145/);
  assert.match(layoutSource, /12789511400/);
  assert.match(robotsSource, /userAgent: "\*"/);
  assert.match(robotsSource, /allow: "\/"/);
  assert.match(robotsSource, /sitemap\.xml/);
  assert.match(sitemapSource, /changeFrequency: "daily"/);
  assert.match(sitemapSource, /priority: 1/);
});
