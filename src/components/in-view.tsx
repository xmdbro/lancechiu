"use client";

import type { ReactNode } from "react";
import {
  motion,
  useInView,
  type Transition,
  type UseInViewOptions,
  type Variant,
} from "motion/react";
import { useRef } from "react";

type InViewProps = {
  children: ReactNode;
  className?: string;
  variants?: {
    hidden: Variant;
    visible: Variant;
  };
  transition?: Transition;
  viewOptions?: UseInViewOptions;
};

const defaultVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export function InView({
  children,
  className,
  variants = defaultVariants,
  transition,
  viewOptions,
}: InViewProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, viewOptions);

  return (
    <motion.div
      ref={ref}
      className={className}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
