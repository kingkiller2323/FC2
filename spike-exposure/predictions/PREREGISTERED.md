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
