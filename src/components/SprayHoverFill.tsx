"use client";

import { useEffect, useRef } from "react";

// Hover version of the spray-fill effect (see SprayFillBand.tsx): a canvas
// behind a button's label where mint droplets sweep across and grow until
// they fill the whole button — left-to-right by default, or bottom-to-top
// with direction="vertical". Driven by a progress value that eases toward
// 1 while hovered/focused and back toward 0 when not — so leaving
// mid-animation smoothly reverses (foam shrinks and retreats) instead of
// snapping. Same guarantees as the band: per-dot Voronoi territory targets
// mean the fill completes purely by expansion, and the canvas (clipped by
// the button's rounded corners) is the bounding box.
//
// Usage: place inside a link/button that has the .spray-hover-link class
// (position: relative + overflow: hidden) and wrap the label in
// .spray-hover-label so it sits above the canvas and flips color as the
// foam fills. The rAF loop only runs while progress is actually moving.

const MINT = "#a2c88f";

const IN_MS = 750; // hover-in: full sweep + fill
const OUT_MS = 450; // hover-out: retreat is a touch quicker
const SWEEP_PORTION = 0.45; // first chunk of progress = the sweep

type Dot = { x: number; y: number; r: number; target: number };

export function SprayHoverFill({
  fill = MINT,
  direction = "horizontal",
}: {
  fill?: string;
  direction?: "horizontal" | "vertical";
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const host = canvas?.parentElement;
    if (!canvas || !host) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduceMotion) return; // CSS hover fallback handles it

    // Marks the link as spray-enabled so CSS can flip the label color on
    // hover (kept off for no-JS / reduced-motion visitors).
    host.dataset.sprayArmed = "true";

    let raf = 0;
    let progress = 0;
    let goal = 0;
    let lastT = 0;
    let dots: Dot[] = [];
    let W = 0;
    let H = 0;

    const sizeCanvas = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = host.clientWidth;
      H = host.clientHeight;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const makeDots = () => {
      dots = [];
      const count = Math.round(W * 1.15);
      for (let i = 0; i < count; i++) {
        const x = Math.random() * W;
        // mild bottom bias for brand character; still covers the top
        const d = H * Math.pow(Math.random(), 1.25);
        const g = Math.random() + Math.random() + Math.random() - 1.5;
        const r = Math.max(0.5, Math.min(2.2, 1.3 + g * 0.7));
        dots.push({ x, y: H - d, r, target: 0 });
      }
      // Extra accumulation along the bottom edge — an additional cluster
      // of dots confined to a thin band above the bottom, layered on top
      // of the population above so the fill reads as pooled/heavier down
      // there. The top-area dots generated above are untouched.
      const bottomCount = Math.round(W * 0.9);
      const bottomBand = H * 0.25; // confine extras to the bottom ~25%
      for (let i = 0; i < bottomCount; i++) {
        const x = Math.random() * W;
        const d = bottomBand * Math.pow(Math.random(), 1.8);
        const g = Math.random() + Math.random() + Math.random() - 1.5;
        const r = Math.max(0.5, Math.min(2.2, 1.3 + g * 0.7));
        dots.push({ x, y: H - d, r, target: 0 });
      }
      // left-most first for a horizontal sweep, bottom-most first for a
      // vertical one — either way, "first" means "first revealed."
      if (direction === "vertical") {
        dots.sort((a, b) => b.y - a.y);
      } else {
        dots.sort((a, b) => a.x - b.x);
      }
      // Voronoi-style covering targets (same idea as the band, smaller box)
      const stepX = 5;
      const stepY = 4;
      for (let sy = 0; sy <= H; sy += stepY) {
        const py = Math.min(sy, H - 0.5);
        for (let sx = 0; sx <= W; sx += stepX) {
          const px = Math.min(sx, W - 0.5);
          let best: Dot | null = null;
          let bestD2 = Infinity;
          for (const dot of dots) {
            const dx = dot.x - px;
            const dy = dot.y - py;
            const d2 = dx * dx + dy * dy;
            if (d2 < bestD2) {
              bestD2 = d2;
              best = dot;
            }
          }
          if (best) best.target = Math.max(best.target, Math.sqrt(bestD2));
        }
      }
      for (const dot of dots) {
        dot.target = Math.max(dot.r * 3, dot.target + 4);
      }
    };

    const easeInOut = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      if (progress <= 0) return;
      ctx.fillStyle = fill;
      if (progress >= 1) {
        ctx.fillRect(0, 0, W, H);
        return;
      }
      const sweepP = Math.min(1, progress / SWEEP_PORTION);
      const growP =
        progress <= SWEEP_PORTION
          ? 0
          : (progress - SWEEP_PORTION) / (1 - SWEEP_PORTION);
      const eased = easeInOut(growP);
      if (direction === "vertical") {
        const front = sweepP * (H + 50);
        for (const d of dots) {
          const rise = H - d.y; // distance up from the bottom edge
          if (rise > front) break;
          const pop = Math.min(1, (front - rise) / 40);
          const r = d.r * pop + (d.target - d.r * pop) * eased;
          if (r <= 0.05) continue;
          ctx.beginPath();
          ctx.arc(d.x, d.y, r, 0, 6.2832);
          ctx.fill();
        }
      } else {
        const front = sweepP * (W + 50);
        for (const d of dots) {
          if (d.x > front) break;
          const pop = Math.min(1, (front - d.x) / 40);
          const r = d.r * pop + (d.target - d.r * pop) * eased;
          if (r <= 0.05) continue;
          ctx.beginPath();
          ctx.arc(d.x, d.y, r, 0, 6.2832);
          ctx.fill();
        }
      }
    };

    const tick = (now: number) => {
      const dt = lastT ? now - lastT : 16;
      lastT = now;
      const rate = goal > progress ? dt / IN_MS : dt / OUT_MS;
      progress =
        goal > progress
          ? Math.min(goal, progress + rate)
          : Math.max(goal, progress - rate);
      draw();
      if (progress !== goal) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
        lastT = 0;
      }
    };

    const setGoal = (g: number) => {
      goal = g;
      if (!raf) {
        if (W === 0) {
          sizeCanvas();
          makeDots();
        }
        lastT = 0;
        raf = requestAnimationFrame(tick);
      }
    };

    const onEnter = () => setGoal(1);
    const onLeave = () => setGoal(0);
    host.addEventListener("pointerenter", onEnter);
    host.addEventListener("pointerleave", onLeave);
    host.addEventListener("focusin", onEnter);
    host.addEventListener("focusout", onLeave);

    const onResize = () => {
      if (W === 0) return; // not initialized yet — next hover sizes it
      sizeCanvas();
      makeDots();
      draw();
    };
    window.addEventListener("resize", onResize);

    return () => {
      host.removeEventListener("pointerenter", onEnter);
      host.removeEventListener("pointerleave", onLeave);
      host.removeEventListener("focusin", onEnter);
      host.removeEventListener("focusout", onLeave);
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
      delete host.dataset.sprayArmed;
    };
  }, [fill, direction]);

  return <canvas ref={canvasRef} className="spray-hover-canvas" aria-hidden />;
}
