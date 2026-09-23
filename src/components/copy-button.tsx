"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type CopyButtonProps = {
  value: string;
  label: string;
  className?: string;
  children?: ReactNode;
};

async function copyText(value: string) {
  try {
    await navigator.clipboard.writeText(value);
    return;
  } catch {
    const textArea = document.createElement("textarea");
    textArea.value = value;
    textArea.setAttribute("readonly", "");
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";
    document.body.appendChild(textArea);
    textArea.select();
    const copied = document.execCommand("copy");
    textArea.remove();

    if (!copied) throw new Error("Copy failed");
  }
}

export function CopyButton({
  value,
  label,
  className = "",
  children,
}: CopyButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    };
  }, []);

  async function handleCopy() {
    if (resetTimer.current) clearTimeout(resetTimer.current);

    try {
      await copyText(value);
      setStatus("copied");
    } catch {
      setStatus("error");
    }

    resetTimer.current = setTimeout(() => setStatus("idle"), 1000);
  }

  const visibleLabel =
    status === "copied"
      ? "[ Copied! ]"
      : status === "error"
        ? "[ Copy failed ]"
        : children ?? value;

  return (
    <button
      className={`copy-button ${className}`.trim()}
      type="button"
      onClick={handleCopy}
      aria-label={label}
      title={label}
    >
      <span aria-live="polite">{visibleLabel}</span>
    </button>
  );
}
