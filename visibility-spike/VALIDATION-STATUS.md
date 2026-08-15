# Visibility Spike — First Validation Status (honest, interim)

Suite: 6 fixture tests, multi-seed (2,000) from the first run. **3 pass, 3 fail
honestly against the committed pre-registration** (which was not edited).

PASS — P2 (both parts): identity link drops outward in 100% of runs absent a
re-identification event; named-at-workplace subject median first-full = 2 days;
anonymous never-learns mass = 0.694 (pre-reg: >0.15). The Powered History
anonymity texture falls out of the mechanism.
PASS — P3: era divergence: time-to-25% = 5d (2004) → 3d (2013) → 3d (2026),
monotone; channel shares: platform 0% of receptions in 2004 → 58% in 2026;
local media 28% → 3%. Direction matches pre-registration; 2013 vs 2026 speed
saturated equal (day-granularity floor — noted).
FAIL (near-miss) — P1: week 0.168 ✓, ever 0.118 ✓, but city reach 0.0213 vs
pre-registered <0.02 — a 6% overshoot on the spillover margin. Kept failing.
FAIL (partial) — P4: avoidance delay 2d→9d (≥2× ✓); never-learns rises 0→0.024
(✓ but weakly "substantial"); dread-state 0.021 vs pre-registered >0.1 ✗ —
with a NAMED workplace story and the ×4 tell multiplier, avoidance delays but
rarely prevents full reception at 60 days. The pre-registered threshold may
itself have been wrong (ASSUMED-shape prediction); reported, not edited.
FAIL — P5: partial-precedes-full 0.342 vs pre-registered >0.5 — direct tells
beat ambient glimpses for a named-local story. Same caveat: the prediction had
no literature anchor (target-reception INCONCLUSIVE); miss reported honestly.

FITTED register (sequencing notes in params.ts): salienceCarriage
(J-curve direction CITED; magnitudes fitted after the first run's
over-diffusion). TOP WEAKNESSES: (1) target-reception rate — no literature
exists; (2) minor-story awareness floors — not retrievable.

Remaining before spike close: property/invariant suite (NO-LEAK, NO-TELEPORT,
NULL-RECEPTION, conservation, determinism, era monotonicity as properties);
P6 optimism-bias regression vs gap-run-01 timings; report with all band
widths; user rulings on the three honest misses.

---

# RULINGS M–O CLOSE-OUT + CONDITIONAL RE-MEASUREMENTS

**Ruling M — P1 threshold provenance, stated plainly:** the 0.02 city bound was
a round number — "it seemed like a small number." Not derived from anything.
The 0.0213 result is therefore a near-miss against an unanchored threshold:
weak evidence in both directions, recorded as such, threshold not adjusted.

**Ruling N — P4 conditional (dread among AVOIDERS, time-resolved):**
day 7: 15.3% · **day 14: 18.4%** · day 30: 7.0% · day 60: 2.1%; median
dread-window (first partial → first full) = 8 days (n=704). The mass sits in
the predicted 15–30% band at the 1–2-week horizon and collapses as fulls
arrive. **Verdict: the mechanism holds partials open under avoidance; the
original prediction stated a conditional, time-windowed quantity as a global
60-day one — the user's specification error, recorded as theirs per
instruction.** (Original global figure 0.021 retained above, labeled global.)

**Ruling N — P5 stratified by surface density:** sparse 0.559 · medium 0.189 ·
high 0.189 partial-first. High among sparse subjects, low among dense —
**mechanism sensitive to density; the global >50% prediction was the wrong
statistic — the user's specification error, theirs per instruction.** One
model note: medium ≈ high (sensitivity saturates once the named workplace
surface is present; the tell-multiplier dominates).

**P6 — optimism-bias regression: CONFIRMED, third instance.** Marcus-analog
median first-full = 6 days vs the judgment run's same-day group reception;
1.6% of seeds reproduce same-day; 43.8% exceed 10 days. The mechanism
under-diffuses relative to judgment exactly as the standing prediction
requires — judgment-run information flow was optimistically fast and neat.

**Ruling O:** salienceCarriage relabeled FITTED-MAGNITUDE / CITED-DIRECTION.

**STANDING NOTE — STRUCTURAL OVER-PRODUCTION (watch for the third instance):**
two spikes, two base mechanisms that over-produced, two damping constants
fitted after a first run: filmingPropensity (exposure) and salienceCarriage
(visibility) — both cited-direction, fitted-magnitude. Twice is not yet a
pattern. If a THIRD damping constant becomes necessary, STOP and audit the
base mechanisms for systematic generosity before adding it.

**V1 property suite: 6/6 pass** (NO-TELEPORT provenance, NULL-RECEPTION,
determinism, conservation+hardening, identity-drop default, era monotonicity).

**P2 noted per ruling: the second canon property derived rather than
asserted** — Powered History's anonymity texture (anonymous subjects never
learning, identity dropping at scope boundaries) now falls out of mechanism.

# SPIKE CLOSED

Built: narrativeStep + receptionOpportunity (pure, seeded); era-varying
constants (one interpolated anchor table — scope guard held); per-(narrative,
scope) subject-link tiers with committed re-identification; avoidance as
upstream committed action; partial reception from surface bandwidth.
Validated: strongly — invariants 6/6, P2 (anonymity texture, 100%/69%), P3
(era divergence, platform 0%→58%); moderately — P4/P5 conditional (mechanism
works; global predictions were mis-specified); honestly open — P1 near-miss vs
unanchored threshold. Optimism bias confirmed a third time (P6). Open,
documented, unworked: target-reception rate, minor-story awareness floors,
medium/high density saturation, day-granularity floor. The runtime inherits:
both functions, the parameter table with full taxonomy, the era anchor table,
and the PAIR rule — exposure ledger + visibility model promote together.
