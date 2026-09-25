"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";

type Option<Value extends string> = {
  value: Value;
  label: string;
};

// A controlled version of Motion Primitives' AnimatedBackground segmented control.
export function AnimatedSelection<Value extends string>({
  options,
  value,
  onValueChange,
  label,
}: {
  options: readonly Option<Value>[];
  value: Value;
  onValueChange: (value: Value) => void;
  label: string;
}) {
  const id = useId();
  const reduceMotion = useReducedMotion();

  return (
    <div className="writing-control-options" role="group" aria-label={label}>
      {options.map((option) => (
        <button
          className="writing-control-button"
          type="button"
          aria-pressed={value === option.value}
          key={option.value}
          onClick={() => onValueChange(option.value)}
        >
          {value === option.value ? (
            <motion.span
              className="writing-control-selection"
              layoutId={`writing-selection-${id}`}
              initial={false}
              transition={{
                duration: reduceMotion ? 0 : 0.24,
                ease: [0.22, 1, 0.36, 1],
              }}
              aria-hidden="true"
            />
          ) : null}
          <span className="writing-control-button-label">{option.label}</span>
        </button>
      ))}
    </div>
  );
}
