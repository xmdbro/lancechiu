"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { IntroPanel } from "@/components/intro-panel";
import { PortfolioPanel } from "@/components/portfolio-panel";
import { usePortfolioNavigation } from "@/components/use-portfolio-navigation";

export function PortfolioSite() {
  const [portfolioOpen, setPortfolioOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const {
    backButtonRef,
    portfolioButtonRef,
    portfolioScrollRef,
    returnPull,
    introDrag,
    isMouseDragging,
    siteFrameRef,
    pointerHandlers,
    touchHandlers,
  } = usePortfolioNavigation({
    portfolioOpen,
    reduceMotion,
    setPortfolioOpen,
  });

  return (
    <main
      ref={siteFrameRef}
      className={`site-frame${isMouseDragging ? " is-mouse-dragging" : ""}`}
      {...touchHandlers}
      {...pointerHandlers}
    >
      <motion.div
        className="panel-track"
        animate={{ y: portfolioOpen ? "-100dvh" : `-${introDrag}px` }}
        transition={
          reduceMotion || isMouseDragging
            ? { duration: 0 }
            : { duration: 0.8, ease: [0.76, 0, 0.24, 1] }
        }
      >
        <IntroPanel
          portfolioOpen={portfolioOpen}
          portfolioButtonRef={portfolioButtonRef}
          onOpen={() => setPortfolioOpen(true)}
        />
        <PortfolioPanel
          portfolioOpen={portfolioOpen}
          returnPull={returnPull}
          reduceMotion={reduceMotion}
          backButtonRef={backButtonRef}
          portfolioScrollRef={portfolioScrollRef}
          onClose={() => setPortfolioOpen(false)}
        />
      </motion.div>
    </main>
  );
}
