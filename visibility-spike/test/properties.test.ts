import { describe, it, expect } from "vitest";
import fc from "fast-check";
import { narrativeStep, receptionOpportunity, type ActorSurfaces, type NarrativeState } from "../src/model.js";
const mkN=(o?:Partial<NarrativeState>):NarrativeState=>({id:"s",year:2026,salience:"notable",homeScope:"neighborhood",reach:{neighborhood:0.1},subjectLinkByScope:{},ageDays:0,activePhase:true,dominantInterpretation:"v",...o});
const mkA=(o?:Partial<ActorSurfaces>):ActorSurfaces=>({actorId:"a",memberScopes:["household","workplace"],platformGroupMember:true,localMediaConsumer:true,circleSizeFactor:0.5,avoidedSurfaces:[],isSubject:false,...o});
describe("V1 invariants", () => {
  it("NO-TELEPORT: every reception carries surface provenance", () => {
    fc.assert(fc.property(fc.integer(), fc.integer({min:1,max:60}), (s,d)=>{
      const r=receptionOpportunity(mkA(),mkN(),d,s);
      if(r.kind!=="none") expect(r.surface).toBeTruthy();
    }),{numRuns:2000});
  });
  it("NULL-RECEPTION: zero-reach narrative yields none, committed not thrown", () => {
    const r=receptionOpportunity(mkA(),mkN({reach:{}}),1,42);
    expect(r.kind).toBe("none");
  });
  it("determinism", () => {
    fc.assert(fc.property(fc.integer(), fc.integer({min:1,max:60}), (s,d)=>{
      expect(receptionOpportunity(mkA(),mkN(),d,s)).toEqual(receptionOpportunity(mkA(),mkN(),d,s));
    }),{numRuns:500});
  });
  it("conservation + hardening: interpretation never changes in step; reach bounded by ceiling", () => {
    let n=mkN(); for(let d=0;d<40;d++){n=narrativeStep(n); expect(n.dominantInterpretation).toBe("v"); expect(n.reach.neighborhood!).toBeLessThanOrEqual(0.801);}
  });
  it("identity-drop default: spilled scopes are anonymous absent re-identification", () => {
    let n=mkN({homeScope:"workplace",reach:{workplace:0.3},subjectLinkByScope:{workplace:"named"}});
    for(let d=0;d<20;d++)n=narrativeStep(n);
    expect(n.subjectLinkByScope.block??"anonymous").toBe("anonymous");
  });
  it("era monotonicity: 2026 neighborhood growth ≥ 2004 at equal age", () => {
    let a=mkN({year:2004}),b=mkN({year:2026});
    for(let d=0;d<5;d++){a=narrativeStep(a);b=narrativeStep(b);}
    expect(b.reach.neighborhood!).toBeGreaterThanOrEqual(a.reach.neighborhood!);
  });
});
