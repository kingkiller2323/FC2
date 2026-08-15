import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { resolvePerception } from "../src/perception.js";
import { resolveRecording } from "../src/recording.js";
import { resolveExposure } from "../src/resolve.js";
import type { DeviceState, ExposureEvent, Lighting, ObserverState, ObjectiveScene } from "../src/types.js";

// V1 — parameter sweeps as executable properties. Thousands of runs per property.

const lightings: Lighting[] = ["daylight", "indoor-fluorescent-good", "night-streetlit", "dark"];

const arbEvent = fc.record({
  id: fc.constant("e"),
  mode: fc.constantFrom("accidental", "deliberate") as fc.Arbitrary<"accidental" | "deliberate">,
  durationSeconds: fc.double({ min: 0.5, max: 120, noNaN: true }),
  signature: fc.record({
    visibility: fc.constantFrom("effects-only", "fully-visible") as fc.Arbitrary<"effects-only" | "fully-visible">,
    visualMagnitude: fc.double({ min: 0.1, max: 1, noNaN: true }),
    audibility: fc.double({ min: 0, max: 1, noNaN: true }),
    emSideEffect: fc.double({ min: 0, max: 1, noNaN: true }),
    physicalSideEffect: fc.double({ min: 0, max: 1, noNaN: true }),
    radiusMeters: fc.double({ min: 0, max: 10, noNaN: true }),
  }),
}) as fc.Arbitrary<ExposureEvent>;

const arbObserver = (over?: Partial<ObserverState>) => fc.record({
  id: fc.constant("o"),
  distanceMeters: fc.double({ min: 0.5, max: 120, noNaN: true }),
  offAxisDegrees: fc.double({ min: 0, max: 180, noNaN: true }),
  occlusion: fc.double({ min: 0, max: 1, noNaN: true }),
  attention: fc.constantFrom("attended", "ambient") as fc.Arbitrary<"attended" | "ambient">,
  attentionTarget: fc.constantFrom("event", "phone", null),
  stress: fc.double({ min: 0, max: 1, noNaN: true }),
  sensory: fc.constant("normal") as fc.Arbitrary<"normal">,
}).map(o => ({ ...o, ...over })) as fc.Arbitrary<ObserverState>;

const arbLighting = fc.constantFrom(...lightings);

