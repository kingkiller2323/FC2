import { describe, it, expect } from "vitest";
import { narrativeStep, receptionOpportunity, type ActorSurfaces, type NarrativeState } from "../src/model.js";

// P1–P5 scored fixtures, MULTI-SEED FROM THE FIRST RUN (Directive 1
// institutionalized): 2,000 seeds per fixture, distributions reported, band
// widths stated. Single seeds are never findings.

const N = 2000;
const seeds = Array.from({ length: N }, (_, i) => 7_000_003 + i * 104729);

function mkNarrative(year: number, over?: Partial<NarrativeState>): NarrativeState {
  return {
    id: "story", year, salience: "minor", homeScope: "neighborhood",
    reach: { neighborhood: 0.03 }, subjectLinkByScope: { neighborhood: "anonymous" },
    ageDays: 0, activePhase: true, dominantInterpretation: "the initial version",
    ...over,
  };
}
function mkActor(over?: Partial<ActorSurfaces>): ActorSurfaces {
  return { actorId: "subject", memberScopes: ["household", "workplace"], platformGroupMember: true, localMediaConsumer: false, circleSizeFactor: 0.5, avoidedSurfaces: [], isSubject: true, ...over };
}

function runDays(n0: NarrativeState, actor: ActorSurfaces, days: number, seed: number) {
  let n = n0;
  let firstFull = -1, firstPartial = -1, partials = 0;
  for (let d = 1; d <= days; d++) {
    n = narrativeStep(n);
    const r = receptionOpportunity(actor, n, d, seed);
    if (r.kind === "partial") { partials++; if (firstPartial < 0) firstPartial = d; }
    if (r.kind === "full" && firstFull < 0) firstFull = d;
  }
  return { n, firstFull, firstPartial, partials };
}

function median(xs: number[]) { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]!; }

describe("P1 — mundane control: most of the neighborhood never learns (2026 minor story)", () => {
  it("neighborhood awareness ≤35% at 1 week, ≤50% ever (deterministic curve; band widths: ASSUMED ceilings)", () => {
    let n = mkNarrative(2026);
    for (let d = 1; d <= 7; d++) n = narrativeStep(n);
    const week = n.reach.neighborhood ?? 0;
    for (let d = 8; d <= 60; d++) n = narrativeStep(n);
    const ever = n.reach.neighborhood ?? 0;
    console.log(`P1: 1-week neighborhood awareness=${week.toFixed(3)}, 60-day=${ever.toFixed(3)}, city=${(n.reach.city ?? 0).toFixed(4)}`);
    expect(week).toBeLessThanOrEqual(0.35);
    expect(ever).toBeLessThanOrEqual(0.50);
    expect(n.reach.city ?? 0).toBeLessThan(0.02);
  });
});

describe("P2 — famous-subject, scope-dependent tiers (Amendment B)", () => {
  it("identity link drops outward by default in ≥90% of runs; re-identification requires a committed event", () => {
    let dropCount = 0;
    for (const _ of seeds.slice(0, 200)) {
      let n = mkNarrative(2026, { homeScope: "workplace", reach: { workplace: 0.3 }, subjectLinkByScope: { workplace: "named" }, salience: "notable" });
      for (let d = 1; d <= 30; d++) n = narrativeStep(n);
      if ((n.subjectLinkByScope.neighborhood ?? "anonymous") === "anonymous") dropCount++;
    }
    expect(dropCount / 200).toBeGreaterThanOrEqual(0.9); // deterministic drop ⇒ 100%; ≥90% pre-registered
  });
  it("named-at-workplace: subject full reception median within days; anonymous-everywhere: substantial never-learns mass", () => {
    const named = seeds.map(s => runDays(mkNarrative(2026, { homeScope: "workplace", reach: { workplace: 0.3 }, subjectLinkByScope: { workplace: "named" }, salience: "notable" }), mkActor(), 60, s).firstFull).filter(d => d > 0);
    const namedMedian = median(named);
    const anonFirsts = seeds.map(s => runDays(mkNarrative(2026, { salience: "minor" }), mkActor(), 60, s).firstFull);
    const anonNever = anonFirsts.filter(d => d < 0).length / N;
    console.log(`P2: named-scope median first-full=${namedMedian}d (n=${named.length}/${N}); anonymous never-learns mass=${anonNever.toFixed(3)}`);
    expect(namedMedian).toBeLessThanOrEqual(7);
    expect(anonNever).toBeGreaterThan(0.15); // "substantial" — band stated: ASSUMED
  });
});

