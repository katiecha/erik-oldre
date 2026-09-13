import type { NextConfig } from "next";

// When building for GitHub Pages (project site served at /<repo>/), we need a
// basePath + asset prefix and a static export. Locally these stay empty so
// `pnpm dev` / `pnpm build` behave normally.
const repo = "erik-oldre";
const isPages = process.env.GITHUB_PAGES === "true";

const basePath = isPages ? `/${repo}` : "";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  basePath,
  assetPrefix: isPages ? `/${repo}/` : "",
  trailingSlash: true,
  // next/image skips basePath when images are unoptimized, so anything loading
  // straight out of public/ has to prefix the path itself. See lib/assets.ts.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
