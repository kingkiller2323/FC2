// Every tunable carries its grounding status. ASSUMED values are surfaced
// prominently in the validation report — they are where the model is weakest.
// CITED values reference the V2 research register (report §V2).

export type Grounding = { value: number; status: "CITED" | "ASSUMED"; source: string };

export const P = {
  // --- perception: geometry ---
  // Eccentricity falloff: acuity-like decline ~ 1/(1 + angle/E2). E2 in degrees.
  eccentricityE2: <Grounding>{ value: 3.0, status: "ASSUMED", source: "pending V2 (Strasburger et al. 2011 review; cortical magnification E2 ~2–3°)" },
  // Distance at which visual detail halves (by lighting).
  distanceHalfMeters: {
    "daylight": <Grounding>{ value: 40, status: "ASSUMED", source: "pending V2" },
    "indoor-fluorescent-good": <Grounding>{ value: 30, status: "ASSUMED", source: "pending V2" },
    "night-streetlit": <Grounding>{ value: 18, status: "ASSUMED", source: "pending V2" },
    "dark": <Grounding>{ value: 6, status: "ASSUMED", source: "pending V2" },
  },
  // Behind-the-head boundary: no direct vision past this off-axis angle.
  visualFieldLimitDegrees: <Grounding>{ value: 100, status: "ASSUMED", source: "pending V2 (binocular+monocular field ~200° total → ~100° half-field)" },

  // --- perception: attention ---
  ambientAttentionFactor: <Grounding>{ value: 0.65, status: "ASSUMED", source: "pending V2" },
  attendedElsewhereFactor: <Grounding>{ value: 0.25, status: "ASSUMED", source: "pending V2 (inattentional blindness: ~46–50% miss for unexpected salient events; Simons & Chabris 1999)" },
  // Orienting: audible salience needed to pull attention (compared against audibility * distance falloff).
  orientingThreshold: <Grounding>{ value: 0.15, status: "ASSUMED", source: "pending V2" },
  audibilityHalfDistanceMeters: <Grounding>{ value: 50, status: "ASSUMED", source: "pending V2" },

  // --- perception: stress (narrowing, never blindness) ---
  stressAttendedBoostExp: <Grounding>{ value: 0.3, status: "ASSUMED", source: "pending V2 (weapon focus: central detail enhanced; Steblay 1992, Fawcett 2013)" },
  stressPeripheralPenalty: <Grounding>{ value: 0.5, status: "ASSUMED", source: "pending V2 (Easterbrook 1959 cue-utilization narrowing)" },

  // --- perception tiers (named thresholds — the only permitted discontinuities) ---
  perceptionTierEdges: { glimpse: 0.12, partial: 0.35, clear: 0.62, complete: 0.85 },

  // --- recording ---
  deviceQualityBase: {
    "door-low": <Grounding>{ value: 0.35, status: "ASSUMED", source: "pending V2 (CAST tier mapping)" },
    "dome-mid": <Grounding>{ value: 0.6, status: "ASSUMED", source: "pending V2" },
    "wide-far": <Grounding>{ value: 0.45, status: "ASSUMED", source: "pending V2" },
    "phone": <Grounding>{ value: 0.8, status: "ASSUMED", source: "pending V2" },
    "phone-2013": <Grounding>{ value: 0.55, status: "ASSUMED", source: "pending V2 (2012–13 phone video + platform transcode; see Era 5 forensics register)" },
    "dashcam": <Grounding>{ value: 0.55, status: "ASSUMED", source: "pending V2" },
  },
  recordingDistanceHalfMeters: <Grounding>{ value: 20, status: "ASSUMED", source: "pending V2 (CAST px/m identify≈250, recognise≈125 → distance mapping per lens)" },
  identifySupportThreshold: <Grounding>{ value: 0.55, status: "ASSUMED", source: "pending V2 (identify-grade detail; note unfamiliar-face matching is poor even on good video — Bruce et al. 2001)" },
  lightingRecordingFactor: {
    "daylight": 1.0, "indoor-fluorescent-good": 0.9, "night-streetlit": 0.6, "dark": 0.25,
  },
  // EM corruption: exposure = emSideEffect * proximity within radius; corruption thresholds are named.
  emCorruptionEdges: { degraded: 0.3, unrecoverable: 0.6 },
  recordingTierEdges: { trace: 0.12, degraded: 0.3, usable: 0.55, sharp: 0.8 },
  seededNoiseAmplitude: <Grounding>{ value: 0.04, status: "ASSUMED", source: "residual variation; deterministic via committed seed" },

  // --- NAMED DESIGN LEVER 1: reaction-time floor (seconds) ---
  // Reported to the user with source + balance statement; not an implementation detail.
  reactionFloorSeconds: <Grounding>{ value: 6.0, status: "ASSUMED", source: "pending V2 (orienting ~1s + decision ~1.5s + retrieve/unlock/launch ~2.5s + aim ~1s)" },

  // --- NAMED DESIGN LEVER 2: already-recording generation rate (per bystander, by context) ---
  // Used by sweeps/scene-population, not by explicit fixtures (fixtures state it directly).
  alreadyRecordingRate: {
    "street": <Grounding>{ value: 0.02, status: "ASSUMED", source: "pending V2" },
    "store": <Grounding>{ value: 0.005, status: "ASSUMED", source: "pending V2" },
    "event-crowd": <Grounding>{ value: 0.15, status: "ASSUMED", source: "pending V2" },
    "home": <Grounding>{ value: 0.01, status: "ASSUMED", source: "pending V2" },
  },
};

export function clamp01(x: number): number { return x < 0 ? 0 : x > 1 ? 1 : x; }
