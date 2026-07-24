import { readdir, readFile, writeFile } from "node:fs/promises";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const analyticsPattern =
  /<script async(?:="")? src="https:\/\/scripts\.simpleanalyticscdn\.com\/latest\.js"><\/script>/g;
const analyticsScript =
  '<script async src="https://scripts.simpleanalyticscdn.com/latest.js"></script>';

export function placeSimpleAnalyticsBeforeBody(html) {
  const withoutAnalytics = html.replace(analyticsPattern, "");

  if (withoutAnalytics === html) {
    throw new Error("Simple Analytics script was not found in the generated HTML.");
  }

  if (!withoutAnalytics.includes("</body>")) {
    throw new Error("Closing body tag was not found in the generated HTML.");
  }

  return withoutAnalytics.replace(
    "</body>",
    `${analyticsScript}</body>`,
  );
}

async function listHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = await Promise.all(
    entries.map((entry) => {
      const entryPath = join(directory, entry.name);

      if (entry.isDirectory()) {
        return listHtmlFiles(entryPath);
      }

      return entry.name.endsWith(".html") ? [entryPath] : [];
    }),
  );

  return files.flat();
}

async function main() {
  const outputDirectory = join(process.cwd(), "out");
  const htmlFiles = await listHtmlFiles(outputDirectory);

  await Promise.all(
    htmlFiles.map(async (file) => {
      const html = await readFile(file, "utf8");
      await writeFile(file, placeSimpleAnalyticsBeforeBody(html));
    }),
  );
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
