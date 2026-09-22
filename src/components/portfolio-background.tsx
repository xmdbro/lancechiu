"use client";

import { useEffect, useRef } from "react";
import { PORTFOLIO_DOT_DATA } from "@/content/portfolio-dots";

const SOURCE_WIDTH = 3840;
const SOURCE_HEIGHT = 2160;
const GRID_SIZE = 40;
const GRID_COLUMNS = SOURCE_WIDTH / GRID_SIZE;
const DOT_RADIUS = 19;
const FRAME_INTERVAL = 1000 / 30;
const CURRENT_SPEED = 0.5;
const CURRENT_AMPLITUDE = 20;

type Dot = {
  color: string;
  radius: number;
  sourceX: number;
  sourceY: number;
};

function decodeDots() {
  const binary = atob(PORTFOLIO_DOT_DATA);
  const dots: Dot[] = [];

  for (let offset = 0; offset < binary.length; offset += 4) {
    const radius = binary.charCodeAt(offset);

    if (!radius) {
      continue;
    }

    const index = offset / 4;
    const column = index % GRID_COLUMNS;
    const row = Math.floor(index / GRID_COLUMNS);
    const red = binary.charCodeAt(offset + 1);
    const green = binary.charCodeAt(offset + 2);
    const blue = binary.charCodeAt(offset + 3);

    dots.push({
      color: `rgb(${red} ${green} ${blue})`,
      radius: (radius / 255) * DOT_RADIUS,
      sourceX: column * GRID_SIZE + GRID_SIZE / 2,
      sourceY: row * GRID_SIZE + GRID_SIZE / 2,
    });
  }

  return dots;
}

export function PortfolioBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");

    if (!canvas || !context) {
      return;
    }

    const dots = decodeDots();
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const pointer = { active: false, x: 0, y: 0 };
    let animationFrame = 0;
    let destroyed = false;
    let lastDraw = 0;
    let visible = true;

    const draw = (time: number) => {
      const bounds = canvas.getBoundingClientRect();
      const width = bounds.width;
      const height = bounds.height;
      const scale = Math.max(width / SOURCE_WIDTH, height / SOURCE_HEIGHT);
      const offsetX = (width - SOURCE_WIDTH * scale) / 2;
      const offsetY = (height - SOURCE_HEIGHT * scale) / 2;
      const seconds = time / 1000;
      const currentStrength = reducedMotion.matches
        ? 0
        : Math.max(1.5, scale * CURRENT_AMPLITUDE);
      const currentPhase = seconds * CURRENT_SPEED;
      const vortexRadius = Math.min(width, height) * 0.2;

      context.clearRect(0, 0, width, height);
      context.fillStyle = "#080808";
      context.fillRect(0, 0, width, height);

      for (const dot of dots) {
        let x = offsetX + dot.sourceX * scale;
        let y = offsetY + dot.sourceY * scale;

        if (currentStrength) {
          const horizontalFlow =
            Math.sin(dot.sourceY * 0.006 + currentPhase) +
            Math.sin(
              dot.sourceX * 0.003 -
                dot.sourceY * 0.004 +
                currentPhase * 0.7,
            ) *
              0.4;
          const verticalFlow =
            Math.cos(dot.sourceX * 0.005 - currentPhase * 0.8) +
            Math.sin(
              (dot.sourceX + dot.sourceY) * 0.004 + currentPhase,
            ) *
              0.35;

          x += horizontalFlow * currentStrength;
          y += verticalFlow * currentStrength * 0.75;
        }

        if (pointer.active) {
          const deltaX = x - pointer.x;
          const deltaY = y - pointer.y;
          const distance = Math.hypot(deltaX, deltaY);

          if (distance < vortexRadius) {
            const falloff = 1 - distance / vortexRadius;
            const angle = falloff * falloff * 0.55;
            const cosine = Math.cos(angle);
            const sine = Math.sin(angle);

            x = pointer.x + deltaX * cosine - deltaY * sine;
            y = pointer.y + deltaX * sine + deltaY * cosine;
          }
        }

        context.beginPath();
        context.arc(x, y, Math.max(0.35, dot.radius * scale), 0, Math.PI * 2);
        context.fillStyle = dot.color;
        context.fill();
      }
    };

    const tick = (time: number) => {
      animationFrame = 0;

      if (destroyed || !visible || document.hidden) {
        return;
      }

      if (time - lastDraw >= FRAME_INTERVAL) {
        lastDraw = time;
        draw(time);
      }

      if (!reducedMotion.matches) {
        animationFrame = requestAnimationFrame(tick);
      }
    };

    const start = () => {
      if (destroyed || !visible || document.hidden) {
        return;
      }

      if (reducedMotion.matches) {
        draw(performance.now());
      } else if (!animationFrame) {
        animationFrame = requestAnimationFrame(tick);
      }
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.max(1, Math.round(bounds.width * pixelRatio));
      canvas.height = Math.max(1, Math.round(bounds.height * pixelRatio));
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
      context.imageSmoothingEnabled = false;
      draw(performance.now());
      start();
    };

    const handlePointerMove = (event: PointerEvent) => {
      const bounds = canvas.getBoundingClientRect();
      pointer.x = event.clientX - bounds.left;
      pointer.y = event.clientY - bounds.top;
      pointer.active =
        pointer.x >= 0 &&
        pointer.x <= bounds.width &&
        pointer.y >= 0 &&
        pointer.y <= bounds.height;
    };

    const handlePointerLeave = () => {
      pointer.active = false;
    };

    const resizeObserver = new ResizeObserver(resize);
    const intersectionObserver = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;

      if (!visible) {
        cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      } else {
        start();
      }
    });

    resizeObserver.observe(canvas);
    intersectionObserver.observe(canvas);
    reducedMotion.addEventListener("change", start);
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("blur", handlePointerLeave);
    document.addEventListener("visibilitychange", start);
    resize();

    return () => {
      destroyed = true;
      cancelAnimationFrame(animationFrame);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      reducedMotion.removeEventListener("change", start);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("blur", handlePointerLeave);
      document.removeEventListener("visibilitychange", start);
    };
  }, []);

  return (
    <div className="portfolio-background" aria-hidden="true">
      <canvas ref={canvasRef} className="portfolio-background-canvas" />
    </div>
  );
}
