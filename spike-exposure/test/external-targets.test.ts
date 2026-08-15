import { describe, it, expect } from "vitest";
import { P } from "../src/params.js";
import { resolveRecording, mulberry32 } from "../src/recording.js";
import { resolveExposure } from "../src/resolve.js";
import type { DeviceState, ExposureEvent, ObserverState, ObjectiveScene, CarriedDevice } from "../src/types.js";

// V3 SCORED — external empirical targets (second pre-registration).

const goodLightEvent: ExposureEvent = {
  id: "et-e", mode: "accidental", durationSeconds: 120,
  signature: { visibility: "fully-visible", visualMagnitude: 0.9, audibility: 0.8, emSideEffect: 0, physicalSideEffect: 0.5, radiusMeters: 0 },
};

function dev(qualityTier: DeviceState["qualityTier"], distanceMeters: number): DeviceState {
  return { id: `d-${qualityTier}-${distanceMeters}`, kind: "cam", qualityTier, distanceMeters, inFieldOfView: true, emExposed: false, operating: true, retentionDays: 30 };
}

describe("ET1 — identification geometry (scored, exact)", () => {
  it("dome-mid: identifySupport FALSE beyond 6 m, TRUE at ≤4 m in good light", () => {
    expect(resolveRecording(goodLightEvent, "daylight", dev("dome-mid", 3), 1).identifySupport).toBe(true);
    expect(resolveRecording(goodLightEvent, "daylight", dev("dome-mid", 4), 1).identifySupport).toBe(true);
    for (const d of [6.5, 8, 12, 25]) {
      expect(resolveRecording(goodLightEvent, "daylight", dev("dome-mid", d), 1).identifySupport).toBe(false);
    }
  });
  it("wide-far: identifySupport FALSE beyond 4 m", () => {
    for (const d of [4.5, 10, 28, 30]) {
      expect(resolveRecording(goodLightEvent, "daylight", dev("wide-far", d), 1).identifySupport).toBe(false);
    }
  });
  it("no fixed camera in any fixture reaches identification-grade capture", () => {
    // Fixture geometries: lot-dome@25 (dome-mid), cam6@2.5/cam7@3 (dome-mid but EM-corrupted),
    // cam3@30 (wide-far), door@40 (door-low, out of FOV), shop-cam@28 (wide-far, night).
    const cases: Array<[DeviceState["qualityTier"], number, "daylight" | "indoor-fluorescent-good" | "night-streetlit", boolean]> = [
      ["dome-mid", 25, "daylight", false],
      ["wide-far", 30, "indoor-fluorescent-good", false],
      ["door-low", 40, "indoor-fluorescent-good", false],
      ["wide-far", 28, "night-streetlit", false],
    ];
    for (const [q, d, L, expected] of cases) {
      expect(resolveRecording(goodLightEvent, L, dev(q, d), 1).identifySupport).toBe(expected);
    }
    // cams 6/7 are within dome-mid identify range but corrupted by the EM signature:
    const emEvent: ExposureEvent = { ...goodLightEvent, durationSeconds: 2, signature: { ...goodLightEvent.signature, emSideEffect: 1, radiusMeters: 3 } };
    const cam6 = resolveRecording(emEvent, "indoor-fluorescent-good", { ...dev("dome-mid", 2.5), emExposed: true }, 20260817);
    expect(cam6.identifySupport).toBe(false);
  });
});

describe("ET2 — bystander prevalence (scored, band; band itself ASSUMED per V2 register)", () => {
  it("100 bystanders, sustained 120s salient street event: 1–10 total captures; 0–2 already-recording", () => {
    // Deterministic population model: geometry/attention profile spread over a street
    // scene; already-recording assignment via seeded PRNG at the street baseline rate.
    const rng = mulberry32(424242);
    const observers: ObserverState[] = [];
    const carried: CarriedDevice[] = [];
    let alreadyCount = 0;
    for (let i = 0; i < 100; i++) {
      const distance = 5 + 115 * (i / 100);            // 5–120 m spread
      const offAxis = (i * 37) % 180;                   // deterministic scatter
      const attention = i % 3 === 0 ? "attended" : "ambient";
      const target = i % 3 === 0 ? (i % 6 === 0 ? "phone" : "companion") : null;
      observers.push({ id: `b${i}`, distanceMeters: distance, offAxisDegrees: offAxis, occlusion: (i % 5) * 0.15, attention, attentionTarget: target, stress: 0.2, sensory: "normal" });
      const already = rng() < P.alreadyRecordingRate["street"].value;
      if (already) alreadyCount++;
      carried.push({ custodian: `b${i}`, kind: "phone", alreadyRecording: already, aimedAtEventIfRecording: already ? rng() < 0.2 : undefined });
    }
    const scene: ObjectiveScene = { layer: "objective", seed: 424242, event: goodLightEvent, lighting: "daylight", observers, devices: [], carried };
    const out = resolveExposure(scene);
    const total = out.bystanderRecordings.length;
    const already = out.bystanderRecordings.filter(b => b.path === "already-recording").length;
    console.log("ET2 POPULATION SWEEP:", JSON.stringify({ total, reactive: total - already, already, capturedSecondsFirst: out.bystanderRecordings[0]?.capturedSeconds }));
    expect(already).toBeGreaterThanOrEqual(0);
    expect(already).toBeLessThanOrEqual(2);
    expect(total).toBeGreaterThanOrEqual(1);
    expect(total).toBeLessThanOrEqual(10);
  });
});
