import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath === "" ? undefined : basePath,
  reactStrictMode: true,
  images: { unoptimized: true },
  trailingSlash: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
};

export default nextConfig;
