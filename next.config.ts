import type { NextConfig } from "next";

// When building for GitHub Pages (project site served at /<repo>/), we need a
// basePath + asset prefix and a static export. Locally these stay empty so
// `pnpm dev` / `pnpm build` behave normally.
const repo = "erik-oldre";
const isPages = process.env.GITHUB_PAGES === "true";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath: isPages ? `/${repo}` : "",
  assetPrefix: isPages ? `/${repo}/` : "",
  trailingSlash: true,
};

export default nextConfig;
