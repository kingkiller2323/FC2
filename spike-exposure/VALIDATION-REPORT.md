# Exposure Spike — Validation Report

Per the ratified plan: V1 sweeps → V2 grounding → V3 scored fixtures (pre-registered) → V4 regression (labeled as such). Suite: 24 tests; **22 pass, 2 fail honestly** — both failures share one diagnosed root cause and were NOT tuned away.

## V1 — Property sweeps: 11/11 PASS

~13,000 generated cases per run. Monotonicity in distance/occlusion/off-axis; fidelity ordered by device tier; stress = narrowing never blindness (attended non-decreasing, peripheral non-increasing in stress); no unnamed cliffs (continuity everywhere except the named visual-field limit and tier edges); byte-for-byte determinism including seeded noise; NULL-EXPOSURE produces committed empty sets, not errors; two-layer invariant (believed scenes are a distinct branded type; the deliberate-use estimate is the same function over Layer-2 inputs).

## V2 — External grounding

Two research registers (perception/attention; CCTV/prevalence), full citations in `src/params.ts` and the agent registers. Grounded highlights: detail-acuity E2 = 2.3° (Strasburger 2011); event detection ~0.65 relative at 70° (Thorpe 2001) — the detection/detail split repaired the pre-grounding defect #1; inattentional-blindness anchors (Simons & Chabris 46% miss, Hyman 25% notice on phone, Drew 83% expert miss); stress narrowing direction (Easterbrook/Steblay/Fawcett); IEC 62676-4 DORI densities (Identify 250 px/m ⇒ ~4 m for 1080p ~90° FOV) — identification became a **geometric chokepoint outcome**, not a score threshold; Bruce et al. 2001 (identify-grade detail ≠ identification success); 30-day retention convention.

### ASSUMED flags (prominent, per ruling — the model's weakest points)

| Parameter | Value | Why ASSUMED |
|---|---|---|
| **reactionFloorSeconds (LEVER 1)** | 7.0 s | No bystander recording-onset literature exists anywhere. Component floor is sourced (Green 2000 surprise-RT 1.5 s + Ashbrook 2008 pocket-retrieval 4.6 s + sub-second quick-launch + aim ~1 s); the appraisal median (10–15 s) is entirely unsourced |
| **filmingPropensity** | 0.06 | Research band 1–10% is itself ASSUMED (no published rate; Boston/7-7 give only order-of-magnitude anchors; Pew 7%-ever is a floor). Constant — salience-scaling deferred. Added after 2nd pre-registration, before the scored run (see Sequencing note) |
| **alreadyRecordingRate (LEVER 2)** | 0.2–5% by context | No direct measurement of "actively recording at a random moment" exists; derived by judgment from dashcam/doorbell/Pew anchors |
| **detectionDetailBlendFloor** | 0.35 | Pure interpolation. Sensitivity: ±0.15 moves mid-angle perception by one tier (sweep shows 15–45° glimpse/none boundary moves) — the single most consequential ASSUMED perception constant |
| **distanceHalfMeters (all lightings)** | 40/30/18/6 m | No per-distance event-perception literature; person-scale calibrated — see Limitation 1 |
| **stressAttendedBoostExp** | 0.3 | Direction cited (Christianson); magnitude unsettled (Deffenbacher shows overall ID impairment) |
| **deviceQualityBase values** | 0.35–0.8 | Tier *ordering* anchored (CAST/IPVM); numeric mapping invented |
| **orienting/audibility constants** | 0.15 / 50 m | No literature in this parameterization |

## V3 — Scored fixtures (pre-registered)

