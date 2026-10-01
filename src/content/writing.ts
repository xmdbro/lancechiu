import "server-only";

import { cache } from "react";
import { connection } from "next/server";

export type WritingMetadata = {
  title: string;
  description: string;
  date: string;
  type: string;
  draft: boolean;
};

export type WritingEntry = WritingMetadata & {
  slug: string;
};

export type WritingArticle = WritingEntry & {
  html: string;
};

const isDevelopment = process.env.NODE_ENV === "development";
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isWritingEntry(value: unknown): value is WritingEntry {
  if (!value || typeof value !== "object") return false;
  const entry = value as Record<string, unknown>;
  return (
    typeof entry.slug === "string" &&
    slugPattern.test(entry.slug) &&
    typeof entry.title === "string" && Boolean(entry.title.trim()) &&
    typeof entry.description === "string" && Boolean(entry.description.trim()) &&
    typeof entry.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(entry.date) &&
    Number.isFinite(Date.parse(entry.date)) &&
    typeof entry.type === "string" && Boolean(entry.type.trim()) &&
    typeof entry.draft === "boolean"
  );
}

async function fetchWriting(path: string): Promise<unknown> {
  // Content can change independently of this deployment. Fetch only at request
  // time, while retaining the explicit production data cache below.
  await connection();

  const base = process.env.WRITINGS_CONTENT_URL ||
    (isDevelopment ? "http://127.0.0.1:4000" : "https://writings.lancechiu.com");
  const url = new URL(path, base.endsWith("/") ? base : base + "/");
  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("WRITINGS_CONTENT_URL must be an HTTP or HTTPS URL.");
  }

  let response: Response;
  try {
    response = await fetch(url, {
      ...(isDevelopment
        ? { cache: "no-store" as const }
        : { cache: "force-cache" as const, next: { revalidate: 60 } }),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (cause) {
    throw new Error(
      "Unable to reach the writings feed at " + url.origin +
      (isDevelopment ? ". Run npm run dev in writings-repository." : "."),
      { cause },
    );
  }

  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Writings feed returned HTTP " + response.status + ".");
  return response.json();
}

export const getWriting = cache(async (slug: string): Promise<WritingArticle | null> => {
  if (!slugPattern.test(slug)) return null;
  const value = await fetchWriting("posts/" + slug + ".json");
  if (value === null) return null;
  if (!isWritingEntry(value) || value.slug !== slug ||
      typeof (value as Record<string, unknown>).html !== "string") {
    throw new Error("Invalid writing data for " + slug + ".");
  }
  if (value.draft && !isDevelopment) return null;
  return value as WritingArticle;
});

export const getAllWriting = cache(async (): Promise<WritingEntry[]> => {
  const value = await fetchWriting("index.json");
  if (!Array.isArray(value) || !value.every(isWritingEntry)) {
    throw new Error("Invalid writings index.");
  }
  return value
    .filter((entry) => isDevelopment || !entry.draft)
    .sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
});

export function formatWritingDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(date));
}
