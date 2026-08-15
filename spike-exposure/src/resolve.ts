import { P } from "./params.js";
import { resolvePerception } from "./perception.js";
import { resolveRecording, mulberry32 } from "./recording.js";

function hashId(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
import type {
  BelievedScene, BystanderRecording, ExposureLedgerEntry, ObjectiveScene, PerceptionRecord,
} from "./types.js";

// The exposure ledger resolution. Same functions serve Layer 1 (objective) and
// Layer 2 (believed/estimate) — the layers are distinct branded input types and
// are NEVER merged.

function bystanderPaths(scene: ObjectiveScene | BelievedScene, perceptions: PerceptionRecord[]): BystanderRecording[] {
  const out: BystanderRecording[] = [];
  const dur = scene.event.durationSeconds;
  for (const c of scene.carried) {
    if (c.alreadyRecording) {
      // Amendment 2b path 2: NOT gated on perception or the reaction floor.
      out.push({
        custodian: c.custodian, path: "already-recording",
        startedAtSecond: 0, // was rolling before onset
        capturedSeconds: dur,
        aimedAtEvent: c.aimedAtEventIfRecording ?? false, // unrelated aim: usually wrong
      });
      continue;
    }
    // Path 1 (reactive): requires perception ≥ glimpse, the filming-propensity
    // gate (the appraise-and-decide term — most people who can film never do;
    // research-driven addition, see params.filmingPropensity), then the
    // reaction floor.
    const p = perceptions.find(x => x.observerId === c.custodian);
    if (!p || (p.onsetTier === "none" && !p.orientedDuringEvent)) continue;
    const decides = mulberry32((scene.seed ^ hashId(c.custodian)) >>> 0)() < P.filmingPropensity.value;
    if (!decides) continue;
    const start = P.reactionFloorSeconds.value;
    const captured = Math.max(0, dur - start);
    if (captured > 0) {
      out.push({ custodian: c.custodian, path: "reactive", startedAtSecond: start, capturedSeconds: captured, aimedAtEvent: true });
    }
    // captured === 0 → no contemporaneous footage; aftermath photography remains
    // possible but is aftermath-evidence territory (contract class, out of spike).
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
