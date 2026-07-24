import type { NextConfig } from "next";

const repository = process.env.GITHUB_REPOSITORY ?? "";
const [owner, repositoryName] = repository.split("/");
const isUserSite = repositoryName === `${owner}.github.io`;
const pagesBasePath =
  repositoryName && !isUserSite ? `/${repositoryName}` : "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: pagesBasePath,
  assetPrefix: pagesBasePath,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