describe("V1 perception properties", () => {
  it("monotonic non-increasing in distance", () => {
    fc.assert(fc.property(arbEvent, arbLighting, arbObserver(), fc.double({ min: 1, max: 50, noNaN: true }), (e, L, o, dd) => {
      const near = resolvePerception(e, L, o);
      const far = resolvePerception(e, L, { ...o, distanceMeters: o.distanceMeters + dd });
      expect(far.internal.onsetScore).toBeLessThanOrEqual(near.internal.onsetScore + 1e-12);
    }), { numRuns: 3000 });
  });

  it("monotonic non-increasing in occlusion", () => {
    fc.assert(fc.property(arbEvent, arbLighting, arbObserver(), fc.double({ min: 0, max: 1, noNaN: true }), (e, L, o, occ2) => {
      const lo = Math.min(o.occlusion, occ2), hi = Math.max(o.occlusion, occ2);
      const a = resolvePerception(e, L, { ...o, occlusion: lo });
      const b = resolvePerception(e, L, { ...o, occlusion: hi });
      expect(b.internal.onsetScore).toBeLessThanOrEqual(a.internal.onsetScore + 1e-12);
    }), { numRuns: 3000 });
  });

  it("monotonic non-increasing in off-axis angle", () => {
    fc.assert(fc.property(arbEvent, arbLighting, arbObserver(), fc.double({ min: 0, max: 180, noNaN: true }), (e, L, o, a2) => {
      const lo = Math.min(o.offAxisDegrees, a2), hi = Math.max(o.offAxisDegrees, a2);
      const a = resolvePerception(e, L, { ...o, offAxisDegrees: lo });
      const b = resolvePerception(e, L, { ...o, offAxisDegrees: hi });
      expect(b.internal.onsetScore).toBeLessThanOrEqual(a.internal.onsetScore + 1e-12);
    }), { numRuns: 3000 });
  });

  it("stress narrows, never blinds: attended-on-event non-decreasing, attended-elsewhere non-increasing", () => {
    fc.assert(fc.property(arbEvent, arbLighting, arbObserver({ attention: "attended", attentionTarget: "event" }),
      fc.double({ min: 0, max: 1, noNaN: true }), (e, L, o, s2) => {
        const lo = Math.min(o.stress, s2), hi = Math.max(o.stress, s2);
        const a = resolvePerception(e, L, { ...o, stress: lo });
        const b = resolvePerception(e, L, { ...o, stress: hi });
        expect(b.internal.onsetScore).toBeGreaterThanOrEqual(a.internal.onsetScore - 1e-12);
      }), { numRuns: 2000 });
    fc.assert(fc.property(arbEvent, arbLighting, arbObserver({ attention: "attended", attentionTarget: "phone" }),
      fc.double({ min: 0, max: 1, noNaN: true }), (e, L, o, s2) => {
        const lo = Math.min(o.stress, s2), hi = Math.max(o.stress, s2);
        const a = resolvePerception(e, L, { ...o, stress: lo });
        const b = resolvePerception(e, L, { ...o, stress: hi });
        expect(b.internal.onsetScore).toBeLessThanOrEqual(a.internal.onsetScore + 1e-12);
      }), { numRuns: 2000 });
  });

  it("no unnamed cliffs: internal score is continuous off the named thresholds", () => {
    fc.assert(fc.property(arbEvent, arbLighting, arbObserver(), (e, L, o) => {
      const eps = 0.01;
      if (Math.abs(o.offAxisDegrees - 100) < 1) return; // named threshold: visual field limit
      const a = resolvePerception(e, L, o);
      const b = resolvePerception(e, L, { ...o, distanceMeters: o.distanceMeters + eps, occlusion: Math.min(1, o.occlusion + eps / 10) });
      expect(Math.abs(b.internal.onsetScore - a.internal.onsetScore)).toBeLessThan(0.05);
    }), { numRuns: 3000 });
  });

  it("determinism: identical inputs give identical records", () => {
    fc.assert(fc.property(arbEvent, arbLighting, arbObserver(), (e, L, o) => {
      expect(resolvePerception(e, L, o)).toEqual(resolvePerception(e, L, o));
    }), { numRuns: 500 });
  });
});

describe("V1 recording properties", () => {
  const arbDevice = fc.record({
    id: fc.string({ minLength: 1, maxLength: 6 }),
    kind: fc.constant("cam"),
    qualityTier: fc.constantFrom("door-low", "dome-mid", "wide-far", "phone", "phone-2013", "dashcam"),
    distanceMeters: fc.double({ min: 0.5, max: 100, noNaN: true }),
    inFieldOfView: fc.boolean(),
    emExposed: fc.boolean(),
    operating: fc.boolean(),
    retentionDays: fc.constant(30),
  }) as fc.Arbitrary<DeviceState>;

  it("fidelity ordered by quality tier at fixed geometry (no EM, in view)", () => {
    const order = ["door-low", "wide-far", "phone-2013", "dome-mid", "phone"] as const;
    fc.assert(fc.property(arbEvent, arbLighting, fc.double({ min: 1, max: 80, noNaN: true }), fc.integer(), (e, L, d, seed) => {
      const ev = { ...e, signature: { ...e.signature, emSideEffect: 0 } };
      const scores = order.map(q => resolveRecording(ev, L, {
        id: "same", kind: "cam", qualityTier: q, distanceMeters: d,
        inFieldOfView: true, emExposed: false, operating: true, retentionDays: 30,
      }, seed).internal.fidelityScore);
      for (let i = 1; i < scores.length; i++) expect(scores[i]!).toBeGreaterThanOrEqual(scores[i - 1]! - 1e-12);
    }), { numRuns: 2000 });
  });

  it("determinism incl. seeded noise", () => {
    fc.assert(fc.property(arbEvent, arbLighting, arbDevice, fc.integer(), (e, L, d, seed) => {
      expect(resolveRecording(e, L, d, seed)).toEqual(resolveRecording(e, L, d, seed));
    }), { numRuns: 500 });
  });

  it("EM corruption non-decreasing as device approaches source", () => {
    fc.assert(fc.property(arbLighting, fc.double({ min: 1, max: 40, noNaN: true }), fc.double({ min: 1, max: 40, noNaN: true }), fc.integer(), (L, d1, d2, seed) => {
      const ev: ExposureEvent = { id: "e", mode: "accidental", durationSeconds: 2, signature: { visibility: "effects-only", visualMagnitude: 0.7, audibility: 0.5, emSideEffect: 1, physicalSideEffect: 0, radiusMeters: 3 } };
      const mk = (dist: number) => resolveRecording(ev, L, { id: "x", kind: "cam", qualityTier: "dome-mid", distanceMeters: dist, inFieldOfView: true, emExposed: true, operating: true, retentionDays: 30 }, seed);
      const near = mk(Math.min(d1, d2)), far = mk(Math.max(d1, d2));
      expect(near.corruption).toBeGreaterThanOrEqual(far.corruption - 1e-12);
    }), { numRuns: 2000 });
  });
});

