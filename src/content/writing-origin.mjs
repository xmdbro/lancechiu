export function getWritingContentBaseUrl() {
  const base = process.env.WRITINGS_CONTENT_URL ||
    (process.env.NODE_ENV === "development"
      ? "http://127.0.0.1:4000"
      : "https://writings.lancechiu.com");
  const url = new URL(base.endsWith("/") ? base : base + "/");
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("WRITINGS_CONTENT_URL must be an HTTP or HTTPS URL.");
  }
  return url;
}
