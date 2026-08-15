// Every tunable carries its grounding status (Ruling A taxonomy):
//   CITED   — value taken from external research; source given.
//   ASSUMED — no source exists; value chosen to fill a gap BEFORE seeing any
//             fixture output. Uncertain but uncontaminated.
//   FITTED  — value or mechanism introduced/adjusted because output looked
//             wrong against an expectation. Contaminated; cannot count toward
//             validation; needs independent validation before promotion.
//
// ⚠ TOP-FLAGGED WEAKNESS: detectionDetailBlendFloor (0.35, ASSUMED) is the most
// dangerous number in the model — pure interpolation with tier-flipping
// authority (±0.15 moves mid-angle perception a full tier). Grounding it needs
// staged-event eyewitness data at known geometry: completeness-of-account vs
// viewing angle for a dynamic incident (Loftus-style staged-event paradigms
// report exactly this but were not run at controlled eccentricities). Until
// such data exists or a purpose-built study is run, every mid-periphery tier
// boundary in this model rests on interpolation.

export type Grounding = { value: number; status: "CITED" | "ASSUMED" | "FITTED"; source: string };

export const P = {
  // --- perception: geometry ---
  eccentricityE2: <Grounding>{ value: 2.3, status: "CITED", source: "Strasburger et al. 2011 (letter acuity E2≈2.3°; grating 2.5–3.0°)" },
  detectionAt70Degrees: <Grounding>{ value: 0.65, status: "CITED", source: "Thorpe et al. 2001: 93%→60.6% correct at 70° (chance 50%) ⇒ ~0.65 relative" },
  detectionDetailBlendFloor: <Grounding>{ value: 0.35, status: "ASSUMED", source: "TOP-FLAGGED: pure interpolation, tier-flipping authority; see file header" },
  distanceHalfMeters: {
    "daylight": <Grounding>{ value: 40, status: "ASSUMED", source: "no per-distance event-perception literature; person-scale (1.7 m) reference — subject scale rescales effective distance (schema ext. 1)" },
    "indoor-fluorescent-good": <Grounding>{ value: 30, status: "ASSUMED", source: "no direct literature; below daylight" },
    "night-streetlit": <Grounding>{ value: 18, status: "ASSUMED", source: "no direct literature; scotopic/mesopic loss" },
    "dark": <Grounding>{ value: 6, status: "ASSUMED", source: "no direct literature" },
  },
  visualFieldLimitDegrees: <Grounding>{ value: 100, status: "CITED", source: "temporal monocular field ~90–100° (standard perimetry; Strasburger review)" },
  personReferenceScaleMeters: <Grounding>{ value: 1.7, status: "CITED", source: "CAST 28/09 subject height reference 1.64–1.76 m" },

  // --- perception: attention ---
  ambientAttentionFactor: <Grounding>{ value: 0.6, status: "CITED", source: "Hyman et al. 2010: >50% undistracted walkers notice (finer split unverified)" },
  attendedElsewhereFactor: <Grounding>{ value: 0.25, status: "CITED", source: "Simons & Chabris 1999 (46% miss); Hyman 2010 (25% phone-talkers notice); Drew 2013 (83% expert miss). 0.25 = demanding-task anchor of a 0.25–0.85 range" },
  orientingThreshold: <Grounding>{ value: 0.15, status: "ASSUMED", source: "no literature in this parameterization" },
  audibilityHalfDistanceMeters: <Grounding>{ value: 50, status: "ASSUMED", source: "no direct literature" },
  // Tactile/physical-contact floor (schema extension 2): being physically acted
  // on gives near-certain perception OF THE CONTACT regardless of vision.
  tactileOnsetFloor: <Grounding>{ value: 0.4, status: "ASSUMED", source: "no literature located for proprioceptive event-report completeness; partial-tier floor, chosen before re-running fixtures" },

  // --- perception: stress ---
  stressAttendedBoostExp: <Grounding>{ value: 0.3, status: "ASSUMED", source: "direction CITED (Christianson 1992); magnitude unsettled (Deffenbacher 2004)" },
  stressPeripheralPenalty: <Grounding>{ value: 0.5, status: "CITED", source: "Easterbrook 1959 direction; Steblay 1992 d≈0.55 / Fawcett 2013 g≈0.75 feature impairment (multiplier mapping ASSUMED)" },

  // --- perception tiers (named thresholds) ---
  perceptionTierEdges: { glimpse: 0.12, partial: 0.35, clear: 0.62, complete: 0.85 },

  // --- recording: pure DORI pixel geometry (v2 rewrite — replaces the v1
  //     quality-score curve; eliminates recordingDistanceHalfMeters and
  //     recordingTierEdges, two ASSUMED constants, entirely) ---
  pxPerMeterAt1m: {
    "door-low": <Grounding>{ value: 280, status: "CITED", source: "D1/CIF-class legacy geometry (CAST 28/09 Table 2: CIF cannot meet Identify)" },
    "dome-mid": <Grounding>{ value: 960, status: "CITED", source: "1080p @ ~90° FOV: 1920/(2·tan45°) = 960 px·m/m" },
    "wide-far": <Grounding>{ value: 550, status: "CITED", source: "1080p @ ~120° FOV: 1920/(2·tan60°) ≈ 554 px·m/m" },
    "phone": <Grounding>{ value: 1600, status: "ASSUMED", source: "4K-class @ ~70° FOV; geometry-extrapolated" },
    "phone-2013": <Grounding>{ value: 500, status: "ASSUMED", source: "720p-class + platform transcode losses (Era 5 forensics register)" },
    "dashcam": <Grounding>{ value: 700, status: "ASSUMED", source: "geometry-extrapolated" },
  },
  // DORI task thresholds in px on a person-scale (1.7 m) subject:
  // Identify 250 px/m ⇒ 425 px; Recognise 125 ⇒ 212.5; Observe 62.5 ⇒ 106.25; Detect 25 ⇒ 42.5.
  // CITED: IEC 62676-4:2014 densities × CAST 1.7 m reference. (2025 revision
  // roughly doubles these under heavy compression — 2014 figures used, caveat noted.)
  doriPersonPx: { identify: 425, recognise: 212.5, observe: 106.25, detect: 42.5, trace: 12 },
  lightingRecordingFactor: {
    "daylight": 1.0, "indoor-fluorescent-good": 0.9, "night-streetlit": 0.6, "dark": 0.25,
  }, // ASSUMED multipliers on effective px
  emCorruptionEdges: { degraded: 0.3, unrecoverable: 0.6 }, // ASSUMED thirds; results insensitive at corruption = 1.0
  seededNoiseAmplitude: <Grounding>{ value: 0.04, status: "ASSUMED", source: "residual variation; deterministic via committed seed" },

  // --- NAMED DESIGN LEVER 1: reaction floor → PER-OBSERVER DISTRIBUTION (Ruling C) ---
  // DISTRIBUTION FAMILY: log-normal — the FAMILY ITSELF IS ASSUMED (Ruling F):
  // nothing sources the shape; it is a defensible default for a positive,
  // right-skewed task time, chosen, not derived.
  // Logged for later, not modeled (Ruling F): "phone already in hand, unlocked,
  // roughly aimed" is a real readiness state that is neither already-recording
  // nor 2-s-floor — it will matter at concerts/protests.
  // Log-normal, median 7 s, sigma 0.55, truncated at 2 s physiological minimum:
  // P(<3s)≈6% (phone-in-hand), P(<5s)≈27%, P(>20s)≈2.8% (bags/gloves/slow appraisal).
  // NOT adjusted against any fixture (Ruling A answer: independent).
  reactionFloorMedianSeconds: <Grounding>{ value: 7.0, status: "ASSUMED", source: "component-sum floor, components sourced (Green 2000 surprise-RT 1.5s + Ashbrook 2008 retrieval 4.6s + quick-launch 0.5–1s + aim ~1s); appraisal median unsourced" },
  reactionFloorSigma: <Grounding>{ value: 0.55, status: "ASSUMED", source: "no distributional literature; percentile shape chosen for physical plausibility; swept 0.4–0.7 in report" },
  reactionFloorMinSeconds: <Grounding>{ value: 2.0, status: "ASSUMED", source: "physiological minimum: orient + raise, phone already in hand" },

  // --- FITTED (Ruling A): cannot count toward validation ---
  filmingPropensity: <Grounding>{ value: 0.06, status: "FITTED", source: "FITTED: mechanism introduced after 2nd pre-registration when inspection showed ~50 recordings/100 bystanders without it; value chosen from the V2 register band (1–10%, itself ASSUMED; Pew 7%-ever floor) so expected output lands inside the ET2 band — chosen against the target. Needs independent validation before ledger promotion. Constant; salience-scaling REQUIRED (Carrer arithmetic) and deferred" },

  // --- NAMED DESIGN LEVER 2: already-recording rate (per bystander, by context) ---
  // Set from the V2 register bands BEFORE any fixture or sweep ran (not fitted).
  alreadyRecordingRate: {
    "street": <Grounding>{ value: 0.005, status: "ASSUMED", source: "V2 register 5.4 band 0.1–1% (LOW), midpoint; set pre-run" },
    "store": <Grounding>{ value: 0.002, status: "ASSUMED", source: "below street baseline; set pre-run" },
    "event-crowd": <Grounding>{ value: 0.05, status: "ASSUMED", source: "recording-normative settings; set pre-run" },
    "home": <Grounding>{ value: 0.005, status: "ASSUMED", source: "video-call prevalence; set pre-run" },
  },
  sustainedCaptureBand: { min: 0.01, max: 0.10 },
};

export function clamp01(x: number): number { return x < 0 ? 0 : x > 1 ? 1 : x; }
