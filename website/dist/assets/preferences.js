(function(root){
 const nodes=[
 {id:'strict-definition',level:0,title:'Strict preference',text:'A ≻ B means A ≽ B and not B ≽ A.',kind:'Definition',requires:[]},
 {id:'transitivity',level:0,title:'Transitivity',text:'A ≽ B and B ≽ C imply A ≽ C.',kind:'Axiom',requires:['transitivity']},
 {id:'completeness',level:0,title:'Completeness',text:'For every A and B: A ≽ B or B ≽ A.',kind:'Axiom',requires:['completeness']},
 {id:'asymmetry',level:1,title:'Strict preference is asymmetric',text:'A ≻ B excludes B ≻ A.',kind:'Intermediate result',requires:[],parents:['strict-definition'],theorem:'strict_asymmetric'},
 {id:'strict-transitivity',level:1,title:'Strict preference is transitive',text:'A ≻ B and B ≻ C imply A ≻ C.',kind:'Intermediate result',requires:['transitivity'],parents:['strict-definition','transitivity'],theorem:'strict_transitive'},
 {id:'reflexivity',level:1,title:'Weak preference is reflexive',text:'Every option satisfies A ≽ A.',kind:'Intermediate result',requires:['completeness'],parents:['completeness'],theorem:'complete_reflexive'},
 {id:'no-cycle',level:2,title:'No strict cycle of three options',text:'A ≻ B ≻ C ≻ A is impossible.',kind:'Consequence',requires:['transitivity'],parents:['asymmetry','strict-transitivity'],theorem:'no_strict_three_cycle'},
 {id:'greatest',level:2,title:'A greatest option among three',text:'Some option is at least as desirable as all three. Ties are allowed.',kind:'Consequence',requires:['transitivity','completeness'],parents:['transitivity','completeness','reflexivity'],theorem:'greatest_of_three'}
 ];
 function analyze(matrix){
  const r=(a,b)=>!!matrix[a][b];
  const complete=[0,1,2].every(a=>[0,1,2].every(b=>r(a,b)||r(b,a)));
  let witness=null;for(let a=0;a<3;a++)for(let b=0;b<3;b++)for(let c=0;c<3;c++)if(r(a,b)&&r(b,c)&&!r(a,c)&&!witness)witness=[a,b,c];
  const strict=(a,b)=>r(a,b)&&!r(b,a);
  const cycle=strict(0,1)&&strict(1,2)&&strict(2,0)||strict(0,2)&&strict(2,1)&&strict(1,0);
  return {complete,transitive:!witness,witness,cycle,greatest:[0,1,2].filter(a=>[0,1,2].every(b=>r(a,b)))};
 }
 root.PreferenceTheory={nodes,analyze};if(typeof module==='object'&&module.exports)module.exports=root.PreferenceTheory;
 if(typeof document==='undefined')return;
 const graph=document.querySelector('#preference-tree');if(!graph)return;
 const selected=()=>['transitivity','completeness','cycle'].filter(id=>document.querySelector('#pref-'+id).checked);
 function render(){
  const choices=selected();graph.replaceChildren();
  const conflict=PhiloConflicts.detect(choices,'preference');
  graph.classList.toggle('proof-tree',!conflict);graph.classList.remove('contradiction-view');
  if(conflict){PhiloConflicts.render(graph,conflict,[...nodes,{id:'cycle',title:'A strict three-option cycle exists.',text:'There are A, B, and C such that A ≻ B, B ≻ C, and C ≻ A.'}],id=>{document.querySelector('#pref-'+id).checked=false;render();});PhiloI18n.apply();renderModel();return;}

  for(let level=2;level>=0;level--){const row=document.createElement('div');row.className='proof-level';
   for(const node of nodes.filter(n=>n.level===level)){
    const active=node.requires.every(id=>choices.includes(id));
    const card=document.createElement('article');card.className='proof-node'+(active?'':' inactive');card.dataset.node=node.id;
    const kind=document.createElement('div');kind.className='eyebrow';kind.textContent=node.kind;
    const h=document.createElement('h4');h.textContent=node.title;
    const p=document.createElement('p');p.textContent=node.text;card.append(kind,h,p);
    if(node.parents){const dependency=document.createElement('small');dependency.textContent='Depends on: '+node.parents.map(id=>nodes.find(n=>n.id===id).title).join(' + ');card.append(dependency);}
    const status=document.createElement('span');status.className='proof-status';status.textContent=active?(node.theorem?'Lean-checked theorem':'Starting point'):'Missing selected axioms';card.append(status);
    if(node.theorem){const link=document.createElement('a');link.href='https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/Preferences.lean';link.textContent='Read the formal proof ↗';card.append(link);}
    row.append(card);
   }graph.append(row);
  }
  PhiloI18n.apply();requestAnimationFrame(drawEdges);renderModel();
 }
 function drawEdges(){
  if(PhiloConflicts.detect(selected(),'preference'))return;
  graph.querySelector('svg')?.remove();const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('proof-edges');svg.setAttribute('aria-hidden','true');
  const origin=graph.getBoundingClientRect();svg.setAttribute('viewBox',`0 0 ${graph.clientWidth} ${graph.scrollHeight}`);
  const choices=selected();for(const node of nodes){if(!node.parents||!node.requires.every(id=>choices.includes(id)))continue;
   const target=graph.querySelector(`[data-node="${node.id}"]`);if(target.hidden)continue;
   const t=target.getBoundingClientRect();for(const parent of node.parents){const source=graph.querySelector(`[data-node="${parent}"]`);if(source.hidden)continue;const s=source.getBoundingClientRect();
    const path=document.createElementNS(svg.namespaceURI,'path');const x=s.left+s.width/2-origin.left,y=s.top-origin.top,tx=t.left+t.width/2-origin.left,ty=t.bottom-origin.top;
    path.setAttribute('d',`M ${x} ${y} C ${x} ${(y+ty)/2}, ${tx} ${(y+ty)/2}, ${tx} ${ty}`);svg.append(path);
   }
  }graph.prepend(svg);
 }
 const matrices={ranking:[[true,true,true],[false,true,true],[false,false,true]],cycle:[[true,true,false],[false,true,true],[true,false,true]],incomparable:[[true,false,false],[false,true,false],[false,false,true]]};
 let matrix=matrices.ranking.map(row=>[...row]);
 const editor=document.querySelector('#preference-matrix');
 for(let a=0;a<3;a++)for(let b=0;b<3;b++){const label=document.createElement('label');const input=document.createElement('input');input.type='checkbox';input.checked=matrix[a][b];label.append(input,document.createTextNode(`${'ABC'[a]} ≽ ${'ABC'[b]}`));editor.append(label);input.addEventListener('change',()=>{matrix[a][b]=input.checked;renderModel();});}
 function renderModel(){
  const result=analyze(matrix),out=document.querySelector('#model-result');out.replaceChildren();
  const add=(text)=>{const p=document.createElement('p');p.textContent=text;out.append(p);};
  add(result.transitive?'Transitivity: satisfied':'Transitivity: violated');add(result.complete?'Completeness: satisfied':'Completeness: violated');
  if(result.witness){const [a,b,c]=result.witness;add(`${'ABC'[a]} ≽ ${'ABC'[b]} · ${'ABC'[b]} ≽ ${'ABC'[c]} · ¬(${'ABC'[a]} ≽ ${'ABC'[c]})`);}
  add(result.cycle?'A strict three-option cycle exists.':'No strict three-option cycle in this example.');
  const greatest=document.createElement('p');const label=document.createElement('span');label.textContent='Greatest options: ';greatest.append(label,document.createTextNode(result.greatest.length?result.greatest.map(i=>'ABC'[i]).join(', '):'—'));out.append(greatest);
  const valid=(!selected().includes('transitivity')||result.transitive)&&(!selected().includes('completeness')||result.complete)&&(!selected().includes('cycle')||result.cycle);
  add(valid?'This example satisfies the selected axioms.':'This example violates a selected axiom; it is not a model of that theory.');PhiloI18n.apply();
 }
 document.querySelectorAll('[id^="pref-"]').forEach(input=>input.addEventListener('change',render));
 document.querySelectorAll('[data-model]').forEach(button=>button.addEventListener('click',()=>{matrix=matrices[button.dataset.model].map(row=>[...row]);editor.querySelectorAll('input').forEach((box,i)=>box.checked=matrix[Math.floor(i/3)][i%3]);renderModel();}));
 document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>requestAnimationFrame(drawEdges)));
 window.addEventListener('resize',drawEdges);render();
})(globalThis);
