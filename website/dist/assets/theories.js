(function(root){
 'use strict';
 const KEY='philoforge.universe.v1';
 const prefix=(theory,id)=>theory+':'+id;
 function createRegistry(spinoza,justice){
  const spEntries=spinoza.entries.map(e=>({...e,id:prefix('spinoza',e.id),localId:e.id,theory:'spinoza'}));
  const spResults=spinoza.results.map(r=>({...r,id:prefix('spinoza',r.id),localId:r.id,theory:'spinoza',requires:r.requires.map(id=>prefix('spinoza',id)),parents:r.parents.map(id=>prefix('spinoza',id))}));
  const model={id:'justice:model',localId:'model',theory:'justice',type:'Definition',title:'People, resources and essential needs',text:'Positive needs, nonnegative resource access and a witnessed minimum of needs-adjusted access. These definitions fix the meaning of Q and justice.',reference:'AI, property and democratic justice',source:'/philoforge/ai-justice/',proofSource:'/proofs/AIJustice.lean'};
  const aiEntries=justice.premises.map(p=>({...p,id:prefix('justice',p.id),localId:p.id,theory:'justice',type:p.kind==='principle'?'Normative principle':'Scenario hypothesis',reference:'AI, property and democratic justice',source:'/philoforge/ai-justice/',proofSource:'/proofs/AIJustice.lean',test:p.id==='H9'}));
  const aiResults=justice.results.map(r=>({...r,id:prefix('justice',r.id),localId:r.id,theory:'justice',type:'Conditional result',theorem:r.leanName.split('.').pop(),requires:['justice:model',...r.requires.map(id=>prefix('justice',id))],parents:r.parents.map(id=>prefix('justice',id)),reference:'AI, property and democratic justice',source:'/philoforge/ai-justice/#'+r.id,proofSource:r.proof.url}));
  const entries=[...spEntries,model,...aiEntries];
  const results=[...spResults,...aiResults];
  const nodes=new Map([...entries,...results].map(node=>[node.id,node]));
  // Complete ancestry with every actual premise, including the shared model.
  // No term or predicate is silently identified across the two vocabularies.
  const prepared=new Set();
  function prepare(node){
   if(prepared.has(node.id))return;
   const leaves=new Set();
   function visit(id){const p=nodes.get(id);if(!p)throw new Error('Unknown dependency: '+id);if(p.requires){prepare(p);p.requires.forEach(x=>leaves.add(x));}else leaves.add(id);}
   node.parents.forEach(visit);
   for(const id of node.requires)if(!leaves.has(id))node.parents.push(id);
   node.level=1+Math.max(0,...node.parents.map(id=>nodes.get(id).level||0));
   prepared.add(node.id);
  }
  aiResults.forEach(prepare);
  const test={id:'spinoza:test-counterexample',localId:'test-counterexample',theory:'spinoza',type:'User test',test:true,title:'Counterexample to Proposition III',text:'There are two things with nothing in common, yet one causes the other.',reference:'Optional test, not a source axiom',proofSource:'https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/Spinoza.lean'};
  entries.push(test);nodes.set(test.id,test);
  const conflicts=[{
   id:'spinoza:counterexample-conflict',title:'Axiom IV + Axiom V conflict with this counterexample',
   text:'This refutes the added counterexample under the selected formal assumptions; it does not show that Spinoza’s axioms contradict one another.',
   requires:['spinoza:E1-A4','spinoza:E1-A5',test.id],
   leanName:'PhiloForge.Spinoza.proposition3_counterexample_conflict',proofSource:test.proofSource,
   steps:['The test supplies x and y with no commonality and with x causing y.','Proposition III, derived from Axioms IV and V, excludes that causal relation.','The same causal relation is asserted and denied.']
  },...justice.conflicts.map(c=>({...c,id:prefix('justice',c.id),requires:c.requires.map(id=>prefix('justice',id)),proofSource:c.proof.url}))];
  const theories=[
   {id:'spinoza',title:'Ethics — Spinoza',description:'Definitions, axioms and explicit interpretations from the verified fragments of the Ethics.',href:'/philoforge/ethics/',link:'Explore the complete Ethics ↗',groups:[['Definitions','Definition'],['Axioms','Axiom'],['Principles from the scholium','Scholium principle'],['Interpretive premises','Interpretive premise']]},
   {id:'justice',title:'AI and democratic justice — Romain Dufetelle',description:'A common productive infrastructure, two normative principles and conditional results about needs, ownership and democratic choice.',href:'/philoforge/ai-justice/',link:'Read the theory and explore its economic model ↗',groups:[['Definitions','Definition'],['Normative principles','Normative principle'],['Economic and institutional hypotheses','Scenario hypothesis']]}
  ].map(theory=>({...theory,ids:entries.filter(e=>e.theory===theory.id&&!e.test).map(e=>e.id)}));
  // Future bridges belong here only after an explicit vocabulary mapping,
  // cross-theory premises and a compiled Lean theorem have been registered.
  return {version:1,theories,entries,results,conflicts,bridges:[],nodes};
 }
 function sanitize(registry,ids){return Array.isArray(ids)?registry.entries.map(e=>e.id).filter(id=>ids.includes(id)):[];}
 function derive(registry,ids){
  const selected=new Set(sanitize(registry,ids));
  const conflicts=registry.conflicts.filter(c=>c.requires.every(id=>selected.has(id)));
  return {roots:registry.entries.filter(e=>selected.has(e.id)),results:conflicts.length?[]:registry.results.filter(r=>r.requires.every(id=>selected.has(id))),conflicts};
 }
 function fromQuery(registry,query){
  if(query.has('premises'))return sanitize(registry,(query.get('premises')||'').split(','));
  if(query.has('axioms'))return sanitize(registry,(query.get('axioms')||'').split(',').map(id=>prefix('spinoza',id)));
  return null;
 }
 function restore(registry,storage,query){
  const shared=fromQuery(registry,query);if(shared!==null)return shared;
  function read(key){try{return JSON.parse(storage.getItem(key));}catch{return null;}}
  const current=read(KEY);if(Array.isArray(current))return sanitize(registry,current);
  const previousSpinoza=read('philoforge.spinoza.v1'),previousJustice=read('philoforge.ai-justice.v1');
  const legacy=[...(Array.isArray(previousSpinoza)?previousSpinoza.map(id=>prefix('spinoza',id)):[])];
  if(Array.isArray(previousJustice)&&previousJustice.length)legacy.push('justice:model',...previousJustice.map(id=>prefix('justice',id)));
  return sanitize(registry,legacy);
 }
 function mapURL(registry,ids,origin,language){
  const url=new URL('/philoforge/map/',origin);url.searchParams.set('premises',sanitize(registry,ids).join(','));url.searchParams.set('lang',language==='fr'?'fr':'en');return url.toString();
 }
 let pending;
 function load(){
  if(!pending)pending=fetch('/data/ai-justice.json').then(r=>{if(!r.ok)throw new Error('Theory unavailable');return r.json();}).then(justice=>createRegistry(root.SpinozaTheory,justice));
  return pending;
 }
 root.PhiloTheories={KEY,createRegistry,sanitize,derive,fromQuery,restore,mapURL,load};
 if(typeof module==='object'&&module.exports)module.exports=root.PhiloTheories;
})(globalThis);
