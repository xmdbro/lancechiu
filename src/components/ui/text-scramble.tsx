"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

// Adapted from Motion Primitives' TextScramble to run when its text changes.
const defaultCharacters =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function TextScramble({
  children,
  className,
  duration = 0.6,
  speed = 0.04,
  characterSet = defaultCharacters,
}: {
  children: string;
  className?: string;
  duration?: number;
  speed?: number;
  characterSet?: string;
}) {
  const [displayText, setDisplayText] = useState(children);
  const previousText = useRef(children);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || !characterSet.length) {
      previousText.current = children;
      const timeout = window.setTimeout(() => setDisplayText(children), 0);
      return () => window.clearTimeout(timeout);
    }

    if (previousText.current === children) return;
    previousText.current = children;

    const characters = Array.from(children);
    const tickMs = Math.max(16, speed * 1000);
    const steps = Math.max(1, Math.ceil((duration * 1000) / tickMs));
    let step = 0;

    const interval = window.setInterval(() => {
      const revealed = Math.floor(((step + 1) / steps) * characters.length);
      setDisplayText(
        characters
          .map((character, index) =>
            character === " " || index < revealed
              ? character
              : characterSet[Math.floor(Math.random() * characterSet.length)],
          )
          .join(""),
      );

      step += 1;
      if (step >= steps) window.clearInterval(interval);
    }, tickMs);

    return () => window.clearInterval(interval);
  }, [children, duration, speed, characterSet, reduceMotion]);

  return (
    <motion.span className={className} aria-label={children}>
      <span aria-hidden="true">
        {reduceMotion || !characterSet.length ? children : displayText}
      </span>
    </motion.span>
  );
}
