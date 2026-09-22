"use client";

import { useState, type RefObject } from "react";
import { motion } from "motion/react";
import { InView } from "@/components/in-view";
// import { PortfolioBackground } from "@/components/portfolio-background";
import { PortfolioSections } from "@/components/portfolio-sections";

type PortfolioPanelProps = {
  portfolioOpen: boolean;
  returnPull: number;
  reduceMotion: boolean | null;
  backButtonRef: RefObject<HTMLButtonElement | null>;
  portfolioScrollRef: RefObject<HTMLDivElement | null>;
  onClose: () => void;
};

export function PortfolioPanel({
  portfolioOpen,
  returnPull,
  reduceMotion,
  backButtonRef,
  portfolioScrollRef,
  onClose,
}: PortfolioPanelProps) {
  const [hasScrolled, setHasScrolled] = useState(false);

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
      {/* <PortfolioBackground /> */}

      <button
        ref={backButtonRef}
        className="back-button"
        type="button"
        onClick={onClose}
      >
        <span className="back-arrow" aria-hidden="true" />
        Back
      </button>

      <div
        ref={portfolioScrollRef}
        className="portfolio-scroll"
        role="region"
        aria-label="Portfolio content"
        tabIndex={0}
        onScroll={(event) => setHasScrolled(event.currentTarget.scrollTop > 16)}
      >
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
          viewOptions={{ amount: 0.08, once: true }}
        >
          <PortfolioSections />
        </InView>
      </div>

      <div
        className={`panel-scroll-cue panel-scroll-cue--portfolio${
          hasScrolled ? " panel-scroll-cue--hidden" : ""
        }`}
        aria-hidden="true"
      >
        <span className="scroll-cue-arrow scroll-cue-arrow--down" />
        Scroll down to view projects
      </div>
    </motion.section>
  );
}
