import createMDX from "@next/mdx";

/** @type {import("next").NextConfig} */
const nextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [
      [
        "rehype-pretty-code",
        {
          theme: "github-dark-dimmed",
          keepBackground: false,
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
