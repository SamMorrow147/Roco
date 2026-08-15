"use client";

import { foamProgress, markIntroDone, startSpray } from "@/lib/foamProgress";
import gsap from "gsap";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";

const FoamCanvas = dynamic(
  () => import("./FoamCanvas").then((mod) => mod.FoamCanvas),
  { ssr: false },
);

const QUOTE_HREF =
  "mailto:rocofoam@gmail.com?subject=Requesting Quote From RoCo Spray Foam Insulation";

const VALUE_PROPS = [
  {
    title: "High-Performance Spray Foam",
    body: "We use professional spray foam systems and modern equipment to create a tighter, more efficient building envelope built for Minnesota weather.",
    icon: "spray" as const,
  },
  {
    title: "The Right Solution for the Job",
    body: "Every project starts with a look at the actual space. We assess the building, understand what you're trying to accomplish, and recommend the right approach for the job.",
    icon: "assessment" as const,
  },
  {
    title: "Straightforward Service",
    body: "Clear communication. Fair estimates. Reliable scheduling. We tell you what needs to be done, show up when we say we will, and get to work.",
    icon: "service" as const,
  },
  {
    title: "Built to Last",
    body: "Whether we're spraying foam, pouring concrete, or laying masonry, we treat every project like it's our own. Clean work. Solid results. Done right the first time.",
    icon: "shield" as const,
  },
];

type ValuePropIconName = "spray" | "assessment" | "service" | "shield";

function ValuePropIcon({ icon }: { icon: ValuePropIconName }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (icon) {
    case "spray":
      return (
        <svg {...common} className="h-9 w-9">
          <path d="M9 3.5v3M12 3v4M15 3.5v3" />
          <path d="M7.5 8h9l1 3.5c.6 2.1.9 4.3.9 6.5a3 3 0 0 1-3 3H8.6a3 3 0 0 1-3-3c0-2.2.3-4.4.9-6.5L7.5 8Z" />
          <path d="M4 12.5h1.6M4 16h1.4" />
        </svg>
      );
    case "assessment":
      return (
        <svg {...common} className="h-9 w-9">
          <path d="M8 3.5h8a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
          <path d="M9.5 3.5v-.75a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v.75" />
          <path d="m9 12.5 2 2 4-4.5" />
          <path d="M9 17h6" />
        </svg>
      );
    case "service":
      return (
        <svg {...common} className="h-9 w-9">
          <path d="m3.5 12 4-4 3 2 3-3 3 3 4-4" />
          <path d="M3.5 12v6a1.5 1.5 0 0 0 1.5 1.5h14A1.5 1.5 0 0 0 20.5 18v-6" />
          <path d="M9 19.5v-4M15 19.5v-4" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common} className="h-9 w-9">
          <path d="M12 3.5 5 6v5.5c0 4.5 3 7.9 7 9 4-1.1 7-4.5 7-9V6l-7-2.5Z" />
          <path d="m9 12 2 2 4-4.5" />
        </svg>
      );
  }
}

type TradeIconName = "driveway" | "foundation" | "steps" | "brick" | "stone" | "chimney";

function TradeServiceIcon({ icon }: { icon: TradeIconName }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (icon) {
    case "driveway":
      return (
        <svg {...common} className="h-9 w-9">
          <path d="M8 5.5h8v3H8Z" />
          <path d="M8 8.5 4 19.5h16L16 8.5" />
          <path d="M12 8.5v11" />
        </svg>
      );
    case "foundation":
      return (
        <svg {...common} className="h-9 w-9">
          <path d="m4 11 8-6.5 8 6.5" />
          <path d="M6 11v6h12v-6" />
          <path d="M3.5 18.5h17" />
          <path d="M5 18.5v2h14v-2" />
        </svg>
      );
    case "steps":
      return (
        <svg {...common} className="h-9 w-9">
          <path d="M4 20h6v-5h5v-5h5V5" />
          <path d="M4 20V10" />
        </svg>
      );
    case "brick":
      return (
        <svg {...common} className="h-9 w-9">
          <path d="M3.5 6.5h17v12h-17Z" />
          <path d="M3.5 10.5h17M3.5 14.5h17" />
          <path d="M12 6.5v4M8 10.5v4M16 10.5v4M12 14.5v4" />
        </svg>
      );
    case "stone":
      return (
        <svg {...common} className="h-9 w-9">
          <path d="M4 15.5h7.5V20H4Z" />
          <path d="M12.5 15.5H20V20h-7.5Z" />
          <path d="M6 11h12v4.5H6Z" />
          <path d="M8 6.5h8V11H8Z" />
        </svg>
      );
    case "chimney":
      return (
        <svg {...common} className="h-9 w-9">
          <path d="M9 20.5V8.5h6v12" />
          <path d="M7.5 8.5h9" />
          <path d="M10 4.5c.5 1.3 1 2.1 2 3 1-.9 1.5-1.7 2-3" />
        </svg>
      );
  }
}

