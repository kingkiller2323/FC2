import { narrativeStep, receptionOpportunity, type ActorSurfaces, type NarrativeState } from "../src/model.js";
const N=2000; const seeds=Array.from({length:N},(_,i)=>7_000_003+i*104729);
const mkN=():NarrativeState=>({id:"s",year:2026,salience:"notable",homeScope:"workplace",reach:{workplace:0.3},subjectLinkByScope:{workplace:"named"},ageDays:0,activePhase:true,dominantInterpretation:"v"});
function run(a:ActorSurfaces,seed:number,days=60){let n=mkN();let ff=-1,fp=-1,parts=0;const state:string[]=[];for(let d=1;d<=days;d++){n=narrativeStep(n);const r=receptionOpportunity(a,n,d,seed);if(r.kind==="partial"){parts++;if(fp<0)fp=d;}if(r.kind==="full"&&ff<0)ff=d;state.push(ff>0?"F":(fp>0?"P":"N"));}return{ff,fp,parts,state};}
// RULING N / P4: dread-state CONDITIONED ON AVOIDANCE, time-resolved
const avoider=():ActorSurfaces=>({actorId:"subject",memberScopes:["household","workplace"],platformGroupMember:true,localMediaConsumer:false,circleSizeFactor:0.5,avoidedSurfaces:["workplace","platformGroup","socialCircle","household"],isSubject:true});
const runs=seeds.map(s=>run(avoider(),s));
for(const day of [7,14,30,60]){const inDread=runs.filter(r=>r.state[day-1]==="P").length/N;console.log(`P4-COND: dread-state (partial,no full) among AVOIDERS at day ${day}: ${inDread.toFixed(3)}`);}
const gaps=runs.filter(r=>r.ff>0&&r.fp>0&&r.fp<r.ff).map(r=>r.ff-r.fp);
console.log(`P4-COND: dread-window length (first partial→first full), median=${gaps.sort((a,b)=>a-b)[Math.floor(gaps.length/2)]}d n=${gaps.length}`);
// RULING N / P5: partial-first stratified by surface density
const strata:Record<string,ActorSurfaces>={
 low:{actorId:"subject",memberScopes:["household"],platformGroupMember:false,localMediaConsumer:false,circleSizeFactor:0.15,avoidedSurfaces:[],isSubject:true},
 medium:{actorId:"subject",memberScopes:["household","workplace"],platformGroupMember:false,localMediaConsumer:false,circleSizeFactor:0.5,avoidedSurfaces:[],isSubject:true},
 high:{actorId:"subject",memberScopes:["household","workplace"],platformGroupMember:true,localMediaConsumer:true,circleSizeFactor:1,avoidedSurfaces:[],isSubject:true}};
for(const [k,a] of Object.entries(strata)){const rs=seeds.map(s=>run(a,s));const wf=rs.filter(r=>r.ff>0);const pf=wf.filter(r=>r.fp>0&&r.fp<r.ff).length/Math.max(1,wf.length);console.log(`P5-STRAT ${k}: partial-first=${pf.toFixed(3)} (full-reception runs=${wf.length}/${N})`);}
// P6: optimism-bias regression — Marcus-analog (platform member, non-subject), FB-group story day 0 = judgment day 5 post; judgment: same-day reception
const marcus:ActorSurfaces={actorId:"marcus",memberScopes:["household"],platformGroupMember:true,localMediaConsumer:false,circleSizeFactor:0.4,avoidedSurfaces:[],isSubject:false};
const m=seeds.map(s=>{let n:NarrativeState={id:"fm",year:2026,salience:"notable",homeScope:"neighborhood",reach:{neighborhood:0.05},subjectLinkByScope:{neighborhood:"anonymous"},ageDays:0,activePhase:true,dominantInterpretation:"fire"};let ff=-1;for(let d=1;d<=10;d++){n=narrativeStep(n);const r=receptionOpportunity(marcus,n,d,s);if(r.kind==="full"&&ff<0)ff=d;}return ff;});
const got=m.filter(d=>d>0); console.log(`P6-REGRESSION: Marcus-analog first-full median=${got.sort((a,b)=>a-b)[Math.floor(got.length/2)]}d, within-1-day share=${(m.filter(d=>d===1).length/N).toFixed(3)}, never-in-10d=${(m.filter(d=>d<0).length/N).toFixed(3)} (judgment: same-day group reception)`);
