// Grounding taxonomy (inherited): CITED | ASSUMED | FITTED | FITTED-CORROBORATED.
//
// ⚠ TOP-FLAGGED WEAKNESS 1: TARGET-RECEPTION RATE. The gossip literature
// confirms targets usually learn second-hand or by accident (Martinescu 2019)
// but NO study measures per-story probability or latency of the subject
// learning (register 5.3: INCONCLUSIVE). Every telling-the-subject constant
// below is ASSUMED. This is this model's analog of the exposure spike's
// units-conversion weakness. Resolution requires a study that does not exist.
//
// ⚠ TOP-FLAGGED WEAKNESS 2: MINOR-STORY AWARENESS FLOORS. The classic
// per-event awareness table for low-salience items was not retrievable
// (register 2.3); minor-story ceilings below are ASSUMED brackets around
// Pew's attention proxy (average story followed closely by 26%).

export type Grounding = { value: number; status: "CITED" | "ASSUMED" | "FITTED" | "FITTED-CORROBORATED"; source: string };

export type Channel = "wordOfMouth" | "localMedia" | "platformGroup" | "massMedia";
export type Salience = "minor" | "notable" | "major";

// Channel weights for a NEIGHBORHOOD-SCALE story, by anchor year.
// Interpolated linearly between anchors. CITED at modern anchors (Pew trend
// surveys 2018–2025), canon-anchored (Era files §2, themselves externally
// researched) for 2004–2014. Values are relative first-source weights.
export const CHANNEL_ANCHORS: Record<number, Record<Channel, number>> = {
  2004: { wordOfMouth: 0.45, localMedia: 0.45, platformGroup: 0.00, massMedia: 0.10 }, // Era 1 §2: days-not-minutes; nothing mass without a news outlet
  2008: { wordOfMouth: 0.40, localMedia: 0.35, platformGroup: 0.15, massMedia: 0.10 }, // Era 2 §2: link-driven forums/blogs, no feed
  2013: { wordOfMouth: 0.35, localMedia: 0.25, platformGroup: 0.30, massMedia: 0.10 }, // Era 3 §2: platform feeds rising, local decline
  2016: { wordOfMouth: 0.35, localMedia: 0.20, platformGroup: 0.35, massMedia: 0.10 }, // Era 5 §3
  2019: { wordOfMouth: 0.33, localMedia: 0.15, platformGroup: 0.42, massMedia: 0.10 }, // Era 5 §3: groups fill local-news vacuum
  2024: { wordOfMouth: 0.35, localMedia: 0.12, platformGroup: 0.43, massMedia: 0.10 }, // Pew 2024: WOM 73% most common source; groups 52% (from 38% 2018); papers 33% (from 43%)
  2026: { wordOfMouth: 0.35, localMedia: 0.10, platformGroup: 0.45, massMedia: 0.10 }, // Foundation-baseline extension (ASSUMED)
};

export function channelWeights(year: number): Record<Channel, number> {
  const ys = Object.keys(CHANNEL_ANCHORS).map(Number).sort((a, b) => a - b);
  const lo = Math.max(...ys.filter(y => y <= year), ys[0]!);
  const hi = Math.min(...ys.filter(y => y >= year), ys[ys.length - 1]!);
  if (lo === hi) return CHANNEL_ANCHORS[lo]!;
  const t = (year - lo) / (hi - lo);
  const out = {} as Record<Channel, number>;
  for (const c of ["wordOfMouth", "localMedia", "platformGroup", "massMedia"] as Channel[]) {
    out[c] = CHANNEL_ANCHORS[lo]![c] + t * (CHANNEL_ANCHORS[hi]![c] - CHANNEL_ANCHORS[lo]![c]);
  }
  return out;
}

