(function(root){
 const source='https://www.gutenberg.org/cache/epub/919/pg919.html';
 const proofSource='https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/Spinoza.lean';
 const entries=[
 {id:'E1-D3',type:'Definition',title:'Substance',text:'A substance is in itself and conceived through itself.',reference:'Ethics I, Definition III',original:'By substance I mean that which is in itself, and is conceived through itself.',mapping:'Formal convention: conceptual independence means no conceptual dependence on a distinct entity. This makes explicit a stronger reading of the prose definition.'},
 {id:'E1-A4',type:'Axiom',title:'Knowledge of effect and cause',text:'Knowing an effect depends on knowing its cause.',reference:'Ethics I, Axiom IV',original:'The knowledge of an effect depends on and involves the knowledge of a cause.',mapping:'Formal convention: if c causes e, the conception of e depends on c. Only the direction needed by the selected proofs is encoded.'},
 {id:'E1-A5',type:'Axiom',title:'Nothing in common',text:'Things with nothing in common cannot be conceived through one another.',reference:'Ethics I, Axiom V',original:'Things which have nothing in common cannot be understood, the one by means of the other.',mapping:'Formal convention: absence of commonality excludes conceptual dependence in both directions.'}
 ];
 const results=[
 {id:'conceptual-separation',title:'No conceptual dependence',text:'If two things have nothing in common, neither is conceived through the other.',reference:'Intermediate step in Ethics I, Proposition III',requires:['E1-A5'],parents:['E1-A5'],level:1,theorem:'conceptual_separation',steps:['Assume x and y have nothing in common.','Apply Axiom V in both directions.','Neither conception depends on the other.']},
 {id:'E1-P3',title:'No causation without commonality',text:'Things with nothing in common cannot cause one another.',reference:'Ethics I, Proposition III',requires:['E1-A4','E1-A5'],parents:['E1-A4','conceptual-separation'],level:2,theorem:'proposition3',steps:['Axiom V excludes conceptual dependence between things with nothing in common.','Suppose one caused the other. Axiom IV would require conceptual dependence.','That contradicts the preceding step, so neither can cause the other.']},
 {id:'E1-P6-C',title:'No external cause of substance',text:'A substance cannot be produced by a cause external to itself, in the reconstructed causal vocabulary.',reference:'Ethics I, Proposition VI, Corollary — alternative demonstration',requires:['E1-D3','E1-A4'],parents:['E1-D3','E1-A4'],level:1,theorem:'external_cause_excluded',steps:['Definition III encodes conceptual independence from distinct entities.','An external cause would make the conception of the substance depend on that cause, by Axiom IV.','This contradicts the encoded independence. External causation is excluded.']}
 ];
 function derive(ids){const set=new Set(ids);return {results:results.filter(r=>r.requires.every(id=>set.has(id))),conflict:set.has('E1-A4')&&set.has('E1-A5')&&set.has('test-counterexample'),roots:entries.filter(e=>set.has(e.id))};}
 root.SpinozaTheory={entries,results,derive};if(typeof module==='object'&&module.exports)module.exports=root.SpinozaTheory;
 if(typeof document==='undefined'||!document.querySelector('#spinoza-library'))return;
 const selected=new Set();try{const saved=JSON.parse(localStorage.getItem('philoforge.spinoza.v1'));if(Array.isArray(saved))for(const id of saved)if([...entries.map(e=>e.id),'test-counterexample'].includes(id))selected.add(id);}catch{}
 const library=document.querySelector('#spinoza-library'),graph=document.querySelector('#spinoza-tree');
 function add(parent,tag,text){const el=document.createElement(tag);el.textContent=text;parent.append(el);return el;}
 function cite(parent,entry){const a=add(parent,'a',entry.reference);a.href=source;a.target='_blank';a.rel='noopener';a.className='source-citation';}
 for(const entry of entries){const card=add(library,'article','');card.className='source-axiom';const label=add(card,'label','');const input=document.createElement('input');input.type='checkbox';input.checked=selected.has(entry.id);input.dataset.axiom=entry.id;label.append(input);add(label,'strong',entry.title);add(card,'div',entry.type).className='eyebrow';add(card,'p',entry.text);cite(card,entry);const details=add(card,'details','');add(details,'summary','Source and formalization');add(details,'blockquote',entry.original);add(details,'p','English translation: R. H. M. Elwes. French text on this site is our translation.');add(details,'p',entry.mapping);input.addEventListener('change',()=>{input.checked?selected.add(entry.id):selected.delete(entry.id);render();});}
 const test=document.querySelector('#test-counterexample');test.checked=selected.has('test-counterexample');test.addEventListener('change',()=>{test.checked?selected.add('test-counterexample'):selected.delete('test-counterexample');render();});
 function render(){
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
     if(node.theorem){const details=add(card,'details','');add(details,'summary','Read the reasoning');const list=add(details,'ol','');node.steps.forEach(step=>add(list,'li',step));const link=add(card,'a','Lean-checked reconstruction ↗');link.href=proofSource;}
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
