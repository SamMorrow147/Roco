"use client";

import { useEffect, useRef } from "react";

// Spray-fill band along the bottom of the foam section.
//
// Modeled on the SprayFillCanvas reference: a canvas exactly the size of
// the final rectangle, where every droplet is a real object whose radius
// is animated per frame. Two phases, all drawn live — no pre-rendered
// layers, no crossfades, no helper fills:
//   1. Sweep — a nozzle front moves left-to-right; dots pop in behind it.
//   2. Grow  — every dot expands from its spray size to its own target
//              radius, computed so its growth exactly covers the region
//              it is nearest to (a Voronoi-style territory). When growth
//              completes, the union of dots IS the solid rectangle — the
//              fill happens purely by expansion.
// The canvas boundary IS the bounding box: any dot near an edge is
// clipped sharp, and nothing can ever appear outside the rectangle.
//
// The rAF loop runs only during the ~5s animation, then stops for good.
// Reduced motion (or any failure) paints the finished rectangle
// immediately; with JS disabled, a plain CSS fallback block shows instead
// (see .spray-band-fallback in globals.css).

const MINT = "#a2c88f";

const SWEEP_MS = 2100;
const GROW_MS = 3400;
const BUFF_HOLD_MS = 280;
const BUFF_MS = 1650;

type Dot = { x: number; y: number; r: number; target: number };

