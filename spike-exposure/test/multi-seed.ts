// Directive 1: every fixture result as a DISTRIBUTION across 1000+ seeds,
// not a single draw. Original single-seed values reported alongside.
import { readFileSync } from "node:fs";
import { resolveExposure } from "../src/resolve.js";
import { mulberry32 } from "../src/recording.js";
import { P } from "../src/params.js";
import type { CarriedDevice, ExposureEvent, ObserverState, ObjectiveScene } from "../src/types.js";

const N = 2000;
const seeds = Array.from({ length: N }, (_, i) => 1_000_001 + i * 7919);

function loadScene(file: string): ObjectiveScene {
  const j = JSON.parse(readFileSync(new URL(`../fixtures/${file}`, import.meta.url), "utf8"));
  return {
    layer: "objective", seed: j.seed,
    event: { id: j.event.id, mode: j.event.mode, durationSeconds: j.event.durationSeconds, signature: j.event.signature, phases: j.event.phases, attentionKeys: j.event.attentionKeys, salience: j.event.salience },
    lighting: j.lighting, observers: j.observers, devices: j.devices,
    carried: (j.observerCarriedDevices ?? []).map((c: any) => ({ custodian: c.custodian, kind: c.kind, alreadyRecording: !!c.alreadyRecording, aimedAtEventIfRecording: c.aimedAtEventIfRecording })),
  };
}

function stats(xs: number[]) {
  const mean = xs.reduce((a, b) => a + b, 0) / xs.length;
  const sd = Math.sqrt(xs.reduce((a, b) => a + (b - mean) ** 2, 0) / xs.length);
  const hist: Record<number, number> = {};
  for (const x of xs) hist[x] = (hist[x] ?? 0) + 1;
  return { mean: +mean.toFixed(2), sd: +sd.toFixed(2), hist: Object.fromEntries(Object.entries(hist).map(([k, v]) => [k, +(v / xs.length).toFixed(3)])) };
}

// --- Carrer, both classifications ---
for (const tier of ["dramatic-safe", "personal-threat"] as const) {
  const base = loadScene("carrer-geometry.json");
  const counts = seeds.map(s => resolveExposure({ ...base, seed: s, event: { ...base.event, salience: tier } })
    .bystanderRecordings.filter(b => b.path === "reactive").length);
  const st = stats(counts);
  const pCanon = counts.filter(c => c >= 3 && c <= 5).length / N;
  const p4 = counts.filter(c => c === 4).length / N;
  const p0 = counts.filter(c => c === 0).length / N;
  console.log(`CARRER ${tier}: mean=${st.mean} sd=${st.sd} P(X=4)=${p4.toFixed(3)} P(3–5)=${pCanon.toFixed(3)} P(0)=${p0.toFixed(3)} hist=${JSON.stringify(st.hist)}`);
}

// --- gap-run-01: bystander count + cam3 tier stability ---
{
  const base = loadScene("gap-run-01-incident.json");
  const byst = seeds.map(s => resolveExposure({ ...base, seed: s }).bystanderRecordings.length);
  const cam3 = seeds.map(s => resolveExposure({ ...base, seed: s }).recordings.find(r => r.deviceId === "cam3")!.tier);
  const tally: Record<string, number> = {};
  for (const t of cam3) tally[t] = (tally[t] ?? 0) + 1;
  console.log(`GAP-RUN-01: bystander count always ${Math.min(...byst)}–${Math.max(...byst)}; cam3 tier distribution: ${JSON.stringify(Object.fromEntries(Object.entries(tally).map(([k, v]) => [k, +(v / N).toFixed(3)])))}`);
}

// --- mundane control: lot-dome tier stability + reactive count ---
{
  const base = loadScene("mundane-control.json");
  const dome = seeds.map(s => resolveExposure({ ...base, seed: s }).recordings.find(r => r.deviceId === "lot-dome")!.tier);
  const reactive = seeds.map(s => resolveExposure({ ...base, seed: s }).bystanderRecordings.filter(b => b.path === "reactive").length);
  const tally: Record<string, number> = {};
  for (const t of dome) tally[t] = (tally[t] ?? 0) + 1;
  console.log(`MUNDANE: lot-dome tiers ${JSON.stringify(Object.fromEntries(Object.entries(tally).map(([k, v]) => [k, +(v / N).toFixed(3)])))}; reactive count range ${Math.min(...reactive)}–${Math.max(...reactive)}`);
}

// --- ET2: population rebuilt per seed (already-recording flags + draws vary) ---
{
  const ev: ExposureEvent = { id: "et-e", mode: "accidental", durationSeconds: 120, signature: { visibility: "fully-visible", visualMagnitude: 0.9, audibility: 0.8, emSideEffect: 0, physicalSideEffect: 0.5, radiusMeters: 0 } };
  const totals: number[] = []; const alreadys: number[] = [];
  for (const s of seeds) {
    const rng = mulberry32(s);
    const observers: ObserverState[] = []; const carried: CarriedDevice[] = [];
    for (let i = 0; i < 100; i++) {
      const distance = 5 + 115 * (i / 100);
      const attention = i % 3 === 0 ? "attended" as const : "ambient" as const;
      observers.push({ id: `b${i}`, distanceMeters: distance, offAxisDegrees: (i * 37) % 180, occlusion: (i % 5) * 0.15, attention, attentionTarget: attention === "attended" ? (i % 6 === 0 ? "phone" : "companion") : null, stress: 0.2, sensory: "normal" });
      const already = rng() < P.alreadyRecordingRate["street"].value;
      carried.push({ custodian: `b${i}`, kind: "phone", alreadyRecording: already, aimedAtEventIfRecording: already ? rng() < 0.2 : undefined });
    }
    const out = resolveExposure({ layer: "objective", seed: s, event: ev, lighting: "daylight", observers, devices: [], carried });
    totals.push(out.bystanderRecordings.length);
    alreadys.push(out.bystanderRecordings.filter(b => b.path === "already-recording").length);
  }
  const st = stats(totals);
  const inBand = totals.filter(t => t >= 1 && t <= 10).length / N;
  const alreadyInBand = alreadys.filter(a => a <= 2).length / N;
  console.log(`ET2: total mean=${st.mean} sd=${st.sd} P(in 1–10 band)=${inBand.toFixed(3)} P(already ≤2)=${alreadyInBand.toFixed(3)} hist=${JSON.stringify(st.hist)}`);
}
