// Earth-B exposure spike — shared types.
// Two-layer invariant: objective and believed scenes are DISTINCT branded types;
// no function ever receives a merged view.

export type PerceptionTier = "none" | "glimpse" | "partial" | "clear" | "complete";
export type RecordingTier = "none" | "trace" | "degraded" | "usable" | "sharp";

export interface EventSignature {
  visibility: "invisible" | "effects-only" | "fully-visible";
  visualMagnitude: number;   // 0..1 how much there is to see
  audibility: number;        // 0..1 at source
  emSideEffect: number;      // 0..1 electronics disruption strength
  physicalSideEffect: number;
  radiusMeters: number;      // EM side-effect radius (0 = none)
  subjectScaleMeters?: number; // schema ext. 1: size of the primary visible subject (default 1.7 = person)
}

// Schema ext. 4: events carry PHASE STRUCTURE, not a duration scalar. The
// reaction clock starts at the first salient phase; the anomaly may land in a
// later phase with devices already rolling (the Lisbon/Carrer shape).
export interface EventPhase {
  name: string;
  startSecond: number;
  durationSeconds: number;
  salient: boolean;          // does this phase plausibly trigger orienting/filming?
  anomalous?: boolean;       // is this the phase that matters for exposure?
}

export interface ExposureEvent {
  id: string;
  mode: "accidental" | "deliberate";
  durationSeconds: number;
  signature: EventSignature;
  phases?: EventPhase[];       // schema ext. 4 (absent ⇒ single-phase event)
  attentionKeys?: string[];    // schema ext. 3: attention targets that count as ON the event's spatial extent
  // Track 2 tier (default mundane). RULING K: tier assignment is an
  // UNREGISTERED DEGREE OF FREEDOM — a modeling input requiring stated
  // per-incident reasoning, NOT an obvious property of the scene. The same
  // scene is often defensible under two tiers (is a settled-but-pinning van an
  // ongoing threat to spectators?); when both are defensible, run and report
  // both. Proper long-term resolution is per-observer threat perception.
  salience?: "mundane" | "dramatic-safe" | "personal-threat";
}

export type Lighting = "daylight" | "indoor-fluorescent-good" | "night-streetlit" | "dark";

export interface ObserverState {
  id: string;
  distanceMeters: number;
  offAxisDegrees: number;    // 0 = looking straight at the event; 180 = facing directly away
  occlusion: number;         // 0..1 fraction of sightline blocked
  attention: "attended" | "ambient";
  attentionTarget: string | null; // when attended: is the target the event itself?
  stress: number;            // 0..1 acute arousal at event time
  sensory: "normal" | "impaired";
  tactileContact?: boolean;  // schema ext. 2: physically acted on by the event
}

export type DeviceQualityTier = "door-low" | "dome-mid" | "wide-far" | "phone" | "phone-2013" | "dashcam";

export interface DeviceState {
  id: string;
  kind: string;
  qualityTier: DeviceQualityTier;
  distanceMeters: number;
  inFieldOfView: boolean;
  emExposed: boolean;        // physically within plausible coupling range of EM side-effects
  operating: boolean;
  retentionDays: number;
}

export interface CarriedDevice {
  custodian: string;         // observer id
  kind: string;
  alreadyRecording: boolean; // Amendment 2b path 2
  aimedAtEventIfRecording?: boolean; // unrelated aim; usually wrong, occasionally perfect
}

// ---- branded scene layers (never collapsed) ----
export interface ObjectiveScene {
  readonly layer: "objective";
  event: ExposureEvent;
  lighting: Lighting;
  observers: ObserverState[];
  devices: DeviceState[];
  carried: CarriedDevice[];
  seed: number;
}
export interface BelievedScene {
  readonly layer: "believed";
  event: ExposureEvent;
  lighting: Lighting;
  observers: ObserverState[]; // only those the actor is aware of
  devices: DeviceState[];     // only devices the actor knows exist
  carried: CarriedDevice[];
  seed: number;
}

export interface PerceptionRecord {
  observerId: string;
  onsetTier: PerceptionTier;      // perception of the event's onset/order (the S1 divergence driver)
  overallTier: PerceptionTier;    // perception of the scene incl. aftermath after orienting
  oriented: boolean;              // did the observer orient to the event at all
  orientedDuringEvent: boolean;   // oriented before it ended
  internal: { onsetScore: number; overallScore: number };
}

export interface RecordingRecord {
  deviceId: string;
  tier: RecordingTier;
  corruption: number;             // 0..1 (1 = critical content unrecoverable)
  identifySupport: boolean;       // meets identify-grade detail for persons at event distance
  retentionDays: number;
  internal: { fidelityScore: number };
}

export interface BystanderRecording {
  custodian: string;
  path: "reactive" | "already-recording";
  startedAtSecond: number;        // relative to event onset
  capturedSeconds: number;        // of the event itself (0 = aftermath only)
  capturedAnomalousPhase: boolean;// schema ext. 4: was the anomalous phase recorded?
  aimedAtEvent: boolean;
}

export interface ExposureLedgerEntry {
  eventId: string;
  layer: "objective" | "believed";
  perceptions: PerceptionRecord[];
  recordings: RecordingRecord[];
  bystanderRecordings: BystanderRecording[];
  nullExposure: boolean;          // named invariant: empty sets are valid committed outcomes
}
