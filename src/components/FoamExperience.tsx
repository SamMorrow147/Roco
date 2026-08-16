"use client";

import { foamProgress, markIntroDone } from "@/lib/foamProgress";
import gsap from "gsap";
import dynamic from "next/dynamic";
import Image from "next/image";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const FoamCanvas = dynamic(
  () => import("./FoamCanvas").then((mod) => mod.FoamCanvas),
  { ssr: false },
);

const QUOTE_HREF =
  "mailto:rocofoam@gmail.com?subject=Requesting Quote From RoCo Spray Foam Insulation";

const SOCIAL_LINKS = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/rocofoam",
    icon: "facebook" as const,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/rocofoam",
    icon: "instagram" as const,
  },
];

// Every entry points at a section that actually exists on the page — the
// old nav had four links ("About", "Services", "FAQs", "Gallery") all
// pointing at the same #concrete anchor, which is why it read as broken.
const NAV_LINKS = [
  { label: "Home", href: "#top", id: "top" },
  { label: "Foam", href: "#values", id: "values" },
  { label: "Concrete", href: "#concrete", id: "concrete" },
  { label: "Contact", href: "#contact", id: "contact" },
];

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
    title: "Honest Service",
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

function SocialIcon({ icon }: { icon: "facebook" | "instagram" }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (icon) {
    case "facebook":
      return (
        <svg {...common} className="h-5 w-5">
          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common} className="h-5 w-5">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
        </svg>
      );
  }
}

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
          <path d="M3.5 9h12v5.5H9" />
          <path d="M9 14.5 7.2 20.5h3.6L12.3 14.5" />
          <path d="M11.3 14.5v2.5" />
          <path d="M15.5 10h2.8v3.5H15.5Z" />
          <path d="M19.5 8c1.6.9 2.6 2.3 3 4M19.5 16c1.6-.9 2.6-2.3 3-4" />
          <circle cx="21.2" cy="7.1" r="1" />
          <circle cx="19.3" cy="6.3" r="0.55" />
          <circle cx="21.5" cy="17.1" r="0.85" />
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

function applyLogoLift(progress: number, logo: HTMLElement) {
  const lift = gsap.utils.clamp(0, 1, (progress - 0.5) / 0.28);
  const eased = gsap.parseEase("power2.out")(lift);
  logo.style.transform = `translateY(${-16 * eased}px) scale(${1 + 0.06 * eased})`;
}

