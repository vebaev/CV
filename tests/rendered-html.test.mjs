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
  assert.match(html, /Research focus/);
  assert.match(html, /Tool development, Illumina\/ONT analysis/);
  assert.match(html, /Memberships/);
  assert.match(html, /AI-Governance, Use, and Impact/);
  assert.match(html, /Publications/);
  assert.match(html, /Vice Dean/);
  assert.match(html, /baev@uni-plovdiv\.bg/);
  assert.doesNotMatch(html, /Academic leadership/);
  assert.doesNotMatch(html, /codex-preview|SkeletonPreview|Starter Project/);
});

test("ships publication data, CV and social preview", async () => {
  const [data] = await Promise.all([
    readFile(new URL("../public/data/scopus.json", import.meta.url), "utf8"),
    access(new URL("../public/Vesselin-Baev-CV-2026.pdf", import.meta.url)),
    access(new URL("../public/og.png", import.meta.url)),
  ]);

  const scopus = JSON.parse(data);
  assert.equal(scopus.authorId, "12789511400");
  assert.ok(scopus.metrics.hIndex >= 15);
  assert.ok(scopus.metrics.citations >= 1193);
  assert.ok(scopus.metrics.documents >= scopus.publications.length);
  assert.ok(scopus.publications.length >= 20);
});
