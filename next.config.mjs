import createMDX from "@next/mdx";
import rehypePrettyCode from "rehype-pretty-code";

/** @type {import("next").NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  rehypePlugins: [
    [
      rehypePrettyCode,
      {
        theme: "github-dark-dimmed",
        keepBackground: false,
      },
    ],
  ],
});

export default withMDX(nextConfig);