describe("P3 — era-divergence triple (Amendment A): same story, 2004 / 2013 / 2026", () => {
  it("time-to-25% decreases monotonically; platform share of receptions rises; local-media share falls", () => {
    const t25: Record<number, number> = {};
    for (const year of [2004, 2013, 2026]) {
      let n = mkNarrative(year, { salience: "notable" });
      let day = -1;
      for (let d = 1; d <= 60; d++) { n = narrativeStep(n); if (day < 0 && (n.reach.neighborhood ?? 0) >= 0.25) day = d; }
      t25[year] = day;
    }
    console.log(`P3: time-to-25% neighborhood awareness: 2004=${t25[2004]}d, 2013=${t25[2013]}d, 2026=${t25[2026]}d`);
    expect(t25[2004]!).toBeGreaterThanOrEqual(t25[2013]!);
    expect(t25[2013]!).toBeGreaterThanOrEqual(t25[2026]!);
    // channel shares of full receptions across seeds (2004 vs 2026)
    for (const [year, expectPlatform] of [[2004, false], [2026, true]] as const) {
      const channels: Record<string, number> = {};
      for (const s of seeds.slice(0, 500)) {
        let n = mkNarrative(year, { salience: "notable" });
        for (let d = 1; d <= 30; d++) {
          n = narrativeStep(n);
          const r = receptionOpportunity(mkActor({ actorId: `a${s}`, isSubject: false, localMediaConsumer: true, platformGroupMember: year >= 2010 }), n, d, s);
          if (r.kind === "full") { channels[r.channel] = (channels[r.channel] ?? 0) + 1; break; }
        }
      }
      const total = Object.values(channels).reduce((a, b) => a + b, 0);
      const platformShare = (channels["platformGroup"] ?? 0) / Math.max(1, total);
      console.log(`P3 channels ${year}:`, JSON.stringify(channels), `platformShare=${platformShare.toFixed(3)}`);
      if (expectPlatform) expect(platformShare).toBeGreaterThan(0.2);
      else expect(platformShare).toBe(0);
    }
  });
});

describe("P4 — avoidance pair (Amendment C)", () => {
  it("avoidance delays full reception ≥2×, raises never-learns mass; partials persist via unavoidable surfaces", () => {
    const mk = (avoid: boolean) => seeds.map(s => runDays(
      mkNarrative(2026, { homeScope: "workplace", reach: { workplace: 0.3 }, subjectLinkByScope: { workplace: "named" }, salience: "notable" }),
      mkActor({ avoidedSurfaces: avoid ? ["workplace", "platformGroup", "socialCircle", "household"] : [] }), 60, s));
    const base = mk(false), avoided = mk(true);
    const mBase = median(base.map(r => r.firstFull).filter(d => d > 0));
    const fullsAvoided = avoided.map(r => r.firstFull).filter(d => d > 0);
    const mAvoid = fullsAvoided.length ? median(fullsAvoided) : Infinity;
    const neverBase = base.filter(r => r.firstFull < 0).length / N;
    const neverAvoid = avoided.filter(r => r.firstFull < 0).length / N;
    const dreadState = avoided.filter(r => r.firstFull < 0 && r.partials >= 1).length / N;
    console.log(`P4: median first-full base=${mBase}d avoided=${mAvoid}d; never-learns base=${neverBase.toFixed(3)} avoided=${neverAvoid.toFixed(3)}; dread-state (partials, no full)=${dreadState.toFixed(3)}`);
    expect(mAvoid).toBeGreaterThanOrEqual(mBase * 2);
    expect(neverAvoid).toBeGreaterThan(neverBase);
    expect(dreadState).toBeGreaterThan(0.1);
  });
});

describe("P5 — partial-reception ordering (Amendment D)", () => {
  it("for a named-local narrative, ≥1 partial precedes the first full in the majority of seeds where both occur", () => {
    const runs = seeds.map(s => runDays(
      mkNarrative(2026, { homeScope: "workplace", reach: { workplace: 0.3 }, subjectLinkByScope: { workplace: "named" }, salience: "notable" }),
      mkActor({ avoidedSurfaces: ["workplace", "platformGroup"] }), 60, s)); // partial avoidance = realistic mixed surfaces
    const withFull = runs.filter(r => r.firstFull > 0);
    const partialFirst = withFull.filter(r => r.firstPartial > 0 && r.firstPartial < r.firstFull).length / Math.max(1, withFull.length);
    console.log(`P5: partial-precedes-full share=${partialFirst.toFixed(3)} (of ${withFull.length} runs with full reception)`);
    expect(partialFirst).toBeGreaterThan(0.5);
  });
});
