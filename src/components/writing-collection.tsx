"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { WritingEntry } from "@/content/writing";

type SortOrder = "newest" | "earliest";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    timeZone: "UTC",
    year: "numeric",
  }).format(new Date(date));
}

export function WritingCollection({ entries }: { entries: WritingEntry[] }) {
  const [sortOrder, setSortOrder] = useState<SortOrder>("newest");
  const [selectedKind, setSelectedKind] = useState("All");

  const kinds = useMemo(
    () => [...new Set(entries.map((entry) => entry.kind))].sort(),
    [entries],
  );

  const visibleEntries = useMemo(() => {
    const filtered =
      selectedKind === "All"
        ? entries
        : entries.filter((entry) => entry.kind === selectedKind);

    return [...filtered].sort((a, b) => {
      const difference = Date.parse(b.date) - Date.parse(a.date);
      return sortOrder === "newest" ? difference : -difference;
    });
  }, [entries, selectedKind, sortOrder]);

  return (
    <section className="writing-collection" aria-label="Writing collection">
      <div className="writing-controls">
        <div className="writing-control-group">
          <span className="writing-control-label">Kind</span>
          <div className="writing-control-options" role="group" aria-label="Filter by kind">
            {["All", ...kinds].map((kind) => (
              <button
                className="writing-control-button"
                type="button"
                aria-pressed={selectedKind === kind}
                key={kind}
                onClick={() => setSelectedKind(kind)}
              >
                {kind}
              </button>
            ))}
          </div>
        </div>

        <div className="writing-control-group writing-control-group--sort">
          <span className="writing-control-label">Order</span>
          <div className="writing-control-options" role="group" aria-label="Sort by date">
            <button
              className="writing-control-button"
              type="button"
              aria-pressed={sortOrder === "newest"}
              onClick={() => setSortOrder("newest")}
            >
              Newest
            </button>
            <button
              className="writing-control-button"
              type="button"
              aria-pressed={sortOrder === "earliest"}
              onClick={() => setSortOrder("earliest")}
            >
              Earliest
            </button>
          </div>
        </div>
      </div>

      {visibleEntries.length > 0 ? (
        <ol className="writing-list">
          {visibleEntries.map((entry, index) => (
            <li key={entry.slug}>
              <Link
                className="writing-list-link"
                href={`/writing/${entry.slug}`}
                transitionTypes={["article-forward"]}
              >
                <span className="writing-list-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="writing-list-copy">
                  <span className="writing-list-title">
                    {entry.title}
                    {entry.draft ? (
                      <span className="writing-draft-badge">Draft</span>
                    ) : null}
                  </span>
                  <span className="writing-list-description">
                    {entry.description}
                  </span>
                </span>
                <span className="writing-list-meta">
                  <span>{entry.kind}</span>
                  <time dateTime={entry.date}>{formatDate(entry.date)}</time>
                </span>
                <span className="writing-list-arrow" aria-hidden="true">
                  ↗
                </span>
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <p className="writing-empty">No pieces match this filter.</p>
      )}
    </section>
  );
}
