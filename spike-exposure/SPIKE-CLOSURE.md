# Exposure Spike — Closure Note

**Status: CLOSED per directive.** No further refinement iterations.

## What was built
Two pure, deterministic resolution functions (perception completeness;
recording via DORI pixel geometry) + bystander-device generation (reactive
path with per-observer log-normal reaction floor; ungated already-recording
path) + three-tier salience propensity + four schema extensions (subject
scale, tactile channel, event attention-extent, event phase structure) +
two-layer branded scene types (objective/believed, never merged). ~600 lines,
25 tests, all state committed; the functions land in the M2/M3 runtime
unchanged.

## What was validated, and how strongly
- **Properties (strong):** 11/11 across ~13k generated cases — monotonicity,
  no unnamed cliffs, stress-narrowing-never-blindness, determinism,
  NULL-EXPOSURE, two-layer invariant.
- **External geometry (strong):** DORI identification chokepoint — CITED
  standard, reproduced exactly; ET1 2/3 with one pre-registration rounding
  miss kept failing honestly.
- **Scored fixtures (moderate):** mundane control 6/6, 100% seed-stable;
  ET2 in-band at P=0.93 across 2,000 seeds.
- **Canon consistency (moderate, wide-band):** Carrer texture consistent with
  the blind salience band (band spans ×2.7); distributional convergence mean
  4.88 vs canon ~4; classification ambiguity documented (Ruling K), shifts
  means ~2× but not canon reproducibility.
- **Regression (informative):** gap-run-01 load-bearing outcomes reproduce;
  divergences explained; cam3 resolved for DORI over judgment (optimism bias).

## What remains open (documented, NOT blockers, NOT to be worked)
Per-observer threat perception · blendFloor grounding (top weakness 1) ·
incident→per-witness units conversion (top weakness 2) · phone-in-hand primed
state · salience tier assignment as judgment input · log-normal family
assumption · ET1 4 m boundary test failing by design.

## What the runtime inherits
The two functions and their parameter table (every constant carrying
CITED/ASSUMED/FITTED-CORROBORATED status with sources); the exposure ledger
contract (§3 + §3a of the gap-log note); the two named design levers (reaction
floor distribution; ambient device density = the setting-level difficulty
dial) plus the salience tier family; the three standalone findings
(identification chokepoint; systematic optimism bias; spectacle–safety filming
peak); the multi-seed harness (fixture results are distributions, never single
draws); and the pairing rule — the ledger ships WITH the visibility model
(GAP-12), never alone.
