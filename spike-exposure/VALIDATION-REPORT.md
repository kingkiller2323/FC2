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

---

# V2 ITERATION (Rulings A–E applied)

## Ruling A — ASSUMED vs FITTED relabel, and the direct answer

Every parameter now carries `CITED | ASSUMED | FITTED`. Exactly ONE parameter is
FITTED: **filmingPropensity (0.06)** — the mechanism was introduced after the
second pre-registration because inspection showed ~50 recordings/100 bystanders
without it, and its value was chosen from the register band so expected output
lands inside the ET2 band. It is labeled contaminated in source, cannot count
toward validation, and needs independent validation (staged-event or
forensic-review data) before ledger promotion.

**Direct answer to the question asked:** Lever 1 (7.0 s) was built from the
component sum (Green + Ashbrook + launch specs) before any fixture ran against
it and was never adjusted afterward — independent. Lever 2's rates were set
from the V2 register bands in the grounding pass, before ET2 or any sweep ran —
independent. Neither lever was tuned to Powered History: the Carrer comparison
happened after both were locked, and the model UNDER-produces canon texture
(0 vs ~4 videos), which is direct evidence against canon-fitting. The earlier
report's "reproduces the evidence texture" phrasing described a post-hoc
observation, not a tuning criterion — but the criticism stands: it should never
have been presented as a virtue, and is not counted as one now.

## Schema extensions 1–4: results (all fixtures re-run)

- **Mundane control: 6/6 — all pre-registered predictions now pass.** The
  subject-scale term (ext. 1) fixed both v1 failures with a CITED mechanism
  (visual angle ∝ size/distance; DORI px-on-subject): b1's aftermath reaches
  `clear`, the lot dome reaches `usable` (car at 25 m ≈ 154 px ≥ Observe-grade)
  while a *person* at the same camera is `degraded` (65 px) — one mechanism,
  both scales correct.
- **Recording model rewritten onto pure DORI pixel geometry** — this *removed*
  two ASSUMED constants (`recordingDistanceHalfMeters`, `recordingTierEdges`)
  and replaced them with CITED px thresholds. Tier semantics are now task-
  anchored: sharp ≥ Recognise, usable ≥ Observe, degraded ≥ Detect.
- **V4 regression improved:** Priya onset `partial` (tactile floor, ext. 2 —
  matches judgment exactly); Ruth onset `glimpse`/overall `partial` (attention-
  extent, ext. 3 — within ±1 of judgment, the order-distortion geometry now
  mechanically representable); Dana `clear` vs `complete` (1 tier, stress-boost
  magnitude); cams 6/7, zero bystander footage, Priya onset<overall all still
  reproduce. **Remaining divergence: cam3 `trace` vs judgment "usable"** — at
  the fixture's stated geometry (wide-far 1080p @ 30 m, subject 2.5 m) DORI
  arithmetic gives ~41 px ≈ Detect-grade; the judgment's "usable" was optimistic
  OR the fixture's distance/FOV transcription is generous. Honestly unresolved;
  flagged for the fixture-geometry audit at ledger promotion. Note the S4 chain
  survives either way: "register 2 visibly unmanned" is a Detect-grade claim
  (person-presence/absence), not an Observe-grade one.
- **ET1: 2/3 sub-assertions pass; one honest miss at exactly 4 m** — the
  pre-registration rounded the dome-mid identify boundary to "≤4 m"; the DORI
  arithmetic gives 3.84 m (960/4 × 1.7 = 408 px < 425). Boundary error of 4%,
  in the pre-registration, not the model. The chokepoint claim itself is
  unaffected. ET2 re-passes (8 captures, in band).

## Ruling B — Carrer v2: arithmetic and honest outcome

**The arithmetic (as demanded):** v1 fixture had 15 observers / 8 carriers
(under-transcribed canon's "dozens" — corrected, disclosed, to 36/18 at 2013
~50% smartphone-camera penetration). Compound gate per bystander: carry 0.5 ×
perceive ~0.9 × propensity 0.06 ⇒ ~2.7%. E[reactive] = 18 × 0.06 ≈ 1.08;
P(zero) = 0.94¹⁸ ≈ 33% — and this seed drew zero (all 18 draws ≥ 0.075).
Canon's ~4 videos from ~36 present implies ~11% per-bystander capture — 4×
the FITTED constant. **FIFTH FINDING confirmed: the gates compound to
near-zero**, and the binding gate is the FITTED propensity, not the floor.

