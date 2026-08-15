# Earth-B Exposure Spike

Two deterministic resolution functions — perception completeness and recording
corruption/survival — per the ratified design (Craft note: "Exposure Spike —
Ratified Design & Validation Plan"). This is a spike, not the runtime; the
functions are pure and intended to land in the M2/M3 runtime unchanged.

## Status: PRE-GROUNDING (honest)

- **V1 property sweeps: ALL PASS** (monotonicity, no unnamed cliffs, stress =
  narrowing never blindness, tier ordering, determinism incl. seeded noise,
  NULL-EXPOSURE invariant, two-layer invariant).
- **V3/V4 scored fixtures: 3 FAILURES on ASSUMED placeholder parameters** —
  committed failing on purpose. Predictions were pre-registered (see
  predictions/PREREGISTERED.md, committed before any function existed) and the
  parameters may only be set from V2 external research, never tuned against the
  fixtures. Known parameter defects the failures already exposed:
  1. the eccentricity curve applies letter-acuity falloff to event *detection*
     — peripheral detection of salient events is far better than detail acuity;
  2. the recording distance curve is too punishing (a mid dome at 25 m daylight
     should be usable; cam3-at-30 m must not collapse to trace).
- Next: V2 research lands → parameters grounded with citations (or flagged
  ASSUMED) → scored fixtures run once → report.

`npm test` runs everything; the scored-fixture failures are the current honest
state, not a broken build.
