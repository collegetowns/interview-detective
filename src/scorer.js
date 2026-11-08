/* ===== generic auto-scorer (no hand-written key lists needed) ===== */
const STOPW=new Set(("a an the of in on to and or for with by at from as is are was were be been being do does did doing how what which who whom whose why when where that this these those their theirs they them its it into about between other others than there here can could would should may might must will shall has have had having i you we our ours your yours his her hers him he she s me my mine any some if so please tell explain elaborate describe share talk walk through would like way ways also many much one ones get got make made really kind sort etc e g eg things thing something anything everything yourself yourselves feel felt think thinking believe believed regarding relation related role example examples provide not no yes all most more less very just well about being own both each either own same such then too again further once only").split(/\s+/));
const SYN=[["barrier","obstacl","challeng","hinder","difficult","difficulti","struggl","hard","prevent","problem","constrain"],["help","support","assist","facilitat","enabl"],["defin","definit","meaning"],["importan","matter","valu","significan","worth"],["develop","grow","growth","learn","build","built"],["teacher","teach","educator","instructor","faculty","professor","staff"],["student","pupil","learner","kid","child"],["parent","famil","guardian","mother","father"],["school","campus","college","universit","institution"],["strateg","approach","techniqu","method","practic","tactic"],["relationship","rapport","bond","connect","trust"],["experienc","event","situation","moment","time","instanc","occasion"],["future","career","job","plan"],["abroad","overseas","international","travel","countr"],["transfer","apply","appli","carry","translat"],["factor","influenc","contribut","reason","cause","why"],["opinion","view","perspectiv","perceiv","percept","attitud"],["goal","purpos","aim","objectiv"],["skill","competenc","abilit"],["success","achiev","accomplish"],["year","long"],["advic","advis","recommend","suggest"],["improv","better","enhanc","strengthen"],["controvers","sensitiv"],["train","prepar","tool","resourc"],["identit","identif"],["expect","pressur"],["participat","involv","engag","join","enrol"],["benefit","gain","takeaway","outcom"],["environment","setting","classroom","climat","space"],["lead"],["languag","tongu","speak","bilingual"],["risk","danger","concern","harm","downsid"],["differ","compar","versus","vs","contrast"],["social","peer","friend"],["academ","grade","coursework"],["behavio","conduct","disciplin"],["veteran","vet","military","soldier","servic"],["sport","athlet","team","coach","game"],["global","world"],["citizen"],["decid","decision","chose","choos","pick"],["become","became","becom","start","first"],["else","add","discuss","miss"]];
const CANON=new Map(); SYN.forEach((g,i)=>g.forEach(p=>CANON.set(p,"§"+i)));
function canonTok(w){
  for(const [p,id] of CANON){ if(w.startsWith(p)) return id; }
  return w.replace(/(ships?|ations?|ings?|ments?|ness|ities|ity|ies|ied|ed|es|ly|s)$/,"").slice(0,6);
}
function normT(t){return t.toLowerCase().replace(/[’']/g,"").replace(/[^a-z0-9]+/g," ").trim();}
function keyToks(t){const out=[]; normT(t).split(" ").forEach(w=>{ if(w.length>1&&!STOPW.has(w)){ const c=canonTok(w); if(!out.includes(c)) out.push(c);} }); return out;}
function buildIndex(allQs){ // allQs: [{t,subs}]
  const docs=allQs.map(q=>keyToks(q.t+" "+(q.subs||[]).join(" "))); const N=docs.length, df=new Map();
  docs.forEach(d=>d.forEach(k=>df.set(k,(df.get(k)||0)+1)));
  const ix=docs.map(d=>{const w=d.map(k=>({k,w:Math.pow(Math.log(1+N/(df.get(k))),2)})); const top=w.slice().sort((a,b)=>b.w-a.w).slice(0,6); return {all:new Set(d),top};});
  const allW=ix.flatMap(x=>x.top.map(t=>t.w)); const mean=allW.length?allW.reduce((a,b)=>a+b,0)/allW.length:1;
  ix.forEach(x=>{const tot=x.top.reduce((a,t)=>a+t.w,0); x.den=Math.max(tot,3*mean);}); return ix;
}
function pairScoreAuto(mine, idx){
  const ks=new Set(keyToks(mine));
  if(!ks.size) return 0;
  const tot=idx.den||1; let m=0; idx.top.forEach(x=>{ if(ks.has(x.k)) m+=x.w; });
  let cov=m/tot; if(idx.top.length>=4) cov=Math.min(1,cov*1.35);
  let inter=0; ks.forEach(k=>{ if(idx.all.has(k)) inter++; });
  const dice=2*inter/(ks.size+idx.all.size);
  return Math.round(100*(.7*cov+.3*Math.min(1,dice*1.8)));
}