// Splatter drops around the pour's landing point: they pop in just ahead
// of the spreading mass (like slop flung out when the first glob hits),
// then get swallowed as the puddle reaches them. `at` is the pour progress
// at which each appears; positions are % of the section box, near the
// landing point at 50% / 38%.
const POUR_SPLATS = [
  { at: 0.015, left: "44%", top: "29%", size: 34, rot: -12 },
  { at: 0.03, left: "58%", top: "44%", size: 52, rot: 24 },
  { at: 0.045, left: "61%", top: "27%", size: 24, rot: 80 },
  { at: 0.06, left: "37%", top: "47%", size: 30, rot: -48 },
  { at: 0.08, left: "49%", top: "56%", size: 44, rot: 130 },
  { at: 0.1, left: "31%", top: "33%", size: 22, rot: 62 },
];

const CONCRETE_SERVICES = [
  {
    title: "Driveways & Flatwork",
    body: "Driveways, garage floors, sidewalks, approaches, and slabs poured level, finished clean, and built with proper drainage in mind.",
    icon: "driveway" as const,
  },
  {
    title: "Foundations & Slabs",
    body: "Footings, frost walls, foundations, and slab-on-grade work built to give your project a solid start.",
    icon: "foundation" as const,
  },
  {
    title: "Patios & Steps",
    body: "Durable outdoor concrete designed to handle Minnesota's changing seasons and freeze-thaw conditions year after year.",
    icon: "steps" as const,
  },
];

const MASONRY_SERVICES = [
  {
    title: "Brick & Block",
    body: "Brick veneer, structural block, and masonry walls laid straight, clean, and built to last.",
    icon: "brick" as const,
  },
  {
    title: "Stonework",
    body: "Natural and manufactured stone for exteriors, entries, fireplaces, and outdoor living spaces.",
    icon: "stone" as const,
  },
  {
    title: "Chimneys & Restoration",
    body: "Chimney work, tuckpointing, and masonry repair to keep existing walls standing through Minnesota winters.",
    icon: "chimney" as const,
  },
];

function applyReveal(progress: number, el: HTMLElement, start: number, span: number) {
  const t = gsap.utils.clamp(0, 1, (progress - start) / span);
  const eased = gsap.parseEase("power2.out")(t);
  el.style.opacity = String(eased);
  el.style.transform = `translateY(${28 * (1 - eased)}px)`;
}