export const P = {
  // Diffusion shape: logistic (S-curve) toward a salience-dependent ceiling.
  // CITED (shape): Deutschmann & Danielson 1960; Rogers 2000 (52 studies) —
  // S-shaped cumulative awareness. SHAPE-ONLY: 1960s magnitudes not imported.
  //
  // Reach ceilings within the story's HOME scope, by salience:
  reachCeiling: {
    minor: <Grounding>{ value: 0.45, status: "ASSUMED", source: "TOP WEAKNESS 2: minor-story floors not retrievable (register 2.3); bracket set around Pew attention proxy (avg story 26% followed closely; range 6–80%)" },
    notable: <Grounding>{ value: 0.80, status: "ASSUMED", source: "between minor and major; no direct anchor" },
    major: <Grounding>{ value: 0.95, status: "CITED", source: "major events reach ~90%+ (Greenberg 1964a: 90% in 60 min; Kanihan & Gale: 97% in 3h for 9/11) — ceiling, not speed, imported" },
  },
  // Daily logistic growth rate multiplier by salience (speed):
  growthRate: {
    minor: <Grounding>{ value: 0.35, status: "ASSUMED", source: "no platform-era neighborhood awareness curves exist (register 3.4 INCONCLUSIVE)" },
    notable: <Grounding>{ value: 0.9, status: "ASSUMED", source: "same gap" },
    major: <Grounding>{ value: 3.0, status: "CITED", source: "major-event speed: ~90% within an hour (1963) to ~97% in 3h (2001) — day-step model saturates in ≤1 day, consistent" },
  },
  // Era speed factor: how much faster a story moves per unit growth in the
  // platform channel share (canon Era 1 'days not minutes' → 2026 'hours').
  eraSpeedFromPlatformShare: <Grounding>{ value: 2.5, status: "ASSUMED", source: "canon direction (Era 1 §2 days → Era 5 §3 immediate); magnitude unanchored" },
  // Outward spillover: fraction of home-scope reach that seeds the next scope
  // up per day, by salience. Identity link DROPS by default at the boundary
  // (Amendment B); retention requires a committed re-identification event.
  spillover: {
    minor: <Grounding>{ value: 0.01, status: "ASSUMED", source: "most minor stories never leave their scope (Chaffee 1975 incomplete diffusion — CITED direction, ASSUMED magnitude)" },
    notable: <Grounding>{ value: 0.05, status: "ASSUMED", source: "same" },
    major: <Grounding>{ value: 0.25, status: "ASSUMED", source: "same" },
  },
  // Decay (heavy tail): reach decays after active phase; interpretation
  // persists (GAP-16 law, validated at S3; drift happens only during active
  // circulation — leveling/sharpening, Allport & Postman, CITED direction).
  reachHalfLifeDays: <Grounding>{ value: 25, status: "CITED", source: "COVID rumor survival: half faded within ~25 days; heavy tail thereafter (MEDIUM confidence, single study)" },

  // --- Reception (per actor, per day) ---
  // Surface bandwidth: probability that a contact opportunity through this
  // surface yields FULL reception (vs partial) when it fires:
  surfaceBandwidth: {
    household: <Grounding>{ value: 0.95, status: "ASSUMED", source: "direct conversation; near-full bandwidth" },
    workplace: <Grounding>{ value: 0.8, status: "ASSUMED", source: "break-room conversation (Greenberg 1964a: at work 75% learned interpersonally — presence of channel CITED, bandwidth ASSUMED)" },
    socialCircle: <Grounding>{ value: 0.85, status: "ASSUMED", source: "" },
    platformGroup: <Grounding>{ value: 0.9, status: "ASSUMED", source: "reading the post is full reception" },
    localMedia: <Grounding>{ value: 0.9, status: "ASSUMED", source: "" },
    ambientPublic: <Grounding>{ value: 0.15, status: "ASSUMED", source: "strangers' looks, half-heard remarks — the partial-reception surface (Amendment D); mostly partial by construction" },
  },
  // Daily opportunity intensity per surface = surfaceActivity × narrative
  // presence in that surface's channel/scope. Base activity rates:
  surfaceActivity: {
    household: 0.9, workplace: 0.7, socialCircle: 0.3, platformGroup: 0.5, localMedia: 0.3, ambientPublic: 0.4,
  }, // ASSUMED — no per-witness contact-frequency literature in this parameterization
  // TOP WEAKNESS 1 — telling-the-subject multiplier when the narrative is
  // NAMED at a scope the actor's ties inhabit (people tell you about you /
  // you encounter it directly):
  namedSubjectTellMultiplier: <Grounding>{ value: 4.0, status: "ASSUMED", source: "TOP WEAKNESS 1: no per-story target-reception measurement exists (register 5.3 INCONCLUSIVE); direction CITED (targets learn from recipients or by accident — Martinescu 2019, 72.5% ever-recall); magnitude invented. Senders also conceal from targets (Dores Cruz 2021) — the multiplier nets telling against concealment" },
  // Avoidance (Amendment C): committed action; multiplies the actor's chosen
  // avoidable surfaces' activity by this factor while active. ambientPublic
  // is NOT avoidable (strangers' looks).
  avoidanceFactor: <Grounding>{ value: 0.15, status: "ASSUMED", source: "no literature; the ACTION is the mechanism (duration+cost committed); the residual 0.15 models imperfect avoidance" },
};

// FITTED (sequencing note): added after the first fixture run showed
// over-diffusion (anonymous never-learns 0.015 vs pre-registered >0.15).
// Direction independently CITED — the J-curve (Greenberg 1964b; register 1.5):
// "as stories decrease in importance, the personal channel plays a
// successively smaller role"; minor stories are conveyed almost exclusively by
// mass media. Magnitudes chosen against the pre-registered targets ⇒ FITTED.
export const salienceCarriage: Record<"minor" | "notable" | "major", Grounding> = {
  minor: { value: 0.08, status: "FITTED", source: "J-curve direction CITED; magnitude fitted (see header note)" },
  notable: { value: 0.4, status: "FITTED", source: "same" },
  major: { value: 1.0, status: "CITED", source: "at extreme salience interpersonal share is maximal (FDR 85% WOM; Kennedy ~50%; 9/11 48%)" },
};

export function clamp01(x: number): number { return x < 0 ? 0 : x > 1 ? 1 : x; }
