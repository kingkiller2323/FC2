// Every tunable carries its grounding status. ASSUMED values are surfaced
// prominently in the validation report — they are where the model is weakest.
// CITED values reference the V2 research register (report §V2).

export type Grounding = { value: number; status: "CITED" | "ASSUMED"; source: string };

export const P = {
  // --- perception: geometry ---
  // DETAIL acuity falloff ~ 1/(1 + angle/E2). Letter/object-detail E2 ≈ 2.3°
  // (Anstis 1974 via Strasburger, Rentschler & Jüttner 2011, J Vision 11(5):13, Table 4).
  eccentricityE2: <Grounding>{ value: 2.3, status: "CITED", source: "Strasburger et al. 2011 (letter acuity E2≈2.3°; grating 2.5–3.0°)" },
  // EVENT DETECTION persists far into the periphery: salient-event categorization
  // ~93% near-central → ~60.6% at 70° (Thorpe et al. 2001, via Strasburger §6.2).
  // Linear decline to the field limit; detection ≠ detail.
  detectionAt70Degrees: <Grounding>{ value: 0.65, status: "CITED", source: "Thorpe et al. 2001: 93%→60.6% correct at 70° (chance 50%) ⇒ ~0.65 relative" },
  // Blend: completeness = detection × (blendFloor + (1−blendFloor) × detail).
  detectionDetailBlendFloor: <Grounding>{ value: 0.35, status: "ASSUMED", source: "interpolation between detection and detail anchors; no direct literature" },
  // Distance at which visual detail halves (by lighting).
  distanceHalfMeters: {
    "daylight": <Grounding>{ value: 40, status: "ASSUMED", source: "no direct per-distance event-perception literature; known limitation: person-scale calibration, no subject-scale term (see report)" },
    "indoor-fluorescent-good": <Grounding>{ value: 30, status: "ASSUMED", source: "no direct literature; below daylight" },
    "night-streetlit": <Grounding>{ value: 18, status: "ASSUMED", source: "no direct literature; scaled from daylight by scotopic/mesopic acuity loss" },
    "dark": <Grounding>{ value: 6, status: "ASSUMED", source: "no direct literature" },
  },
  // Behind-the-head boundary: no direct vision past this off-axis angle.
  visualFieldLimitDegrees: <Grounding>{ value: 100, status: "CITED", source: "temporal monocular field extends ~90–100° (Strasburger review; standard perimetry)" },

  // --- perception: attention ---
  ambientAttentionFactor: <Grounding>{ value: 0.6, status: "CITED", source: "Hyman et al. 2010: >50% of undistracted walkers notice the unexpected event (MEDIUM: 25%-vs->50% split verified; finer split unverified)" },
  attendedElsewhereFactor: <Grounding>{ value: 0.25, status: "CITED", source: "Simons & Chabris 1999 (46% overall miss; ~50% opaque-gorilla); Hyman 2010 (25% of phone-talkers notice); Drew 2013 (83% expert miss). Range 0.25–0.85 by load; 0.25 = demanding-task anchor" },
  // Orienting: audible salience needed to pull attention (compared against audibility * distance falloff).
  orientingThreshold: <Grounding>{ value: 0.15, status: "ASSUMED", source: "no direct literature for auditory-orienting threshold in this parameterization" },
  audibilityHalfDistanceMeters: <Grounding>{ value: 50, status: "ASSUMED", source: "no direct literature; loud-impulse audibility persists far beyond visual detail" },

  // --- perception: stress (narrowing, never blindness) ---
  stressAttendedBoostExp: <Grounding>{ value: 0.3, status: "ASSUMED", source: "direction CITED (Christianson 1992 central/gist enhancement, 'tunnel memory'); magnitude unsettled — Deffenbacher 2004 shows overall ID impairment under high stress" },
  stressPeripheralPenalty: <Grounding>{ value: 0.5, status: "CITED", source: "Easterbrook 1959 (direction); Steblay 1992 feature-accuracy d≈0.55; Fawcett 2013 g≈0.75 peripheral/feature impairment (magnitude mapped to 0.5 multiplier — mapping itself ASSUMED)" },

  // --- perception tiers (named thresholds — the only permitted discontinuities) ---
  perceptionTierEdges: { glimpse: 0.12, partial: 0.35, clear: 0.62, complete: 0.85 },

  // --- recording ---
  deviceQualityBase: {
    "door-low": <Grounding>{ value: 0.35, status: "ASSUMED", source: "value mapping ASSUMED; anchored to CAST 28/09 Table 2 (CIF/D1-era legacy systems cannot meet Identify) and IPVM installed-base lag" },
    "dome-mid": <Grounding>{ value: 0.6, status: "ASSUMED", source: "value mapping ASSUMED; anchored to IPVM (1080p typical new install 2016–20; recorded ~10–15 fps) and CAST wide-area Observe-to-Recognise reality" },
    "wide-far": <Grounding>{ value: 0.45, status: "ASSUMED", source: "value mapping ASSUMED; wide-FOV lowers px/m at all distances (IEC 62676-4 geometry)" },
    "phone": <Grounding>{ value: 0.8, status: "ASSUMED", source: "value mapping ASSUMED; modern phone sensors exceed typical installed CCTV" },
    "phone-2013": <Grounding>{ value: 0.55, status: "ASSUMED", source: "value mapping ASSUMED; 2012–13 phone + platform transcode (Era 5 forensics register: VFR→CFR, recompression)" },
    "dashcam": <Grounding>{ value: 0.55, status: "ASSUMED", source: "value mapping ASSUMED" },
  },
  recordingDistanceHalfMeters: <Grounding>{ value: 20, status: "ASSUMED", source: "usability (not identification) halving distance; identification handled separately by identifyRangeMeters. Known limitation: person-scale calibration — no subject-scale term (see report)" },
  // Identification is a GEOMETRIC chokepoint outcome, not a score threshold:
  // IEC 62676-4 Identify = 250 px/m; a 1080p ~90°-FOV camera gives ~960/d px/m
  // → Identify only within ~4 m. Per-tier ranges derived from that geometry.
  identifyRangeMeters: {
    "door-low": <Grounding>{ value: 1.5, status: "CITED", source: "CAST 28/09 Table 2: CIF-class cannot meet Identify except point-blank" },
    "dome-mid": <Grounding>{ value: 4.5, status: "CITED", source: "IEC 62676-4: 250 px/m; 1080p ~90° FOV ⇒ ~960/d px/m ⇒ ~3.8–4.5 m" },
    "wide-far": <Grounding>{ value: 2.5, status: "CITED", source: "wider FOV ⇒ lower px/m ⇒ shorter identify range (same geometry)" },
    "phone": <Grounding>{ value: 8, status: "ASSUMED", source: "4K-capable narrow FOV; geometry-extrapolated, not published" },
    "phone-2013": <Grounding>{ value: 3.5, status: "ASSUMED", source: "720p-class + transcode" },
    "dashcam": <Grounding>{ value: 4, status: "ASSUMED", source: "geometry-extrapolated" },
  },
  // Even identification-grade footage supports UNFAMILIAR-viewer identification
  // poorly: Bruce et al. 2001 — 70% overall, 56% hard mismatches (near chance).
  // identifySupport therefore means "meets identify-grade DETAIL", never
  // "identification succeeds" — the downstream epistemics own that.
  lightingRecordingFactor: {
    "daylight": 1.0, "indoor-fluorescent-good": 0.9, "night-streetlit": 0.6, "dark": 0.25,
  },
  // EM corruption: exposure = emSideEffect * proximity within radius; corruption thresholds are named.
  emCorruptionEdges: { degraded: 0.3, unrecoverable: 0.6 },
  recordingTierEdges: { trace: 0.12, degraded: 0.3, usable: 0.55, sharp: 0.8 },
  seededNoiseAmplitude: <Grounding>{ value: 0.04, status: "ASSUMED", source: "residual variation; deterministic via committed seed" },

  // --- NAMED DESIGN LEVER 1: reaction-time floor (seconds) ---
  // Reported to the user with source + balance statement; not an implementation detail.
  reactionFloorSeconds: <Grounding>{ value: 7.0, status: "ASSUMED", source: "component-sum FLOOR, components sourced: surprise perception-response ~1.5s (Green 2000) + pocket retrieval ~4.6s (Ashbrook CHI 2008 'Quickdraw') + quick-launch camera ~0.5–1s (vendor-grade) + aim ~1s (unsourced) ≈ 7s primed minimum. Median realistic start 10–15s (appraisal term UNSOURCED). No direct bystander recording-onset literature exists — flagged ASSUMED as a whole; floor well-anchored, median soft" },
  // Typical (median) start for long events — appraisal-dominated, unsourced.
  reactionTypicalStartSeconds: <Grounding>{ value: 12.0, status: "ASSUMED", source: "median 10–15s per component analysis; appraisal/decision term has no literature" },
  // Filming propensity: the appraise-and-decide gate — the fraction of
  // perceiving, phone-carrying bystanders who actually film. Research-driven
  // addition made AFTER the second pre-registration and BEFORE the scored run
  // (documented in the report): without it every able bystander films, which
  // contradicts every empirical anchor.
  filmingPropensity: <Grounding>{ value: 0.06, status: "ASSUMED", source: "V2 register: 1–10% of bystanders capture ≥1 clip over a sustained incident (ASSUMED band, no published rate); Pew 2014: 7% of US adults had ever posted news video (floor anchor). Constant for the spike; salience-scaling deferred" },

  // --- NAMED DESIGN LEVER 2: already-recording generation rate (per bystander, by context) ---
  // Used by sweeps/scene-population, not by explicit fixtures (fixtures state it directly).
  alreadyRecordingRate: {
    "street": <Grounding>{ value: 0.005, status: "ASSUMED", source: "V2 register 5.4: no direct measurement exists; ASSUMED band 0.1–1% in ordinary public settings (LOW confidence), midpoint taken" },
    "store": <Grounding>{ value: 0.002, status: "ASSUMED", source: "below street baseline; judgment on the same ASSUMED band" },
    "event-crowd": <Grounding>{ value: 0.05, status: "ASSUMED", source: "recording-normative settings (performances/rallies) sit above baseline; ASSUMED, LOW" },
    "home": <Grounding>{ value: 0.005, status: "ASSUMED", source: "video-call prevalence; ASSUMED" },
  },
  // Sustained-incident capture band (validation target ET2, itself ASSUMED):
  // 1–10% of bystanders capture ≥1 clip over a salient sustained smartphone-era
  // incident (V2 register 4.5: Boston ~2.6/100/event-day upper anchor; 7/7
  // ~0.03/100 pre-smartphone lower anchor; no published rate exists).
  sustainedCaptureBand: { min: 0.01, max: 0.10 },
};

export function clamp01(x: number): number { return x < 0 ? 0 : x > 1 ? 1 : x; }
