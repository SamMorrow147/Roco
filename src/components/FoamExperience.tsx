"use client";

import { foamProgress, markIntroDone } from "@/lib/foamProgress";
import { SprayFillBand } from "@/components/SprayFillBand";
import { SprayHoverFill } from "@/components/SprayHoverFill";
import { QUOTE_HREF } from "@/lib/site";
import gsap from "gsap";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

const FoamCanvas = dynamic(
  () => import("./FoamCanvas").then((mod) => mod.FoamCanvas),
  { ssr: false },
);

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
    title: "The Right Solution\nfor the Job",
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

// Pistachio 1px frame that draws around a value card from the top-left.
// Sized in JS so the stroke sits on the box edge; pathLength=1 lets CSS
// animate dashoffset 1→0 regardless of the card's pixel perimeter.
function DrawBoxStroke() {
  const svgRef = useRef<SVGSVGElement>(null);
  const rectRef = useRef<SVGRectElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const rect = rectRef.current;
    if (!svg || !rect) return;

    const sync = () => {
      const w = svg.clientWidth;
      const h = svg.clientHeight;
      const sw = 1;
      const r = 6;
      rect.setAttribute("x", String(sw / 2));
      rect.setAttribute("y", String(sw / 2));
      rect.setAttribute("width", String(Math.max(0, w - sw)));
      rect.setAttribute("height", String(Math.max(0, h - sw)));
      rect.setAttribute(
        "rx",
        String(Math.min(r, (w - sw) / 2, (h - sw) / 2)),
      );
    };

    const ro = new ResizeObserver(sync);
    ro.observe(svg);
    sync();
    return () => ro.disconnect();
  }, []);

  return (
    <svg
      ref={svgRef}
      className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      aria-hidden
    >
      <rect
        ref={rectRef}
        className="value-card-stroke"
        pathLength={1}
        fill="none"
        stroke="#a2c88f"
        strokeWidth={1}
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

function ValuePropIcon({ icon }: { icon: ValuePropIconName }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  switch (icon) {
    case "spray":
      return (
        <svg {...common} className="h-16 w-16">
          <path d="M3.5 9h12v5.5H9" />
          <path d="M9 14.5 7.2 20.5h3.6L12.3 14.5" />
          <path d="M11.3 14.5v2.5" />
          <path d="M15.5 10h2.8v3.5H15.5Z" />
          <path d="M19.2 11.75h4.2" />
          <path d="M19.1 10.9 22.8 8" />
          <path d="M19.1 12.6 22.8 15.5" />
          <path d="M19.3 10.1 22 6.5" />
          <path d="M19.3 13.4 22 17" />
          <circle cx="20.5" cy="8.5" r="0.45" fill="currentColor" stroke="none" />
          <circle cx="22.6" cy="7" r="0.35" fill="currentColor" stroke="none" />
          <circle cx="23.5" cy="10.1" r="0.4" fill="currentColor" stroke="none" />
          <circle cx="23.6" cy="13.5" r="0.35" fill="currentColor" stroke="none" />
          <circle cx="22.4" cy="16.5" r="0.4" fill="currentColor" stroke="none" />
          <circle cx="20.6" cy="15.3" r="0.3" fill="currentColor" stroke="none" />
          <circle cx="23.3" cy="11.8" r="0.28" fill="currentColor" stroke="none" />
        </svg>
      );
    case "assessment":
      return (
        <svg {...common} className="h-16 w-16">
          <path d="M8 3.5h8a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1H8a1 1 0 0 1-1-1V4.5a1 1 0 0 1 1-1Z" />
          <path d="M9.5 3.5v-.75a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v.75" />
          <path d="m9 12.5 2 2 4-4.5" />
          <path d="M9 17h6" />
        </svg>
      );
    case "service":
      return (
        <svg {...common} className="h-16 w-16">
          <path d="m3.5 12 4-4 3 2 3-3 3 3 4-4" />
          <path d="M3.5 12v6a1.5 1.5 0 0 0 1.5 1.5h14A1.5 1.5 0 0 0 20.5 18v-6" />
          <path d="M9 19.5v-4M15 19.5v-4" />
        </svg>
      );
    case "shield":
      return (
        <svg {...common} className="h-16 w-16">
          <path d="M12 3.5 5 6v5.5c0 4.5 3 7.9 7 9 4-1.1 7-4.5 7-9V6l-7-2.5Z" />
          <path d="m9 12 2 2 4-4.5" />
        </svg>
      );
  }
}

type TradeIconName = "driveway" | "foundation" | "steps" | "brick" | "stone" | "chimney";

/** Flat line icons — same viewBox and stroke for every service card. */
function TradeIcon({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="h-20 w-20"
      aria-hidden
    >
      {children}
    </svg>
  );
}

function TradeServiceIcon({ icon }: { icon: TradeIconName }) {
  switch (icon) {
    case "driveway":
      return (
        <TradeIcon>
          <path d="M6 14h36v20H6Z" />
          <path d="M24 14v20" />
          <path d="M6 24h36" />
        </TradeIcon>
      );
    case "foundation":
      return (
        <TradeIcon>
          <path d="M24 5 8 20h32Z" />
          <path d="M12 20v16" />
          <path d="M36 20v16" />
          <path d="M21 36v-9h6" />
          <path d="M5 36h38v7H5Z" />
        </TradeIcon>
      );
    case "steps":
      return (
        <TradeIcon>
          <path d="M5 41h13V31h10V21h10V11h8" />
        </TradeIcon>
      );
    case "brick":
      return (
        <TradeIcon>
          <path d="M4 32h40v11H4Z" />
          <path d="M24 32v11" />
          <path d="M16 20h28v12" />
          <path d="M16 20v12" />
          <path d="M30 20v12" />
          <path d="M28 8h16v12" />
          <path d="M28 8v12" />
        </TradeIcon>
      );
    case "stone":
      return (
        <TradeIcon>
          <path d="M6 6h23v17H6Z" />
          <path d="M32 6h10v17H32Z" />
          <path d="M6 26h13v16H6Z" />
          <path d="M22 26h20v16H22Z" />
        </TradeIcon>
      );
    case "chimney":
      return (
        <TradeIcon>
          <path d="M14 4h20v6h-5v32H19V10h-5Z" />
        </TradeIcon>
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

function applyLogoLift(
  progress: number,
  logo: HTMLElement,
  mark?: HTMLElement | null,
) {
  const lift = gsap.utils.clamp(0, 1, (progress - 0.5) / 0.28);
  const eased = gsap.parseEase("power2.out")(lift);
  logo.style.transform = `translateY(${-16 * eased}px) scale(${1 + 0.06 * eased})`;
  if (!mark) return;
  // Shadow drops and spreads as the mark lifts toward the camera.
  const y = 4 + 18 * eased;
  const blur = 8 + 18 * eased;
  const alpha = 0.2 + 0.16 * eased;
  mark.style.filter = `drop-shadow(0 ${y}px ${blur}px rgba(0, 32, 12, ${alpha}))`;
}

function playLogoGrowIn(logoWrap: HTMLElement) {
  gsap.fromTo(
    logoWrap,
    { opacity: 0, scale: 0.42, transformOrigin: "50% 65%" },
    { opacity: 1, scale: 1, duration: 1.05, ease: "power3.out" },
  );
}

export function FoamExperience() {
  const logoImgRef = useRef<HTMLImageElement>(null);
  const logoLiftRef = useRef<HTMLDivElement>(null);
  const concreteLogoLiftRef = useRef<HTMLDivElement>(null);
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const blockWallRef = useRef<HTMLDivElement>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const replayHeroRef = useRef<() => void>(() => {});

  const goHome = (event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setMobileOpen(false);
    const atTop = window.scrollY < 120;
    window.scrollTo({ top: 0, behavior: atTop ? "auto" : "smooth" });
    if (atTop) replayHeroRef.current();
  };

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
    // every animation frame regardless of input. Once the bar has shown
    // (user scrolled past the hero), it stays — scrolling back to the
    // top must not hide the logo or cream bar.
    let navLatched = false;
    let scrollScheduled = false;
    const runScrollUpdate = () => {
      scrollScheduled = false;
      if (!navRef.current) return;
      if (window.scrollY > 24) navLatched = true;
      navRef.current.dataset.scrolled = navLatched ? "true" : "false";
    };
    const scheduleScrollUpdate = () => {
      if (scrollScheduled) return;
      scrollScheduled = true;
      window.requestAnimationFrame(runScrollUpdate);
    };
    window.addEventListener("scroll", scheduleScrollUpdate, { passive: true });
    window.addEventListener("resize", scheduleScrollUpdate);
    runScrollUpdate();

    // ---- Block wall: cards fade up when the section enters view.
    // Same recipe as [data-reveal]: hidden state is applied here so
    // without JS the wall is simply visible.
    const wall = blockWallRef.current;
    let wallTl: gsap.core.Timeline | null = null;
    let wallObserver: IntersectionObserver | null = null;
    if (wall && !reduceMotion) {
      wall.dataset.armed = "true";
      const revealBlocks = () => {
        const blocks = Array.from(
          wall.querySelectorAll<HTMLElement>(".cmu"),
        ).filter((el) => el.offsetWidth > 0);
        wallTl = gsap.timeline({
          onComplete: () => {
            gsap.set(blocks, { clearProps: "all" });
            delete wall.dataset.armed;
          },
        });
        wallTl.fromTo(
          blocks,
          { opacity: 0, y: 16 },
          {
            opacity: 1,
            y: 0,
            duration: 0.5,
            stagger: 0.07,
            ease: "power2.out",
          },
        );
      };
      wallObserver = new IntersectionObserver(
        (entries) => {
          if (entries.some((e) => e.isIntersecting)) {
            wallObserver?.disconnect();
            wallObserver = null;
            revealBlocks();
          }
        },
        { threshold: 0.12 },
      );
      wallObserver.observe(wall);
    }

    // ---- Concrete logo: same scale-in as the hero foam logo, triggered
    // the first time the concrete section scrolls into view.
    const concreteLogoWrap = concreteLogoLiftRef.current;
    let concreteLogoObserver: IntersectionObserver | null = null;
    if (concreteLogoWrap && !reduceMotion) {
      gsap.set(concreteLogoWrap, {
        opacity: 0,
        scale: 0.42,
        transformOrigin: "50% 65%",
      });
      concreteLogoObserver = new IntersectionObserver(
        (entries) => {
          if (!entries.some((entry) => entry.isIntersecting)) return;
          concreteLogoObserver?.disconnect();
          playLogoGrowIn(concreteLogoWrap);
        },
        { threshold: 0.35, rootMargin: "0px 0px -8% 0px" },
      );
      concreteLogoObserver.observe(concreteLogoWrap);
    }

    // ---- Scroll reveals: section titles and copy fade up the first time
    // they enter the viewport. Same recipe as the block wall: the hidden
    // state is applied here pre-paint (never in the markup, so without JS
    // everything is simply visible), GSAP owns the tween, and styles are
    // handed back to CSS on completion so Tailwind hover transforms keep
    // working. The hero, nav, and block wall keep their own intros —
    // nothing here touches an element that already animates.
    const revealEls = Array.from(
      document.querySelectorAll<HTMLElement>("[data-reveal]"),
    );
    let revealObserver: IntersectionObserver | null = null;
    if (revealEls.length && !reduceMotion) {
      // transition:none while armed — some of these elements carry
      // Tailwind's `transition` utility for hover states, which would
      // otherwise smooth (and lag) every frame GSAP writes.
      gsap.set(revealEls, { opacity: 0, y: 26, transition: "none" });
      revealEls.forEach((el) => {
        if (el.classList.contains("value-card")) {
          el.dataset.strokeArmed = "true";
        }
      });
      revealObserver = new IntersectionObserver(
        (entries) => {
          // Everything entering in the same batch rises together,
          // staggered in DOM order. On mobile, elements tend to enter
          // one at a time, so each simply plays as it arrives.
          const batch = entries
            .filter((entry) => entry.isIntersecting)
            .map((entry) => entry.target as HTMLElement)
            .sort((a, b) => revealEls.indexOf(a) - revealEls.indexOf(b));
          batch.forEach((el, i) => {
            revealObserver?.unobserve(el);
            gsap.to(el, {
              opacity: 1,
              y: 0,
              duration: 0.65,
              delay: i * 0.12,
              ease: "power2.out",
              onStart: () => {
                if (el.classList.contains("value-card")) {
                  el.dataset.strokeOn = "true";
                }
              },
              onComplete: () => gsap.set(el, { clearProps: "all" }),
            });
          });
        },
        { threshold: 0.25, rootMargin: "0px 0px -6% 0px" },
      );
      revealEls.forEach((el) => revealObserver!.observe(el));
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
    let navRevealed = false;
    const tickProgress = () => {
      const progress = foamProgress.value;
      if (logoLiftRef.current && foamProgress.introDone) {
        applyLogoLift(progress, logoLiftRef.current, logoImgRef.current);
      }
      if (navRef.current && !navRevealed) {
        applyReveal(progress, navRef.current, 0.7, 0.14);
        if (progress >= 0.84) navRevealed = true;
      }
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

    replayHeroRef.current = () => {
      introTween?.kill();
      foamProgress.introDone = false;
      foamProgress.value = 0;
      foamProgress.startedAt = -1;
      if (progressFrame) {
        window.cancelAnimationFrame(progressFrame);
        progressFrame = 0;
      }
      if (copyRef.current) applyReveal(0, copyRef.current, 0.74, 0.16);
      if (logoImgRef.current) logoImgRef.current.style.filter = "none";
      startProgressLoop();
      if (!logoWrap || reduceMotion) {
        markIntroDone();
        return;
      }
      gsap.set(logoWrap, {
        opacity: 0,
        scale: 0.42,
        transformOrigin: "50% 65%",
      });
      introTween = gsap.to(logoWrap, {
        opacity: 1,
        scale: 1,
        duration: 1.05,
        ease: "power3.out",
        onComplete: markIntroDone,
      });
    };

    return () => {
      if (fallback !== undefined) window.clearTimeout(fallback);
      introTween?.kill();
      window.removeEventListener("scroll", scheduleScrollUpdate);
      window.removeEventListener("resize", scheduleScrollUpdate);
      sectionObserver?.disconnect();
      wallObserver?.disconnect();
      wallTl?.kill();
      concreteLogoObserver?.disconnect();
      gsap.killTweensOf(concreteLogoWrap);
      revealObserver?.disconnect();
      gsap.killTweensOf(revealEls);
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
      const target = e.target as Node;
      const insideNav = navRef.current?.contains(target);
      const insideMenu = mobileMenuRef.current?.contains(target);
      if (!insideNav && !insideMenu) {
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
    <div className="relative min-h-dvh overflow-x-clip">
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
          <a
            href="#top"
            onClick={goHome}
            aria-label="RoCo Spray Foam Insulation — home"
            className="flex h-9 shrink-0 items-center"
          >
            <Image
              src="/brand/roco-nav-logo.png"
              alt="RoCo Spray Foam Insulation"
              width={842}
              height={187}
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
                onClick={link.id === "top" ? goHome : undefined}
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
      </nav>

      {/* Rendered as a sibling of <nav>, not a descendant: applyReveal()
          sets a `transform` directly on navRef.current for the scroll-in
          animation, and any transform on an ancestor turns it into the
          containing block for position:fixed descendants — which would
          trap this panel's fixed positioning against the 56px-tall nav
          bar instead of the viewport (net result: a zero-height, invisible
          panel). Keeping it outside <nav> avoids that entirely. The
          outside-click handler above checks both navRef and this ref. */}
      <div
        id="mobile-nav-menu"
        ref={mobileMenuRef}
        className="nav-mobile-menu z-40 md:hidden"
        data-open={mobileOpen}
        inert={!mobileOpen}
      >
        <div className="nav-mobile-wipe" aria-hidden>
          <span className="nav-mobile-fill" />
          <SprayFillBand play="speckle" color="#f4f1ea" />
        </div>
        <div className="nav-mobile-menu-content">
          <div className="flex flex-col items-center gap-5">
            {NAV_LINKS.map((link) => (
              <a
                key={link.id}
                href={link.href}
                data-nav-id={link.id}
                onClick={(event) => {
                  setMobileOpen(false);
                  if (link.id === "top") goHome(event);
                }}
                className="nav-link nav-link-mobile text-center"
              >
                {link.label}
              </a>
            ))}
            <a
              href={QUOTE_HREF}
              onClick={() => setMobileOpen(false)}
              className="mt-6 inline-flex items-center justify-center rounded-sm bg-[#005828] px-10 py-5 text-center text-base tracking-[0.18em] text-white shadow-sm transition hover:bg-[#004818]"
            >
              Request a quote
            </a>
          </div>
        </div>
      </div>

      <main className="relative z-10 flex min-h-dvh flex-col">
        <section
          id="top"
          className="flex flex-1 flex-col items-center justify-center px-6 pt-24 pb-24 text-center"
        >
          <div className="logo-stage w-[110%] sm:w-full sm:max-w-[34rem]">
            <div ref={logoLiftRef} className="hero-logo">
              <Image
                ref={logoImgRef}
                src="/brand/roco-logo.webp"
                alt="RoCo Spray Foam Insulation"
                width={1500}
                height={725}
                priority
                sizes="(min-width: 640px) 34rem, 100vw"
                className="hero-logo-mark mx-auto h-auto w-full max-w-[34rem]"
              />
            </div>
          </div>

          <div ref={copyRef} className="mt-5 flex max-w-xl flex-col items-center gap-5 opacity-0 sm:mt-8 sm:gap-4">
            <p className="flex flex-col gap-2 text-xl text-[#004818] sm:text-2xl">
              <span className="font-eurostile-black">Built for Minnesota.</span>
              <span className="font-eurostile">Insulated for every season.</span>
            </p>
            <p className="text-[0.82rem] font-semibold tracking-[0.22em] text-[#004818] uppercase">
              <a href="#values" className="nav-link-inline">
                Spray Foam
              </a>
              .{" "}
              <a href="#concrete" className="nav-link-inline">
                Concrete
              </a>
              .{" "}
              <a href="#contact" className="nav-link-inline">
                Masonry
              </a>
              .
            </p>
            <p className="text-[0.9rem] font-semibold tracking-[0.22em] text-[#004818] uppercase">
              <a href="tel:3208088500" className="underline-offset-4 hover:underline">
                320.808.8500
              </a>
            </p>
            <a
              href={QUOTE_HREF}
              className="inline-block rounded-sm bg-[#005828] px-6 py-3 text-[0.8rem] font-semibold tracking-[0.2em] text-white uppercase shadow-sm transition hover:-translate-y-0.5 hover:bg-[#004818] hover:shadow-md"
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
        {/* Spray bands: canvas strips along the top and bottom lines —
            dots sweep on, grow per frame, and merge into one solid mint
            stroke. The top band is the same effect flipped vertically
            (dense at the top stroke, specks trailing down). All drawing
            and triggering lives in SprayFillBand.tsx. */}
        <SprayFillBand position="top" />
        <SprayFillBand />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <p data-reveal className="on-foam text-[0.78rem] font-semibold tracking-[0.28em] text-[#f4f1ea] uppercase">
            Why RoCo Foam
          </p>
          <h2 data-reveal className="on-foam mt-3 text-4xl tracking-[0.04em] text-[#f4f1ea] uppercase sm:text-5xl">
            <span className="font-eurostile-black block">A Better Seal.</span>
            <span className="font-eurostile-regular mt-1 block">For A Better Build.</span>
          </h2>
          <p data-reveal className="on-foam mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-[#f4f1ea]">
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
                data-reveal
                className="value-card relative rounded-md bg-[#041208]/42 p-7 transition hover:-translate-y-1 hover:bg-[#041208]/55"
              >
                <DrawBoxStroke />
                <div className="mx-auto flex justify-center text-white sm:mx-0 sm:justify-start">
                  <ValuePropIcon icon={prop.icon} />
                </div>
                <h3 className="font-eurostile mt-5 text-center text-xl tracking-[0.06em] whitespace-pre-line text-white uppercase sm:text-left">
                  {prop.title}
                </h3>
                <p className="mt-3 text-[0.95rem] font-medium leading-relaxed text-[#f4f1ea]">
                  {prop.body}
                </p>
              </div>
            ))}
          </div>
          {/* Quote on the left, benefits deep-dive on the right. Stacks
              centered on phones. Reveals with the cards above. */}
          <div data-reveal className="mt-10 flex flex-col items-center justify-between gap-4 sm:flex-row">
            <Link
              href={QUOTE_HREF}
              className="spray-hover-link spray-hover-link--invert inline-block rounded-sm border border-[#a2c88f] bg-[#a2c88f] px-6 py-3 text-[0.8rem] font-semibold tracking-[0.2em] text-[#00250f] uppercase transition hover:-translate-y-0.5"
            >
              <SprayHoverFill fill="#f4f1ea" />
              <span className="spray-hover-label">Get a Quote</span>
            </Link>
            <Link
              href="/spray-foam-benefits"
              className="spray-hover-link inline-block rounded-sm border border-[#a2c88f]/60 px-6 py-3 text-[0.8rem] font-semibold tracking-[0.2em] text-[#f4f1ea] uppercase transition hover:-translate-y-0.5 hover:border-[#a2c88f] hover:bg-[#a2c88f]/15"
            >
              <SprayHoverFill />
              <span className="spray-hover-label">
                Spray Foam Benefits
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section
        id="concrete"
        className="concrete-parallax relative z-10 flex min-h-[90vh] scroll-mt-24 flex-col justify-center px-6 py-32 sm:px-10 sm:py-40"
      >
        {/* Dark wash — just enough for text legibility over the jobsite photo. */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a1a17]/55 via-[#1a1a17]/40 to-[#1a1a17]/60" />
        <div className="relative z-10 mx-auto max-w-3xl text-center">
          <div className="logo-stage mx-auto mb-6 w-full max-w-[34rem]">
            <div ref={concreteLogoLiftRef} className="hero-logo">
              <Image
                src="/brand/roco-concrete-logo.png"
                alt="RoCo Concrete Services"
                width={1024}
                height={490}
                unoptimized
                sizes="(min-width: 640px) 34rem, 100vw"
                className="mx-auto h-auto w-full max-w-[34rem]"
              />
            </div>
          </div>
          <h2 data-reveal className="on-foam text-4xl tracking-[0.04em] text-[#f4f1ea] uppercase sm:text-5xl">
            <span className="font-eurostile-black block">Built Solid.</span>
            <span className="font-eurostile-regular mt-1 block">Poured Right.</span>
          </h2>
          <p data-reveal className="on-foam mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-[#f4f1ea]">
            From slabs and foundations to block, brick, and stone, we build it to last and finish it right.
          </p>
        </div>
        {/* Spray along the photo's bottom edge — already there, then
            buffed away right-to-left so the join with the concrete
            texture below reads as a sharp polished line. */}
        <SprayFillBand play="buff" color="#c8c9cb" />
      </section>

      {/* Service cards live in their own textured section below the photo
          rather than sitting on top of it, so the block wall reads clearly
          and the photo section keeps its own breathing room. */}
      <section className="concrete-services-bg relative z-10 px-6 py-20 sm:px-10">
        <div className="mx-auto max-w-5xl">
          {/* CMU block wall: two courses of three. Placement, mortar
              joints, and textured faces live in globals.css. */}
          <div ref={blockWallRef} className="block-wall">
            {CONCRETE_SERVICES.map((service) => (
              <div key={service.title} className="cmu p-7">
                <div className="mx-auto flex h-24 items-center justify-center text-[#1f1f1f]">
                  <TradeServiceIcon icon={service.icon} />
                </div>
                <h3 className="font-eurostile mt-5 text-center text-xl tracking-[0.06em] text-[#1f1f1f] uppercase">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#4a4a4a]">
                  {service.body}
                </p>
              </div>
            ))}
            {MASONRY_SERVICES.map((service) => (
              <div key={service.title} className="cmu p-7">
                <div className="mx-auto flex h-24 items-center justify-center text-[#1f1f1f]">
                  <TradeServiceIcon icon={service.icon} />
                </div>
                <h3 className="font-eurostile mt-5 text-center text-xl tracking-[0.06em] text-[#1f1f1f] uppercase">
                  {service.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[#4a4a4a]">
                  {service.body}
                </p>
              </div>
            ))}
          </div>
          {/* Deep-dive link: mirrors the spray foam benefits button above —
              right-aligned under the block wall on desktop, centered on
              mobile. Reveals on scroll. */}
          <div data-reveal className="mt-10 text-center sm:text-right">
            <Link
              href="/concrete-masonry"
              className="fill-hover-link inline-block rounded-sm border border-[#8d8f91] bg-[#d0d2d4] px-6 py-3 text-[0.8rem] font-semibold tracking-[0.2em] text-[#1f1f1f] uppercase transition hover:-translate-y-0.5 hover:border-[#6e7072]"
            >
              <span className="fill-hover-layer" aria-hidden />
              <span className="fill-hover-label">
                Our Concrete &amp; Masonry Services
              </span>
            </Link>
          </div>
        </div>
      </section>

      <section
        id="contact"
        className="masonry-parallax relative z-10 flex min-h-[88svh] scroll-mt-24 flex-col justify-end px-6 pb-16 pt-28 text-center sm:px-10 sm:pb-24 sm:pt-40"
      >
        {/* Same grey buff as Built Solid's bottom edge, flipped so dense
            speckle sits on this photo's top join and trails downward. */}
        <SprayFillBand position="top" play="buff" color="#c8c9cb" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#004818]/22 via-[#003117]/12 to-[#00250f]/28" />
        <div className="relative z-10 mx-auto max-w-3xl">
          <p data-reveal className="on-foam text-[0.78rem] font-semibold tracking-[0.28em] text-[#f4f1ea] uppercase">
            Serving Central Minnesota |{" "}
            <a href="tel:3208088500" className="underline-offset-4 hover:underline">
              320.808.8500
            </a>
          </p>
          <h2 data-reveal className="on-foam mt-3 text-4xl tracking-[0.04em] text-[#f4f1ea] uppercase sm:text-5xl">
            <span className="font-eurostile-black block">Ready to Get Started?</span>
          </h2>
          <p data-reveal className="on-foam mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-[#f4f1ea]">
            Tell us about your project and we&apos;ll help you figure out the right solution.
          </p>
          <a
            href={QUOTE_HREF}
            data-reveal
            className="mt-8 inline-block rounded-sm bg-white px-6 py-3 text-[0.8rem] font-semibold tracking-[0.2em] text-[#005828] uppercase shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
          >
            Request a quote
          </a>
        </div>
      </section>

      <footer className="relative z-10 bg-[#f4f1ea] px-6 py-16 text-center sm:px-10 sm:py-20">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-center gap-6 sm:gap-10">
          <a
            href="#top"
            onClick={goHome}
            aria-label="RoCo Spray Foam Insulation — home"
            className="inline-block"
          >
            <Image
              src="/brand/roco-logo.webp"
              alt="RoCo Spray Foam Insulation"
              width={1500}
              height={725}
              className="h-16 w-auto max-w-[min(44vw,13rem)] object-contain sm:h-20 sm:max-w-[16rem]"
            />
          </a>
          <a href="#concrete" aria-label="RoCo Concrete & Masonry" className="inline-block">
            <Image
              src="/brand/roco-concrete-logo.png"
              alt="RoCo Concrete & Masonry"
              width={1024}
              height={490}
              unoptimized
              className="h-16 w-auto max-w-[min(44vw,13rem)] object-contain sm:h-20 sm:max-w-[16rem]"
            />
          </a>
        </div>

        <nav
          aria-label="Footer"
          className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-[0.78rem] font-semibold tracking-[0.22em] text-[#004818] uppercase sm:gap-x-7"
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className="transition hover:text-[#005828]"
            >
              {link.label}
            </a>
          ))}
          <a
            href={QUOTE_HREF}
            className="inline-flex items-center rounded-sm bg-[#005828] px-4 py-2 tracking-[0.18em] text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#004818] hover:shadow-md"
          >
            Request a quote
          </a>
        </nav>

        <div className="mt-8 flex items-center justify-center gap-3">
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
        <p className="mt-8 text-[0.68rem] font-semibold tracking-[0.22em] text-[#005828]/70 uppercase">
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

        <a
          href="https://clubhausagency.com"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Website powered by Clubhaus Agency"
          className="mt-8 inline-flex items-center gap-2.5 no-underline sm:gap-3"
        >
          <div className="text-right leading-snug">
            <div className="text-[8px] font-normal tracking-[0.08em] text-[#005828]/45 uppercase sm:text-[10px]">
              Website Powered By
            </div>
            <div className="text-[10px] font-semibold tracking-[0.02em] text-[#005828]/80 sm:text-[13px]">
              Clubhaus Agency
            </div>
          </div>
          <Image
            src="/CH_Tag.png"
            alt=""
            width={36}
            height={36}
            className="block h-6 w-6 shrink-0 sm:h-9 sm:w-9"
          />
        </a>
      </footer>
    </div>
  );
}
