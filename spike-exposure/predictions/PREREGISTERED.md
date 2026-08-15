# Pre-registered predictions — committed BEFORE the resolution functions exist

This file is committed in the scaffold commit, prior to any implementation. The
functions must not be tuned against these after the fact; divergence is scored
per the tolerance stated on each line.

## Mundane control (`mundane-control.json`) — V3 SCORED

Tolerances: perception within ±1 tier; recording exact tier; bystander-footage
counts exact.

1. **b1-walker** (20 m, near-axis, ambient, daylight): perception of the impact
   moment **partial or clear**; perception of the aftermath **complete**.
2. **b2-trunk** (8 m, facing away): impact moment **none or glimpse** (audible
   bang orients him after onset); aftermath **clear or complete**.
3. **b3-phone** (35 m, absorbed in phone): impact moment **none or glimpse**
   (inattentional-blindness candidate rescued by high audibility); aftermath
   **partial or clear**.
4. **lot-dome** (25 m, mid-tier dome, daylight, no susceptibility): recording
   **usable** — event captured, faces below identify threshold at that range;
   survives; no corruption.
5. **Reactive bystander footage of the ~2 s impact: zero** (below any
   plausible reaction floor). Aftermath photography is permitted and expected
   to be possible for b1 and b3.
6. **NULL-EXPOSURE check:** no observer ends at `none` for the *whole scene*
   (the bang at these ranges guarantees at least orienting); the model must NOT
   produce an empty observer set here.

## External empirical targets — V3 SCORED (predictions registered against researched numbers)

To be appended in a SECOND pre-registration commit after the research agents
return anchors but BEFORE the functions are run against them:

- Predicted independent reactive-recording count for a crowd/duration profile
  matching a researched real incident (target: within the researched
  order-of-magnitude band).
- Predicted identification-support rate for the device tier table vs published
  CCTV identification failure rates (target: same qualitative bracket —
  unfamiliar-face identification from typical installed CCTV is poor).

## Carrer geometry (`carrer-geometry.json`) — UNSCORED PLAUSIBILITY

No score. Descriptive expectations only, recorded for honesty: with a 25 s
fully-visible event, the reactive path should produce **some** mid-event phone
recordings (canon says ~4 of ~8 carriers); near witnesses should reach
clear/complete perception; the across-street camera should land degraded/usable
with identification below the identify tier. Any strong divergence from canon
texture is a NOTE — possibly about canon, which was authored backwards from a
narrative requirement.

## gap-run-01 incident (`gap-run-01-incident.json`) — V4 REGRESSION ONLY

Not a validation target. The functions' outputs are diffed against the
judgment outcomes recorded in the fixture; each divergence is explained in the
report. Divergence is a finding, not automatically a failure (judgment n=1 is
not ground truth). The frozen Craft baseline is untouched.

---

## SECOND PRE-REGISTRATION — external empirical targets (committed after research
## returned anchors, BEFORE the functions run against them)

Research anchors (V2 register): IEC 62676-4 DORI densities (Identify 250 px/m,
Recognise 125, Observe 62.5, Detect 25 — HIGH confidence); a 1080p ~90°-FOV
camera yields ~960/d px/m, so Identify holds only within ~4 m; Bruce et al.
2001 (unfamiliar-face matching 70% overall, 56% on hard mismatches even from
good video); bystander capture rates have NO published measurement — the
register's ASSUMED band is 1–10% of bystanders capturing ≥1 clip over a
sustained smartphone-era incident, instantaneous already-recording 0.1–1% in
ordinary public settings.

**ET1 — identification geometry (scored, exact):** with grounded identify
ranges, `identifySupport` must be FALSE for a dome-mid camera beyond 6 m and
for a wide-far camera beyond 4 m, and TRUE for dome-mid at ≤4 m in good light
with no corruption. Consequence to confirm: NO fixed camera in any of the three
fixtures produces identification-grade capture — identification is a
chokepoint outcome, not a wide-area outcome.

**ET2 — bystander prevalence (scored, band):** population sweep, 100 bystanders,
sustained (120 s) salient public street event, smartphone era, mixed
attention/geometry profile: total distinct captures (reactive +
already-recording) must land within **1–10**; already-recording contributors
within **0–2** (0.1–1 expected at street baseline). The band is the research
register's ASSUMED recommendation — scored against it honestly as
band-membership, with the band's ASSUMED status stated in the report.
