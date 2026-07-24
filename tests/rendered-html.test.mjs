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
  assert.match(html, /About me/);
  assert.match(html, /English/);
  assert.match(html, /French/);
  assert.match(html, /Russian/);
  assert.match(html, /Japanese/);
  assert.match(html, /Research focus/);
  assert.match(html, /Tool and Workflow Development/);
  assert.match(html, /AI Models in Bioinformatics/);
  assert.match(html, /Tool development/);
  assert.match(html, /Illumina\/ONT analysis/);
  assert.match(html, /AI bioinformatics solutions/);
  assert.match(html, /Memberships/);
  assert.match(html, /AI-Governance, Use, and Impact/);
  assert.match(html, /Publications/);
  assert.match(html, /Vice Dean/);
  assert.match(html, /baev@uni-plovdiv\.bg/);
  assert.match(html, /tel:\+35932261560/);
  assert.match(html, /imessage:\/\/vebaev@gmail\.com/);
  assert.match(html, /Prof\. Dr\. Vesselin Baev in Tokyo/);
  assert.match(html, /35\.6762° N/);
  assert.match(html, /139\.6503° E/);
  assert.doesNotMatch(html, /Download CV/);
  assert.doesNotMatch(html, /hero-monogram/);
  assert.doesNotMatch(html, /Academic leadership/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|Starter Project/);
});

test("ships publication data, CV and social preview", async () => {
  const [data] = await Promise.all([
    readFile(new URL("../public/data/scopus.json", import.meta.url), "utf8"),
    access(new URL("../public/Vesselin-Baev-CV-2026.pdf", import.meta.url)),
    access(new URL("../public/Vesselin-Baev-Tokyo.jpg", import.meta.url)),
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
});
