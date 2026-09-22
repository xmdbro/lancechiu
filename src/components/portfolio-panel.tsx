"use client";

import type { RefObject } from "react";
import { motion } from "motion/react";
import { InView } from "@/components/in-view";

type PortfolioPanelProps = {
  portfolioOpen: boolean;
  returnPull: number;
  reduceMotion: boolean | null;
  backButtonRef: RefObject<HTMLButtonElement | null>;
  onClose: () => void;
};

export function PortfolioPanel({
  portfolioOpen,
  returnPull,
  reduceMotion,
  backButtonRef,
  onClose,
}: PortfolioPanelProps) {
  return (
    <motion.section
      className="panel portfolio-panel"
      aria-label="Portfolio"
      aria-hidden={!portfolioOpen}
      inert={!portfolioOpen || undefined}
      animate={{ y: portfolioOpen ? returnPull : 0 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 520, damping: 45, mass: 0.7 }
      }
    >
      <button
        ref={backButtonRef}
        className="back-button"
        type="button"
        onClick={onClose}
      >
        <span className="back-arrow" aria-hidden="true" />
        Back
      </button>

      <InView
        className="portfolio-content"
        variants={{
          hidden: { opacity: 0, y: 36, filter: "blur(8px)" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)" },
        }}
        transition={{
          duration: reduceMotion ? 0 : 0.65,
          ease: [0.22, 1, 0.36, 1],
        }}
        viewOptions={{ amount: 0.45, once: true }}
      >
        <p className="portfolio-eyebrow">Portfolio / 001</p>
        <h2 className="portfolio-name">Under Construction...</h2>
        <p className="portfolio-subtitle">Sorry about that!</p>
        <p className="portfolio-byline">
          <span className="portfolio-byline-dot" aria-hidden="true" />
          Lance Chiu, De La Salle University
        </p>
      </InView>

      <div
        className="panel-scroll-cue panel-scroll-cue--portfolio"
        aria-hidden="true"
      >
        <span className="scroll-cue-arrow scroll-cue-arrow--up" />
        Scroll up to return
      </div>
    </motion.section>
  );
}
