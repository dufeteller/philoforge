(function(root){
 const translations=root.PhiloLocales.fr;
 const reverse=Object.fromEntries(Object.entries(translations).map(([en,fr])=>[fr,en]));
 function translate(text,language){
  if(!text.trim())return text;
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
  const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
  let node;while((node=walker.nextNode())){
   if(node.parentElement.closest('script,style,input,textarea,[data-language-switch]'))continue;
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
 root.PhiloI18n={translate,apply,setLanguage,get language(){return language;},t:text=>translate(text,language)};
 if(typeof module==='object'&&module.exports)module.exports=root.PhiloI18n;
 if(typeof document!=='undefined'){
  document.querySelectorAll('[data-language]').forEach(button=>button.addEventListener('click',()=>setLanguage(button.dataset.language)));
  apply();
 }
})(globalThis);