**Phase structure did its job but did not close the count gap:** with the
reaction clock starting at the van crash (phase 1) and the anomaly at 17–25 s,
any recording that exists now covers the anomalous phase with ~99% probability
(P(floor < 25 s) ≈ 99% at median 7/σ 0.55) — v1's structural impossibility is
gone; what remains is purely the propensity count. A salience-scaled propensity
of ~0.3–0.5 for a man-pinned-under-van event would yield 5–9 recordings ≈
canon texture — but implementing that number NOW would be fitting to canon, so
it is stated as arithmetic and deferred to independent grounding (documented
bystander-video counts at attested incidents of known salience).

## Ruling C — Lever 1 as distribution

Implemented: per-observer log-normal, median 7.0 s, σ = 0.55, truncated at
2.0 s, drawn deterministically per observer+seed. Percentile sweep:

| σ | P(<3 s) | P(<5 s) | P(>10 s) | P(>20 s) |
|---|---|---|---|---|
| 0.40 | 1.7% | 20.0% | 18.6% | 0.4% |
| **0.55 (proposed)** | **6.2%** | **27.0%** | **25.8%** | **2.8%** |
| 0.70 | 11.3% | 31.5% | 30.5% | 6.7% |

σ = 0.55 recommended: ~6% quick-draws (phone already in hand) honors
Ashbrook's retrieval-dominance finding, ~3% slow tail (bags, gloves, frozen
appraisal) stays plausible. σ = 0.70 over-produces sub-3 s draws against the
4.6 s retrieval anchor. The cliff is gone: "is my power under 7 seconds" is now
a risk curve, not a binary.

## Ruling D — the design property, named

**AMBIENT DEVICE DENSITY IS THE SETTING-LEVEL DIFFICULTY DIAL.** Because the
floor distribution makes reactive capture of short events rare-but-possible and
the already-recording path is ungated, the effective exposure risk of a fast
power is set almost entirely by Lever 2's context rates. A designer tunes the
exposure game per setting (store vs street vs rally vs 2013 vs 2026) by setting
one table — no mechanics change. This is the lever a difficulty system will
eventually hang from.

## Status after v2

23/24 (the one failure is the pre-registered ET1 rounding miss, kept honest).
FITTED count: 1 (filmingPropensity — blocks ledger promotion until
independently validated). TOP-FLAGGED: detectionDetailBlendFloor (see
params.ts header — tier-flipping authority, pure interpolation; grounding
requires staged-event completeness-vs-eccentricity data that does not exist in
the literature as parameterized).

---

# POST-V2 RULINGS (F, G, H) AND THE OPTIMISM-BIAS FINDING

**Ruling F:** σ = 0.55 accepted. The log-normal FAMILY is now tagged ASSUMED in
params.ts (the shape was chosen, not derived). Logged-not-modeled: the primed
state ("phone in hand, unlocked, roughly aimed") — a third readiness class
between already-recording and the 2 s floor; matters at concerts/protests.

**Ruling G:** cam3 divergence RESOLVED in DORI's favor — judgment was
optimistic, and the likely reason is recorded: cam3 carried the timing clue, so
judgment had a narrative motive to make it legible. The fixture's judgment
record is annotated (original text preserved); fixture geometry was NOT
adjusted to rescue "usable"; the frozen Craft baseline is untouched. S4
survives (Detect-grade supports register-2-unmanned).

**NAMED FINDING — SYSTEMATIC OPTIMISM BIAS.** The external standard has now
corrected improvised evidence twice, in the same direction (Carrer: judgment 4
videos, model fewer; cam3: judgment usable, DORI Detect): **improvised evidence
is systematically more legible than real evidence.** Standing prediction for
all future ledger-vs-canon runs across Eras 1–5: expect under-production
BEFORE running; treat matching canon as the surprising result.

**Ruling H, Track 1 (recorded):** published surviving video counts measure the
COMPOUND propensity × survival × custody × publication — never the propensity
gate alone. Any counting study is reported as bounding the product; it cannot
ground 0.06 by itself.

---

# RULING H — TRACK 2 OUTCOME (blind research, pre-registered comparison)

**The blind register** (Martin/Knuth/Przyrembel 2025 German EMS field data; van
der Wal 2021 evacuation-video analysis; Lindegaard 2022; Philpot 2019; full
citations in the register): mundane per-carrier filming propensity **0.02–0.10**;
dramatic-but-spectator-safe **0.15–0.40** (~3–6×); personal-threat suppression
**×0.4–0.6** (filming OR 0.41 under perceivable threat) — an **inverted-U**.
Absolute anchors LOW-MEDIUM (incident-level → per-witness conversion, stated
plainly); shape MEDIUM-HIGH.

**Unsealed comparison (full text in predictions/SALIENCE-PREREGISTRATION.md):**
1. **Canon vs literature: HIT.** Carrer's canon texture implies 0.22
   per-carrier; the blind band for exactly that incident class is 0.15–0.40.
   Canon sits mid-band. Per the optimism-bias finding this was the SURPRISING
   outcome — and, notably, it is the bias-defying exception: canon's Carrer
   *count* was realistic even though its camera legibility (cam3-style) was not.