export function FoamExperience() {
  const logoImgRef = useRef<HTMLImageElement>(null);
  const logoLiftRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const blockWallRef = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useLayoutEffect(() => {
    // Hero logo: grow toward the camera in 3D, then hold the spray until
    // that's finished so foam never paints over a half-started entrance.
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const logoWrap = logoLiftRef.current;
    let introTween: gsap.core.Tween | null = null;
    let begun = false;
    let fallback: number | undefined;

    if (logoWrap && !reduceMotion) {
      gsap.set(logoWrap, {
        opacity: 0,
        scale: 0.42,
        transformOrigin: "50% 65%",
      });
    }

    const begin = () => {
      if (begun) return;
      begun = true;
      if (!logoWrap || reduceMotion) {
        markIntroDone();
        return;
      }
      introTween = gsap.to(logoWrap, {
        opacity: 1,
        scale: 1,
        duration: 1.05,
        ease: "power3.out",
        onComplete: markIntroDone,
      });
    };

    const img = logoImgRef.current;
    if (img && !img.complete) {
      img.addEventListener("load", begin, { once: true });
      img.addEventListener("error", begin, { once: true });
      fallback = window.setTimeout(begin, 2000);
    } else {
      begin();
    }

    // (Parallax backdrops are pure CSS — position:fixed ::before layers
    // clipped to their sections in globals.css. No JS involved.)

    // Scroll/resize only recompute the nav's "scrolled" state when the
    // browser actually has something new to show, rather than polling on
    // every animation frame regardless of input. The small nav logo's
    // fade-in is plain CSS keyed off data-scrolled — no per-frame
    // transform math needed for it at all.
    let scrollScheduled = false;
    const runScrollUpdate = () => {
      scrollScheduled = false;
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

    // ---- Block wall: the service cards are CMU blocks that drop in from
    // above once the section scrolls into view — bottom course first, left
    // to right, each block falling with gravity (power2.in), landing with
    // a small squash-and-settle and a puff of dust. The hidden starting
    // state is applied here, pre-paint, rather than in the markup — so if
    // JS never runs the cards are simply visible.
    const wall = blockWallRef.current;
    let wallTl: gsap.core.Timeline | null = null;
    let wallObserver: IntersectionObserver | null = null;
    if (wall && !reduceMotion) {
      wall.dataset.armed = "true";
      const layBlocks = () => {
        const blocks = Array.from(
          wall.querySelectorAll<HTMLElement>(".cmu"),
        ).filter((el) => el.offsetWidth > 0);
        // Lay order comes from layout geometry, so the same code handles
        // both layouts: pyramid courses share a top (lowest course first,
        // then left to right); the single-column stack lays top to bottom.
        const measured = blocks.map((el) => {
          const r = el.getBoundingClientRect();
          return { el, top: Math.round(r.top), left: r.left };
        });
        const stacked =
          new Set(measured.map((m) => m.top)).size === measured.length;
        measured.sort((a, b) =>
          stacked ? a.top - b.top : b.top - a.top || a.left - b.left,
        );
        wallTl = gsap.timeline({
          onComplete: () => {
            // Hand transforms back to CSS so the hover lift works.
            gsap.set(blocks, { clearProps: "all" });
            delete wall.dataset.armed;
          },
        });
        measured.forEach((m, i) => {
          const at = i * 0.13;
          wallTl!
            // Fade up fast at the top of the fall, then drop the full
            // distance under gravity — the block is solid well before it
            // lands, so the impact reads.
            .to(m.el, { opacity: 1, duration: 0.14, ease: "none" }, at)
            .to(m.el, { y: 0, duration: 0.5, ease: "power2.in" }, at)
            // The thunk: a quick squash against the course below.
            .to(
              m.el,
              { y: 3, scaleY: 0.98, transformOrigin: "50% 100%", duration: 0.07, ease: "power1.out" },
              at + 0.5,
            )
            .to(m.el, { y: 0, scaleY: 1, duration: 0.12, ease: "power1.out" }, at + 0.57);
          const dust = m.el.querySelector<HTMLElement>(".cmu-dust");
          if (dust) {
            wallTl!.fromTo(
              dust,
              { opacity: 0.8, scale: 0.4 },
              { opacity: 0, scale: 1.15, duration: 0.42, ease: "power1.out" },
              at + 0.5,
            );
          }
        });
      };
      wallObserver = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            wallObserver?.disconnect();
            wallObserver = null;
            layBlocks();
          }
        },
        { threshold: 0.12 },
      );
      wallObserver.observe(wall);
    }

    // ---- Active-section tracking: highlights whichever section is
    // currently in view. Link elements (desktop row + mobile panel share
    // the same ids via [data-nav-id]) are flagged directly via dataset,
    // matching the "scrolled" pattern above — no React re-render per scroll.
    const sectionEls = NAV_LINKS.map((link) =>
      document.getElementById(link.id),
    ).filter((el): el is HTMLElement => el !== null);
    const markActiveLink = (id: string) => {
      document
        .querySelectorAll<HTMLElement>("[data-nav-id]")
        .forEach((el) => {
          el.dataset.active = el.dataset.navId === id ? "true" : "false";
        });
    };
    const sectionObserver = sectionEls.length
      ? new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) markActiveLink(entry.target.id);
            }
          },
          { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
        )
      : null;
    sectionEls.forEach((el) => sectionObserver?.observe(el));

    // Collapse the mobile menu automatically if the viewport is resized
    // (or rotated) past the point where the full desktop nav takes over.
    const mdQuery = window.matchMedia("(min-width: 768px)");
    const handleMdChange = () => {
      if (mdQuery.matches) setMobileOpen(false);
    };
    mdQuery.addEventListener("change", handleMdChange);

    // ---- Time-driven reveal: nav / copy fade in with the spray's
    // progress. Short-lived: runs only while the intro + spray are actively
    // animating, then stops itself once things settle — rather than
    // polling forever.
    let progressFrame = 0;
    let settledFrames = 0;
    const tickProgress = () => {
      const progress = foamProgress.value;
      if (logoLiftRef.current && foamProgress.introDone) {
        applyLogoLift(progress, logoLiftRef.current);
      }
      if (navRef.current) applyReveal(progress, navRef.current, 0.7, 0.14);
      if (copyRef.current) applyReveal(progress, copyRef.current, 0.74, 0.16);

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

    return () => {
      if (fallback !== undefined) window.clearTimeout(fallback);
      introTween?.kill();
      window.removeEventListener("scroll", scheduleScrollUpdate);
      window.removeEventListener("resize", scheduleScrollUpdate);
      sectionObserver?.disconnect();
      wallObserver?.disconnect();
      wallTl?.kill();
      mdQuery.removeEventListener("change", handleMdChange);
      if (progressFrame) window.cancelAnimationFrame(progressFrame);
    };
  }, []);

  // While the mobile menu is open: Escape closes it, a click/tap outside
  // the nav closes it, and the page behind it stops scrolling.
  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    const onPointerDown = (e: PointerEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setMobileOpen(false);
      }
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [mobileOpen]);

  return (
    <div id="top" className="relative min-h-dvh overflow-x-clip">
      <FoamCanvas />

      {/* The nav lives OUTSIDE <main>: main is `relative z-10`, which makes
          it a stacking context — a nav nested inside can never paint above
          sibling sections that share that z-index (they come later in the
          DOM, so they'd cover it, z-40 or not). As a direct child of the
          root, the nav's z-40 wins over every z-10 section. */}
      <nav
        ref={navRef}
        className="site-nav fixed inset-x-0 top-0 z-40 px-5 text-[0.78rem] leading-none font-semibold tracking-[0.22em] text-[#004818] uppercase opacity-0 sm:px-10"
      >
        <div className="flex h-14 items-center justify-between gap-4">
          <a href="#top" aria-label="RoCo Spray Foam Insulation — home" className="flex h-9 shrink-0 items-center">
            <Image
              src="/brand/roco-logo-mark.png"
              alt="RoCo Spray Foam Insulation"
              width={1424}
              height={560}
              unoptimized
              className="nav-logo block h-9 w-auto max-h-9 object-contain"
            />
          </a>

          <div className="hidden h-full flex-1 items-center justify-end gap-x-5 md:flex lg:gap-x-7">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                data-nav-id={link.id}
                className="nav-link whitespace-nowrap"
              >
                {link.label}
              </a>
            ))}
            <a
              href={QUOTE_HREF}
              className="inline-flex h-8 items-center whitespace-nowrap rounded-sm bg-[#005828] px-3 tracking-[0.18em] text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#004818] hover:shadow-md"
            >
              Request a quote
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen((open) => !open)}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="nav-burger inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-sm text-[#004818] transition hover:text-[#005828] md:hidden"
          >
            <span className="nav-burger-bars" data-open={mobileOpen}>
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>

        <div
          id="mobile-nav-menu"
          className="nav-mobile-menu md:hidden"
          data-open={mobileOpen}
          hidden={!mobileOpen}
        >
          <div className="flex flex-col items-center gap-1 pt-3 pb-8">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                data-nav-id={link.id}
                onClick={() => setMobileOpen(false)}
                className="nav-link nav-link-mobile text-center"
              >
                {link.label}
              </a>
            ))}
            <a
              href={QUOTE_HREF}
              onClick={() => setMobileOpen(false)}
              className="mt-4 inline-flex items-center justify-center rounded-sm bg-[#005828] px-6 py-3.5 text-center tracking-[0.18em] text-white shadow-sm transition hover:bg-[#004818]"
            >
              Request a quote
            </a>
          </div>
        </div>
      </nav>

      <main className="relative z-10 flex min-h-dvh flex-col">
        <section className="flex flex-1 flex-col items-center justify-center px-6 pt-24 pb-24 text-center">
          <div className="logo-stage">
            <div ref={logoLiftRef} className="hero-logo">
              <Image
                ref={logoImgRef}
                src="/brand/roco-logo.webp"
                alt="RoCo Spray Foam Insulation"
                width={1500}
                height={725}
                priority
                sizes="(min-width: 640px) 34rem, 100vw"
                className="mx-auto h-auto w-full max-w-[34rem]"
              />
            </div>
          </div>

          <div ref={copyRef} className="mt-8 max-w-xl opacity-0">
            <p className="font-eurostile-black text-3xl tracking-[0.08em] text-[#005828] uppercase sm:text-4xl">
              We Do It Right.
            </p>
            <p className="mt-4 text-xl text-[#004818] sm:text-2xl">
              <span className="font-eurostile-black block">Built for Minnesota.</span>
              <span className="font-eurostile mt-1 block">Insulated for every season.</span>
            </p>
            <p className="mt-4 text-[0.82rem] font-semibold tracking-[0.28em] text-[#004818] uppercase">
              Spray Foam. Concrete. Masonry.
            </p>
            <p className="mt-4 text-[0.9rem] font-semibold tracking-[0.22em] text-[#004818] uppercase">
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
      </main>

      <section
        id="values"
        className="foam-values relative z-10 flex min-h-[62vh] scroll-mt-24 flex-col justify-center px-6 py-20 sm:px-10 sm:py-28"
      >
        {/* Logo mint, sitting on top of the photo wash so the join reads as
            a stroke rather than a seam. */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[3px] bg-[#a2c88f]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[3px] bg-[#a2c88f]"
          aria-hidden
        />
        {/* Light wash — the photo stays visible; type uses a letter halo. */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#00180a]/40 via-[#00250f]/22 to-[#00180a]/42" />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p className="on-foam text-[0.78rem] font-semibold tracking-[0.28em] text-[#f4f1ea] uppercase">
            Why RoCo Foam
          </p>
          <h2 className="on-foam mt-3 text-4xl tracking-[0.04em] text-[#f4f1ea] uppercase sm:text-5xl">
            <span className="font-eurostile-black block">A Better Seal.</span>
            <span className="font-eurostile mt-1 block">A Better Build.</span>
          </h2>
          <p className="on-foam mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-[#f4f1ea]">
            Properly installed spray foam creates a tight, continuous insulation barrier that helps control drafts, improve efficiency, and keep your space comfortable year-round.
          </p>
        </div>
      </section>

      {/* Value props live in their own solid-color section below the photo
          rather than sitting on top of it, so the cards read clearly and
          the photo section keeps its own breathing room. */}
      <section className="relative z-10 bg-[#00250f] px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 text-left sm:grid-cols-2 lg:grid-cols-4">
            {VALUE_PROPS.map((prop) => (
              <div
                key={prop.title}
                className="rounded-md border border-white/20 bg-[#041208]/42 p-7 transition hover:-translate-y-1 hover:bg-[#041208]/55"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#a2c88f]/50 bg-[#a2c88f]/15 text-white">
                  <ValuePropIcon icon={prop.icon} />
                </div>
                <h3 className="font-eurostile mt-5 text-center text-xl tracking-[0.06em] text-white uppercase sm:text-left">
                  {prop.title}
                </h3>
                <p className="mt-3 text-[0.95rem] font-medium leading-relaxed text-[#f4f1ea]">
                  {prop.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="concrete"
        className="concrete-parallax relative z-10 flex min-h-[62vh] scroll-mt-24 flex-col justify-center px-6 py-20 sm:px-10 sm:py-28"
      >
        {/* Dark wash — just enough for text legibility over the jobsite photo. */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a17]/55 via-[#1a1a17]/40 to-[#1a1a17]/60" />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <h2 className="on-foam text-4xl tracking-[0.04em] text-[#f4f1ea] uppercase sm:text-5xl">
            <span className="font-eurostile-black block">Concrete & Masonry</span>
            <span className="font-eurostile mt-1 block">Poured Right. Built Solid.</span>
          </h2>
          <p className="on-foam mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-[#f4f1ea]">
            From slabs and foundations to block, brick, and stone, we build it to last and finish it right.
          </p>
        </div>
      </section>

      {/* Service cards live in their own textured section below the photo
          rather than sitting on top of it, so the block wall reads clearly
          and the photo section keeps its own breathing room. */}
      <section className="concrete-services-bg relative z-10 px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-5xl">
          {/* CMU block wall: two courses of three, stacked like block on a
              jobsite. Placement, mortar joints, and textured faces live in
              globals.css; the lay-in animation is in the effect above. */}
          <div ref={blockWallRef} className="block-wall">
            {CONCRETE_SERVICES.map((service) => (
              <div key={service.title} className="cmu p-7">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#005828]/20 bg-[#005828]/10 text-[#005828]">
                  <TradeServiceIcon icon={service.icon} />
                </div>
                <h3 className="font-eurostile mt-5 text-center text-xl tracking-[0.06em] text-[#005828] uppercase">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#3c4a3f]">
                  {service.body}
                </p>
                <span className="cmu-dust" aria-hidden />
              </div>
            ))}
            {MASONRY_SERVICES.map((service) => (
              <div key={service.title} className="cmu p-7">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#005828]/20 bg-[#005828]/10 text-[#005828]">
                  <TradeServiceIcon icon={service.icon} />
                </div>
                <h3 className="font-eurostile mt-5 text-center text-xl tracking-[0.06em] text-[#005828] uppercase">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#3c4a3f]">
                  {service.body}
                </p>
                <span className="cmu-dust" aria-hidden />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="masonry-parallax relative z-10 flex min-h-[62vh] scroll-mt-24 flex-col justify-center px-6 py-20 text-center sm:px-10 sm:py-28"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#004818]/22 via-[#003117]/12 to-[#00250f]/28" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <p className="on-foam text-[0.78rem] font-semibold tracking-[0.28em] text-[#f4f1ea] uppercase">
            Serving Central Minnesota |{" "}
            <a href="tel:3208088500" className="underline-offset-4 hover:underline">
              320.808.8500
            </a>
          </p>
          <h2 className="on-foam mt-3 text-4xl tracking-[0.04em] text-[#f4f1ea] uppercase sm:text-5xl">
            <span className="font-eurostile-black block">Ready to Get Started?</span>
          </h2>
          <p className="on-foam mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-[#f4f1ea]">
            Tell us about your project and we&apos;ll help you figure out the right solution.
          </p>
          <a
            href={QUOTE_HREF}
            className="mt-8 inline-block rounded-sm bg-white px-6 py-3 text-[0.8rem] font-semibold tracking-[0.2em] text-[#005828] uppercase shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            Request a quote
          </a>
        </div>
      </section>

      <footer className="relative z-10 bg-[#f4f1ea] px-6 py-14 text-center sm:px-10">
        <a href="#top" className="inline-block">
          <Image
            src="/brand/roco-logo.webp"
            alt="RoCo Spray Foam Insulation"
            width={1500}
            height={725}
            className="mx-auto h-14 w-auto sm:h-16"
          />
        </a>
        <div className="mt-7 flex items-center justify-center gap-3">
          {SOCIAL_LINKS.map((social) => (
            <a
              key={social.label}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={social.label}
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[#005828]/25 text-[#005828] transition hover:-translate-y-0.5 hover:border-[#005828] hover:bg-[#005828] hover:text-white"
            >
              <SocialIcon icon={social.icon} />
            </a>
          ))}
        </div>
        <p className="mt-7 text-[0.68rem] font-semibold tracking-[0.22em] text-[#005828]/70 uppercase">
          <a href="tel:3208088500" className="hover:text-[#005828]">
            320.808.8500
          </a>
          {" · "}
          <a href="mailto:rocofoam@gmail.com" className="hover:text-[#005828]">
            rocofoam@gmail.com
          </a>
        </p>
        <p className="mt-3 text-[0.65rem] tracking-[0.18em] text-[#005828]/55 uppercase">
          © {new Date().getFullYear()} RoCo Spray Foam Insulation
        </p>
      </footer>
    </div>
  );
}
