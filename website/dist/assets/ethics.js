(async()=>{
 const container=document.querySelector('#ethics-items');if(!container)return;
 const t=s=>PhiloI18n.t(s),add=(p,tag,text)=>{const e=document.createElement(tag);e.textContent=text;p.append(e);return e;};
 let corpus;try{const response=await fetch('/data/ethics.json');if(!response.ok)throw Error();corpus=await response.json();}catch{container.textContent=t('The library could not be loaded. Reload to try again.');return;}
 const part=document.querySelector('#ethics-part'),kind=document.querySelector('#ethics-kind'),search=document.querySelector('#ethics-search'),status=document.querySelector('#ethics-status');
 let page=0;const pageSize=24;const requested=new URL(location.href).searchParams.get('item');if(requested){const item=corpus.items.find(i=>i.id===requested);if(item){part.value=item.part;search.value=item.id;}}
 function render(){
  container.replaceChildren();const fr=PhiloI18n.language==='fr';
  const items=corpus.items.filter(i=>(!fr||i.translations?.fr)&&(!part.value||i.part===Number(part.value))&&(!kind.value||i.kind===kind.value)&&(!status.value||i.status===status.value)).filter(i=>`${i.id} ${fr?i.translations.fr.statement:i.statement} ${i.reference}`.toLowerCase().includes(search.value.trim().toLowerCase()));
  page=Math.min(page,Math.max(0,Math.ceil(items.length/pageSize)-1));document.querySelector('#ethics-count').textContent=items.length;document.querySelector('#ethics-page').textContent=`${page+1} / ${Math.max(1,Math.ceil(items.length/pageSize))}`;
  document.querySelector('#ethics-prev').disabled=page===0;document.querySelector('#ethics-next').disabled=(page+1)*pageSize>=items.length;
  for(const item of items.slice(page*pageSize,(page+1)*pageSize)){
   const card=add(container,'article','');card.className='ethics-card';card.dataset.localised='true';
   const label=add(card,'div',`${item.id} · ${t(item.kind)}`);label.className='eyebrow';
   const badge=add(card,'span',t(item.status==='lean-checked'?'Lean-checked reconstruction':item.status==='encoded-premise'?'Encoded starting point · explicit interpretation':'Source text · not yet formalized'));badge.className='proof-status';
   add(card,'h3',fr?item.translations.fr.statement:item.statement);
   const cite=add(card,'a',fr?`Éthique ${item.part} · ${t(item.kind)} ${item.number||''}`:item.reference);cite.href=item.source;cite.target='_blank';cite.rel='noopener';
   if(item.formalScope){add(card,'p',t(item.formalScope));const proof=add(card,'a',t('Inspect the Lean formalization ↗'));proof.href='https://github.com/dufeteller/philoforge/blob/main/logic/PhiloForge/Spinoza.lean';}
   const paragraphs=fr?item.translations.fr.paragraphs:item.paragraphs;
   if(paragraphs?.length){const details=add(card,'details','');add(details,'summary',t('Read the demonstration and commentary'));paragraphs.forEach(text=>add(details,'p',text));}
   else if(fr&&item.paragraphs.length)add(card,'p',t('The English demonstration is available in the linked source. Its French translation has not been added.'));
   const permalink=add(card,'a',t('Link to this entry ↗'));permalink.href=`?item=${encodeURIComponent(item.id)}&lang=${PhiloI18n.language}`;permalink.className='entry-link';
   if(['E1-D3','E1-D5','E1-A4','E1-A5','E3-D1','E3-D2'].includes(item.id)){const select=add(card,'a',t('Explore the verified deductions ↗'));select.href=`/philoforge/?lang=${PhiloI18n.language}#spinoza-title`;}
  }
  if(!items.length)add(container,'p',t('No entries match these filters. In French mode, entries without a French translation are hidden.'));
 }
 for(const control of [part,kind,search,status])control.addEventListener('input',()=>{page=0;render();});
 document.querySelector('#ethics-prev').onclick=()=>{page--;render();container.scrollIntoView({block:'start'});};document.querySelector('#ethics-next').onclick=()=>{page++;render();container.scrollIntoView({block:'start'});};
 document.querySelectorAll('[data-language]').forEach(b=>b.addEventListener('click',()=>{page=0;render();}));render();
})();
