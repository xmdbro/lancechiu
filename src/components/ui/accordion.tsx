"use client";

import { createContext, useContext, useId, useState, type ComponentProps, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

// Shadcn's compositional API, with Motion Primitives-style height animation.
type AccordionContextValue = {
  openValue: string | null;
  setOpenValue: (value: string | null) => void;
};

type AccordionItemContextValue = {
  open: boolean;
  value: string;
  triggerId: string;
  contentId: string;
};

const AccordionContext = createContext<AccordionContextValue | null>(null);
const AccordionItemContext = createContext<AccordionItemContextValue | null>(null);

function useAccordionContext() {
  const context = useContext(AccordionContext);
  if (!context) throw new Error("Accordion parts must be inside Accordion");
  return context;
}

function useAccordionItemContext() {
  const context = useContext(AccordionItemContext);
  if (!context) throw new Error("Accordion parts must be inside AccordionItem");
  return context;
}

export function Accordion({
  children,
  className,
  onValueChange,
}: {
  children: ReactNode;
  className?: string;
  onValueChange?: (value: string | null) => void;
}) {
  const [openValue, setOpenValue] = useState<string | null>(null);

  function updateOpenValue(value: string | null) {
    setOpenValue(value);
    onValueChange?.(value);
  }

  return (
    <AccordionContext.Provider value={{ openValue, setOpenValue: updateOpenValue }}>
      <div className={className} data-slot="accordion">{children}</div>
    </AccordionContext.Provider>
  );
}

export function AccordionItem({
  children,
  className,
  value,
}: {
  children: ReactNode;
  className?: string;
  value: string;
}) {
  const { openValue } = useAccordionContext();
  const id = useId();
  const open = openValue === value;

  return (
    <AccordionItemContext.Provider
      value={{ open, value, triggerId: `${id}-trigger`, contentId: `${id}-content` }}
    >
      <div className={className} data-slot="accordion-item" data-state={open ? "open" : "closed"}>
        {children}
      </div>
    </AccordionItemContext.Provider>
  );
}

export function AccordionTrigger({
  children,
  className,
  ...props
}: ComponentProps<"button">) {
  const { openValue, setOpenValue } = useAccordionContext();
  const { open, value, triggerId, contentId } = useAccordionItemContext();

  return (
    <h2 className="accordion-heading">
      <button
        {...props}
        type="button"
        id={triggerId}
        aria-controls={contentId}
        aria-expanded={open}
        className={className}
        data-slot="accordion-trigger"
        data-state={open ? "open" : "closed"}
        onClick={() => setOpenValue(openValue === value ? null : value)}
      >
        {children}
      </button>
    </h2>
  );
}

export function AccordionContent({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const { open, triggerId, contentId } = useAccordionItemContext();
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      id={contentId}
      role="region"
      aria-labelledby={triggerId}
      aria-hidden={!open}
      inert={!open}
      data-slot="accordion-content"
      data-state={open ? "open" : "closed"}
      initial={false}
      animate={{ height: open ? "auto" : 0, opacity: open ? 1 : 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.28, ease: [0.22, 1, 0.36, 1] }}
      className="accordion-content-outer"
    >
      <div className={className}>{children}</div>
    </motion.div>
  );
}
