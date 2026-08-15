// AMENDMENT A: era-varying CONSTANTS (never an era system — scope guard is a
// ratified ruling). Values anchored to the Powered History era files'
// "Evidence & communications environment" sections, which were externally
// researched and verified during canon construction. Status for all entries:
// CITED-to-canon-research. The blind diffusion register (V2) supplies the
// diffusion-shape constants separately; these anchor the CHANNEL environment.

export interface EraMediaAnchors {
  yearRange: [number, number];
  capture: string;        // what an ordinary person can record
  spreadSpeed: string;    // how fast a local story can move
  channels: string;       // dominant channels for a neighborhood-scale story
  localNews: string;      // state of local-news infrastructure
  canonSource: string;
}

export const ERA_ANCHORS: EraMediaAnchors[] = [
  { yearRange: [2001, 2004],
    capture: "film/print-first; no US camera phones until late 2002; VGA novelty by 2003-04; low res, thin metadata",
    spreadSpeed: "days, not minutes — newspaper, local TV, word of mouth, email forward, forum post; nothing reaches mass audiences without a news outlet",
    channels: "word-of-mouth + local print/TV dominant; email chains and forums the fastest non-news spread; no YouTube, no smartphones, no ubiquitous social sharing",
    localNews: "intact — morning newspapers and evening local news are the default surface",
    canonSource: "Era 1 §2–3" },
  { yearRange: [2005, 2008],
    capture: "camera phones VGA–1MP; MiniDV; YouTube from Apr 2005; ~13 h/min uploads by 2008",
    spreadSpeed: "millions within days possible, but via links/embeds/search — no personalized feed; provenance thin",
    channels: "forums, blogs, email, MySpace, early Facebook/Twitter; discovery is link-driven, not feed-driven",
    localNews: "still functional; online video mainstream from 2006 but news outlets remain the amplifier",
    canonSource: "Era 2 §2" },
  { yearRange: [2009, 2013],
    capture: "smartphone minority (2009) → solid majority (2013); VGA→1080p standard; pre-LTE uploads deferred hours, immediate by 2013",
    spreadSpeed: "busy-street events filmed from several angles by 2013; platform intake 20→100 h/min — visibility per item FALLS as volume quintuples",
    channels: "platform feeds rising; crowd investigation capable (2011) then discredited (Boston, 2013); amateur forensics raise confidence not accuracy",
    localNews: "declining; platform distribution overtaking",
    canonSource: "Era 3 §2" },
  { yearRange: [2014, 2014],
    capture: "58–59% US adult smartphone; 1080p ambient default; multi-angle assumed",
    spreadSpeed: "News Feed AUTOPLAY in front of 1.3B+; no FB Live/native Twitter video yet — live moments travel by TV then fragment into clips",
    channels: "Facebook feed dominant; YouTube ~300 h/min; Verification Handbook codifies newsroom UGC procedure",
    localNews: "weakened; 'the anomaly reporter' not yet a beat",
    canonSource: "Era 4 §2" },
  { yearRange: [2015, 2019],
    capture: "live video ambient (FB Live/Periscope mid-decade); synthetic media makes 'authentic' an expert claim by 2018",
    spreadSpeed: "immediate; algorithmic feeds; viral-or-nothing dynamics",
    channels: "platform groups + feeds dominant for neighborhood stories; provenance literacy a mass-culture skill; every newsroom's anomaly beat by 2016",
    localNews: "collapsed to remnant; neighborhood Facebook groups fill the local-information role (canon: the Southgate Neighbors group, gap-run-01)",
    canonSource: "Era 5 §3" },
  { yearRange: [2020, 2026],
    capture: "assumed continuation: near-universal smartphone, 4K, doorbells ~20%+ of households",
    spreadSpeed: "algorithmic spikiness; mostly-nothing-or-viral",
    channels: "neighborhood platforms/groups mature as the default local surface; legacy local media residual",
    localNews: "residual",
    canonSource: "Foundation baseline + Era 5 trajectory (ASSUMED extension — canon Eras 6–7 not yet authored)" },
];
