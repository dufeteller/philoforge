(()=>{
 const viewport=document.querySelector('#map-viewport'),world=document.querySelector('#map-world'),detail=document.querySelector('#node-detail');
 const ids=(new URL(location.href).searchParams.get('axioms')||'').split(',');const data=SpinozaTheory.derive(ids);
 const message=document.querySelector('#map-message');
 if(data.conflict){message.textContent='This selection has a known contradiction. Return to axiom selection to inspect its proof.';viewport.hidden=true;PhiloI18n.apply();return;}
 if(!data.roots.length){message.textContent='No starting points selected. Return to axiom selection.';viewport.hidden=true;PhiloI18n.apply();return;}
 const nodes=[...data.roots.map(n=>({...n,level:0})),...data.results];const positions=new Map();
 const maxLevel=Math.max(0,...nodes.map(n=>n.level));
 const levels=Array.from({length:maxLevel+1},(_,i)=>i);
 const width=Math.max(900,Math.max(...levels.map(l=>nodes.filter(n=>n.level===l).length))*310);
 const height=280+maxLevel*270;
 world.style.width=width+'px';world.style.height=height+'px';
 for(let level=0;level<=maxLevel;level++){const row=nodes.filter(n=>n.level===level);row.forEach((n,i)=>positions.set(n.id,{x:(width-row.length*290)/2+i*290,y:height-230-level*270}));}
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.classList.add('map-lines');svg.setAttribute('viewBox',`0 0 ${width} ${height}`);svg.setAttribute('aria-hidden','true');
 const colors=['#3d7056','#986036','#506f9b'];
 const outgoing=new Map();for(const n of data.results)for(const parent of n.parents){if(!outgoing.has(parent))outgoing.set(parent,[]);outgoing.get(parent).push(n.id);}
 for(const [index,n] of data.results.entries()){
  const t=positions.get(n.id),tx=t.x+125,ty=t.y+185,jy=ty+30+(index%3)*14;
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
 for(const n of nodes){const pos=positions.get(n.id);const card=add(world,'button','');card.className='map-node';card.dataset.node=n.id;card.style.left=pos.x+'px';card.style.top=pos.y+'px';add(card,'span',n.type||'Consequence').className='eyebrow';add(card,'strong',n.title);add(card,'span',n.reference);card.addEventListener('click',()=>{highlight(n.id);detail.replaceChildren();detail.hidden=false;const close=add(detail,'button','Close');close.className='secondary';close.addEventListener('click',()=>{detail.hidden=true;highlight(null);card.focus();});add(detail,'h2',n.title);add(detail,'p',n.text);const cite=add(detail,'a',n.reference);cite.href=n.source||'https://www.gutenberg.org/cache/epub/919/pg919.html';cite.target='_blank';cite.rel='noopener';if(n.steps){add(detail,'p','Conditional reconstruction · Historical fidelity awaits review');const compare=add(detail,'a','Compare the source and the formalization ↗');compare.href='/philoforge/review/?item='+encodeURIComponent(n.id)+'&lang='+PhiloI18n.language;const list=add(detail,'ol','');n.steps.forEach(s=>add(list,'li',s));}if(n.mapping)add(detail,'p',n.mapping);const proof=add(detail,'a','Inspect the Lean formalization ↗');proof.href=n.proofSource||'https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/Spinoza.lean';PhiloI18n.apply();close.focus();});}
 function highlight(id){
  const related=new Set();function visit(nodeId){if(related.has(nodeId))return;related.add(nodeId);const node=nodes.find(n=>n.id===nodeId);for(const parent of node?.parents||[])visit(parent);}
  if(id)visit(id);
  world.querySelectorAll('[data-node]').forEach(card=>{card.classList.toggle('map-dimmed',!!id&&!related.has(card.dataset.node));card.classList.toggle('map-selected',card.dataset.node===id);});
  svg.querySelectorAll('g').forEach(group=>group.classList.toggle('map-dimmed',!!id&&!related.has(group.dataset.result)));
 }
 let scale=1,x=0,y=0;
 const minimumScale=()=>Math.min(.15,Math.max(1,viewport.clientWidth-50)/width,Math.max(1,viewport.clientHeight-50)/height);
 const limit=s=>Math.max(minimumScale(),Math.min(3,s));
 function apply(){world.style.transform=`translate(${x}px,${y}px) scale(${scale})`;document.querySelector('#zoom-value').textContent=Math.round(scale*100)+'%';}
 function zoom(factor,cx=viewport.clientWidth/2,cy=viewport.clientHeight/2){const next=limit(scale*factor);x=cx-(cx-x)*next/scale;y=cy-(cy-y)*next/scale;scale=next;apply();}
 function fit(){highlight(null);scale=limit(Math.min((viewport.clientWidth-50)/width,(viewport.clientHeight-50)/height));x=(viewport.clientWidth-width*scale)/2;y=(viewport.clientHeight-height*scale)/2;apply();}
 document.querySelector('#zoom-in').onclick=()=>zoom(1.25);document.querySelector('#zoom-out').onclick=()=>zoom(.8);document.querySelector('#fit-map').onclick=fit;document.querySelector('#reset-map').onclick=()=>{scale=1;x=(viewport.clientWidth-width)/2;y=0;apply();};
 viewport.addEventListener('wheel',e=>{e.preventDefault();const rect=viewport.getBoundingClientRect();zoom(Math.exp(-e.deltaY*.002),e.clientX-rect.left,e.clientY-rect.top);},{passive:false});
 // Delay capture until a real drag so a stationary press still clicks the node.
 const pointers=new Map();const dragThreshold=6;let pinch=null,dragging=false,suppressClick=false;
 function beginDrag(){
  dragging=true;suppressClick=true;viewport.classList.add('map-dragging');
  viewport.focus({preventScroll:true});
  for(const id of pointers.keys())viewport.setPointerCapture(id);
 }
 viewport.addEventListener('pointerdown',e=>{
  if(e.button!==0)return;
  if(!pointers.size)suppressClick=false;
  pointers.set(e.pointerId,{x:e.clientX,y:e.clientY,startX:e.clientX,startY:e.clientY});
  if(!e.target.closest('.map-node'))viewport.focus({preventScroll:true});
  if(pointers.size===2){
   beginDrag();const [a,b]=[...pointers.values()];pinch=Math.hypot(a.x-b.x,a.y-b.y);
  }
 });
 viewport.addEventListener('pointermove',e=>{
  const pointer=pointers.get(e.pointerId);if(!pointer)return;
  const previousX=pointer.x,previousY=pointer.y;pointer.x=e.clientX;pointer.y=e.clientY;
  if(pointers.size===1){
   const wasDragging=dragging;
   if(!dragging&&Math.hypot(pointer.x-pointer.startX,pointer.y-pointer.startY)<dragThreshold)return;
   if(!dragging)beginDrag();
   x+=pointer.x-(wasDragging?previousX:pointer.startX);
   y+=pointer.y-(wasDragging?previousY:pointer.startY);apply();
  }else if(pointers.size===2){
   const [a,b]=[...pointers.values()],distance=Math.hypot(a.x-b.x,a.y-b.y),rect=viewport.getBoundingClientRect();
   if(pinch>0)zoom(distance/pinch,(a.x+b.x)/2-rect.left,(a.y+b.y)/2-rect.top);pinch=distance;
  }
  e.preventDefault();
 });
 function endPointer(e){
  // Ignore capture transferred from a touched node to the viewport.
  if(e.type==='lostpointercapture'&&e.target!==viewport)return;
  if(!pointers.delete(e.pointerId))return;
  pinch=null;
  if(!pointers.size){dragging=false;viewport.classList.remove('map-dragging');}
 }
 for(const event of ['pointerup','pointercancel','lostpointercapture'])viewport.addEventListener(event,endPointer);
 viewport.addEventListener('pointerleave',e=>{
  // A press that leaves before reaching the threshold must not stay active.
  if(!viewport.hasPointerCapture(e.pointerId))endPointer(e);
 });
 viewport.addEventListener('click',e=>{
  // Consume the synthetic click following a pan or pinch, but keep keyboard activation.
  if(suppressClick&&e.detail!==0){e.preventDefault();e.stopImmediatePropagation();suppressClick=false;return;}
  if(!e.target.closest('.map-node')){detail.hidden=true;highlight(null);viewport.focus({preventScroll:true});}
 },true);
 viewport.addEventListener('keydown',e=>{if(e.target!==viewport)return;const moves={ArrowLeft:[40,0],ArrowRight:[-40,0],ArrowUp:[0,40],ArrowDown:[0,-40]};if(moves[e.key]){e.preventDefault();x+=moves[e.key][0];y+=moves[e.key][1];apply();}else if(['+','=','-','0'].includes(e.key)){e.preventDefault();e.key==='0'?fit():zoom(e.key==='-'?.8:1.25);}});
 document.querySelectorAll('[data-language]').forEach(b=>b.addEventListener('click',()=>requestAnimationFrame(apply)));
 window.addEventListener('resize',fit);PhiloI18n.apply();requestAnimationFrame(fit);
})();
