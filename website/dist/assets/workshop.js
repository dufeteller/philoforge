(async function(root){
 'use strict';
 const library=document.getElementById('theory-library');if(!library)return;
 const api=root.PhiloTheories,t=text=>root.PhiloI18n.t(text);
 const add=(parent,tag,text,cls)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=t(text);if(cls)e.className=cls;parent.append(e);return e;};
 const registry=await api.load().catch(()=>null);
 if(!registry){document.getElementById('workshop-loading').textContent=t('The theories could not be loaded. Reload the page to try again.');return;}
 document.getElementById('workshop-loading').hidden=true;
 let storage;try{storage=localStorage;}catch{storage={getItem:()=>null,setItem:()=>{}};}
 const selected=new Set(api.restore(registry,storage,new URL(location.href).searchParams));
 const groups=[],inputs=[];
 function group(parent,title,ids,key,open=false){
  const section=add(parent,'section',undefined,'selection-group');section.dataset.theoryGroup=key;
  const row=add(section,'div',undefined,'selection-group-row');
  const toggle=add(row,'button',undefined,'selection-toggle');toggle.type='button';toggle.id='toggle-'+key;section.setAttribute('aria-labelledby',toggle.id);
  const arrow=add(toggle,'span');arrow.textContent=open?'▾':'▸';arrow.setAttribute('aria-hidden','true');arrow.dataset.localised='';
  add(toggle,'span',title);
  const body=add(section,'div',undefined,'selection-children');body.id='selection-'+key;body.hidden=!open;
  toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-controls',body.id);
  toggle.addEventListener('click',()=>{body.hidden=!body.hidden;toggle.setAttribute('aria-expanded',String(!body.hidden));arrow.textContent=body.hidden?'▸':'▾';});
  const checkbox=add(row,'input');checkbox.type='checkbox';checkbox.dataset.selectionGroup=key;checkbox.setAttribute('aria-label',t('Select all: '+title));
  checkbox.addEventListener('change',()=>{for(const id of ids)checkbox.checked?selected.add(id):selected.delete(id);render();});
  groups.push({checkbox,ids,title});return body;
 }
 function entryCard(parent,entry){
  const card=add(parent,'article',undefined,'source-axiom compact-starting-point');
  const label=add(card,'label');add(label,'strong',entry.title);
  const input=add(label,'input');input.type='checkbox';input.dataset.premise=entry.id;inputs.push({input,id:entry.id});
  const details=add(card,'details');add(details,'summary',entry.theory==='spinoza'?'Source and formalization':'Statement and formalization');
  add(details,'p',entry.text);
  if(entry.original)add(details,'blockquote',entry.original);
  if(entry.mapping)add(details,'p',entry.mapping);
  if(entry.source){const source=add(details,'a',entry.reference,'source-citation');source.href=entry.source;}
  input.addEventListener('change',()=>{input.checked?selected.add(entry.id):selected.delete(entry.id);render();});
 }
 for(const theory of registry.theories){
  const body=group(library,theory.title,theory.ids,theory.id,true);
  const intro=add(body,'div',undefined,'theory-description');add(intro,'p',theory.description);
  const link=add(intro,'a',theory.link,'text-link');link.href=theory.href;
  for(const [title,type]of theory.groups){
   const members=registry.entries.filter(e=>e.theory===theory.id&&e.type===type&&!e.test);
   const subgroup=group(body,title,members.map(e=>e.id),theory.id+'-'+type.toLowerCase().replaceAll(' ','-'));
   members.forEach(entry=>entryCard(subgroup,entry));
  }
 }
 const tests=document.getElementById('workshop-tests');
 registry.entries.filter(e=>e.test).forEach(e=>entryCard(tests,e));
 function render(){
  inputs.forEach(({input,id})=>input.checked=selected.has(id));
  for(const {checkbox,ids}of groups){const count=ids.filter(id=>selected.has(id)).length;checkbox.checked=count===ids.length;checkbox.indeterminate=count>0&&count<ids.length;}
  const data=api.derive(registry,[...selected]);
  const summary=document.getElementById('universe-summary');summary.replaceChildren();
  for(const theory of registry.theories){
   const count=theory.ids.filter(id=>selected.has(id)).length;
   const item=add(summary,'span');item.textContent=t(theory.title)+': '+count+' / '+theory.ids.length;
  }
  const count=add(summary,'span');count.textContent=data.results.length+' '+t('available results');
  const conflicts=document.getElementById('universe-conflicts');conflicts.replaceChildren();conflicts.hidden=!data.conflicts.length;
  for(const conflict of data.conflicts){
   const box=add(conflicts,'article',undefined,'contradiction-proof');add(box,'h3',conflict.title);add(box,'p',conflict.text);
   const steps=add(box,'ol');conflict.steps.forEach(step=>add(steps,'li',step));
   if(conflict.proof){const code=add(box,'pre');code.dataset.localised='';code.textContent=conflict.proof.code;}
   const proof=add(box,'a','Lean-checked contradiction proof ↗');proof.href=conflict.proofSource;
   const reset=add(box,'button','Remove the test assumption','secondary');reset.type='button';
   reset.addEventListener('click',()=>{for(const id of conflict.requires)if(registry.nodes.get(id)?.test)selected.delete(id);render();});
  }
  document.getElementById('universe-empty').hidden=data.roots.length>0;
  const generate=document.getElementById('generate-map');generate.disabled=!data.roots.length||data.conflicts.length>0;
  const link=document.getElementById('map-link');link.href=api.mapURL(registry,[...selected],location.origin,root.PhiloI18n.language);link.hidden=!data.roots.length||data.conflicts.length>0;
  try{storage.setItem(api.KEY,JSON.stringify([...selected]));}catch{}
  const current=new URL(location.href);
  if(current.searchParams.has('premises')||current.searchParams.has('axioms')){current.searchParams.delete('axioms');current.searchParams.set('premises',api.sanitize(registry,[...selected]).join(','));current.searchParams.set('lang',root.PhiloI18n.language);history.replaceState(null,'',current);}
  root.PhiloI18n.apply();
 }
 document.getElementById('select-theories').addEventListener('click',()=>{selected.clear();registry.theories.forEach(theory=>theory.ids.forEach(id=>selected.add(id)));render();});
 document.getElementById('clear-theories').addEventListener('click',()=>{selected.clear();render();});
 document.getElementById('generate-map').addEventListener('click',()=>{
  const data=api.derive(registry,[...selected]);if(!data.roots.length||data.conflicts.length)return;
  const opened=window.open(api.mapURL(registry,[...selected],location.origin,root.PhiloI18n.language),'_blank');if(opened)opened.opener=null;
 });
 document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',render));
 render();
})(globalThis);
