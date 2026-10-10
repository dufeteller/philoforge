(function(root){
 const translations=root.PhiloLocales.fr;
 const reverse=Object.fromEntries(Object.entries(translations).map(([en,fr])=>[fr,en]));
 const neutral=new Set(['EN','FR','Romain Dufetelle','Romain Dufetelle — Journal','PhiloForge — Romain Dufetelle','Journal','PhiloForge','GitHub','Collaboration','Language / Langue','English','Français']);
 function canDisplay(text,language){
  if(language!=='fr')return true;
  const source=reverse[text.trim()]||text.trim();
  if(!source||neutral.has(source)||/^[\d\s.·↓↗∴+={}₁₂₃ABC,T≽≻¬()—]+$/.test(source)||/^[A-Z-]+@\d+$/.test(source))return true;
  if(/^(\d+) (?:consequences|conséquences) · (\d+) (?:explicit conflicts|conflits explicites)$/.test(source))return true;
  if(/^(Depends on: |Dépend de : )/.test(source))return source.replace(/^(Depends on: |Dépend de : )/,'').split(' + ').every(part=>canDisplay(part,language));
  return typeof translations[source]==='string'&&translations[source].trim().length>0;
 }
 function translate(text,language){
  if(!text.trim())return text;
  if(!canDisplay(text,language))return '';
  const leading=text.match(/^\s*/)[0],trailing=text.match(/\s*$/)[0];
  let source=text.trim();source=reverse[source]||source;
  const counts=source.match(/^(\d+) (?:consequences|conséquences) · (\d+) (?:explicit conflicts|conflits explicites)$/);
  if(counts)return language==='fr'?`${counts[1]} conséquences · ${counts[2]} conflits explicites`:`${counts[1]} consequences · ${counts[2]} explicit conflicts`;
  if(source.startsWith('Depends on: ')||source.startsWith('Dépend de : ')){
   const parts=source.replace(/^(Depends on: |Dépend de : )/,'').split(' + ');
   return (language==='fr'?'Dépend de : ':'Depends on: ')+parts.map(part=>translate(part,language)).join(' + ');
  }
  return leading+(language==='fr'?(translations[source]||source):source)+trailing;
 }
 let language='en';
 if(typeof document!=='undefined'){
  try{const preferred=new URL(location.href).searchParams.get('lang')||localStorage.getItem('dufetelle.language');if(preferred==='fr')language='fr';}catch{}
 }
 function apply(){
  if(typeof document==='undefined')return;
  document.documentElement.lang=language;
  document.querySelectorAll('[data-missing-translation]').forEach(element=>{element.hidden=false;delete element.dataset.missingTranslation;});
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  let node;while((node=walker.nextNode())){
   if(node.parentElement.closest('script,style,input,textarea,[data-language-switch]'))continue;
   if(!canDisplay(node.nodeValue,language)){
    const unit=node.parentElement.closest('.axiom,.deduction,.proof-node,.steps article,.tags span,#analysis-questions li,#selected li')||node.parentElement;
    if(!unit.hidden){unit.hidden=true;unit.dataset.missingTranslation='fr';}
    continue;
   }
   const next=translate(node.nodeValue,language);if(next!==node.nodeValue)node.nodeValue=next;
  }
  for(const element of document.querySelectorAll('[aria-label],[title],meta[name="description"]')){
   for(const attr of ['aria-label','title','content'])if(element.hasAttribute(attr))element.setAttribute(attr,translate(element.getAttribute(attr),language));
  }
  document.title=translate(document.title,language);
  for(const button of document.querySelectorAll('[data-language]'))button.setAttribute('aria-pressed',String(button.dataset.language===language));
  const name=document.querySelector('#universe-name');
  if(name&&['My first universe','Mon premier univers'].includes(name.value))name.value=translate(name.value,language);
 }
 function setLanguage(next){
  language=next==='fr'?'fr':'en';try{localStorage.setItem('dufetelle.language',language);}catch{}
  apply();
 }
 root.PhiloI18n={translate,canDisplay,apply,setLanguage,get language(){return language;},t:text=>translate(text,language)};
 if(typeof module==='object'&&module.exports)module.exports=root.PhiloI18n;
 if(typeof document!=='undefined'){
  document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.language)));
  apply();
 }
})(globalThis);
