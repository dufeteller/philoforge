(function(root){
 const source='https://www.gutenberg.org/cache/epub/919/pg919.html';
 const proofSource='https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/Spinoza.lean';
 const entries=[
 {id:'E1-D3',type:'Definition',title:'Substance',text:'A substance is in itself and conceived through itself.',reference:'Ethics I, Definition III',original:'By substance I mean that which is in itself, and is conceived through itself.',mapping:'Formal convention: conceptual independence means no conceptual dependence on a distinct entity. This makes explicit a stronger reading of the prose definition.'},
 {id:'E1-A4',type:'Axiom',title:'Knowledge of effect and cause',text:'Knowing an effect depends on knowing its cause.',reference:'Ethics I, Axiom IV',original:'The knowledge of an effect depends on and involves the knowledge of a cause.',mapping:'Formal convention: if c causes e, the conception of e depends on c. Only the direction needed by the selected proofs is encoded.'},
 {id:'E1-A5',type:'Axiom',title:'Nothing in common',text:'Things with nothing in common cannot be conceived through one another.',reference:'Ethics I, Axiom V',original:'Things which have nothing in common cannot be understood, the one by means of the other.',mapping:'Formal convention: absence of commonality excludes conceptual dependence in both directions.'}
 ];
 entries.push({id:'E1-D5',type:'Definition',title:'Modes of substance',text:'A mode exists in and is conceived through another entity.',reference:'Ethics I, Definition V',original:'By mode, I mean the modifications of substance, or that which exists in, and is conceived through, something other than itself.',mapping:'Formal convention: ModeOf names a distinct entity in which the mode exists and on which its conception depends. Priority in Proposition I is reconstructed as asymmetric conceptual dependence, not temporal precedence.'});
 entries.push(
 {id:'E3-D1',type:'Definition',title:'Adequate and partial causes',text:'An adequate cause makes its effect understandable through itself alone; a partial cause does not.',reference:'Ethics III, Definition I',source:'https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap03',original:'I call that an adequate cause, whose effect can be clearly and distinctly perceived through it.',mapping:'Formal convention: adequacy includes causation and intelligibility through this cause alone. Partial causation includes causation and excludes that intelligibility.'},
 {id:'E3-D2',type:'Definition',title:'Activity and passivity',text:'We act when we are the adequate cause of an event; we are passive when we are only a partial cause.',reference:'Ethics III, Definition II',source:'https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap03',original:'I say that we act when anything takes place, either within us or externally to us, whereof we are the adequate cause.',mapping:'Formal convention: activity and passivity are relative to the same actor and event. This does not exclude a person being active in one respect and passive in another.'}
 );
 const results=[
 {id:'conceptual-separation',title:'No conceptual dependence',text:'If two things have nothing in common, neither is conceived through the other.',reference:'Intermediate step in Ethics I, Proposition III',requires:['E1-A5'],parents:['E1-A5'],level:1,theorem:'conceptual_separation',steps:['Assume x and y have nothing in common.','Apply Axiom V in both directions.','Neither conception depends on the other.']},
 {id:'E1-P3',title:'No causation without commonality',text:'Things with nothing in common cannot cause one another.',reference:'Ethics I, Proposition III',requires:['E1-A4','E1-A5'],parents:['E1-A4','conceptual-separation'],level:2,theorem:'proposition3',steps:['Axiom V excludes conceptual dependence between things with nothing in common.','Suppose one caused the other. Axiom IV would require conceptual dependence.','That contradicts the preceding step, so neither can cause the other.']},
 {id:'E1-P6-C',title:'No external cause of substance',text:'A substance cannot be produced by a cause external to itself, in the reconstructed causal vocabulary.',reference:'Ethics I, Proposition VI, Corollary — alternative demonstration',requires:['E1-D3','E1-A4'],parents:['E1-D3','E1-A4'],level:1,theorem:'external_cause_excluded',steps:['Definition III encodes conceptual independence from distinct entities.','An external cause would make the conception of the substance depend on that cause, by Axiom IV.','This contradicts the encoded independence. External causation is excluded.']}
 ];
 results.push(
 {id:'adequate-not-partial',title:'An adequate cause is not partial',text:'For the same effect, a cause cannot be both adequate and partial in this encoding.',reference:'Definitional consequence of Ethics III, Definition I',requires:['E3-D1'],parents:['E3-D1'],level:1,theorem:'adequate_not_partial',source:'https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap03',proofSource:'https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaAffects.lean',steps:['Adequacy asserts that this effect is understood through this cause alone.','Partial causation denies the same intelligibility.','These conditions cannot hold together for the same cause and effect.']},
 {id:'active-not-passive',title:'Activity excludes passivity for this event',text:'For one actor and one event, activity and passivity exclude one another in the reconstructed definitions.',reference:'Definitional consequence of Ethics III, Definitions I–II',requires:['E3-D1','E3-D2'],parents:['adequate-not-partial','E3-D2'],level:2,theorem:'active_not_passive',source:'https://www.gutenberg.org/files/3800/3800-h/3800-h.htm#chap03',proofSource:'https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/SpinozaAffects.lean',steps:['Activity means being the adequate cause of this event.','Passivity means being its partial cause.','The adequate-not-partial result excludes simultaneous activity and passivity for this event.']}
 );
 results.push(
 {id:'E1-P1',title:'Substance is prior to its modes',text:'A mode depends conceptually on its substance; the substance does not depend on that distinct mode. This reconstructs priority as asymmetric conceptual dependence.',reference:'Ethics I, Proposition I — conceptual reconstruction',requires:['E1-D3','E1-D5'],parents:['E1-D3','E1-D5'],level:1,theorem:'proposition1',steps:['Definition V supplies a mode conceived through a distinct substance.','Definition III excludes dependence of that substance on the distinct mode.','Conceptual dependence runs in one direction: this is the explicit interpretation of priority used here.']},
 {id:'E1-P6',title:'Distinct substances cannot cause each other',text:'In the causal encoding, neither of two distinct substances causes the other. This uses the corollary’s alternative argument, not Spinoza’s full historical proof of Proposition VI.',reference:'Ethics I, Proposition VI — causal reconstruction',requires:['E1-D3','E1-A4'],parents:['E1-P6-C','E1-D3'],level:2,theorem:'proposition6_causal',steps:['The external-cause result excludes a cause distinct from a substance.','Apply it to the first substance with the second as the proposed external cause.','Apply it in the reverse direction. Both causal relations are excluded.']}
 );
 function derive(ids){const set=new Set(ids);return {results:results.filter(r=>r.requires.every(id=>set.has(id))),conflict:set.has('E1-A4')&&set.has('E1-A5')&&set.has('test-counterexample'),roots:entries.filter(e=>set.has(e.id))};}
 for(const result of results)result.leanName='PhiloForge.Spinoza.'+(result.proofSource?.includes('SpinozaAffects')?'Affects.':'')+result.theorem;
 root.SpinozaTheory={entries,results,derive};if(typeof module==='object'&&module.exports)module.exports=root.SpinozaTheory;
 if(typeof document==='undefined'||!document.querySelector('#spinoza-library'))return;
 const selected=new Set();try{const saved=JSON.parse(localStorage.getItem('philoforge.spinoza.v1'));if(Array.isArray(saved))for(const id of saved)if([...entries.map(e=>e.id),'test-counterexample'].includes(id))selected.add(id);}catch{}
 const library=document.querySelector('#spinoza-library'),graph=document.querySelector('#spinoza-tree');
 function add(parent,tag,text){const el=document.createElement(tag);el.textContent=text;parent.append(el);return el;}
 function cite(parent,entry){const a=add(parent,'a',entry.reference);a.href=entry.source||source;a.target='_blank';a.rel='noopener';a.className='source-citation';}
 const groups=[];
 function createGroup(parent,title,ids,key,open=false){
  const section=add(parent,'section','');section.className='selection-group';
  const row=add(section,'div','');row.className='selection-group-row';
  const toggle=add(row,'button','');toggle.type='button';toggle.className='selection-toggle';
  const arrow=add(toggle,'span',open?'▾':'▸');arrow.setAttribute('aria-hidden','true');arrow.dataset.localised='true';add(toggle,'span',title);
  const body=add(section,'div','');body.id='selection-'+key;body.className='selection-children';body.hidden=!open;
  toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-controls',body.id);
  toggle.addEventListener('click',()=>{body.hidden=!body.hidden;toggle.setAttribute('aria-expanded',String(!body.hidden));arrow.textContent=body.hidden?'▸':'▾';});
  const checkbox=document.createElement('input');checkbox.type='checkbox';checkbox.dataset.selectionGroup=key;checkbox.setAttribute('aria-label','Select all: '+title);row.append(checkbox);
  checkbox.addEventListener('change',()=>{for(const id of ids)checkbox.checked?selected.add(id):selected.delete(id);render();});
  groups.push({checkbox,ids});return body;
 }
 const theory=createGroup(library,'Ethics — Spinoza',entries.map(e=>e.id),'spinoza',true);
 for(const type of ['Definition','Axiom']){
  const members=entries.filter(e=>e.type===type);
  const group=createGroup(theory,type==='Definition'?'Definitions':'Axioms',members.map(e=>e.id),type.toLowerCase());
  for(const entry of members){
   const card=add(group,'article','');card.className='source-axiom compact-starting-point';
   const label=add(card,'label','');add(label,'strong',entry.title);const input=document.createElement('input');input.type='checkbox';input.checked=selected.has(entry.id);input.dataset.axiom=entry.id;label.append(input);
   const details=add(card,'details','');add(details,'summary','Source and formalization');
   add(details,'p',entry.text);cite(details,entry);add(details,'blockquote',entry.original);add(details,'p','English translation: R. H. M. Elwes. French text on this site is our translation.');add(details,'p',entry.mapping);
   input.addEventListener('change',()=>{input.checked?selected.add(entry.id):selected.delete(entry.id);render();});
  }
 }

 const test=document.querySelector('#test-counterexample');test.checked=selected.has('test-counterexample');test.addEventListener('change',()=>{test.checked?selected.add('test-counterexample'):selected.delete('test-counterexample');render();});
 function render(){
  for(const input of library.querySelectorAll('[data-axiom]'))input.checked=selected.has(input.dataset.axiom);
  for(const {checkbox,ids} of groups){const count=ids.filter(id=>selected.has(id)).length;checkbox.checked=count===ids.length;checkbox.indeterminate=count>0&&count<ids.length;}
  const data=derive([...selected]);graph.replaceChildren();
  graph.hidden=!data.conflict;
  document.querySelector('#map-link').hidden=true;graph.className=data.conflict?'contradiction-view':'proof-tree';
  document.querySelector('#spinoza-empty').hidden=data.roots.length>0;
  document.querySelector('#generate-map').disabled=data.roots.length===0;
  document.querySelector('.tree-caption').hidden=!!data.conflict;
  if(data.conflict){renderConflict();}else{
   for(let level=2;level>=0;level--){const row=add(graph,'div','');row.className='proof-level';const nodes=level===0?data.roots:data.results.filter(r=>r.level===level);
    if(!nodes.length){row.remove();continue;}
    for(const node of nodes){const card=add(row,'article','');card.className='proof-node';card.dataset.node=node.id;add(card,'div',level===0?node.type:'Consequence').className='eyebrow';add(card,'h3',node.title);add(card,'p',node.text);cite(card,node);
     if(node.theorem){const details=add(card,'details','');add(details,'summary','Read the reasoning');const list=add(details,'ol','');node.steps.forEach(step=>add(list,'li',step));const link=add(card,'a','Lean-checked reconstruction ↗');link.href=node.proofSource||proofSource;}
    }
   }
  }
  try{localStorage.setItem('philoforge.spinoza.v1',JSON.stringify([...selected]));}catch{}
  PhiloI18n.apply();requestAnimationFrame(drawEdges);
 }
 function renderConflict(){const box=add(graph,'article','');box.className='contradiction-proof';add(box,'div','COUNTEREXAMPLE TEST — NOT A SPINOZA AXIOM').className='eyebrow';add(box,'h3','Axiom IV + Axiom V conflict with this counterexample');
  const branches=add(box,'div','');branches.className='conflict-branches';const left=add(branches,'div','');left.className='conflict-branch';add(left,'h4','Spinoza’s Proposition III');add(left,'p','Axioms IV and V imply that things with nothing in common cannot cause one another.');const right=add(branches,'div','');right.className='conflict-branch';add(right,'h4','Your test assumption');add(right,'p','There are two things with nothing in common, yet one causes the other.');
  const clash=add(box,'div','');clash.className='conflict-clash';add(clash,'span','⊥').setAttribute('aria-hidden','true');add(clash,'strong','Contradiction');
  const list=add(box,'ol','');['The test supplies x and y with no commonality and with x causing y.','Proposition III, derived from Axioms IV and V, excludes that causal relation.','The same causal relation is asserted and denied.'].forEach(step=>add(list,'li',step));const link=add(box,'a','Lean-checked contradiction proof ↗');link.href=proofSource;
  add(box,'p','This refutes the added counterexample under the selected formal assumptions; it does not show that Spinoza’s axioms contradict one another.');const button=add(box,'button','Remove the test assumption');button.className='secondary';button.addEventListener('click',()=>{selected.delete('test-counterexample');test.checked=false;render();});
 }
 function drawEdges(){graph.querySelector('svg')?.remove();if(derive([...selected]).conflict)return;const origin=graph.getBoundingClientRect();const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('proof-edges');svg.setAttribute('aria-hidden','true');svg.setAttribute('viewBox',`0 0 ${graph.clientWidth} ${graph.scrollHeight}`);
  for(const node of derive([...selected]).results){const target=graph.querySelector(`[data-node="${node.id}"]`);if(!target||target.hidden)continue;const t=target.getBoundingClientRect();for(const id of node.parents){const sourceNode=graph.querySelector(`[data-node="${id}"]`);if(!sourceNode||sourceNode.hidden)continue;const s=sourceNode.getBoundingClientRect();const x=s.left+s.width/2-origin.left,y=s.top-origin.top,tx=t.left+t.width/2-origin.left,ty=t.bottom-origin.top;const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',`M ${x} ${y} C ${x} ${(y+ty)/2}, ${tx} ${(y+ty)/2}, ${tx} ${ty}`);svg.append(path);}}
  graph.prepend(svg);
 }
 document.querySelector('#generate-map').addEventListener('click',()=>{
  const data=derive([...selected]);
  if(data.conflict){render();graph.scrollIntoView({behavior:'smooth',block:'start'});return;}
  if(!data.roots.length)return;
  const url=new URL('/philoforge/map/',location.origin);url.searchParams.set('axioms',[...selected].join(','));url.searchParams.set('lang',PhiloI18n.language);
  const opened=window.open(url.toString(),'_blank');if(opened)opened.opener=null;
  const fallback=document.querySelector('#map-link');fallback.href=url.toString();fallback.hidden=false;
});
document.querySelector('#select-spinoza').addEventListener('click',()=>{entries.forEach(e=>selected.add(e.id));library.querySelectorAll('input').forEach(i=>i.checked=true);render();});
 document.querySelector('#clear-spinoza').addEventListener('click',()=>{selected.clear();library.querySelectorAll('input').forEach(i=>i.checked=false);test.checked=false;render();});
 document.querySelectorAll('[data-language]').forEach(b=>b.addEventListener('click',()=>requestAnimationFrame(drawEdges)));window.addEventListener('resize',drawEdges);render();
})(globalThis);
