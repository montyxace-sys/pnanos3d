import type { NextConfig } from "next";

const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const isExport = process.env.NEXT_EXPORT === "true";

const nextConfig: NextConfig = {
  ...(isExport ? { output: "export" } : {}),
  basePath,
  assetPrefix: basePath === "" ? undefined : basePath,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;