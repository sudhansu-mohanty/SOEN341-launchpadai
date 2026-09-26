/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === "production";

const nextConfig = {
  output: "export",
  basePath: isProd ? "/SOEN341-launchpadai" : "",
  assetPrefix: isProd ? "/SOEN341-launchpadai/" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
