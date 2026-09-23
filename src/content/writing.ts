import "server-only";

import { readdir } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import type { ComponentType } from "react";

export type WritingMetadata = {
  title: string;
  description: string;
  date: string;
  kind: string;
  draft?: boolean;
};

export type WritingEntry = WritingMetadata & {
  slug: string;
};

type WritingModule = {
  default: ComponentType;
  metadata: WritingMetadata;
};

const writingDirectory = path.join(process.cwd(), "src", "content", "writing");

function isValidMetadata(value: unknown): value is WritingMetadata {
  if (!value || typeof value !== "object") return false;

  const metadata = value as Record<string, unknown>;
  return (
    typeof metadata.title === "string" &&
    typeof metadata.description === "string" &&
    typeof metadata.date === "string" &&
    typeof metadata.kind === "string"
  );
}

export const getWriting = cache(async (slug: string) => {
  if (!/^[a-z0-9-]+$/.test(slug)) return null;

  try {
    const writingModule = (await import(
      `@/content/writing/${slug}.mdx`
    )) as WritingModule;

    if (!isValidMetadata(writingModule.metadata)) {
      throw new Error(`Invalid writing metadata in ${slug}.mdx`);
    }

    return writingModule;
  } catch (error) {
    if (
      error instanceof Error &&
      (error.message.includes("Cannot find module") ||
        error.message.includes("Module not found"))
    ) {
      return null;
    }

    throw error;
  }
});

export const getAllWriting = cache(async (): Promise<WritingEntry[]> => {
  const filenames = await readdir(writingDirectory);
  const slugs = filenames
    .filter((filename) => filename.endsWith(".mdx"))
    .map((filename) => filename.slice(0, -4));

  const entries = await Promise.all(
    slugs.map(async (slug) => {
      const writingModule = await getWriting(slug);
      return writingModule ? { slug, ...writingModule.metadata } : null;
    }),
  );

  return entries
    .filter((entry): entry is WritingEntry => Boolean(entry))
    .filter((entry) => !entry.draft || process.env.NODE_ENV === "development")
    .sort((a, b) => Date.parse(b.date) - Date.parse(a.date));
});

export function formatWritingDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(date));
}
