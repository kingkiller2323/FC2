import { P, clamp01 } from "./params.js";
import type { DeviceState, ExposureEvent, Lighting, RecordingRecord, RecordingTier } from "./types.js";

// Recording corruption/survival: quality-tier base × distance × lighting,
// EM susceptibility from side-effect signature and proximity, deterministic
// seeded noise committed with the event.

export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashId(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

export function toRecordingTier(score: number): RecordingTier {
  const e = P.recordingTierEdges;
  if (score >= e.sharp) return "sharp";
  if (score >= e.usable) return "usable";
  if (score >= e.degraded) return "degraded";
  if (score >= e.trace) return "trace";
  return "none";
}

export function resolveRecording(event: ExposureEvent, lighting: Lighting, d: DeviceState, seed: number): RecordingRecord {
  if (!d.operating || !d.inFieldOfView) {
    return { deviceId: d.id, tier: "none", corruption: 0, identifySupport: false, retentionDays: d.retentionDays, internal: { fidelityScore: 0 } };
  }

  const q = P.deviceQualityBase[d.qualityTier].value;
  const distF = clamp01(1 / (1 + d.distanceMeters / P.recordingDistanceHalfMeters.value));
  const lightF = P.lightingRecordingFactor[lighting];
  const noise = (mulberry32((seed ^ hashId(d.id)) >>> 0)() - 0.5) * 2 * P.seededNoiseAmplitude.value;
  let fidelity = clamp01(q * (0.4 + 0.6 * distF) * lightF + noise);

  // EM susceptibility: named thresholds (degraded / unrecoverable).
  let corruption = 0;
  const r = event.signature.radiusMeters;
  if (d.emExposed && event.signature.emSideEffect > 0 && r > 0) {
    const proximity = clamp01(1 / (1 + Math.max(0, d.distanceMeters - r) / r));
    corruption = clamp01(event.signature.emSideEffect * proximity);
  }
  if (corruption >= P.emCorruptionEdges.unrecoverable) fidelity = Math.min(fidelity, 0.1); // critical seconds unrecoverable
  else if (corruption >= P.emCorruptionEdges.degraded) fidelity = fidelity * (1 - corruption);

  const identifySupport = fidelity >= P.identifySupportThreshold.value && corruption < P.emCorruptionEdges.degraded;

  return {
    deviceId: d.id,
    tier: toRecordingTier(fidelity),
    corruption,
    identifySupport,
    retentionDays: d.retentionDays,
    internal: { fidelityScore: fidelity },
  };
}
