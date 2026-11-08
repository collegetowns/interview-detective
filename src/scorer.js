/* ===== TF-IDF cosine similarity scorer =====
   Each protocol question (and each sub-question) is a document. Words are lower-cased,
   common function words removed, reduced to a stem, and a short list of synonyms is
   merged (e.g. barrier/obstacle/challenge). IDF is computed over the real protocol:
   idf = ln((1+N)/(1+df)) + 1 (the smoothed form used by scikit-learn). A student
   question is compared with each protocol question by cosine similarity (0 to 1);
   words that never occur in the protocol get the highest IDF, so off-topic words lower the similarity. */
const STOPW=new Set(("a an the of in on to and or for with by at from as is are was were be been being do does did doing how what which who whom whose why when where that this these those their theirs they them its it into about between other others than there here can could would should may might must will shall has have had having i you we our ours your yours his her hers him he she s me my mine any some if so please tell explain elaborate describe share talk walk through like way ways also many much one ones get got make made really kind sort etc e g eg things thing something anything everything yourself yourselves feel felt think thinking believe believed regarding relation related role example examples provide not no yes all most more less very just well able about being own want wants wanted new present study both each either same such then too again further once only").split(/\s+/));
const SYN=[["barrier","obstacl","challeng","hinder","difficult","difficulti","struggl","hard","prevent","problem","constrain"],["help","support","assist","facilitat","enabl"],["defin","definit","meaning"],["importan","matter","valu","significan","worth"],["develop","grow","growth","learn","build","built"],["teacher","teach","educator","instructor","faculty","professor","staff"],["student","pupil","learner","kid","child"],["parent","famil","guardian","mother","father"],["school","campus","college","universit","institution"],["strateg","approach","techniqu","method","practic","tactic"],["relationship","rapport","bond","connect","trust"],["experienc","event","situation","moment","time","instanc","occasion"],["future","career","job","plan"],["abroad","overseas","international","travel","countr"],["transfer","apply","appli","carry","translat"],["factor","influenc","contribut","reason","cause"],["opinion","view","perspectiv","perceiv","percept","attitud"],["goal","purpos","aim","objectiv"],["skill","competenc","abilit"],["success","achiev","accomplish"],["year","long"],["advic","advis","recommend","suggest"],["improv","better","enhanc","strengthen"],["controvers","sensitiv"],["train","prepar","tool","resourc"],["identit","identif"],["expect","pressur"],["participat","involv","engag","join","enrol"],["benefit","gain","takeaway","outcom"],["environment","setting","classroom","climat","space"],["lead"],["languag","tongu","speak","bilingual"],["risk","danger","concern","harm","downsid"],["differ","compar","versus","vs","contrast"],["social","peer","friend"],["academ","grade","coursework"],["behavio","conduct","disciplin"],["veteran","vet","military","soldier","servic"],["sport","athlet","team","coach","game"],["global","world"],["citizen"],["decid","decision","chose","choos","pick"],["become","became","becom","start","first"],["else","add","discuss","miss","additional"]];
const CANON=new Map(); SYN.forEach((g,i)=>g.forEach(p=>CANON.set(p,"§"+i)));
function canonTok(w){ for(const [p,id] of CANON){ if(w.startsWith(p)) return id; } return w.replace(/(ships?|ations?|ings?|ments?|ness|ities|ity|ies|ied|ed|es|ly|s)$/,"").slice(0,6); }
function normT(t){return String(t).replace(/\[[^\]]*\]/g," ").toLowerCase().replace(/[’']/g,"").replace(/[^a-z0-9]+/g," ").trim();}
function keyToks(t){const out=[]; normT(t).split(" ").forEach(w=>{ if(w.length>1&&!STOPW.has(w)){ const c=canonTok(w); if(!out.includes(c)) out.push(c);} }); return out;}
function buildIndex(allQs){ // allQs: [{t,subs}] -> {idf, per-question units with unit vectors}
  const flat=[]; allQs.forEach((q,qi)=>[q.t].concat(q.subs||[]).forEach(u=>flat.push({qi,d:keyToks(u)})));
  const N=flat.length, df=new Map(); flat.forEach(f=>f.d.forEach(k=>df.set(k,(df.get(k)||0)+1)));
  const idf=new Map(); df.forEach((v,k)=>idf.set(k,Math.log((1+N)/(1+v))+1));
  const maxIdf=Math.log(1+N)+1; // weight for a word that never appears in the protocol (df = 0)
  const vec=d=>{const m=new Map(); let n=0; d.forEach(k=>{ const w=idf.has(k)?idf.get(k):maxIdf; m.set(k,w); n+=w*w; }); n=Math.sqrt(n)||1; m.forEach((v,k)=>m.set(k,v/n)); return m;};
  flat.forEach(f=>f.v=vec(f.d));
  return {vec, qs:allQs.map((_,qi)=>flat.filter(f=>f.qi===qi))};
}
function cosine(a,b){ let s=0; a.forEach((v,k)=>{ if(b.has(k)) s+=v*b.get(k); }); return s; }
function similarity(mineText, IX, qi){ // best cosine between a student question and protocol question qi (or any of its sub-questions)
  const v=IX.vec(keyToks(mineText)); if(!v.size) return 0;
  return Math.max(0,...IX.qs[qi].map(u=>cosine(v,u.v)));
}
