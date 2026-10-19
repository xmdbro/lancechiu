import test from "node:test";
import assert from "node:assert/strict";
import { getWritingContentBaseUrl } from "../src/content/writing-origin.mjs";
import config from "../next.config.mjs";

test("article fetches and image rewrites use the same content origin", async (t) => {
  const originalMode = process.env.NODE_ENV;
  const originalUrl = process.env.WRITINGS_CONTENT_URL;
  t.after(() => {
    if (originalMode === undefined) delete process.env.NODE_ENV;
    else process.env.NODE_ENV = originalMode;
    if (originalUrl === undefined) delete process.env.WRITINGS_CONTENT_URL;
    else process.env.WRITINGS_CONTENT_URL = originalUrl;
  });
  for (const [mode, override, expected] of [
    ["development", undefined, "http://127.0.0.1:4000/"],
    ["production", undefined, "https://writings.lancechiu.com/"],
    ["development", "https://preview.example/content", "https://preview.example/content/"],
    ["production", "https://preview.example/content/", "https://preview.example/content/"],
  ]) {
    process.env.NODE_ENV = mode;
    if (override === undefined) delete process.env.WRITINGS_CONTENT_URL;
    else process.env.WRITINGS_CONTENT_URL = override;
    assert.equal(getWritingContentBaseUrl().href, expected);
    assert.deepEqual(await config.rewrites(), [{
      source: "/images/:path*",
      destination: expected + "images/:path*",
    }]);
  }
  process.env.WRITINGS_CONTENT_URL = "file:///private/";
  assert.throws(getWritingContentBaseUrl, /HTTP or HTTPS/);
});
