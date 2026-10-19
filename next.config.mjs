import { getWritingContentBaseUrl } from "./src/content/writing-origin.mjs";

/** @type {import("next").NextConfig} */
const nextConfig = {
  async rewrites() {
    // Array rewrites run after public/ files, preserving existing site assets.
    return [{
      source: "/images/:path*",
      destination: new URL("images/:path*", getWritingContentBaseUrl()).href,
    }];
  },
};

export default nextConfig;
