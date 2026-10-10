(()=>{
 const viewport=document.querySelector('#map-viewport'),world=document.querySelector('#map-world'),detail=document.querySelector('#node-detail');
 const ids=(new URL(location.href).searchParams.get('axioms')||'').split(',');const data=SpinozaTheory.derive(ids);
 const message=document.querySelector('#map-message');
 if(data.conflict){message.textContent='This selection has a known contradiction. Return to axiom selection to inspect its proof.';viewport.hidden=true;PhiloI18n.apply();return;}
 if(!data.roots.length){message.textContent='No starting points selected. Return to axiom selection.';viewport.hidden=true;PhiloI18n.apply();return;}
 const nodes=[...data.roots.map(n=>({...n,level:0})),...data.results];const positions=new Map();
 const width=Math.max(900,Math.max(...[0,1,2].map(l=>nodes.filter(n=>n.level===l).length))*310);
 const height=820;
 world.style.width=width+'px';world.style.height=height+'px';
 for(let level=0;level<=2;level++){const row=nodes.filter(n=>n.level===level);row.forEach((n,i)=>positions.set(n.id,{x:(width-row.length*290)/2+i*290,y:height-230-level*270}));}
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('map-lines');svg.setAttribute('viewBox',`0 0 ${width} ${height}`);svg.setAttribute('aria-hidden','true');
 const colors=['#3d7056','#986036','#506f9b'];
 const outgoing=new Map();for(const n of data.results)for(const parent of n.parents){if(!outgoing.has(parent))outgoing.set(parent,[]);outgoing.get(parent).push(n.id);}
 for(const [index,n] of data.results.entries()){
  const t=positions.get(n.id),tx=t.x+125,ty=t.y+185,jy=ty+35;
  const group=document.createElementNS(svg.namespaceURI,'g');group.dataset.result=n.id;group.style.color=colors[index%colors.length];
  function line(d){const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',d);group.append(path);}
  for(const parent of n.parents){const source=positions.get(parent);if(!source)continue;
   const targets=outgoing.get(parent),port=targets.indexOf(n.id),sx=source.x+125+(port-(targets.length-1)/2)*24,sy=source.y;
   const parentNode=nodes.find(node=>node.id===parent);
   if(n.level-parentNode.level>1){const side=20+index*12;line(`M ${sx} ${sy} V ${sy-22} H ${side} V ${jy} H ${tx}`);}
   else line(`M ${sx} ${sy} V ${jy} H ${tx}`);
  }
  line(`M ${tx} ${jy} V ${ty}`);
  const junction=document.createElementNS(svg.namespaceURI,'circle');junction.setAttribute('cx',tx);junction.setAttribute('cy',jy);junction.setAttribute('r',n.parents.length>1?'6':'3');group.append(junction);
  const arrow=document.createElementNS(svg.namespaceURI,'path');arrow.setAttribute('d',`M ${tx-5} ${ty+9} L ${tx} ${ty+2} L ${tx+5} ${ty+9}`);group.append(arrow);svg.append(group);
 }
 world.append(svg);
 const add=(p,tag,text)=>{const el=document.createElement(tag);el.textContent=text;p.append(el);return el;};
 for(const n of nodes){const pos=positions.get(n.id);const card=add(world,'button','');card.className='map-node';card.dataset.node=n.id;card.style.left=pos.x+'px';card.style.top=pos.y+'px';add(card,'span',n.type||'Consequence').className='eyebrow';add(card,'strong',n.title);add(card,'span',n.reference);card.addEventListener('click',()=>{highlight(n.id);detail.replaceChildren();detail.hidden=false;const close=add(detail,'button','Close');close.className='secondary';close.addEventListener('click',()=>{detail.hidden=true;highlight(null);card.focus();});add(detail,'h2',n.title);add(detail,'p',n.text);const cite=add(detail,'a',n.reference);cite.href='https://www.gutenberg.org/cache/epub/919/pg919.html';cite.target='_blank';cite.rel='noopener';if(n.steps){const list=add(detail,'ol','');n.steps.forEach(s=>add(list,'li',s));}if(n.mapping)add(detail,'p',n.mapping);const proof=add(detail,'a','Inspect the Lean formalization ↗');proof.href='https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/Spinoza.lean';PhiloI18n.apply();close.focus();});}
 function highlight(id){
  const related=new Set();function visit(nodeId){if(related.has(nodeId))return;related.add(nodeId);const node=nodes.find(n=>n.id===nodeId);for(const parent of node?.parents||[])visit(parent);}
  if(id)visit(id);
  world.querySelectorAll('[data-node]').forEach(card=>{card.classList.toggle('map-dimmed',!!id&&!related.has(card.dataset.node));card.classList.toggle('map-selected',card.dataset.node===id);});
  svg.querySelectorAll('g').forEach(group=>group.classList.toggle('map-dimmed',!!id&&!related.has(group.dataset.result)));
 }
 let scale=1,x=0,y=0;const limit=s=>Math.max(.15,Math.min(3,s));
 function apply(){world.style.transform=`translate(${x}px,${y}px) scale(${scale})`;document.querySelector('#zoom-value').textContent=Math.round(scale*100)+'%';}
 function zoom(factor,cx=viewport.clientWidth/2,cy=viewport.clientHeight/2){const next=limit(scale*factor);x=cx-(cx-x)*next/scale;y=cy-(cy-y)*next/scale;scale=next;apply();}
 function fit(){highlight(null);scale=limit(Math.min((viewport.clientWidth-50)/width,(viewport.clientHeight-50)/height));x=(viewport.clientWidth-width*scale)/2;y=(viewport.clientHeight-height*scale)/2;apply();}
 document.querySelector('#zoom-in').onclick=()=>zoom(1.25);document.querySelector('#zoom-out').onclick=()=>zoom(.8);document.querySelector('#fit-map').onclick=fit;document.querySelector('#reset-map').onclick=()=>{scale=1;x=(viewport.clientWidth-width)/2;y=0;apply();};
 viewport.addEventListener('wheel',e=>{e.preventDefault();const rect=viewport.getBoundingClientRect();zoom(Math.exp(-e.deltaY*.002),e.clientX-rect.left,e.clientY-rect.top);},{passive:false});
 const pointers=new Map();let pinch=null;
 viewport.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;viewport.focus();viewport.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===2){const [a,b]=[...pointers.values()];pinch=Math.hypot(a.x-b.x,a.y-b.y);} });
 viewport.addEventListener('pointermove',e=>{const prev=pointers.get(e.pointerId);if(!prev)return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});if(pointers.size===1){x+=e.clientX-prev.x;y+=e.clientY-prev.y;apply();}else if(pointers.size===2){const [a,b]=[...pointers.values()],distance=Math.hypot(a.x-b.x,a.y-b.y),rect=viewport.getBoundingClientRect();if(pinch>0)zoom(distance/pinch,(a.x+b.x)/2-rect.left,(a.y+b.y)/2-rect.top);pinch=distance;}});
 for(const event of ['pointerup','pointercancel'])viewport.addEventListener(event,e=>{pointers.delete(e.pointerId);pinch=null;});
 viewport.addEventListener('keydown',e=>{if(e.target!==viewport)return;const moves={ArrowLeft:[40,0],ArrowRight:[-40,0],ArrowUp:[0,40],ArrowDown:[0,-40]};if(moves[e.key]){e.preventDefault();x+=moves[e.key][0];y+=moves[e.key][1];apply();}else if(['+','=','-','0'].includes(e.key)){e.preventDefault();e.key==='0'?fit():zoom(e.key==='-'?.8:1.25);}});
 document.querySelectorAll('[data-language]').forEach(b=>b.addEventListener('click',()=>requestAnimationFrame(apply)));
 window.addEventListener('resize',fit);PhiloI18n.apply();requestAnimationFrame(fit);
})();
