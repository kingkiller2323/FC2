import { P, clamp01 } from "./params.js";
import type { DeviceState, ExposureEvent, Lighting, RecordingRecord, RecordingTier } from "./types.js";

// v2 recording model: pure DORI pixel geometry (IEC 62676-4 densities × CAST
// 1.7 m reference), replacing the v1 quality-score distance curve. A device's
// capture grade = pixels on the subject; tiers map to DORI tasks:
//   sharp ≥ Recognise-grade · usable ≥ Observe · degraded ≥ Detect · trace ≥ minimal.
// Subject scale (schema ext. 1) enters as px/m × subjectScaleMeters.

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function hashId(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

export function toRecordingTier(subjectPx: number): RecordingTier {
  const t = P.doriPersonPx;
  if (subjectPx >= t.recognise) return "sharp";
  if (subjectPx >= t.observe) return "usable";
  if (subjectPx >= t.detect) return "degraded";
  if (subjectPx >= t.trace) return "trace";
  return "none";
}

export function resolveRecording(event: ExposureEvent, lighting: Lighting, d: DeviceState, seed: number): RecordingRecord {
  if (!d.operating || !d.inFieldOfView) {
    return { deviceId: d.id, tier: "none", corruption: 0, identifySupport: false, retentionDays: d.retentionDays, internal: { fidelityScore: 0 } };
  }

  const pxPerM = P.pxPerMeterAt1m[d.qualityTier].value / Math.max(0.5, d.distanceMeters);
  const lightF = P.lightingRecordingFactor[lighting];
  const noise = 1 + (mulberry32((seed ^ hashId(d.id)) >>> 0)() - 0.5) * 2 * P.seededNoiseAmplitude.value;
  const subjectScale = event.signature.subjectScaleMeters ?? P.personReferenceScaleMeters.value;
  let subjectPx = pxPerM * subjectScale * lightF * noise;

  // EM susceptibility: named thresholds (degraded / unrecoverable).
  let corruption = 0;
  const r = event.signature.radiusMeters;
  if (d.emExposed && event.signature.emSideEffect > 0 && r > 0) {
    const proximity = clamp01(1 / (1 + Math.max(0, d.distanceMeters - r) / r));
    corruption = clamp01(event.signature.emSideEffect * proximity);
  }
  if (corruption >= P.emCorruptionEdges.unrecoverable) subjectPx = Math.min(subjectPx, P.doriPersonPx.trace); // critical seconds unrecoverable
  else if (corruption >= P.emCorruptionEdges.degraded) subjectPx = subjectPx * (1 - corruption);

  // Identification concerns the PERSON, not the scene subject: person-px must
  // meet the Identify threshold (250 px/m × 1.7 m = 425 px). Even then,
  // identify-grade DETAIL ≠ identification succeeding (Bruce et al. 2001:
  // unfamiliar matching 70%/56% on good video) — downstream epistemics own that.
  const personPx = pxPerM * P.personReferenceScaleMeters.value * lightF;
  const identifySupport = personPx >= P.doriPersonPx.identify && corruption < P.emCorruptionEdges.degraded && lightF >= 0.6;

  return {
    deviceId: d.id,
    tier: toRecordingTier(subjectPx),
    corruption,
    identifySupport,
    retentionDays: d.retentionDays,
    internal: { fidelityScore: subjectPx },
  };
}
