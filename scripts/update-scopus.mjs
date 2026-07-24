import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const AUTHOR_ID = "12789511400";
const API_ROOT = "https://api.elsevier.com/content";
const outputPath = resolve("public/data/scopus.json");
const tempPath = `${outputPath}.tmp`;
const apiKey = process.env.ELSEVIER_API_KEY;
const instToken = process.env.ELSEVIER_INST_TOKEN;

if (!apiKey) {
  throw new Error("ELSEVIER_API_KEY is required");
}

const headers = {
  Accept: "application/json",
  "X-ELS-APIKey": apiKey,
};

if (instToken) {
  headers["X-ELS-Insttoken"] = instToken;
}

async function fetchJson(url) {
  const response = await fetch(url, { headers });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `Scopus request failed (${response.status}): ${detail.slice(0, 240)}`,
    );
  }
  return response.json();
}

function text(value, fallback = "") {
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  return fallback;
}

function number(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function normalizeAuthors(entry) {
  const authors = Array.isArray(entry.author) ? entry.author : [];
  if (authors.length) {
    return authors
      .map((author) => author.authname || author["ce:indexed-name"])
      .filter(Boolean)
      .join(", ");
  }
  return text(entry["dc:creator"], "Vesselin Baev et al.");
}

function normalizePublication(entry) {
  const date = text(entry["prism:coverDate"]);
  return {
    title: text(entry["dc:title"], "Untitled publication"),
    authors: normalizeAuthors(entry),
    year: number(date.slice(0, 4)),
    journal: text(entry["prism:publicationName"], "Scopus indexed publication"),
    doi: text(entry["prism:doi"]) || undefined,
    citations: number(entry["citedby-count"]),
    type: text(entry.subtypeDescription || entry.subtype, "Publication"),
  };
}

const authorUrl =
  `${API_ROOT}/author/author_id/${AUTHOR_ID}` +
  "?view=ENHANCED&httpAccept=application%2Fjson";
const searchUrl =
  `${API_ROOT}/search/scopus` +
  `?query=AU-ID%28${AUTHOR_ID}%29&view=COMPLETE&count=200&sort=-coverDate` +
  "&httpAccept=application%2Fjson";

const [authorPayload, searchPayload] = await Promise.all([
  fetchJson(authorUrl),
  fetchJson(searchUrl),
]);

const authorRecord = authorPayload["author-retrieval-response"]?.[0];
const core = authorRecord?.coredata;
const entries = searchPayload["search-results"]?.entry;

if (!core || !Array.isArray(entries) || entries.length === 0) {
  throw new Error("Scopus returned an incomplete author profile");
}

const publications = entries
  .filter((entry) => !entry.error)
  .map(normalizePublication)
  .filter((entry) => entry.year > 1900)
  .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));

const previous = JSON.parse(await readFile(outputPath, "utf8"));
const next = {
  authorId: AUTHOR_ID,
  updatedAt: new Date().toISOString(),
  source: "Elsevier Scopus APIs",
  metrics: {
    hIndex: number(core["h-index"], previous.metrics.hIndex),
    citations: number(core["citation-count"], previous.metrics.citations),
    documents: number(
      core["document-count"],
      number(searchPayload["search-results"]?.["opensearch:totalResults"], publications.length),
    ),
  },
  publications,
};

await mkdir(dirname(outputPath), { recursive: true });
await writeFile(tempPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
await rename(tempPath, outputPath);

console.log(
  `Updated Scopus data: ${next.metrics.documents} documents, h-index ${next.metrics.hIndex}, ${next.metrics.citations} citations.`,
);