2. **My pre-registered band (0.3–0.5): NEAR-MISS, derivation error owned** —
   I overstated canon's requirement ~40% (wrote 0.3–0.5 where 4/18 = 0.22).
   Bands overlap on [0.30, 0.40]; prediction center high.
3. **The FITTED 0.06 landed mid-bracket of the blind mundane band (0.02–0.10).**
   Chosen fitted; corroborated by a researcher who never saw it.

**Track 2 implemented:** filmingPropensity is now a three-tier salience
structure — mundane 0.06 (origin FITTED, since corroborated; relabel to
CITED-bracket PROPOSED, pending ratification) · dramatic-safe 0.275
(CITED-bracket midpoint) · personal-threat 0.14 (CITED suppression factor).
The event schema carries `salience`; the inverted-U is in the model.

**The convergence result:** Carrer re-run with the independently derived tier:
**5 reactive recordings vs canon's ~4, the first beginning ~6.8 s in
("videos beginning mid-event"), covering the anomalous phase** — produced by
phase structure (Ruling B) + the floor distribution (Ruling C) + the blind
salience band (Track 2), none of which was tuned to canon. Carrer remains
UNSCORED by standing rule; this is reported as out-of-sample convergence, not
as a scored pass.

**Promotion status:** Track 2 succeeded within the register's stated
confidence. The mundane tier's relabel (FITTED → CITED-bracket, on grounds of
blind corroboration) awaits user ratification; if declined, Track 3 stands
ready (third named design lever). Either path unblocks ledger promotion per
Ruling H. The units caveat (incident-level vs per-witness) is the parameter
family's honest residual weakness and is flagged in every source string.

**Suite: 23/24** — the one failure remains the pre-registered ET1 rounding
error, kept failing per ruling.

---

# RULINGS I–L APPLIED

**Ruling I — relabel granted as FITTED-CORROBORATED, not CITED.** The status
now exists in the taxonomy; the source string leads with "FITTED FIRST …
CORROBORATED SECOND" in that order, states that no source says 0.06, and that
corroboration is not derivation. **Ledger promotion: UNBLOCKED** (the parameter
no longer claims to be modeled). Track 3 not needed.

**Ruling J — band widths stated; language downgraded.** The dramatic-safe band
0.15–0.40 spans a factor of **2.7**; the mundane band 0.02–0.10 spans a factor
of **5**. Amended results language: canon's 0.22 is **consistent with the blind
band, within a wide band** (not "clean hit"); the 0.06 baseline is
**consistent with the blind mundane bracket, within a very wide band**. A broad
range of plausible values would also have landed inside; these results are
consistency checks, not tight tests — and they are the results that unblocked
promotion, which is why the widths are stated here. (The original "HIT"
phrasing remains visible in the pre-registration file's unsealed section and in
repo history, per the keep-the-record instruction.)

**Ruling K — tier assignment is an unregistered degree of freedom; sensitivity
run executed.** The salience *bands* were blind; the *classification* of Carrer
was not — it was assigned knowing the target count. Both classifications run:

| Classification | Seeded outcome | Expectation (18 × p) |
|---|---|---|
| dramatic-safe (0.275) | **5 recordings** | 5.0 |
| personal-threat (0.14) | **0 recordings** | 2.5 (seeded zero, P≈7%) |
| canon | ~4 | — |

Reasoning, stated separately from the result: *for* dramatic-safe — the van is
at rest post-impact, the anomalous phase is a rescue, most fixture observers
stand 12–60 m away outside any plausible vehicle path, and van der Wal's
suppression was measured under perceivable ongoing threat to the observer
(fires, alarms). *For* personal-threat — the vehicle was violently displaced
seconds earlier, could shift during the lift, near observers (4–8 m) are inside
a plausible envelope, and the fixture's own near-observer stress values
(0.7–0.8) encode perceived danger. **Verdict: both are defensible; the scene is
genuinely mixed** (near observers plausibly suppressed, far ones not), and the
honest ambiguity is itself a finding: with classification contested, the
convergence claim weakens from "5 vs ~4" to "0–5 spanning canon, depending on
a judgment call." Proper resolution is per-observer threat perception (logged
in the schema docs as the required refinement). Generalized: tier assignment is
now documented in the input schema as a judgment input requiring stated
per-incident reasoning.

**Ruling L** — written up standalone on Craft: *Finding — The Spectacle–Safety
Filming Peak.*

**Also (units caveat elevated):** the incident→per-witness conversion is now
TOP-FLAGGED WEAKNESS 2 in params.ts, alongside blendFloor, with the resolution
requirement stated (per-witness coding of filmers-vs-present at known
incidents — a study that does not exist).
