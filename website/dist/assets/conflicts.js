(function(root){
 const proofs={
  alternatives:{id:'alternatives-conflict',axioms:['agency@1','no-alternatives@1'],title:'Incompatible assumptions about alternatives',positive:'Some agent has alternative actions.',negative:'No agent has alternative actions.',steps:['The existence axiom supplies an agent a and a situation s with alternatives.','The exclusion axiom applies to that same agent a and situation s.','The same proposition is both asserted and denied: a contradiction.'],theorem:'alternatives_conflict'},
  preference:{id:'transitivity-cycle-conflict',axioms:['transitivity','cycle'],title:'Transitivity conflicts with a strict cycle',positive:'Transitivity implies A ≻ C.',negative:'The cycle includes C ≻ A, which excludes A ≽ C.',steps:['The cycle axiom supplies A ≻ B, B ≻ C, and C ≻ A.','Transitivity of strict preference gives A ≻ C, hence A ≽ C.','By definition, C ≻ A implies not A ≽ C.','Therefore A ≽ C and not A ≽ C: a contradiction.'],theorem:'transitivity_cycle_conflict'}
 };
 function detect(ids,kind){const proof=proofs[kind];return proof.axioms.every(id=>ids.includes(id))?proof:null;}
 function render(panel,proof,axioms,remove){
  panel.replaceChildren();panel.classList.add('contradiction-view');
  const article=document.createElement('article');article.className='contradiction-proof';
  const add=(tag,text,parent=article)=>{const el=document.createElement(tag);el.textContent=text;parent.append(el);return el;};
  add('div','KNOWN CONTRADICTION').className='eyebrow';add('h3',proof.title);
  add('p','Only the highlighted axioms are needed for this conflict. Other selected axioms are not part of this proof.');
  const branches=add('div','');branches.className='conflict-branches';
  proof.axioms.forEach((id,index)=>{const axiom=axioms.find(a=>a.id===id);const branch=add('div','',branches);branch.className='conflict-branch';add('h4',axiom.title,branch);add('p',axiom.statement||axiom.text,branch);add('div','↓',branch).className='conflict-arrow';add('strong',index===0?proof.positive:proof.negative,branch);});
  const clash=add('div','');clash.className='conflict-clash';const symbol=add('span','⊥',clash);symbol.setAttribute('aria-hidden','true');add('strong','Contradiction',clash);add('p','The same proposition and its negation cannot both hold.',clash);
  add('h4','Proof, step by step');const list=add('ol','');proof.steps.forEach(step=>add('li',step,list));
  const link=add('a','Lean-checked contradiction proof ↗');link.href='https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/Conflicts.lean';
  add('p','Remove either conflicting axiom to remove this known conflict. This does not establish consistency with all other assumptions.');
  const actions=add('div','');actions.className='presets';proof.axioms.forEach(id=>{const button=add('button','Remove this axiom',actions);const title=add('span',axioms.find(a=>a.id===id).title,button);button.prepend(document.createTextNode(' · '));button.addEventListener('click',()=>remove(id));});
  panel.append(article);
 }
 root.PhiloConflicts={proofs,detect,render};if(typeof module==='object'&&module.exports)module.exports=root.PhiloConflicts;
})(globalThis);
