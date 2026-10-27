import type { NextConfig } from "next";

// GitHub Pages serves the site from /<repo-name>/; the deploy workflow passes that in as BASE_PATH.
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  // Static HTML export to out/ (no server needed). Remove when the site gets a backend.
  output: "export",
  // Pages export as /journeys/<id>/index.html, which every static host serves at /journeys/<id>/.
  trailingSlash: true,
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
