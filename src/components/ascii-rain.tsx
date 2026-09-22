"use client";

/*
MIT License

Copyright (c) 2026 ayangabryl

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

Adapted from Asciify's application-owned Rain background template:
https://asciify.org/background-templates/rain.js
*/

import { useEffect, useRef } from "react";

const DEFAULT_RAIN_CHARACTERS =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789" +
  "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";

type RainOptions = {
  opacity?: number;
  fontSize?: number;
  chars?: string;
  color?: string;
  accentColor?: string;
  speed?: number;
  density?: number;
  tailLength?: number;
};

type Rgb = { r: number; g: number; b: number };

function parseColor(color: string): Rgb | null {
  const hex = color.match(/^#([0-9a-f]{3,8})$/i)?.[1];

  if (hex) {
    const values =
      hex.length <= 4
        ? hex.split("").map((value) => parseInt(value + value, 16))
        : [
            parseInt(hex.slice(0, 2), 16),
            parseInt(hex.slice(2, 4), 16),
            parseInt(hex.slice(4, 6), 16),
          ];

    return { r: values[0], g: values[1], b: values[2] };
  }

  const rgb = color.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/i);
  return rgb ? { r: +rgb[1], g: +rgb[2], b: +rgb[3] } : null;
}

function seededNoise(x: number, y: number) {
  let value = x * 127 + y * 311;
  value = (value >> 13) ^ value;

  return (
    ((value * (value * value * 15731 + 789221) + 1376312589) & 2147483647) /
    2147483647
  );
}

function renderRain(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  time: number,
  options: Required<Omit<RainOptions, "opacity">>,
) {
  const {
    fontSize,
    chars,
    accentColor,
    color,
    speed,
    density,
    tailLength,
  } = options;
  const cellWidth = fontSize * 0.62;
  const cellHeight = fontSize * 1.4;
  const columns = Math.ceil(width / cellWidth);
  const rows = Math.ceil(height / cellHeight);
  const body = parseColor(color) ?? { r: 55, g: 55, b: 55 };
  const accent = parseColor(accentColor) ?? body;
  const cycle = rows + tailLength;

  context.clearRect(0, 0, width, height);
  context.font = `${fontSize}px monospace`;
  context.textBaseline = "top";

  for (let column = 0; column < columns; column += 1) {
    if (seededNoise(column * 17, 3) > density) {
      continue;
    }

    const columnSpeed = (0.5 + seededNoise(column * 31, 7) * 1.5) * speed;
    const offset = seededNoise(column * 13, 11) * cycle;
    const head = Math.floor((time * columnSpeed * 7 + offset) % cycle);
    const x = column * cellWidth;

    for (let tailIndex = 0; tailIndex <= tailLength; tailIndex += 1) {
      const row = head - (tailLength - tailIndex);

      if (row < 0 || row >= rows) {
        continue;
      }

      const characterValue = seededNoise(
        column * 53 + Math.floor(time * 5 + tailIndex),
        row * 7,
      );
      const character = chars[Math.floor(characterValue * chars.length)];
      const tailProgress = tailIndex / tailLength;
      const isHead = tailIndex === tailLength;
      const ink = isHead ? accent : body;
      const alpha = isHead ? 0.72 : tailProgress * 0.8;

      context.fillStyle = `rgba(${ink.r}, ${ink.g}, ${ink.b}, ${alpha})`;
      context.fillText(character, x, row * cellHeight);
    }
  }
}

function mountRainBackground(target: HTMLElement, options: RainOptions = {}) {
  const {
    opacity = 0.7,
    fontSize = 14,
    chars = DEFAULT_RAIN_CHARACTERS,
    accentColor = "#171715",
    color = "#171715",
    speed = 0.6,
    density = 1.0,
    tailLength = 20,
  } = options;
  const originalPosition = target.style.position;

  if (getComputedStyle(target).position === "static") {
    target.style.position = "relative";
  }

  const canvas = document.createElement("canvas");
  canvas.style.cssText = [
    "position:absolute",
    "inset:0",
    "width:100%",
    "height:100%",
    `opacity:${opacity}`,
    "pointer-events:none",
  ].join(";");
  target.prepend(canvas);

  const context = canvas.getContext("2d");

  if (!context) {
    canvas.remove();
    return () => undefined;
  }

  const pixelRatio = Math.min(2, window.devicePixelRatio || 1);
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  let elapsed = 0;
  let previousTime = 0;
  let animationFrame = 0;
  let destroyed = false;
  let visible = true;

  const draw = () => {
    const bounds = target.getBoundingClientRect();
    renderRain(context, bounds.width, bounds.height, elapsed, {
      fontSize,
      chars,
      accentColor,
      color,
      speed,
      density,
      tailLength,
    });
  };

  const tick = (time: number) => {
    animationFrame = 0;

    if (destroyed || !visible || document.hidden) {
      previousTime = 0;
      return;
    }

    if (!reducedMotion.matches && previousTime) {
      elapsed += Math.min(0.05, (time - previousTime) / 1000);
    }

    previousTime = time;
    draw();

    if (!reducedMotion.matches) {
      animationFrame = requestAnimationFrame(tick);
    }
  };

  const start = () => {
    if (!destroyed && visible && !document.hidden && !animationFrame) {
      animationFrame = requestAnimationFrame(tick);
    }
  };

  const resize = () => {
    const bounds = target.getBoundingClientRect();
    canvas.width = bounds.width * pixelRatio;
    canvas.height = bounds.height * pixelRatio;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    queueMicrotask(start);
  };

  const resizeObserver = new ResizeObserver(resize);
  const intersectionObserver = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    previousTime = 0;
    start();
  });

  resizeObserver.observe(target);
  intersectionObserver.observe(target);
  reducedMotion.addEventListener("change", start);
  document.addEventListener("visibilitychange", start);
  resize();
  start();

  return () => {
    destroyed = true;
    cancelAnimationFrame(animationFrame);
    resizeObserver.disconnect();
    intersectionObserver.disconnect();
    reducedMotion.removeEventListener("change", start);
    document.removeEventListener("visibilitychange", start);
    canvas.remove();
    target.style.position = originalPosition;
  };
}

export function AsciiRain() {
  const rainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = rainRef.current;

    if (!target) {
      return;
    }

    return mountRainBackground(target);
  }, []);

  return <div ref={rainRef} className="ascii-rain" aria-hidden="true" />;
}
