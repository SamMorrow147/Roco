export const foamVertexShader = /* glsl */ `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

export const foamFragmentShader = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uProgress;
uniform float uAspect;

varying vec2 vUv;

vec2 hash22(vec2 p) {
  vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

float hash(vec2 p) {
  return hash22(p).x;
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  v += noise(p) * 0.55;
  v += noise(p * 2.13 + 7.7) * 0.28;
  v += noise(p * 4.41 + 3.1) * 0.17;
  return v;
}

float smax(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(a, b, h) + k * h * (1.0 - h);
}

// Field of overlapping rounded caps (foam pillows).
// Returns height in x, dominant-cell random id in y.
vec2 capField(vec2 x, float density, float minRad, float varRad) {
  vec2 n = floor(x);
  vec2 f = fract(x);
  float h = 0.0;
  float id = 0.0;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 o = hash22(n + g);
      float live = smoothstep(1.0 - density - 0.08, 1.0 - density + 0.08, 1.0 - o.x * 0.999);
      float rad = minRad + varRad * o.y;
      vec2 d = g + o - f;
      float r2 = dot(d, d) / (rad * rad);
      float fall = max(1.0 - min(r2, 1.0), 0.0);
      float cap = fall * fall * (3.0 - 2.0 * fall);
      cap = pow(cap, 0.82) * live * (0.72 + 0.28 * fract(o.y * 9.31));
      if (cap > h * 0.72) {
        id = mix(id, fract(o.x * 13.7 + o.y * 5.9), smoothstep(h * 0.72, h * 0.72 + 0.22, cap));
      }
      h = smax(h, cap, 0.16);
    }
  }
  return vec2(h, id);
}

// Droplet accumulation: each cell holds one droplet with a random dose threshold.
// As the spray dose sweeps up the screen, droplets dust on stochastically and densify.
// Returns x: droplet mask, y: fresh-landing flash.
vec2 dropletField(vec2 st, vec2 off, float scale, float radMin, float radVar, float band, float frontY) {
  vec2 x = (st + off) * scale;
  vec2 n = floor(x);
  vec2 f = fract(x);
  float acc = 0.0;
  float flash = 0.0;
  for (int j = -1; j <= 1; j++) {
    for (int i = -1; i <= 1; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 o = hash22(n + g);
      vec2 cpos = g + o;
      float cy = (n.y + cpos.y) / scale - off.y;
      float thr = fract(o.x * 5.17 + o.y * 2.71);
      float tSince = frontY - cy - thr * band;
      float landed = step(0.0, tSince);
      float pop = clamp(tSince / 0.045, 0.0, 1.0);
      float rad = (radMin + radVar * fract(o.y * 7.13)) * (0.5 + 0.5 * pop);
      vec2 d = cpos - f;
      float r2 = dot(d, d) / max(rad * rad, 1e-5);
      float fall = max(1.0 - min(r2, 1.0), 0.0);
      float m = fall * fall * (3.0 - 2.0 * fall) * landed;
      acc = max(acc, m);
      flash = max(flash, m * exp(-max(tSince, 0.0) * 12.0));
    }
  }
  return vec2(acc, flash);
}

float sprayDots(vec2 st) {
  vec2 mist = capField(st * 60.0 + vec2(2.1, 5.4), 0.34, 0.1, 0.22);
  vec2 beads = capField(st * 22.0 + vec2(8.7, 1.3), 0.5, 0.16, 0.34);
  return clamp(mist.x * 0.6 + beads.x * 0.95, 0.0, 1.0);
}

void main() {
  vec2 uv = vUv;
  vec2 st = vec2((uv.x - 0.5) * uAspect, uv.y - 0.5);

  // ---- Spray sweep: wet front travels bottom -> top, fast ----
  float sprayT = smoothstep(0.0, 0.22, uProgress);
  float frontY = mix(-0.42, 1.4, sprayT);

  float jitter =
    (noise(vec2(st.x * 3.4, 2.2)) - 0.5) * 0.16 +
    (noise(vec2(st.x * 9.0, 17.0)) - 0.5) * 0.07 +
    (noise(vec2(st.x * 27.0, 5.0)) - 0.5) * 0.025;
  float ahead = st.y - frontY - jitter;
  float passed = -ahead;

  float fan = exp(-max(ahead, 0.0) * max(ahead, 0.0) * 90.0);
  float settled = smoothstep(-0.03, 0.16, passed);

  // ---- Spray accumulation: droplets dust on across a wide active band ----
  float spraying = 1.0 - smoothstep(0.96, 1.0, sprayT);
  float band = 0.26;

  // Droplet fields are only computed while they can still be seen — once the
  // global fill covers the wall (uProgress > 0.36) they're skipped entirely,
  // which keeps the per-frame GPU cost low after the spray phase.
  vec2 tiny = vec2(0.0);
  vec2 med  = vec2(0.0);
  vec2 bead = vec2(0.0);
  vec2 fine = vec2(0.0);
  vec2 mist = vec2(0.0);
  if (uProgress < 0.36) {
    tiny = dropletField(st, vec2(5.2, 8.4), 54.0, 0.11, 0.15, band, frontY);
    med  = dropletField(st, vec2(1.7, 3.9), 22.0, 0.16, 0.24, band, frontY);
    bead = dropletField(st, vec2(0.0, 0.0), 11.0, 0.18, 0.24, band * 0.9, frontY);

    // Atomized overspray: dense fields of very small specks. They land across
    // a wider band and slightly AHEAD of the wet front (frontY offset), so a
    // mist of fine droplets dusts the wall before the heavy material lands.
    fine = dropletField(st, vec2(9.6, 2.2), 90.0, 0.12, 0.16, band * 1.2, frontY + 0.06);
    mist = dropletField(st, vec2(3.3, 6.1), 150.0, 0.10, 0.14, band * 1.5, frontY + 0.12);
  }

  // Merged wet film builds underneath once an area has taken enough dose.
  float dose = passed / band;
  float film = smoothstep(0.35, 0.8, dose);

  // Spray-dot detail only matters while the wet film is visible.
  float dots = uProgress < 0.6 ? sprayDots(st) : 0.0;
  float cov = max(film, bead.x);
  cov = max(cov, med.x * 0.92);
  cov = max(cov, tiny.x * 0.78);
  cov = max(cov, fine.x * 0.62);
  cov = max(cov, mist.x * 0.5);
  // Late global fill so no pinholes survive once expansion takes over.
  cov = max(cov, smoothstep(0.22, 0.34, uProgress));
  cov = smoothstep(0.08, 0.42, cov);

  // ---- Confine the foam to the OSB panel between the two studs. ----
  // The CSS background is cover-fitted; replicate that mapping so the mask
  // lands exactly on the studs' inner edges at any viewport aspect. Portrait
  // viewports use the portrait wall image (see globals.css), which has its
  // own aspect and stud positions — switch on the same condition the CSS uses.
  float isPortrait = step(uAspect, 1.0);
  float bgAspect = mix(1.7768, 0.5628, isPortrait);
  float studL = mix(0.1148, 0.1243, isPortrait);
  float studR = mix(0.8947, 0.8916, isPortrait);
  float rxCover = min(uAspect / bgAspect, 1.0);
  float uImg = vUv.x * rxCover + (1.0 - rxCover) * 0.5;
  float studMask = smoothstep(studL - 0.004, studL + 0.004, uImg)
    * (1.0 - smoothstep(studR - 0.004, studR + 0.004, uImg));
  cov *= studMask;

  // Sparkle of droplets hitting right now — the spray's energy.
  float flash = max(bead.y, max(med.y, tiny.y)) * spraying;
  flash = max(flash, max(fine.y, mist.y) * 0.85 * spraying);
  flash *= studMask;

  // Age since front passed: drives inflation + curing.
  // ---- Foam wave: a second front that chases the spray up the wall.
  // The spray front reaches the top at ~0.11 progress; the foam front leaves
  // the bottom right then, so "spray upward" is followed by "foam upward".
  float foamT = smoothstep(0.1, 0.3, uProgress);
  float foamFrontY = mix(-0.55, 1.5, foamT);
  float foamPassed = foamFrontY - st.y - jitter * 0.5;
  float age = clamp(foamPassed / 0.7, 0.0, 1.0);
  float inflate = smoothstep(0.02, 0.55, age);
  inflate = max(inflate, smoothstep(0.32, 0.5, uProgress));
  float cure = smoothstep(0.45, 1.0, age);
  cure = max(cure, smoothstep(0.42, 0.72, uProgress));

  // ---- Foam height field: big pillows + lobes + small blobs ----
  vec2 warp = vec2(fbm(st * 2.3), fbm(st * 2.3 + 11.7)) - 0.5;
  float zoom = mix(1.5, 1.0, smoothstep(0.08, 0.85, uProgress));
  vec2 q = (st + warp * 0.14) * zoom;

  // Growth: young foam shows only low, sparse beads; mature foam is a full wall.
  vec2 big = capField(q * 2.55 + vec2(1.3, 4.8), 0.86, 0.66, 0.52);
  vec2 lob = capField(q * 5.9 + vec2(9.2, 2.7), 0.82, 0.52, 0.44);
  vec2 sml = capField(q * 12.5 + vec2(4.4, 7.9), 0.74, 0.44, 0.38);

  // Swell: foam overshoots as it expands, then settles as it cures.
  float overshoot = 1.0 + 0.2 * smoothstep(0.3, 0.62, age) * (1.0 - smoothstep(0.62, 1.0, age) * 0.6);
  float grow = inflate * overshoot;
  float hBig = big.x * 0.82 * grow;

  // Detail rides additively on top of the pillows so it stays visible.
  float micro = fbm(st * 34.0) - 0.5;
  float hDet =
    lob.x * 0.24 * (0.35 + 0.65 * big.x) * (0.4 + 0.6 * grow) +
    sml.x * 0.12 * (0.45 + 0.55 * big.x) * (0.3 + 0.7 * grow) +
    micro * 0.03 * (0.3 + 0.7 * cure);

  // Wet film + beads before inflation takes over.
  float bulge = bead.x * 0.85 + med.x * 0.35 + fine.x * 0.14 + mist.x * 0.08;
  float filmH = 0.04 + dots * 0.07 + bulge * 0.13;
  float bodyMix = smoothstep(0.06, 0.5, inflate);
  hBig = mix(filmH * cov, hBig, bodyMix);
  hDet *= bodyMix;
  float h = clamp(hBig + hDet, 0.0, 1.3);

  // ---- Normals: pillow shape soft, surface detail crisp ----
  float ampBig = mix(30.0, 46.0, smoothstep(0.1, 0.8, inflate));
  float ampDet = mix(40.0, 100.0, smoothstep(0.1, 0.8, inflate));
  vec3 n = normalize(vec3(
    -(dFdx(hBig) * ampBig + dFdx(hDet) * ampDet),
    -(dFdy(hBig) * ampBig + dFdy(hDet) * ampDet),
    1.0));

  // ---- Palette: creamy foam with a slight green cast ----
  vec3 cured = vec3(0.92, 0.925, 0.83);
  vec3 curedHi = vec3(0.975, 0.972, 0.905);
  vec3 curedShadow = vec3(0.68, 0.72, 0.57);
  // Fresh spray: light pistachio, not mossy olive. wetDeep sits barely a
  // tone below wet so film vs. droplets reads as one material, not spots.
  vec3 wet = vec3(0.88, 0.93, 0.71);
  vec3 wetDeep = vec3(0.83, 0.885, 0.66);

  // Per-pillow tint variation so the wall doesn't read as uniform plastic.
  float blobId = mix(big.y, lob.y, 0.45);
  float tintVar = (blobId - 0.5) * 0.09 + (fract(sml.y * 3.7) - 0.5) * 0.04;

  float peak = smoothstep(0.05, 0.85, h);
  vec3 albedo = mix(wet, cured, cure);
  albedo += tintVar * vec3(0.6, 0.55, 0.35);
  vec3 shadowCol = mix(wetDeep, curedShadow, cure);
  albedo = mix(shadowCol, albedo, 0.6 + 0.4 * peak);
  albedo = mix(albedo, curedHi, pow(peak, 2.2) * 0.2 * cure);

  // ---- Lighting ----
  vec3 light = normalize(vec3(-0.4, 0.55, 0.72));
  vec3 view = vec3(0.0, 0.0, 1.0);
  float diff = max(dot(n, light), 0.0);
  float wrap = max((dot(n, light) + 0.55) / 1.55, 0.0);

  float ao = mix(0.8, 1.0, smoothstep(0.0, 0.68, h));
  ao *= mix(0.96, 1.0, peak);

  float gloss = mix(64.0, 14.0, cure);
  float specAmp = mix(0.42, 0.13, cure);
  float spec = pow(max(dot(reflect(-light, n), view), 0.0), gloss) * specAmp;
  float fres = pow(1.0 - max(dot(n, view), 0.0), 3.0);

  vec3 col = albedo * (0.42 + wrap * 0.58 + diff * 0.16) * ao;
  col += spec * vec3(1.0, 1.0, 0.92) * peak;
  col += fres * mix(wet, curedHi, cure) * mix(0.2, 0.06, cure) * peak;

  // Wet shimmer on freshly landed material — kept subtle so the droplets
  // stay in the same tonal family as the film beneath them.
  col += wet * dots * 0.13 * (1.0 - cure) * cov * (1.0 - inflate);

  // ---- Gentle vignette on the foam so center content pops ----
  float vig = smoothstep(0.42, 1.25, length(vec2(st.x, st.y * 1.25)));
  col *= mix(1.05, 0.88, vig);

  // Fresh-landing flashes: droplets glint as they hit.
  vec3 jetCol = clamp(wet * flash * 1.1 + vec3(0.9, 0.94, 0.72) * flash * flash * 0.5, 0.0, 1.0);
  col = col + jetCol * (1.0 - col);

  // ---- Premultiplied-alpha output: only the foam is rendered; the page's
  // background image shows through untouched wherever coverage is zero.
  // Flash glints add over the bare wall where foam hasn't landed yet.
  vec3 rgbPm = col * cov + jetCol * (1.0 - cov);
  gl_FragColor = vec4(clamp(rgbPm, 0.0, 1.0), cov);
}
`;
