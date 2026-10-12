(function (root) {
  'use strict';
  const KEY = 'philoforge.ai-justice.v1';
  const defaults = { output: 200, labor: 5, owners: 10, sharing: 0, collective: 100 };
  function derive(data, selection) {
    const selected = new Set(selection);
    return data.results.map(result => ({ ...result,
      missing: result.requires.filter(id => !selected.has(id)),
      available: result.requires.every(id => selected.has(id))
    }));
  }
  function cleanSelection(data, values) {
    return Array.isArray(values) ? data.premises.map(p => p.id).filter(id => values.includes(id)) : [...data.defaultSelection];
  }
  function conflicts(data, selection) {
    const selected=new Set(selection);
    return data.conflicts.filter(conflict=>conflict.requires.every(id=>selected.has(id)));
  }
  function simulate(input = {}) {
    const bounds = {output:[50,400],labor:[0,100],owners:[1,100],sharing:[0,100],collective:[0,150]};
    const p = {};
    for (const key of Object.keys(defaults)) {
      const value = Number(input[key] ?? defaults[key]);
      if (!Number.isFinite(value) || value < bounds[key][0] || value > bounds[key][1]) throw new RangeError(key);
      p[key] = value;
    }
    if (!Number.isInteger(p.owners)) throw new RangeError('owners');
    const n = 100, needs = 0.75, lambda = p.labor / 100, tau = p.sharing / 100;
    const profits = (1 - lambda) * p.output;
    const labor = lambda * p.output / n;
    const collectiveOutput = p.output * p.collective / 100;
    const common = collectiveOutput / n;
    const groups = [
      {id:'nonowners',count:n-p.owners,before:0.8,after:labor+tau*profits/n,common},
      {id:'owners',count:p.owners,before:0.8+20/p.owners,after:labor+(1-tau)*profits/p.owners+tau*profits/n,common}
    ].filter(group => group.count > 0);
    const below = (a,b) => a < b - 1e-9;
    const count = predicate => groups.reduce((sum,g) => sum + (predicate(g) ? g.count : 0),0);
    return {...p,n,needs,groups,collectiveOutput,
      losers:count(g=>below(g.after,g.before)),deprived:count(g=>below(g.after,needs)),
      commonDeprived:below(common,needs)?n:0,improved:count(g=>below(g.after,common)),
      score:Math.min(...groups.map(g=>g.after/needs)),commonScore:common/needs,
      threshold:lambda+tau*(1-lambda)
    };
  }
  const api = { derive, cleanSelection, conflicts, simulate, defaults };
  root.AIJustice = api;
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (typeof document === 'undefined') return;
  const t = text => root.PhiloI18n.t(text);
  const el = (tag, text, className) => {
    const node = document.createElement(tag);
    if (text !== undefined) node.textContent = text;
    if (className) node.className = className;
    return node;
  };
  let data, selection;
  const openProofs = new Set();
  function save() { try { localStorage.setItem(KEY, JSON.stringify([...selection])); } catch {} }
  function premiseList() {
    for (const kind of ['definition','principle','hypothesis']) {
      const container = document.getElementById({definition:'justice-definitions',principle:'justice-principles',hypothesis:'justice-hypotheses'}[kind]);
      container.replaceChildren();
      for (const p of data.premises.filter(p=>p.kind===kind)) {
        const label = el('label',undefined,'justice-premise');
        const checkbox = el('input'); checkbox.type='checkbox'; checkbox.value=p.id;
        checkbox.checked=selection.has(p.id); checkbox.dataset.premise=p.id;
        checkbox.addEventListener('change',()=>{
          if(checkbox.checked) selection.add(p.id); else selection.delete(p.id);
          save(); renderResults();
        });
        const body=el('span'); body.append(el('span',p.id,'justice-id'),el('strong',t(p.title)),el('span',t(p.text),'justice-premise-text'));
        label.append(checkbox,body);container.append(label);
      }
    }
  }
  function renderFoundation() {
    const text=document.getElementById('justice-foundation-text');text.replaceChildren();
    for(const section of data.foundation){
      const article=el('article');article.id='foundation-'+section.id;
      article.append(el('h3',t(section.title)),el('p',t(section.text)));text.append(article);
    }
    const coverage=document.getElementById('justice-coverage');coverage.replaceChildren();
    for(const item of data.coverage){
      const article=el('article');article.append(el('span',t(item.status),'justice-badge'),el('h3',t(item.title)),el('p',t(item.text)));
      const links=el('div',undefined,'justice-coverage-links');
      for(const id of item.results){const result=data.results.find(r=>r.id===id);const link=el('a',t(result.title));link.href='#'+id;links.append(link);}
      article.append(links);coverage.append(article);
    }
  }
  function renderResults() {
    const incompatible=conflicts(data,selection);
    const results=incompatible.length?incompatible.map(r=>({...r,available:true})):derive(data,selection);
    const count=results.filter(r=>r.available).length;
    document.getElementById('justice-count').textContent=incompatible.length?t('Resolve the conflict before using these premises together.'):`${count} / ${results.length} · ${t('Results available under the selected premises')}`;
    const list=document.getElementById('justice-results');list.replaceChildren();
    for (const result of results) {
      const article=el('article',undefined,'justice-result'+(result.available?'':' is-conditional')+(incompatible.length?' justice-conflict':''));
      article.id=result.id;
      const top=el('div',undefined,'justice-result-top');
      top.append(el('span',t(incompatible.length?'Incompatible premises':result.available?'Premises selected':'Additional premises required'),'justice-badge'));
      const anchor=el('a','#','justice-anchor');anchor.href='#'+result.id;anchor.setAttribute('aria-label',t('Link to this result'));top.append(anchor);
      article.append(top,el('h3',t(result.title)),el('p',t(result.text)),el('div',result.formula,'justice-formula'));
      const deps=el('p',undefined,'justice-dependencies');
      deps.append(document.createTextNode(t(result.requires.length?'Premises:':'Definitions only')));
      for (const id of result.requires) {
        const span=el('span',id,selection.has(id)?'is-selected':'is-missing');
        span.title=t(data.premises.find(p=>p.id===id).title);deps.append(span);
      }
      article.append(deps);
      if(result.parents.length){
        const parents=el('p',undefined,'justice-dependencies');parents.append(document.createTextNode(t('Uses:')));
        for(const id of result.parents){const a=el('a',t(data.results.find(r=>r.id===id).title));a.href='#'+id;parents.append(a);}
        article.append(parents);
      }
      const details=el('details');details.open=openProofs.has(result.id);
      details.addEventListener('toggle',()=>{if(details.open)openProofs.add(result.id);else openProofs.delete(result.id);});
      details.append(el('summary',t('Demonstration and exact Lean proof')));
      const steps=el('ol');result.steps.forEach(step=>steps.append(el('li',t(step))));details.append(steps);
      details.append(el('p',t(result.limit),'justice-limit'));
      const code=el('pre');code.append(el('code',result.proof.code));details.append(code);
      const source=el('a',t('Inspect this theorem on GitHub'),'text-link');source.href=result.proof.url;details.append(source);
      article.append(details);list.append(article);
    }
  }
  function renderSimulation(){
    const values=Object.fromEntries(Object.keys(defaults).map(key=>[key,document.getElementById('sim-'+key).value]));
    const result=simulate(values);
    const format=new Intl.NumberFormat(root.PhiloI18n.language,{maximumFractionDigits:3});
    for(const key of Object.keys(defaults))document.getElementById('sim-'+key+'-value').textContent=format.format(result[key])+(key==='output'||key==='owners'?'':' %');
    const stats=document.getElementById('justice-sim-stats');stats.replaceChildren();
    for(const [value,label] of [[result.losers,'People worse off than before'],[result.deprived,'People below essential needs'],[result.improved,'People gaining under collective allocation']]){
      const card=el('div');card.append(el('strong',`${value} / 100`),el('span',t(label)));stats.append(card);
    }
    const body=document.getElementById('justice-sim-body');body.replaceChildren();
    for(const group of result.groups){
      const row=el('tr');const name=el('th',t(group.id==='owners'?'Capital owners':'People without capital')+` (${group.count})`);name.scope='row';row.append(name);
      for(const value of [group.before,group.after,group.common])row.append(el('td',format.format(value)));
      body.append(row);
    }
    const total=el('tr');const name=el('th',t('Total output'));name.scope='row';total.append(name);
    for(const value of [100,result.output,result.collectiveOutput])total.append(el('td',format.format(value)));body.append(total);
    document.getElementById('justice-sim-score').textContent=`Q(P) = ${format.format(result.score)} · Q(C) = ${format.format(result.commonScore)} · ${t('Essential-needs threshold:')} ${format.format(result.needs)}`;
    document.getElementById('justice-sim-condition').textContent=`${t('Nonowner improvement condition:')} Yᶜ / Yᴾ > λ + τ(1 − λ) = ${format.format(result.threshold)}`;
  }
  function refresh(){if(!data)return;renderFoundation();premiseList();renderResults();renderSimulation();}
  for(const button of document.querySelectorAll('[data-language]'))button.addEventListener('click',refresh);
  for(const key of Object.keys(defaults))document.getElementById('sim-'+key).addEventListener('input',renderSimulation);
  document.getElementById('justice-select-core').addEventListener('click',()=>{if(!data)return;selection=new Set(data.defaultSelection);save();refresh();});
  document.getElementById('justice-select-all').addEventListener('click',()=>{if(!data)return;selection=new Set(data.premises.filter(p=>p.id!=='H9').map(p=>p.id));save();refresh();});
  document.getElementById('justice-clear').addEventListener('click',()=>{if(!data)return;selection=new Set();save();refresh();});
  document.getElementById('justice-reset-sim').addEventListener('click',()=>{
    for(const [key,value] of Object.entries(defaults))document.getElementById('sim-'+key).value=value;
    renderSimulation();
  });
  fetch('/data/ai-justice.json').then(response=>{if(!response.ok)throw new Error('load');return response.json();}).then(value=>{
    data=value;
    let saved;try{saved=JSON.parse(localStorage.getItem(KEY));}catch{}
    selection=new Set(cleanSelection(data,saved));
    document.getElementById('justice-loading').hidden=true;
    document.getElementById('justice-workshop').hidden=false;
    refresh();
    if(location.hash){const target=document.getElementById(location.hash.slice(1));if(target)target.scrollIntoView();}
  }).catch(()=>{const message=document.getElementById('justice-loading');message.dataset.localised='';message.textContent=t('The theory could not be loaded. Reload the page to try again.');});
})(globalThis);
