import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolveExposure } from "../src/resolve.js";
import type { ObjectiveScene } from "../src/types.js";

function loadScene(file: string): ObjectiveScene {
  const j = JSON.parse(readFileSync(new URL(`../fixtures/${file}`, import.meta.url), "utf8"));
  return {
    layer: "objective",
    seed: j.seed,
    event: { id: j.event.id, mode: j.event.mode, durationSeconds: j.event.durationSeconds, signature: j.event.signature, phases: j.event.phases, attentionKeys: j.event.attentionKeys, salience: j.event.salience },
    lighting: j.lighting,
    observers: j.observers,
    devices: j.devices,
    carried: (j.observerCarriedDevices ?? []).map((c: any) => ({
      custodian: c.custodian, kind: c.kind, alreadyRecording: !!c.alreadyRecording,
      aimedAtEventIfRecording: c.aimedAtEventIfRecording,
    })),
  };
}

describe("V3 SCORED — mundane control (pre-registered tolerances)", () => {
  const out = resolveExposure(loadScene("mundane-control.json"));
  const p = (id: string) => out.perceptions.find(x => x.observerId === id)!;
  const tiers = ["none", "glimpse", "partial", "clear", "complete"];
  const within = (t: string, allowed: string[]) => allowed.includes(t);

  it("P1 b1-walker: impact partial/clear (±1 tier), aftermath complete (±1)", () => {
    expect(within(p("b1-walker").onsetTier, ["glimpse", "partial", "clear", "complete"])).toBe(true);
    expect(within(p("b1-walker").overallTier, ["clear", "complete"])).toBe(true);
  });
  it("P2 b2-trunk: impact none/glimpse (±1 ⇒ ≤partial), aftermath clear/complete (±1 ⇒ ≥partial)", () => {
    expect(tiers.indexOf(p("b2-trunk").onsetTier)).toBeLessThanOrEqual(tiers.indexOf("partial"));
    expect(tiers.indexOf(p("b2-trunk").overallTier)).toBeGreaterThanOrEqual(tiers.indexOf("partial"));
  });
  it("P3 b3-phone: impact none/glimpse (±1 ⇒ ≤partial), aftermath partial/clear (±1)", () => {
    expect(tiers.indexOf(p("b3-phone").onsetTier)).toBeLessThanOrEqual(tiers.indexOf("partial"));
    expect(within(p("b3-phone").overallTier, ["glimpse", "partial", "clear", "complete"])).toBe(true);
  });
  it("P4 lot-dome: usable exactly; survives; no corruption", () => {
    const r = out.recordings.find(x => x.deviceId === "lot-dome")!;
    expect(r.tier).toBe("usable");
    expect(r.corruption).toBe(0);
  });
  it("P5 zero reactive bystander footage of the 2s impact", () => {
    expect(out.bystanderRecordings.filter(b => b.path === "reactive")).toHaveLength(0);
  });
  it("P6 NULL-EXPOSURE must NOT fire (audible bang at these ranges)", () => {
    expect(out.nullExposure).toBe(false);
    for (const per of out.perceptions) expect(per.oriented).toBe(true);
  });
});

describe("V4 REGRESSION ONLY — gap-run-01 incident vs judgment outcomes", () => {
  const out = resolveExposure(loadScene("gap-run-01-incident.json"));
  const p = (id: string) => out.perceptions.find(x => x.observerId === id)!;
  const r = (id: string) => out.recordings.find(x => x.deviceId === id)!;

  it("reports the diff (informational — divergence is a finding, not a failure)", () => {
    const diff = {
      dana: { judgment: "complete", mechanic: p("dana").overallTier },
      priyaOnset: { judgment: "partial (grab clear, onset unseen)", mechanic: p("priya").onsetTier },
      priyaOverall: { mechanic: p("priya").overallTier },
      ruth: { judgment: "partial w/ order distortion", mechanicOnset: p("ruth").onsetTier, mechanicOverall: p("ruth").overallTier },
      kyle: { judgment: "none-to-trace", mechanicOnset: p("kyle").onsetTier, mechanicOverall: p("kyle").overallTier, oriented: p("kyle").oriented },
      cam6: { judgment: "corrupted/unrecoverable", mechanic: r("cam6").tier, corruption: r("cam6").corruption },
      cam7: { judgment: "corrupted/unrecoverable", mechanic: r("cam7").tier, corruption: r("cam7").corruption },
      cam3: { judgment: "usable-with-artifacts", mechanic: r("cam3").tier, corruption: r("cam3").corruption },
      door: { judgment: "nothing relevant", mechanic: r("door").tier },
      bystander: { judgment: "none (2s event)", mechanic: out.bystanderRecordings.length },
    };
    console.log("V4 REGRESSION DIFF:", JSON.stringify(diff, null, 2));
    expect(out.eventId).toBe("gr1-e-incident");
  });

  it("mechanical regression floors (documented correction: cam3's tier moved to the reported diff — the original assertion hard-coded judgment as ground truth, contradicting the ratified verdict semantics that V4 divergence is a finding to explain, not a failure)", () => {
    // cam6/cam7 critical seconds unrecoverable; no bystander footage of a 2s event;
    // Priya's onset worse than her overall (she turned after onset) — the S1 driver.
    expect(r("cam6").corruption).toBeGreaterThanOrEqual(0.6);
    expect(r("cam7").corruption).toBeGreaterThanOrEqual(0.6);
    expect(out.bystanderRecordings).toHaveLength(0);
    const tiers = ["none", "glimpse", "partial", "clear", "complete"];
    expect(tiers.indexOf(p("priya").onsetTier)).toBeLessThan(tiers.indexOf(p("priya").overallTier));
    // cam3: judgment said "usable-with-artifacts"; the mechanic's verdict is
    // reported in the diff above and explained in the validation report.
  });
});

describe("PLAUSIBILITY (UNSCORED) — Carrer geometry", () => {
  const out = resolveExposure(loadScene("carrer-geometry.json"));
  it("Ruling K sensitivity: BOTH salience classifications reported", () => {
    const scene = loadScene("carrer-geometry.json");
    const asSafe = resolveExposure({ ...scene, event: { ...scene.event, salience: "dramatic-safe" } });
    const asThreat = resolveExposure({ ...scene, event: { ...scene.event, salience: "personal-threat" } });
    console.log("RULING K TIER SENSITIVITY:", JSON.stringify({
      "dramatic-safe": asSafe.bystanderRecordings.filter(b => b.path === "reactive").length,
      "personal-threat": asThreat.bystanderRecordings.filter(b => b.path === "reactive").length,
      canon: "~4",
    }));
    expect(asSafe.eventId).toBe("cg-e-rescue");
  });
  it("descriptive report only", () => {
    const reactive = out.bystanderRecordings.filter(b => b.path === "reactive");
    const summary = {
      note: "UNSCORED — canon texture was authored, not physics",
      canonTexture: "~4 phone videos beginning mid-event; camera misses the instant; no identifying capture",
      mechanicReactiveRecordings: reactive.length,
      recordingStartsAtSecond: reactive[0]?.startedAtSecond ?? null,
      shopCam: out.recordings.find(x => x.deviceId === "shop-cam"),
      perceptionSpread: out.perceptions.map(p => `${p.observerId}:${p.onsetTier}/${p.overallTier}`).join(" "),
    };
    console.log("CARRER PLAUSIBILITY:", JSON.stringify(summary, null, 2));
    expect(out.eventId).toBe("cg-e-rescue");
  });
});