**Mundane control: 4/6 PASS.** P2, P3, P5 (zero reactive footage of a 2 s event), P6 (no false null) pass. **P1-overall and P4 FAIL**, one root cause: **no subject-scale term** — the model calibrates perception and recording detail to person-scale targets, so a car-scale scene at 20–25 m under-scores (b1's aftermath lands `partial` vs predicted `clear+`; the lot dome lands `degraded` at 0.428 vs predicted `usable`). Not tuned away; see Limitation 1.

**ET1 identification geometry: PASS (all 3).** Dome-mid identifies only ≤4.5 m, wide-far ≤2.5 m; **no fixed camera in any fixture achieves identification-grade capture** — identification is confirmed as a chokepoint outcome, exactly the CAST/IEC geometry.

**ET2 bystander prevalence: PASS.** 100 bystanders, 120 s salient street event → **8 total captures** (8 reactive + 0 already-recording), inside the pre-registered 1–10 band; already-recording inside 0–2.

## V4 — Regression vs gap-run-01 judgment (labeled: findings, not failures)

| Item | Judgment | Mechanic | Explanation |
|---|---|---|---|
| cams 6/7 | corrupted, unrecoverable | corruption ≥ 0.6, tier ≤ trace | **MATCH** (EM model reproduces the S4-load-bearing loss) |
| bystander footage | none | none | **MATCH** (2 s ≪ 7 s floor) |
| Priya onset < overall | yes (turned after onset) | none < partial | **MATCH** (the S1 driver reproduces) |
| Dana | complete | clear | 1 tier off; her *tactile* certainty isn't visual — Limitation 2 |
| Priya onset | "partial (grab clear)" | none | Judgment bundled the tactile grab into perception; the mechanic is visual-only — Limitation 2 |
| Ruth onset | partial w/ order distortion | none | Her attention target (the freezer case) WAS part of the event's spatial extent; the mechanic treats events as points and scored her attended-elsewhere — Limitation 3 |
| cam3 | usable-with-artifacts | trace/degraded | Limitation 1 (scale) + judgment optimism; the S4 chain (register 2 visibly unmanned at 30 m wide-angle) plausibly needs only Observe-grade, which the CAST geometry supports — the tier semantics and subject scale need reconciling |
| Kyle | none-to-trace | none onset / glimpse overall | Effectively a match (corridor flicker) |

**Regression verdict:** the mechanically load-bearing outcomes (camera loss, no bystander footage, witness-account divergence driver) reproduce; every divergence is explained by the three limitations below.

## PLAUSIBILITY (unscored) — Carrer geometry

Mechanic: **0 reactive recordings** (8 carriers × 0.06 propensity ≈ 0.5 expected) vs canon's ~4 videos; shop-cam `trace` (night, wide, 28 m) vs canon's partial-but-real footage. **Note, not failure:** canon's texture implies either salience-scaled filming propensity (a spectacular rescue recruits far more filming than baseline — deferred parameter), more carriers present than the fixture's 15 observers, or generous canon. Recorded as a genuine open question — possibly about canon, per the demotion ruling.

## Three model limitations (all divergences trace here)

1. **No subject-scale term.** Perception and recording detail are person-scale calibrated; meters-scale subjects (vehicles, scaffolds, storefronts) under-score at distance. Fix: a subject-scale input to the stimulus/detail terms (px-on-target geometry already supports it on the recording side).
2. **Visual-only perception.** Tactile/proprioceptive/auditory *content* channels don't exist (audibility only orients). A person yanked by the arm has near-certain perception of the yank regardless of facing.
3. **Point events.** Events have no spatial extent, so attention aimed at one effect site (Ruth's freezer case) scores as attended-elsewhere. Multi-site events need attention-overlap resolution.

## Sequencing honesty note

`filmingPropensity` was added **after** the second pre-registration but **before** any scored run, when inspection showed the ratified reactive path (perceive → floor) had no appraise-and-decide gate and would produce ~50 recordings per 100 bystanders — contradicting every empirical anchor in the register. The value (0.06) comes from the register's band, not from fixture fitting. ET2 passed on first run after the addition.

## M-implications (adds to the standing list)

- The three limitations are the exposure ledger's next design inputs (subject scale, non-visual channels, event spatial extent) — all are input-schema extensions, not architecture changes.
- Recording-tier semantics need a task anchor (map tiers to DORI tasks explicitly: usable ≈ Observe, sharp ≈ Recognise+) so "usable for what?" stops being ambiguous — the cam3 divergence is partly semantic.
- Salience-scaled filming propensity before any crowd-scene fixture is trusted.
- The two levers (below) go to the user for ruling; everything else is engineering.