// position="bottom" (default): band sits on the section's bottom stroke,
// dense at the line, fine specks rising. position="top": the same band
// pinned to the top stroke and flipped vertically (see .spray-band--top).
// play="buff": spray is already there; a right-to-left pass shrinks it
// away like the surface being polished to a sharp edge.
// play="speckle": the droplet texture only, no sweep and no grow — used
// as the leading edge of the mobile nav wipe.
export function SprayFillBand({
  position = "bottom",
  play = "fill",
  color = MINT,
}: {
  position?: "top" | "bottom";
  play?: "fill" | "buff" | "speckle";
  color?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // JS is running — hide the static no-JS fallback block.
    wrap.dataset.armed = "true";
    wrap.dataset.play = play;

    let raf = 0;
    let startT = 0;
    let done = false;
    let dots: Dot[] = [];
    let W = 0;
    let H = 0;

    const sizeCanvas = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      W = wrap.clientWidth;
      H = wrap.clientHeight;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const makeDots = () => {
      dots = [];
      const count = Math.round(W * 1.7); // pre-cull density; scales with width
      for (let i = 0; i < count; i++) {
        const x = Math.random() * W;
        // distance above the bottom edge, strongly bottom-biased
        const d = H * Math.pow(Math.random(), 2.2);
        const norm = d / H; // 0 at the line, 1 at the top of the box
        // density falloff: progressively cull dots toward the top
        if (Math.random() > 0.22 + 0.78 * Math.pow(1 - norm, 1.5)) continue;
        // approximate gaussian via sum of uniforms
        const g = Math.random() + Math.random() + Math.random() - 1.5;
        // size ombre: chunky at the bottom, fine specks near the top
        const r =
          Math.max(0.6, Math.min(2.8, 1.7 + g * 0.9)) *
          (0.4 + 0.75 * Math.pow(1 - norm, 1.3));
        dots.push({ x, y: H - d, r: Math.max(0.35, r), target: 0 });
      }
      dots.sort((a, b) => a.x - b.x); // sweep reveals in x order
      if (play !== "buff") computeTargets();
    };

    // Assign every dot the final radius that exactly covers its own
    // territory: sample the rectangle on a grid, hand each sample to its
    // nearest dot, and size that dot to reach its farthest sample (plus
    // margin). The union of grown dots is then guaranteed to cover the
    // whole box — the fill completes by expansion alone. Runs once per
    // play (~2k dots x ~3k samples), a few ms.
    const computeTargets = () => {
      const stepX = 6;
      const stepY = 4;
      for (const d of dots) d.target = 0;
      for (let sy = 0; sy <= H; sy += stepY) {
        const py = Math.min(sy, H - 0.5);
        for (let sx = 0; sx <= W; sx += stepX) {
          const px = Math.min(sx, W - 0.5);
          let best: Dot | null = null;
          let bestD2 = Infinity;
          for (const d of dots) {
            const dx = d.x - px;
            const dy = d.y - py;
            const d2 = dx * dx + dy * dy;
            if (d2 < bestD2) {
              bestD2 = d2;
              best = d;
            }
          }
          if (best) best.target = Math.max(best.target, Math.sqrt(bestD2));
        }
      }
      for (const d of dots) {
        // cover the farthest owned sample + inter-sample slack, and never
        // finish smaller than a healthy multiple of the spray size
        d.target = Math.max(d.r * 3.2, d.target + 5);
      }
    };

    const drawFinal = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, W, H);
    };

    const drawSpeckle = () => {
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = color;
      for (const d of dots) {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, 6.2832);
        ctx.fill();
      }
    };

    const easeInOut = (t: number) =>
      t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

    const easeBuff = (t: number) => 1 - Math.pow(1 - t, 1.55);

    const frame = (now: number) => {
      if (!startT) startT = now;
      const t = now - startT;
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = color;

      if (play === "buff") {
        // Hold the speckle, then a nozzle-in-reverse: the front walks
        // right-to-left and dots collapse as it passes, like a buffer
        // polishing the seam to a hard line.
        if (t < BUFF_HOLD_MS) {
          drawSpeckle();
          raf = requestAnimationFrame(frame);
          return;
        }
        const k = (t - BUFF_HOLD_MS) / BUFF_MS;
        if (k >= 1) {
          done = true;
          raf = 0;
          return;
        }
        const front = W + 90 - easeBuff(k) * (W + 180);
        const zone = 85;
        for (const d of dots) {
          if (d.x > front) continue;
          const pop = Math.min(1, (front - d.x) / zone);
          const r = d.r * pop;
          if (r < 0.05) continue;
          ctx.beginPath();
          ctx.arc(d.x, d.y, r, 0, 6.2832);
          ctx.fill();
        }
        raf = requestAnimationFrame(frame);
        return;
      }

      if (t <= SWEEP_MS) {
        // Phase 1: nozzle front moves across; each dot pops up to full
        // size over the ~90px behind the front.
        const front = (t / SWEEP_MS) * (W + 120);
        for (const d of dots) {
          if (d.x > front) break;
          const pop = Math.min(1, (front - d.x) / 90);
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r * (0.5 + 0.5 * pop), 0, 6.2832);
          ctx.fill();
        }
      } else if (t <= SWEEP_MS + GROW_MS) {
        // Phase 2: pure expansion — every dot eases from its spray size
        // to its own covering target. Dense bottom dots have small
        // targets and seal first; sparse top specks have larger targets
        // and close the last gaps, so the box naturally fills upward.
        const k = easeInOut((t - SWEEP_MS) / GROW_MS);
        for (const d of dots) {
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.r + (d.target - d.r) * k, 0, 6.2832);
          ctx.fill();
        }
      } else {
        drawFinal();
        done = true;
        raf = 0;
        return; // animation complete — loop ends here
      }
      raf = requestAnimationFrame(frame);
    };

    const start = () => {
      if (raf || done) return;
      if (play === "buff") {
        // Speckle is already painted; this just starts the RTL buff.
        if (reduceMotion) {
          ctx.clearRect(0, 0, W, H);
          done = true;
          return;
        }
        startT = 0;
        raf = requestAnimationFrame(frame);
        return;
      }
      sizeCanvas();
      if (reduceMotion) {
        drawFinal();
        done = true;
        return;
      }
      makeDots();
      startT = 0;
      raf = requestAnimationFrame(frame);
    };

    if (play === "buff") {
      sizeCanvas();
      if (reduceMotion) {
        done = true;
      } else {
        makeDots();
        drawSpeckle();
      }
    }

    if (play === "speckle") {
      sizeCanvas();
      makeDots();
      drawSpeckle();
      done = true;
    }

    const io =
      play === "speckle"
        ? null
        : new IntersectionObserver(
            (entries) => {
              if (entries.some((e) => e.isIntersecting)) {
                io?.disconnect();
                start();
              }
            },
            { threshold: play === "buff" ? 0.15 : 0.4 },
          );
    io?.observe(wrap);

    const onResize = () => {
      // Mobile browsers fire `resize` when the address bar collapses or
      // expands during an ordinary scroll — a height-only change with the
      // width untouched. This band only cares about width (it's a
      // horizontal sweep), so treat a same-width resize as noise and skip
      // it entirely; otherwise a live mid-scroll animation would get
      // wiped and restarted by nothing more than normal scrolling, which
      // is exactly what read as "glitchy" on phones.
      if (wrap.clientWidth === W) return;
      if (done) {
        sizeCanvas();
        if (play === "buff") ctx.clearRect(0, 0, W, H);
        else if (play === "speckle") {
          makeDots();
          drawSpeckle();
        } else drawFinal();
      } else if (play === "buff" && !raf) {
        sizeCanvas();
        makeDots();
        drawSpeckle();
      } else if (raf) {
        // resized mid-animation: rebuild at the new size and replay
        sizeCanvas();
        makeDots();
        startT = 0;
      }
    };
    window.addEventListener("resize", onResize);

    return () => {
      io?.disconnect();
      window.removeEventListener("resize", onResize);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [play, color]);

  return (
    <div
      ref={wrapRef}
      className={
        position === "top" ? "spray-band spray-band--top" : "spray-band"
      }
      aria-hidden
    >
      {/* No-JS fallback: the finished solid stroke. Hidden once JS arms. */}
      <span className="spray-band-fallback" />
      <canvas ref={canvasRef} className="spray-band-canvas" />
    </div>
  );
}