describe("NULL-EXPOSURE named invariant", () => {
  it("far + occluded + brief + quiet yields committed empty outcome, not an error", () => {
    const scene: ObjectiveScene = {
      layer: "objective", seed: 1,
      event: { id: "null-e", mode: "accidental", durationSeconds: 1, signature: { visibility: "effects-only", visualMagnitude: 0.2, audibility: 0.05, emSideEffect: 0, physicalSideEffect: 0, radiusMeters: 0 } },
      lighting: "dark",
      observers: [{ id: "far-away", distanceMeters: 110, offAxisDegrees: 170, occlusion: 1, attention: "attended", attentionTarget: "phone", stress: 0, sensory: "normal" }],
      devices: [{ id: "off-cam", kind: "dome", qualityTier: "dome-mid", distanceMeters: 10, inFieldOfView: false, emExposed: false, operating: true, retentionDays: 30 }],
      carried: [{ custodian: "far-away", kind: "phone", alreadyRecording: false }],
    };
    const out = resolveExposure(scene);
    expect(out.nullExposure).toBe(true);
    expect(out.perceptions[0]!.onsetTier).toBe("none");
    expect(out.recordings[0]!.tier).toBe("none");
    expect(out.bystanderRecordings).toHaveLength(0);
  });
});

describe("Two-layer invariant", () => {
  it("believed-scene resolution is the same functions over different inputs, tagged by layer", () => {
    const base = {
      seed: 7,
      event: { id: "e2", mode: "accidental" as const, durationSeconds: 2, signature: { visibility: "effects-only" as const, visualMagnitude: 0.7, audibility: 0.9, emSideEffect: 1, physicalSideEffect: 0.3, radiusMeters: 3 } },
      lighting: "indoor-fluorescent-good" as const,
      observers: [], carried: [],
    };
    const objective = resolveExposure({ ...base, layer: "objective", devices: [
      { id: "known", kind: "dome", qualityTier: "dome-mid" as const, distanceMeters: 3, inFieldOfView: true, emExposed: true, operating: true, retentionDays: 30 },
      { id: "unknown-cam3", kind: "wide", qualityTier: "wide-far" as const, distanceMeters: 30, inFieldOfView: true, emExposed: false, operating: true, retentionDays: 30 },
    ] });
    const believed = resolveExposure({ ...base, layer: "believed", devices: [
      { id: "known", kind: "dome", qualityTier: "dome-mid" as const, distanceMeters: 3, inFieldOfView: true, emExposed: true, operating: true, retentionDays: 30 },
    ] });
    expect(objective.recordings).toHaveLength(2);
    expect(believed.recordings).toHaveLength(1); // the actor's estimate omits the camera they don't know exists
    expect(objective.layer).toBe("objective");
    expect(believed.layer).toBe("believed");
  });
});
