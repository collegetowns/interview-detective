/* ===== TF-IDF cosine similarity scorer =====
   Each protocol question (and each sub-question) is a document. Words are lower-cased,
   common function words removed, reduced to a stem, and a short list of synonyms is
   merged (e.g. barrier/obstacle/challenge). IDF is computed over the real protocol:
   idf = ln((1+N)/(1+df)) + 1 (the smoothed form used by scikit-learn). A student
   question is compared with each protocol question by cosine similarity (0 to 1);
   words that never occur in the protocol get the highest IDF, so off-topic words lower the similarity. */
const STOPW=new Set(("a an the of in on to and or for with by at from as is are was were be been being do does did doing how what which who whom whose why when where that this these those their theirs they them its it into about between other others than there here can could would should may might must will shall has have had having i you we our ours your yours his her hers him he she s me my mine any some if so please tell explain elaborate describe share talk walk through like way ways also many much one ones get got make made really kind sort etc e g eg things thing something anything everything yourself yourselves feel felt think thinking believe believed regarding relation related role example examples provide not no yes all most more less very just well able about being own want wants wanted new present study both each either same such then too again further once only").split(/\s+/));
/* Synonym groups: one group per line, comma-separated single words. Each word is reduced to a stem;
   a token joins the group when it equals a stem or a stem plus a common ending (s, es, ed, ing, er, ion, ...). */
const DEFAULT_SYNONYMS=/*__SYNONYMS__*/"";
const ENDINGS=/^(e|s|es|d|ed|ing|ings|er|ers|ly|al|ally|ment|ments|ement|ements|ship|ships|ies|ied|y|ion|ions|ity|ities|ive|ize|ized|ise|ised|ness)?$/;
function stemWord(w){ w=w.toLowerCase().replace(/[^a-z]/g,""); return w.length>4?w.replace(/(ies|es|s|ing|ed|e|y)$/,""):w; }
function parseSynonyms(text){ const groups=[]; String(text||"").split(/\r?\n/).forEach(line=>{ const ws=line.split(/[,;]/).map(x=>x.trim()).filter(x=>/^[A-Za-z'’-]+$/.test(x)); if(ws.length>1) groups.push(ws); }); return groups; }
let SYN_STEMS=[];
function setSynonyms(text){ const list=[]; parseSynonyms(text).forEach((g,i)=>g.forEach(w=>{ const st=stemWord(w); if(st.length>=2) list.push([st,"§"+i]); })); list.sort((x,y)=>y[0].length-x[0].length); SYN_STEMS=list; }
function canonTok(w){
  for(const [st,id] of SYN_STEMS){ if(w.startsWith(st)&&ENDINGS.test(w.slice(st.length))) return id; }
  return w.replace(/(ships?|ations?|ings?|ments?|ness|ities|ity|ies|ied|ed|es|ly|s)$/,"").slice(0,6);
}
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
