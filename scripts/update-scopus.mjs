import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

const AUTHOR_ID = "12789511400";
const API_ROOT = "https://api.elsevier.com/content";
const CROSSREF_API_ROOT = "https://api.crossref.org/works";
const CROSSREF_CONCURRENCY = 1;
const CROSSREF_REQUEST_DELAY_MS = 250;
const CROSSREF_RETRY_LIMIT = 4;
const AUTHOR_OVERRIDES = new Map([
  [
    "10.1201/b16675-40",
    "Galina Yahubyan, Elena Apostolova, Ivan Minkov, Vesselin Baev",
  ],
]);
const SEARCH_PAGE_SIZE = 25;
const SEARCH_RESULT_LIMIT = 5000;
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

async function fetchJson(url, requestHeaders = headers) {
  const response = await fetch(url, { headers: requestHeaders });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(
      `Request failed (${response.status}): ${detail.slice(0, 240)}`,
    );
  }
  return response.json();
}

function sleep(milliseconds) {
  return new Promise((resolvePromise) =>
    setTimeout(resolvePromise, milliseconds),
  );
}

function crossrefAuthorName(author) {
  const literal = text(author.name).trim();
  const given = text(author.given).trim();
  const family = text(author.family).trim();
  return [given, family].filter(Boolean).join(" ") || literal;
}

async function crossrefAuthors(doi) {
  for (let attempt = 0; attempt < CROSSREF_RETRY_LIMIT; attempt += 1) {
    const response = await fetch(
      `${CROSSREF_API_ROOT}/${encodeURIComponent(doi)}`,
      {
        headers: {
          Accept: "application/json",
          "User-Agent":
            "Vesselin-Baev-CV/1.0 (mailto:baev@uni-plovdiv.bg)",
        },
      },
    );

    if (response.ok) {
      const payload = await response.json();
      return Array.isArray(payload.message?.author)
        ? payload.message.author.map(crossrefAuthorName).filter(Boolean)
        : [];
    }
    if (response.status === 404) return [];
    if (response.status !== 429) {
      throw new Error(`Crossref request failed (${response.status})`);
    }

    await sleep(500 * 2 ** attempt);
  }

  throw new Error("Crossref rate limit persisted after retries");
}

function publisherAuthorName(value) {
  const parts = value.split(",").map((part) => part.trim()).filter(Boolean);
  return parts.length === 2 ? `${parts[1]} ${parts[0]}` : value.trim();
}

async function publisherAuthors(doi) {
  const response = await fetch(`https://doi.org/${doi}`, {
    headers: {
      Accept: "text/html",
      "User-Agent": "Vesselin-Baev-CV/1.0 (mailto:baev@uni-plovdiv.bg)",
    },
  });
  if (!response.ok) return [];

  const html = await response.text();
  return (html.match(/<meta\b[^>]*>/gi) ?? [])
    .filter((tag) => /name=["']citation_author["']/i.test(tag))
    .map((tag) => tag.match(/content=["']([^"']+)["']/i)?.[1])
    .filter(Boolean)
    .map(publisherAuthorName);
}

async function completeAuthors(publication) {
  if (!publication.doi) return publication;

  const override = AUTHOR_OVERRIDES.get(publication.doi.toLowerCase());
  if (override) return { ...publication, authors: override };

  try {
    const crossref = await crossrefAuthors(publication.doi);
    const authors = crossref.length
      ? crossref
      : await publisherAuthors(publication.doi);

    return authors.length
      ? { ...publication, authors: authors.join(", ") }
      : publication;
  } catch (error) {
    console.warn(
      `Unable to retrieve the complete author list for ${publication.doi}: ${error.message}`,
    );
    return publication;
  } finally {
    await sleep(CROSSREF_REQUEST_DELAY_MS);
  }
}

async function mapWithConcurrency(values, concurrency, mapper) {
  const results = new Array(values.length);
  let nextIndex = 0;

  async function worker() {
    while (nextIndex < values.length) {
      const index = nextIndex;
      nextIndex += 1;
      results[index] = await mapper(values[index]);
    }
  }

  await Promise.all(
    Array.from(
      { length: Math.min(concurrency, values.length) },
      () => worker(),
    ),
  );
  return results;
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

function makeSearchUrl(start) {
  return (
    `${API_ROOT}/search/scopus` +
    `?query=AU-ID%28${AUTHOR_ID}%29&view=STANDARD` +
    `&count=${SEARCH_PAGE_SIZE}&start=${start}&sort=-coverDate` +
    "&httpAccept=application%2Fjson"
  );
}

const firstSearchPayload = await fetchJson(makeSearchUrl(0));

const firstSearchResults = firstSearchPayload["search-results"];
const totalResults = number(firstSearchResults?.["opensearch:totalResults"]);
const resultLimit = Math.min(totalResults, SEARCH_RESULT_LIMIT);
const remainingStarts = [];

for (let start = SEARCH_PAGE_SIZE; start < resultLimit; start += SEARCH_PAGE_SIZE) {
  remainingStarts.push(start);
}

const remainingPayloads = await Promise.all(
  remainingStarts.map((start) => fetchJson(makeSearchUrl(start))),
);
const entries = [firstSearchPayload, ...remainingPayloads].flatMap(
  (payload) => payload["search-results"]?.entry ?? [],
);

if (!Array.isArray(entries) || entries.length === 0) {
  throw new Error("Scopus returned an incomplete publication list");
}

const validEntries = entries.filter((entry) => !entry.error);
const basePublications = validEntries
  .map(normalizePublication)
  .filter((entry) => entry.year > 1900)
  .sort((a, b) => b.year - a.year || a.title.localeCompare(b.title));
const publications = await mapWithConcurrency(
  basePublications,
  CROSSREF_CONCURRENCY,
  completeAuthors,
);
const citationCounts = validEntries
  .filter((entry) => entry["citedby-count"] !== undefined)
  .map((entry) => number(entry["citedby-count"]))
  .sort((a, b) => b - a);

const previous = JSON.parse(await readFile(outputPath, "utf8"));
const calculatedCitations = citationCounts.reduce((sum, count) => sum + count, 0);
const calculatedHIndex = citationCounts.filter(
  (citations, index) => citations >= index + 1,
).length;
const next = {
  authorId: AUTHOR_ID,
  updatedAt: new Date().toISOString(),
  source: "Elsevier Scopus APIs",
  metrics: {
    hIndex: citationCounts.length ? calculatedHIndex : previous.metrics.hIndex,
    citations: citationCounts.length
      ? calculatedCitations
      : previous.metrics.citations,
    documents: number(
      firstSearchResults?.["opensearch:totalResults"],
      publications.length,
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
