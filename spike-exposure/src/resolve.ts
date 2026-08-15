import { P } from "./params.js";
import { resolvePerception } from "./perception.js";
import { resolveRecording, mulberry32, hashId } from "./recording.js";
import type {
  BelievedScene, BystanderRecording, EventPhase, ExposureLedgerEntry, ObjectiveScene, PerceptionRecord,
} from "./types.js";

// The exposure ledger resolution. Same functions serve Layer 1 (objective) and
// Layer 2 (believed/estimate) — distinct branded input types, never merged.

// Per-observer reaction floor (Ruling C): log-normal(median, sigma), truncated
// at the physiological minimum, drawn deterministically per observer+seed.
export function observerReactionFloor(custodian: string, seed: number): number {
  const rng = mulberry32((seed ^ hashId("floor:" + custodian)) >>> 0);
  // Box–Muller from two deterministic uniforms.
  const u1 = Math.max(1e-12, rng()), u2 = rng();
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  const draw = Math.exp(Math.log(P.reactionFloorMedianSeconds.value) + P.reactionFloorSigma.value * z);
  return Math.max(P.reactionFloorMinSeconds.value, draw);
}

// Schema ext. 4: phase helpers. Absent phases ⇒ whole event is one salient,
// anomalous phase starting at 0.
function phasesOf(dur: number, phases?: EventPhase[]): EventPhase[] {
  return phases && phases.length > 0
    ? phases
    : [{ name: "event", startSecond: 0, durationSeconds: dur, salient: true, anomalous: true }];
}

function bystanderPaths(scene: ObjectiveScene | BelievedScene, perceptions: PerceptionRecord[]): BystanderRecording[] {
  const out: BystanderRecording[] = [];
  const dur = scene.event.durationSeconds;
  const ph = phasesOf(dur, scene.event.phases);
  const firstSalientStart = Math.min(...ph.filter(p => p.salient).map(p => p.startSecond));
  const anomalous = ph.filter(p => p.anomalous);
  const coversAnomaly = (from: number) =>
    anomalous.some(a => from < a.startSecond + a.durationSeconds);

  for (const c of scene.carried) {
    if (c.alreadyRecording) {
      // Amendment 2b path 2: NOT gated on perception or the reaction floor.
      out.push({
        custodian: c.custodian, path: "already-recording",
        startedAtSecond: 0, capturedSeconds: dur,
        capturedAnomalousPhase: anomalous.length > 0,
        aimedAtEvent: c.aimedAtEventIfRecording ?? false,
      });
      continue;
    }
    // Path 1 (reactive): perception ≥ glimpse → filming-propensity gate
    // (FITTED — see params) → per-observer reaction floor measured from the
    // FIRST SALIENT PHASE, not from the anomalous moment (Ruling B).
    const p = perceptions.find(x => x.observerId === c.custodian);
    if (!p || (p.onsetTier === "none" && !p.orientedDuringEvent)) continue;
    const tier = scene.event.salience ?? "mundane";
    const decides = mulberry32((scene.seed ^ hashId(c.custodian)) >>> 0)() < P.filmingPropensityByTier[tier].value;
    if (!decides) continue;
    const start = firstSalientStart + observerReactionFloor(c.custodian, scene.seed);
    const captured = Math.max(0, dur - start);
    if (captured > 0) {
      out.push({
        custodian: c.custodian, path: "reactive",
        startedAtSecond: start, capturedSeconds: captured,
        capturedAnomalousPhase: coversAnomaly(start),
        aimedAtEvent: true,
      });
    }
  }
  return out;
}

export function resolveExposure(scene: ObjectiveScene | BelievedScene): ExposureLedgerEntry {
  const perceptions = scene.observers.map(o => resolvePerception(scene.event, scene.lighting, o));
  const recordings = scene.devices.map(d => resolveRecording(scene.event, scene.lighting, d, scene.seed));
  const bystanders = bystanderPaths(scene, perceptions);

  // NULL-EXPOSURE named invariant: empty sets are valid committed outcomes.
  const nullExposure =
    perceptions.every(p => p.onsetTier === "none" && p.overallTier === "none") &&
    recordings.every(r => r.tier === "none") &&
    bystanders.length === 0;

  return {
    eventId: scene.event.id,
    layer: scene.layer,
    perceptions,
    recordings,
    bystanderRecordings: bystanders,
    nullExposure,
  };
}
