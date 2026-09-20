import type { NextConfig } from "next";

// GitHub Pages serves this repo at /the-red-button/, so the build needs a
// matching basePath. Only applied when building for Pages (see the
// deploy workflow) so local dev and other hosts (e.g. Vercel) are unaffected.
const isGithubPages = process.env.GITHUB_PAGES === "true";
const repoName = "the-red-button";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: isGithubPages ? `/${repoName}` : undefined,
  assetPrefix: isGithubPages ? `/${repoName}/` : undefined,
};

export default nextConfig;
