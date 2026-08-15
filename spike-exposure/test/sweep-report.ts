// Lever curves + sensitivity report (printed, for the validation report).
import { P } from "../src/params.js";
import { resolvePerception } from "../src/perception.js";
import type { ExposureEvent, ObserverState } from "../src/types.js";

const ev = (dur: number): ExposureEvent => ({
  id: "s", mode: "accidental", durationSeconds: dur,
  signature: { visibility: "fully-visible", visualMagnitude: 0.9, audibility: 0.8, emSideEffect: 0, physicalSideEffect: 0.5, radiusMeters: 0 },
});

console.log("== LEVER 1: reaction floor vs event duration (contemporaneous footage possible?) ==");
for (const floor of [5, 7, 10, 15]) {
  const row = [2, 5, 8, 10, 15, 25, 60].map(d => `${d}s:${d - floor > 0 ? "YES(" + (d - floor) + "s)" : "no"}`).join(" ");
  console.log(`floor=${floor}s → ${row}`);
}

console.log("\n== LEVER 2: expected recordings per 100 bystanders (sustained event, propensity × carriers) ==");
for (const prop of [0.03, 0.06, 0.1]) {
  for (const ctx of ["street", "store", "event-crowd"] as const) {
    const already = 100 * P.alreadyRecordingRate[ctx].value;
    const reactive = 100 * 0.9 /*carry rate*/ * 0.6 /*perceive*/ * prop;
    console.log(`propensity=${prop} ctx=${ctx}: reactive≈${reactive.toFixed(1)} + already≈${already.toFixed(1)}`);
  }
}

console.log("\n== SENSITIVITY: detection/detail blend floor (ASSUMED 0.35) — tier stability ==");
const obs = (angle: number): ObserverState => ({ id: "o", distanceMeters: 20, offAxisDegrees: angle, occlusion: 0, attention: "ambient", attentionTarget: null, stress: 0.1, sensory: "normal" });
const orig = P.detectionDetailBlendFloor.value;
for (const bf of [0.2, 0.35, 0.5]) {
  (P.detectionDetailBlendFloor as { value: number }).value = bf;
  const tiers = [0, 15, 45, 80].map(a => `${a}°:${resolvePerception(ev(2), "daylight", obs(a)).onsetTier}`).join(" ");
  console.log(`blendFloor=${bf} → ${tiers}`);
}
(P.detectionDetailBlendFloor as { value: number }).value = orig;
