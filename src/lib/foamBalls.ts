export const MAX_FOAM_BALLS = 64;

export const FOAM_NOZZLE = {
  x: -0.84,
  y: -0.52,
};

export type FoamBall = {
  x: number;
  y: number;
  sprayDelay: number;
  maxRadius: number;
};

function hash(n: number) {
  const v = Math.sin(n * 127.1) * 43758.5453;
  return v - Math.floor(v);
}

export function createFoamBalls(): FoamBall[] {
  const balls: FoamBall[] = [];
  const sprayAngle = Math.atan2(0.62, 0.98);

  const pushInCone = (
    along: number,
    spread: number,
    sprayDelay: number,
    maxRadius: number,
  ) => {
    const dist = 0.22 + along * 1.28;
    const angle = sprayAngle + spread * (0.22 + along * 0.5);
    balls.push({
      x: FOAM_NOZZLE.x + Math.cos(angle) * dist,
      y: FOAM_NOZZLE.y + Math.sin(angle) * dist,
      sprayDelay,
      maxRadius,
    });
  };

  // First trigger pull: a few fat wet beads.
  [
    { along: 0.28, spread: -0.08, delay: 0.02, radius: 0.7 },
    { along: 0.4, spread: 0.18, delay: 0.045, radius: 0.62 },
    { along: 0.34, spread: -0.42, delay: 0.06, radius: 0.52 },
    { along: 0.52, spread: 0.05, delay: 0.075, radius: 0.58 },
  ].forEach((bead) =>
    pushInCone(bead.along, bead.spread, bead.delay, bead.radius),
  );

  // Second burst: more coverage across the cone.
  [
    { along: 0.58, spread: -0.55, delay: 0.11, radius: 0.48 },
    { along: 0.62, spread: 0.48, delay: 0.125, radius: 0.5 },
    { along: 0.72, spread: -0.12, delay: 0.14, radius: 0.54 },
    { along: 0.7, spread: 0.72, delay: 0.155, radius: 0.44 },
    { along: 0.48, spread: 0.9, delay: 0.16, radius: 0.4 },
  ].forEach((bead) =>
    pushInCone(bead.along, bead.spread, bead.delay, bead.radius),
  );

  // Spatter droplets that sell the psssht, then swell a little.
  for (let i = 0; i < 28; i++) {
    const along = hash(i * 2.17);
    const spread = (hash(i * 3.91) - 0.5) * 2.0;
    const burst = hash(i * 5.3) < 0.45 ? 0.03 : 0.12;
    pushInCone(
      along,
      spread,
      burst + along * 0.16 + hash(i * 8.1) * 0.04,
      0.035 + hash(i * 6.4) * 0.11,
    );
  }

  // Late corner hits so expansion can finish the frame.
  balls.push(
    { x: -0.72, y: 0.48, sprayDelay: 0.2, maxRadius: 0.58 },
    { x: 0.78, y: 0.5, sprayDelay: 0.24, maxRadius: 0.6 },
    { x: 0.82, y: -0.46, sprayDelay: 0.22, maxRadius: 0.56 },
    { x: -0.18, y: 0.56, sprayDelay: 0.21, maxRadius: 0.5 },
    { x: 0.08, y: -0.58, sprayDelay: 0.18, maxRadius: 0.52 },
  );

  return balls.slice(0, MAX_FOAM_BALLS);
}
