(async()=>{
 const content=document.querySelector('#review-content'),select=document.querySelector('#review-item');
 const t=s=>PhiloI18n.t(s), add=(p,tag,text)=>{const el=document.createElement(tag);el.textContent=text;p.append(el);return el;};
 const link=(p,text,url)=>{const a=add(p,'a',text);a.href=url;return a;};
 let review,sources;
 try{const responses=await Promise.all([fetch('/data/spinoza-review.json'),fetch('/data/spinoza-sources.json')]);if(responses.some(r=>!r.ok))throw Error();[review,sources]=await Promise.all(responses.map(r=>r.json()));}
 catch{content.textContent=t('The review dossier could not be loaded. Reload to try again.');return;}
 const requested=new URL(location.href).searchParams.get('item');let chosen=review.items.some(r=>r.id===requested)?requested:review.items[0].id;
 function render(){
  const fr=PhiloI18n.language==='fr';select.replaceChildren();
  // Respect optional translation: hide an untranslated dossier as one unit.
  const available=review.items.filter(r=>!fr||[r.title,r.formalStatement,r.local,r.limit].every(s=>PhiloI18n.canDisplay(s,'fr'))&&(!r.sourceStatement||r.sourceStatement.fr));
  if(!available.some(r=>r.id===chosen))chosen=available[0]?.id;
  for(const r of available){const option=add(select,'option',r.id+' · '+t(r.title));option.value=r.id;option.selected=r.id===chosen;}
  content.replaceChildren();content.dataset.localised='true';const r=available.find(r=>r.id===chosen);
  if(!r){add(content,'p',t('No translated dossier is available.'));return;}
  add(content,'h2',t(r.title));
  const badges=add(content,'div','');badges.className='review-badges';
  add(badges,'span',t('Formal implication: Lean checked')).className='proof-status';
  add(badges,'span',t('Historical fidelity: independent review pending')).className='proof-status review-pending';
  const columns=add(content,'div','');columns.className='review-columns';
  const source=add(columns,'article','');add(source,'h3',t('Source statement'));
  if(r.sourceStatement)add(source,'blockquote',fr?r.sourceStatement.fr:r.sourceStatement.en);
  else add(source,'p',t('This is an intermediate or definitional consequence, not a separately numbered proposition.'));
  const first=sources.passages[r.sourceIds[0]];add(source,'p',t('Latin reference'));add(source,'blockquote',first.latin).lang='la';
  link(source,first.reference+' · ILIESI–CNR',first.url);
  add(source,'p',t('English: Elwes. French: our translation. The Latin text is shown for comparison.'));
  const formal=add(columns,'article','');add(formal,'h3',t('What the encoded proof establishes'));add(formal,'p',t(r.formalStatement));
  add(formal,'h4',t('Local hypotheses'));add(formal,'p',t(r.local));
  const limit=add(formal,'div','');limit.className='review-limit';add(limit,'h4',t('Interpretation and limits'));add(limit,'p',t(r.limit));
  add(content,'h3',t('Selected premises and definitions'));const list=add(content,'ul','');
  for(const p of r.premises){const li=add(list,'li','');add(li,'strong',p.id+' · '+t(p.title)+' · '+t(p.type));add(li,'p',t(p.interpretation));}
  const lean=add(content,'details','');add(lean,'summary',t('Exact Lean statement'));add(add(lean,'pre',''),'code',r.exactLean);link(lean,t('Inspect the Lean formalization ↗'),r.proofUrl);
  const evidence=add(content,'details','');add(evidence,'summary',t('All cited Latin passages'));
  for(const id of r.sourceIds){const passage=sources.passages[id];link(evidence,id+' · ILIESI–CNR',passage.url);add(evidence,'blockquote',passage.latin).lang='la';}
  link(content,t('Link to this dossier ↗'),`?item=${encodeURIComponent(r.id)}&lang=${PhiloI18n.language}`);
 }
 select.addEventListener('change',()=>{chosen=select.value;render();});
 document.querySelectorAll('[data-language]').forEach(b=>b.addEventListener('click',render));render();
})();
