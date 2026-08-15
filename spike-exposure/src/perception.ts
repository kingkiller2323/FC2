import { P, clamp01 } from "./params.js";
import type { ExposureEvent, Lighting, ObserverState, PerceptionRecord, PerceptionTier } from "./types.js";

// Perception completeness: geometric base × attention gate × stress transform,
// with the event signature as stimulus. Continuous internal score in [0,1];
// committed tier at named thresholds only.

function distanceFactor(d: number, lighting: Lighting): number {
  const half = P.distanceHalfMeters[lighting].value;
  return clamp01(1 / (1 + d / half));
}

function offAxisFactor(angleDeg: number): number {
  const a = Math.abs(angleDeg);
  if (a >= P.visualFieldLimitDegrees.value) return 0; // named threshold: outside the visual field
  return clamp01(1 / (1 + a / P.eccentricityE2.value) + 0.06 * (1 - a / P.visualFieldLimitDegrees.value));
  // second term: peripheral motion/flash detection floor — periphery detects that
  // *something* happened long after it stops resolving what.
}

function audibleSalience(event: ExposureEvent, d: number): number {
  return clamp01(event.signature.audibility / (1 + d / P.audibilityHalfDistanceMeters.value));
}

function visualStimulus(event: ExposureEvent): number {
  if (event.signature.visibility === "invisible") return 0;
  const base = event.signature.visualMagnitude;
  return event.signature.visibility === "effects-only" ? base * 0.85 : base;
}

function attentionGate(o: ObserverState, attendedOnEvent: boolean): number {
  if (o.attention === "ambient") return P.ambientAttentionFactor.value;
  return attendedOnEvent ? 1.0 : P.attendedElsewhereFactor.value;
}

function stressTransform(score: number, o: ObserverState, attendedOnEvent: boolean): number {
  // Narrowing, never blindness: attended target non-decreasing in stress,
  // unattended periphery non-increasing in stress.
  if (attendedOnEvent) return clamp01(Math.pow(score, 1 - P.stressAttendedBoostExp.value * o.stress));
  return clamp01(score * (1 - P.stressPeripheralPenalty.value * o.stress));
}

export function toPerceptionTier(score: number): PerceptionTier {
  const e = P.perceptionTierEdges;
  if (score >= e.complete) return "complete";
  if (score >= e.clear) return "clear";
  if (score >= e.partial) return "partial";
  if (score >= e.glimpse) return "glimpse";
  return "none";
}

export function resolvePerception(event: ExposureEvent, lighting: Lighting, o: ObserverState): PerceptionRecord {
  const attendedOnEvent = o.attention === "attended" && o.attentionTarget !== null &&
    /event|cart|priya|scene/i.test(o.attentionTarget);

  // --- onset phase: geometry as-found at t0 ---
  const sensoryFactor = o.sensory === "impaired" ? 0.5 : 1.0;
  const visBase =
    visualStimulus(event) *
    distanceFactor(o.distanceMeters, lighting) *
    offAxisFactor(o.offAxisDegrees) *
    (1 - o.occlusion) *
    sensoryFactor;
  const gated = visBase * attentionGate(o, attendedOnEvent);
  const onsetScore = stressTransform(gated, o, attendedOnEvent);

  // --- orienting: does the observer turn toward it at all? ---
  const heard = audibleSalience(event, o.distanceMeters) * sensoryFactor;
  const sawSomething = onsetScore > 0.02;
  const oriented = sawSomething || heard >= P.orientingThreshold.value;

  // Oriented during the event only if it lasts long enough to turn (≈1s orienting latency).
  const orientedDuringEvent = oriented && event.durationSeconds > 1.0 &&
    (sawSomething || heard >= P.orientingThreshold.value);

  // --- overall/aftermath phase: after orienting, facing toward, no surprise penalty ---
  let overallScore = onsetScore;
  if (oriented) {
    const facingScore =
      visualStimulus(event) * 0.9 + 0.1 /* aftermath is scene-state: always something to see */;
    const aftermath =
      clamp01(facingScore) *
      distanceFactor(o.distanceMeters, lighting) *
      (1 - o.occlusion * 0.5) /* observers reposition around partial occlusion */ *
      sensoryFactor;
    overallScore = Math.max(onsetScore, aftermath * (orientedDuringEvent ? 1.0 : 0.9));
  }

  return {
    observerId: o.id,
    onsetTier: toPerceptionTier(onsetScore),
    overallTier: toPerceptionTier(overallScore),
    oriented,
    orientedDuringEvent,
    internal: { onsetScore, overallScore },
  };
}
