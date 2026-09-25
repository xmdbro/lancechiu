"use client";

import { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { TextScramble } from "@/components/ui/text-scramble";

type ListeningData = {
  isPlaying?: boolean;
  track: { name: string; artist: string } | null;
};

export function ListeningStatus() {
  const [data, setData] = useState<ListeningData | null>(null);
  const [open, setOpen] = useState(false);
  const triggerLabel = data?.track
    ? data.isPlaying ? "Listening" : "Recently played"
    : "See what I’m listening to";

  useEffect(() => {
    if (!open) return;

    let active = true;
    let pending = false;

    async function refresh() {
      if (pending || document.hidden) return;
      pending = true;

      try {
        const response = await fetch("/api/listening", { cache: "no-store" });
        if (!response.ok) throw new Error("Listening is unavailable");
        const result = (await response.json()) as ListeningData;
        if (active) setData(result);
      } catch {
        if (active) setData(null);
      } finally {
        pending = false;
      }
    }

    void refresh();
    const interval = window.setInterval(() => void refresh(), 20_000);
    document.addEventListener("visibilitychange", refresh);
    window.addEventListener("focus", refresh);

    return () => {
      active = false;
      window.clearInterval(interval);
      document.removeEventListener("visibilitychange", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, [open]);

  return (
    <Accordion
      className="listening-status"
      onValueChange={(value) => setOpen(value === "listening")}
    >
      <AccordionItem value="listening">
        <AccordionTrigger className="listening-status-trigger" aria-label={triggerLabel}>
          <span className="listening-status-trigger-label">
            <span
              className={`listening-status-dot${data?.isPlaying ? " is-playing" : ""}`}
              aria-hidden="true"
            />
            <TextScramble>{triggerLabel}</TextScramble>
          </span>
          <span className="listening-status-chevron" aria-hidden="true" />
        </AccordionTrigger>
        <AccordionContent className="listening-status-content">
          <a
            className="listening-status-link"
            href="https://listening.lancechiu.com"
            target="_blank"
            rel="noreferrer"
            aria-label={
              data?.track
                ? `${data.isPlaying ? "Now listening to" : "Recently played"} ${data.track.name} by ${data.track.artist}. Open Listening.`
                : "Open Listening"
            }
          >
            <span className="listening-status-track">
              <TextScramble>{data?.track?.name ?? "Open Listening"}</TextScramble>
            </span>
            {data?.track ? (
              <TextScramble className="listening-status-artist">{data.track.artist}</TextScramble>
            ) : null}
          </a>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
