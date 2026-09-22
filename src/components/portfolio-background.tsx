"use client";

import { useEffect, useRef } from "react";
import { mountStudio, type StudioInput } from "asciify-engine/studio";
import asciifyImage from "@/app/asciify.png";

const settings = {
  version: 1,
  aspectRatio: "1:1",
  style: "dots",
  cellSize: 10,
  charset: " .:-=+*#%@",
  colorMode: "source",
  ink: "#6a6968",
  crop: {
    x: 0.5,
    y: 0.35,
    zoom: 1,
    rotation: 0,
  },
  backdrop: {
    mode: "solid",
    color: "#080808",
    color2: "#393323",
    blur: 12,
    opacity: 1,
  },
  color: {
    brightness: 0.05,
    contrast: 0.85,
    saturation: 1,
    grayscale: 0,
    tint: "#e8b900",
    amount: 0,
    blend: "source-over",
  },
  dither: {
    algorithm: "bayer4",
    palette: "mono",
    colors: ["#080808", "#e8b900"],
    amount: 1,
    scale: 2,
    threshold: 0.5,
    motion: "none",
    speed: 1,
  },
  mask: {
    enabled: false,
    invert: false,
    shapes: [],
  },
  lights: [],
  effects: {
    bloom: 0,
    characterBloom: 0,
    grain: 0,
    dust: 0,
    scanlines: 0,
    crt: 0,
    prism: 0,
    vignette: 0,
    glitch: 0,
    pixelate: 0,
    blur: 0,
    blurType: "gaussian",
    angle: 0,
    focus: 0.5,
    halftone: 0,
  },
  motion: {
    type: "current",
    speed: 0.5,
  },
  hover: {
    effect: "vortex",
    strength: 0.65,
    radius: 0.38,
    edgeSafe: true,
  },
} satisfies StudioInput;

export function PortfolioBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const abortController = new AbortController();
    let destroyed = false;
    let resizeObserver: ResizeObserver | undefined;
    let studio: Awaited<ReturnType<typeof mountStudio>> | undefined;

    async function mount(canvasElement: HTMLCanvasElement) {
      const bounds = canvasElement.getBoundingClientRect();

      const nextStudio = await mountStudio(canvasElement, asciifyImage.src, {
        settings,
        width: Math.max(1, Math.round(bounds.width)),
        height: Math.max(1, Math.round(bounds.height)),
        signal: abortController.signal,
      });

      if (destroyed) {
        nextStudio.destroy();
        return;
      }

      studio = nextStudio;
      resizeObserver = new ResizeObserver(([entry]) => {
        if (!entry) {
          return;
        }

        const { width, height } = entry.contentRect;
        studio?.resize(
          Math.max(1, Math.round(width)),
          Math.max(1, Math.round(height)),
          Math.min(window.devicePixelRatio, 2),
        );
      });
      resizeObserver.observe(canvasElement);
    }

    void mount(canvas).catch((error: unknown) => {
      if (!destroyed && !abortController.signal.aborted) {
        console.error("Unable to mount the portfolio background.", error);
      }
    });

    return () => {
      destroyed = true;
      abortController.abort();
      resizeObserver?.disconnect();
      studio?.destroy();
    };
  }, []);

  return (
    <div className="portfolio-background" aria-hidden="true">
      <canvas ref={canvasRef} className="portfolio-background-canvas" />
    </div>
  );
}