export function FoamExperience() {
  const logoImgRef = useRef<HTMLImageElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const replayRef = useRef<HTMLButtonElement>(null);
  const concreteSectionRef = useRef<HTMLElement>(null);
  const concreteFillRef = useRef<HTMLDivElement>(null);
  const concreteRimRef = useRef<HTMLDivElement>(null);
  const concreteBodyRef = useRef<HTMLDivElement>(null);
  const restartRef = useRef<() => void>(() => {});

  useLayoutEffect(() => {
    // The hero logo no longer has an entrance animation — it's just a
    // static image. We still hold the spray until it's actually
    // loaded/decoded, so it never sprays over a half-painted logo.
    let begun = false;
    let fallback: number | undefined;
    const begin = () => {
      if (begun) return;
      begun = true;
      markIntroDone();
    };

    const img = logoImgRef.current;
    if (img && !img.complete) {
      img.addEventListener("load", begin, { once: true });
      img.addEventListener("error", begin, { once: true });
      // Never stall forever (e.g. a stuck request): start after 2s regardless.
      fallback = window.setTimeout(begin, 2000);
    } else {
      begin();
    }

    // ---- Concrete pour (top-down view): a glob lands, splatters, then
    // oozes outward as an irregular puddle. Scroll position only sets the
    // *target* size; a short-lived rAF loop springs the visible edge
    // toward it and wobbles the rim while it moves — so the front keeps
    // creeping for a beat after you stop scrolling, like wet concrete
    // finding its level, instead of tracking the scrollbar 1:1.
    const POUR_X = 0.5; // landing point, as fractions of the section box —
    const POUR_Y = 0.38; // must match --pour-cx / --pour-cy in globals.css
    const POINTS = 72;
    const RIM = 13; // px of darker "wet lip" showing around the surface
    const TWO_PI = Math.PI * 2;
    // Fixed per-angle lobing (three sine harmonics at co-prime frequencies)
    // turns the outline into an irregular blob instead of a geometric
    // circle. Computed once; the time-varying wobble is added per frame.
    const lobes: number[] = [];
    for (let i = 0; i < POINTS; i++) {
      const a = (i / POINTS) * TWO_PI;
      lobes.push(
        0.06 * Math.sin(3 * a + 0.9) +
          0.04 * Math.sin(7 * a + 2.2) +
          0.022 * Math.sin(13 * a + 4.6),
      );
    }
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const pour = { target: 0, r: 0, t: 0, w: 0, h: 0, frame: 0, idle: 0 };
    const splats = Array.from(
      concreteFillRef.current?.querySelectorAll<HTMLElement>("[data-splat]") ??
        [],
    );

    const renderPour = (now: number) => {
      const wrap = concreteFillRef.current;
      const rim = concreteRimRef.current;
      const body = concreteBodyRef.current;
      if (!wrap || !rim || !body) return;

      const ox = pour.w * POUR_X;
      const oy = pour.h * POUR_Y;
      // Edge wobble shrinks as the pour completes, so the finished slab
      // sits still instead of shimmering forever.
      const activity = gsap.utils.clamp(0, 1, (1 - pour.t) * 2.5);
      const wob = reduceMotion ? 0 : activity * Math.min(9, pour.r * 0.06);

      let outer = "";
      let inner = "";
      for (let i = 0; i < POINTS; i++) {
        const a = (i / POINTS) * TWO_PI;
        const wobble = wob * Math.sin(5 * a + now * 0.0021 + i * 0.35);
        const r = Math.max(0, pour.r * (1 + lobes[i]) + wobble);
        outer += `${i ? "," : ""}${(ox + Math.cos(a) * r).toFixed(1)}px ${(oy + Math.sin(a) * r).toFixed(1)}px`;
        // Surface sits inset from the lip; the inset itself varies a bit
        // so the dark rim reads as an uneven wet edge, not a stroke.
        const ri = Math.max(0, r - RIM - 4 * Math.sin(9 * a + 1.3));
        inner += `${i ? "," : ""}${(ox + Math.cos(a) * ri).toFixed(1)}px ${(oy + Math.sin(a) * ri).toFixed(1)}px`;
      }
      rim.style.clipPath = `polygon(${outer})`;
      body.style.clipPath = `polygon(${inner})`;
      wrap.style.setProperty("--pour-r", `${pour.r.toFixed(1)}px`);
      wrap.style.opacity = pour.t > 0.01 ? "1" : "0";

      for (const s of splats) {
        const at = Number(s.dataset.splat);
        const k = gsap.utils.clamp(0, 1, (pour.t - at) / 0.05);
        s.style.opacity = String(k);
        s.style.transform = `translate(-50%, -50%) scale(${0.5 + 0.5 * k}) rotate(${s.dataset.rot}deg)`;
      }
    };

    const tickPour = (now: number) => {
      pour.frame = 0;
      const diff = pour.target - pour.r;
      pour.r =
        reduceMotion || Math.abs(diff) < 0.5
          ? pour.target
          : pour.r + diff * 0.085; // the ooze: ~8.5% of the gap per frame
      renderPour(now);
      const moving = Math.abs(pour.target - pour.r) >= 0.5;
      if (moving) pour.idle = now;
      // Keep the rim wobbling for ~1s after the edge stops, then freeze —
      // no idle rAF loop hanging around once the pour has settled.
      const midPour = !reduceMotion && pour.t > 0.01 && pour.t < 0.995;
      if (moving || (midPour && now - pour.idle < 1000)) {
        pour.frame = window.requestAnimationFrame(tickPour);
      }
    };
    const wakePour = () => {
      if (pour.frame) return;
      pour.idle = performance.now();
      pour.frame = window.requestAnimationFrame(tickPour);
    };

    const updateConcrete = () => {
      const sec = concreteSectionRef.current;
      if (!sec) return;
      const rect = sec.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // 0 when the section's top touches the viewport bottom; 1 after ~85%
      // of a viewport of further scrolling — so the pour tracks the scroll.
      const raw = gsap.utils.clamp(0, 1, (vh - rect.top) / (vh * 0.85));
      // Fast-then-slow growth: constant flow into a spreading disc grows
      // the radius roughly with sqrt(volume) — power2.out reads right.
      pour.t = gsap.parseEase("power2.out")(raw);
      pour.w = rect.width;
      pour.h = rect.height;
      const ox = rect.width * POUR_X;
      const oy = rect.height * POUR_Y;
      const corners: [number, number][] = [
        [0, 0],
        [rect.width, 0],
        [0, rect.height],
        [rect.width, rect.height],
      ];
      const maxDist = corners.reduce(
        (m, [cx, cy]) => Math.max(m, Math.hypot(cx - ox, cy - oy)),
        0,
      );
      // Overshoot so the lobed edge fully clears the corners at t = 1.
      pour.target = pour.t * maxDist * 1.12;
      wakePour();
    };

    // (Parallax backdrops are pure CSS — position:fixed ::before layers
    // clipped to their sections in globals.css. No JS involved.)

    // Scroll/resize only recompute the concrete pour and the nav's
    // "scrolled" state when the browser actually has something new to show,
    // rather than polling on every animation frame regardless of input.
    // The small nav logo's fade-in is plain CSS keyed off data-scrolled —
    // no per-frame transform math needed for it at all.
    let scrollScheduled = false;
    const runScrollUpdate = () => {
      scrollScheduled = false;
      updateConcrete();
      if (navRef.current) {
        navRef.current.dataset.scrolled = window.scrollY > 24 ? "true" : "false";
      }
    };
    const scheduleScrollUpdate = () => {
      if (scrollScheduled) return;
      scrollScheduled = true;
      window.requestAnimationFrame(runScrollUpdate);
    };
    window.addEventListener("scroll", scheduleScrollUpdate, { passive: true });
    window.addEventListener("resize", scheduleScrollUpdate);
    runScrollUpdate();

    // ---- Time-driven reveal: nav / copy / replay fade in with the spray's
    // progress. Short-lived: runs only while the intro + spray are actively
    // animating, then stops itself once things settle, restarting only when
    // "Replay spray" fires it up again — rather than polling forever.
    let progressFrame = 0;
    let settledFrames = 0;
    const tickProgress = () => {
      const progress = foamProgress.value;
      if (navRef.current) applyReveal(progress, navRef.current, 0.7, 0.14);
      if (copyRef.current) applyReveal(progress, copyRef.current, 0.74, 0.16);
      if (replayRef.current) applyReveal(progress, replayRef.current, 0.86, 0.1);

      settledFrames = progress >= 1 ? settledFrames + 1 : 0;
      if (settledFrames > 2) {
        progressFrame = 0;
        return;
      }
      progressFrame = window.requestAnimationFrame(tickProgress);
    };
    const startProgressLoop = () => {
      if (progressFrame) return;
      settledFrames = 0;
      progressFrame = window.requestAnimationFrame(tickProgress);
    };
    startProgressLoop();

    restartRef.current = () => {
      startSpray();
      startProgressLoop();
    };

    return () => {
      if (fallback !== undefined) window.clearTimeout(fallback);
      window.removeEventListener("scroll", scheduleScrollUpdate);
      window.removeEventListener("resize", scheduleScrollUpdate);
      if (progressFrame) window.cancelAnimationFrame(progressFrame);
      if (pour.frame) window.cancelAnimationFrame(pour.frame);
    };
  }, []);

  return (
    <div id="top" className="relative min-h-dvh">
      <FoamCanvas />

      <main className="relative z-10 flex min-h-dvh flex-col">
        <nav
          ref={navRef}
          className="site-nav fixed inset-x-0 top-0 z-40 flex items-center justify-between gap-4 px-5 py-4 text-[0.78rem] font-semibold tracking-[0.22em] text-[#004818] uppercase opacity-0 sm:px-10"
        >
          {/* Small static logo, faded in by CSS once data-scrolled is set. */}
          <Image
            src="/brand/roco-logo.webp"
            alt="RoCo Spray Foam Insulation"
            width={1500}
            height={725}
            className="nav-logo h-8 w-auto shrink-0 sm:h-9"
          />
          <div className="flex flex-1 flex-wrap items-center justify-end gap-x-6 gap-y-2">
            <a className="nav-link" href="#top">Home</a>
            <a className="nav-link" href="#concrete">About</a>
            <a className="nav-link" href="#concrete">Services</a>
            <a className="nav-link" href="#concrete">FAQs</a>
            <a className="nav-link" href="#concrete">Gallery</a>
            <a className="nav-link" href="#contact">Contact</a>
            <a
              href={QUOTE_HREF}
              className="rounded-sm bg-[#005828] px-4 py-2 tracking-[0.18em] text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#004818] hover:shadow-md"
            >
              Request a quote
            </a>
          </div>
        </nav>

        <section className="flex flex-1 flex-col items-center justify-center px-6 pt-24 pb-24 text-center">
          <Image
            ref={logoImgRef}
            src="/brand/roco-logo.webp"
            alt="RoCo Spray Foam Insulation"
            width={1500}
            height={725}
            priority
            sizes="(min-width: 640px) 34rem, 88vw"
            className="mx-auto h-auto w-[min(88vw,34rem)]"
          />

          <div ref={copyRef} className="mt-8 max-w-xl opacity-0">
            <p className="font-eurostile text-3xl tracking-[0.08em] text-[#005828] uppercase sm:text-4xl">
              We Do It Right.
            </p>
            <p className="mt-4 text-[0.82rem] font-semibold tracking-[0.28em] text-[#004818] uppercase">
              Spray Foam. Concrete. Masonry.
            </p>
            <p className="mt-4 text-xl font-semibold text-[#004818] sm:text-2xl">
              Built for Minnesota. Insulated for every season.
            </p>
            <p className="mt-4 text-[0.9rem] font-semibold tracking-[0.22em] text-[#004818] uppercase">
              Serving Central Minnesota |{" "}
              <a href="tel:3208088500" className="underline-offset-4 hover:underline">
                320.808.8500
              </a>
            </p>
            <a
              href={QUOTE_HREF}
              className="mt-6 inline-block rounded-sm bg-[#005828] px-6 py-3 text-[0.8rem] font-semibold tracking-[0.2em] text-white uppercase shadow-sm transition hover:-translate-y-0.5 hover:bg-[#004818] hover:shadow-md"
            >
              Request a quote
            </a>
          </div>
        </section>

        <button
          ref={replayRef}
          type="button"
          onClick={() => restartRef.current()}
          className="absolute right-6 bottom-6 rounded-sm border border-[#005828]/25 bg-white/50 px-4 py-2 text-[0.75rem] font-semibold tracking-[0.22em] text-[#005828] uppercase opacity-0 backdrop-blur-sm transition hover:bg-white/80 sm:right-10 sm:bottom-8"
        >
          Replay spray
        </button>
      </main>

      <section
        id="values"
        className="foam-values relative z-10 flex min-h-[92vh] scroll-mt-20 flex-col justify-center px-6 py-32 sm:px-10"
      >
        {/* Light wash — the photo stays visible; type uses a letter halo. */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#00180a]/40 via-[#00250f]/22 to-[#00180a]/42" />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <p className="on-foam text-[0.78rem] font-semibold tracking-[0.28em] text-[#f4f1ea] uppercase">
            Why RoCo
          </p>
          <h2 className="on-foam font-eurostile mt-3 text-4xl tracking-[0.04em] text-[#f4f1ea] uppercase sm:text-5xl">
            The RoCo Difference.
          </h2>
          <p className="on-foam mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-[#f4f1ea]">
            No shortcuts. No one-size-fits-all solutions. Just experienced work, quality materials, and a crew that takes pride in the finished product.
          </p>
          <div className="mt-14 grid gap-8 text-left sm:grid-cols-2 lg:grid-cols-4">
            {VALUE_PROPS.map((prop) => (
              <div
                key={prop.title}
                className="rounded-md border border-white/20 bg-[#041208]/42 p-7 transition hover:-translate-y-1 hover:bg-[#041208]/55"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#a2c88f]/50 bg-[#a2c88f]/15 text-white">
                  <ValuePropIcon icon={prop.icon} />
                </div>
                <h3 className="on-foam font-eurostile mt-5 text-xl tracking-[0.06em] text-white uppercase">
                  {prop.title}
                </h3>
                <p className="on-foam mt-3 text-[0.95rem] font-medium leading-relaxed text-[#f4f1ea]">
                  {prop.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="concrete"
        ref={concreteSectionRef}
        className="relative z-10 scroll-mt-20 overflow-hidden bg-[#f4f1ea] px-6 py-24 sm:px-10"
      >
        {/* Top-down concrete pour: splatter drops + an irregular puddle
            that oozes outward, driven by scroll (see updateConcrete). */}
        <div
          ref={concreteFillRef}
          aria-hidden
          className="concrete-pour pointer-events-none absolute inset-0 opacity-0"
        >
          {/* Splats sit under the main mass, so it swallows them. */}
          {POUR_SPLATS.map((s) => (
            <div
              key={`${s.left}-${s.top}`}
              data-splat={s.at}
              data-rot={s.rot}
              className="concrete-splat"
              style={{
                left: s.left,
                top: s.top,
                width: s.size,
                height: s.size * 0.82,
              }}
            />
          ))}
          {/* Dark wet lip: the slightly-larger blob behind the surface. */}
          <div
            ref={concreteRimRef}
            className="concrete-pour-rim absolute inset-0"
          />
          {/* Puddle surface: texture + wet sheen, inset from the lip. */}
          <div ref={concreteBodyRef} className="absolute inset-0">
            <div className="concrete-texture absolute inset-0" />
            <div className="concrete-pour-sheen absolute inset-0" />
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-5xl">
          <div className="text-center">
            <h2 className="font-eurostile-black text-5xl tracking-[0.04em] text-[#004818] uppercase sm:text-6xl lg:text-7xl">
              Concrete & Masonry
            </h2>
            <p className="font-eurostile mt-3 text-2xl tracking-[0.08em] text-[#005828] uppercase sm:text-3xl">
              Poured. Floated. Laid.
            </p>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-[#3c4a3f]">
              From foundations to brick and stone, we pour concrete and lay masonry that&apos;s built to perform and finished with care.
            </p>
          </div>
          <div className="mt-12 grid gap-8 sm:grid-cols-3">
            {[...CONCRETE_SERVICES, ...MASONRY_SERVICES].map((service) => (
              <div
                key={service.title}
                className="rounded-md border border-[#005828]/10 bg-white/95 p-7 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#005828]/20 bg-[#005828]/10 text-[#005828]">
                  <TradeServiceIcon icon={service.icon} />
                </div>
                <h3 className="font-eurostile mt-5 text-xl tracking-[0.06em] text-[#005828] uppercase">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#3c4a3f]">
                  {service.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="concrete-crew"
        className="concrete-parallax relative z-10 flex min-h-[70vh] scroll-mt-20 flex-col justify-center px-6 py-32 sm:px-10"
      >
        {/* Dark wash — just enough for text legibility over the photo. */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a17]/55 via-[#1a1a17]/40 to-[#1a1a17]/60" />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="text-[0.78rem] font-semibold tracking-[0.28em] text-[#a2c88f] uppercase">
            On The Job
          </p>
          <h2 className="font-eurostile mt-3 text-4xl tracking-[0.04em] text-[#f4f1ea] uppercase sm:text-5xl">
            Real Work. Real Jobsites.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[#c7dab8]">
            From insulation to concrete and masonry, see the work we&apos;re putting in across Central Minnesota.
          </p>
          <p className="mt-4 text-[0.78rem] font-semibold tracking-[0.28em] text-[#a2c88f] uppercase">
            Sprayed. Poured. Built Right.
          </p>
        </div>
      </section>

      <section
        id="contact"
        className="relative z-10 scroll-mt-20 bg-[#004818] px-6 py-20 text-center sm:px-10"
      >
        <h2 className="font-eurostile text-3xl tracking-[0.06em] text-[#f4f1ea] uppercase">
          Ready to Get Started?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[#e6ecdd]">
          Tell us about your project and we&apos;ll help you figure out the right solution.
        </p>
        <p className="mt-4 text-[0.82rem] font-semibold tracking-[0.28em] text-[#a2c88f] uppercase">
          Serving Central Minnesota |{" "}
          <a href="tel:3208088500" className="underline-offset-4 hover:underline">
            320.808.8500
          </a>
        </p>
        <a
          href={QUOTE_HREF}
          className="mt-8 inline-block rounded-sm bg-white px-6 py-3 text-[0.8rem] font-semibold tracking-[0.2em] text-[#005828] uppercase shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
        >
          Request a quote
        </a>
      </section>
    </div>
  );
}
