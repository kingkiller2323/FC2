// Visibility model spike — two pure functions:
//   narrativeStep: reach growth/spillover/decay/hardening per day (per scope)
//   receptionOpportunity: per-actor per-day resolution → full / partial / none
// Invariants: NO-LEAK (knowledge only via returned events) · NO-TELEPORT
// (every event carries surface/channel provenance) · NULL-RECEPTION valid ·
// conservation (reach changes only here) · determinism (seeded) · reputation
// two-layer (actor's believed status is never written by this module).

import { P, channelWeights, clamp01, salienceCarriage, type Channel, type Salience } from "./params.js";

export type Scope = "household" | "workplace" | "block" | "neighborhood" | "district" | "city";
export const SCOPE_LADDER: Scope[] = ["household", "workplace", "block", "neighborhood", "district", "city"];

export type SubjectLink = "named" | "description-only" | "anonymous";

export interface NarrativeState {
  id: string;
  year: number;
  salience: Salience;            // Ruling K discipline: judgment input, stated reasoning
  homeScope: Scope;
  reach: Partial<Record<Scope, number>>;   // awareness fraction per scope
  subjectLinkByScope: Partial<Record<Scope, SubjectLink>>; // Amendment B: per (narrative, scope)
  ageDays: number;
  activePhase: boolean;          // growth vs decay
  dominantInterpretation: string; // hardening: persists absent corrective transmission (GAP-16 law)
}

export interface ReIdentificationEvent {
  narrativeId: string; scope: Scope; day: number;
  mechanism: string;             // committed, provenanced (Amendment B)
}

// One day of narrative evolution. Pure; returns the new state.
export function narrativeStep(n: NarrativeState, reidentifications: ReIdentificationEvent[] = []): NarrativeState {
  const w = channelWeights(n.year);
  const speed = 1 + P.eraSpeedFromPlatformShare.value * w.platformGroup;
  const ceiling = P.reachCeiling[n.salience].value;
  const g = P.growthRate[n.salience].value * speed;
  const reach: Partial<Record<Scope, number>> = { ...n.reach };
  const link: Partial<Record<Scope, SubjectLink>> = { ...n.subjectLinkByScope };

  const idx = SCOPE_LADDER.indexOf(n.homeScope);
  for (let i = idx; i < SCOPE_LADDER.length; i++) {
    const s = SCOPE_LADDER[i]!;
    const a = reach[s] ?? 0;
    if (n.activePhase) {
      // logistic growth toward ceiling (S-curve, CITED shape)
      const grown = a + g * Math.max(a, 0.02) * (ceiling - a) * (s === n.homeScope ? 1 : 0.5);
      reach[s] = clamp01(Math.min(ceiling, grown));
      // outward spillover seeds the next scope; identity link DROPS by default
      const next = SCOPE_LADDER[i + 1];
      if (next && reach[s]! > 0.1) {
        const seeded = (reach[next] ?? 0) + P.spillover[n.salience].value * reach[s]!;
        reach[next] = clamp01(seeded);
        if (link[next] === undefined) link[next] = "anonymous"; // Amendment B default drop
      }
    } else {
      reach[s] = a * Math.pow(0.5, 1 / P.reachHalfLifeDays.value); // heavy-tail decay of ACTIVE reach; awareness itself is not forgotten in-model — this models circulation
    }
  }
  for (const r of reidentifications) {
    if (r.narrativeId === n.id) link[r.scope] = "named"; // discrete, committed, provenanced
  }
  const activePhase = n.activePhase && n.ageDays < 14; // active window ASSUMED
  return { ...n, reach, subjectLinkByScope: link, ageDays: n.ageDays + 1, activePhase };
}

// --- Reception ---
export interface ActorSurfaces {
  actorId: string;
  memberScopes: Scope[];               // where the actor's life actually runs
  platformGroupMember: boolean;
  localMediaConsumer: boolean;
  circleSizeFactor: number;            // 0..1 (Dunbar-graded)
  avoidedSurfaces: string[];           // Amendment C: active avoidance (committed action upstream)
  isSubject: boolean;                  // is this actor the narrative's subject?
}

export type Reception =
  | { kind: "full"; surface: string; channel: Channel | "interpersonal"; day: number }
  | { kind: "partial"; surface: string; day: number } // Amendment D: knows SOMETHING circulates, not what
  | { kind: "none" };

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

// One actor-day. Pure, seeded, deterministic. NO-LEAK: the caller commits the
// returned event; nothing else may write actor knowledge.
export function receptionOpportunity(actor: ActorSurfaces, n: NarrativeState, day: number, seed: number): Reception {
  const rng = mulberry32((seed ^ hash(actor.actorId) ^ (day * 2654435761)) >>> 0);
  const w = channelWeights(n.year);

  const surfaces: Array<{ name: keyof typeof P.surfaceActivity; scope: Scope | null; channel: Channel | "interpersonal"; gate: boolean }> = [
    { name: "household", scope: "household", channel: "interpersonal", gate: actor.memberScopes.includes("household") },
    { name: "workplace", scope: "workplace", channel: "interpersonal", gate: actor.memberScopes.includes("workplace") },
    { name: "socialCircle", scope: "neighborhood", channel: "interpersonal", gate: true },
    { name: "platformGroup", scope: "neighborhood", channel: "platformGroup", gate: actor.platformGroupMember },
    { name: "localMedia", scope: "city", channel: "localMedia", gate: actor.localMediaConsumer },
    { name: "ambientPublic", scope: "neighborhood", channel: "interpersonal", gate: true },
  ];

  for (const s of surfaces) {
    if (!s.gate || !s.scope) continue;
    const reachHere = n.reach[s.scope] ?? 0;
    if (reachHere <= 0) continue;
    let activity = P.surfaceActivity[s.name];
    if (actor.avoidedSurfaces.includes(s.name) && s.name !== "ambientPublic") activity *= P.avoidanceFactor.value; // ambient is unavoidable (Amendment C/D)
    // channel weighting: platform/local-media surfaces scale with the era's channel share
    const channelFactor = s.channel === "interpersonal" ? w.wordOfMouth + 0.3 : s.channel === "platformGroup" ? w.platformGroup : w.localMedia;
    // Salience carriage (FITTED, J-curve direction CITED): low-salience
    // stories rarely arise in conversation or get posted; media surfaces are
    // exempt (they are what carries minor stories, per the J-curve's middle).
    const carriage = s.channel === "localMedia" || s.channel === "massMedia" ? 1 : salienceCarriage[n.salience].value;
    let intensity = activity * reachHere * channelFactor * carriage * (s.name === "socialCircle" ? actor.circleSizeFactor : 1);
    // TOP WEAKNESS 1: named-subject routing — people tell you about you
    if (actor.isSubject && (n.subjectLinkByScope[s.scope] ?? "anonymous") === "named" && s.channel === "interpersonal") {
      intensity *= P.namedSubjectTellMultiplier.value;
    }
    if (rng() < clamp01(intensity)) {
      const full = rng() < P.surfaceBandwidth[s.name].value;
      if (full) return { kind: "full", surface: s.name, channel: s.channel, day };
      return { kind: "partial", surface: s.name, day }; // Amendment D: falls out of bandwidth, not special-cased
    }
  }
  return { kind: "none" }; // NULL-RECEPTION: a valid committed outcome
}
