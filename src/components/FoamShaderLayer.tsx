"use client";

import { advanceSpray, foamProgress, startSpray } from "@/lib/foamProgress";
import { foamFragmentShader, foamVertexShader } from "@/shaders/foamShaders";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import type * as THREE from "three";

const BG_IMAGE_URL = "/brand/wall-bg.webp";
const BG_IMAGE_URL_PORTRAIT = "/brand/wall-bg-mobile.webp";

function FoamQuad() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const [bgReady, setBgReady] = useState(false);

  // The shader never draws the background — the CSS image shows through the
  // transparent canvas untouched. We only preload it here so the spray waits
  // for the wall to be visible before sweeping.
  useEffect(() => {
    const img = new window.Image();
    const markReady = () => setBgReady(true);
    img.onload = markReady;
    img.onerror = markReady;
    // Match the CSS: portrait screens load the portrait wall image.
    img.src = window.matchMedia("(orientation: portrait)").matches
      ? BG_IMAGE_URL_PORTRAIT
      : BG_IMAGE_URL;
    if (img.complete) markReady();
  }, []);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uProgress: { value: 0 },
      uAspect: { value: 1 },
    }),
    [],
  );

  // Don't start the spray on the very first frames: shader compilation and
  // pipeline warm-up cause frame drops there, and since the spray is
  // clock-driven those dropped frames read as a laggy, skipping sweep.
  // Wait for the background, the logo intro, and a few smooth frames.
  const startedRef = useRef(false);
  const warmupFramesRef = useRef(0);

  useFrame(({ size }) => {
    const material = materialRef.current;
    if (!material) return;

    // One global timebase (not the per-Canvas clock): if hot-reload ever
    // mounts two canvases at once, they agree on time instead of fighting
    // over the shared progress state and freezing the animation.
    const nowSec = performance.now() / 1000;

    let progress = 0;
    if (startedRef.current) {
      progress = advanceSpray(nowSec);
    } else if (bgReady && foamProgress.introDone) {
      warmupFramesRef.current += 1;
      if (warmupFramesRef.current >= 4) {
        startedRef.current = true;
        startSpray();
      }
    }
    material.uniforms.uTime.value = nowSec;
    material.uniforms.uProgress.value = progress;
    material.uniforms.uAspect.value = size.width / Math.max(size.height, 1);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={foamVertexShader}
        fragmentShader={foamFragmentShader}
        uniforms={uniforms}
        toneMapped={false}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
}

export function FoamShaderLayer() {
  // The canvas is only visible over the hero. Once the page has scrolled a
  // safe margin past it (and the spray has finished), stop the render loop
  // entirely — otherwise the GPU keeps drawing a full-screen shader at 60fps
  // behind opaque sections, starving the parallax/backdrop work further down
  // the page. The last rendered frame stays on the canvas, so scrolling back
  // up shows the settled foam untouched.
  const [active, setActive] = useState(true);
  useEffect(() => {
    let scheduled = false;
    const update = () => {
      scheduled = false;
      const vh = window.innerHeight || 1;
      setActive(window.scrollY < vh * 1.3 || foamProgress.value < 1);
    };
    const onScroll = () => {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 h-dvh w-screen">
      <Canvas
        frameloop={active ? "always" : "never"}
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1 }}
        dpr={[1, 1.15]}
        gl={{
          antialias: true,
          alpha: true,
          premultipliedAlpha: true,
          powerPreference: "high-performance",
        }}
        flat
        style={{ width: "100%", height: "100%", display: "block" }}
      >
        <FoamQuad />
      </Canvas>
    </div>
  );
}
