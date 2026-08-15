type FoamProgress = {
  value: number;
  startedAt: number;
  generation: number;
  duration: number;
  introDone: boolean;
};

const globalState = globalThis as typeof globalThis & {
  __rocoFoamProgress?: FoamProgress;
};

export const foamProgress =
  globalState.__rocoFoamProgress ??
  (globalState.__rocoFoamProgress = {
    value: 0,
    startedAt: -1,
    generation: 0,
    duration: 5.2,
    introDone: false,
  });

foamProgress.duration = 5.2;
foamProgress.introDone = foamProgress.introDone ?? false;

// The logo plays its entrance animation first; the spray holds until then.
export function markIntroDone() {
  foamProgress.introDone = true;
}

export function startSpray() {
  foamProgress.value = 0;
  foamProgress.startedAt = -1;
  foamProgress.generation += 1;
}

export function advanceSpray(elapsedTime: number) {
  if (foamProgress.startedAt < 0 || elapsedTime + 0.0001 < foamProgress.startedAt) {
    foamProgress.startedAt = elapsedTime;
  }

  foamProgress.value = Math.min(
    Math.max((elapsedTime - foamProgress.startedAt) / foamProgress.duration, 0),
    1,
  );

  return foamProgress.value;
}
