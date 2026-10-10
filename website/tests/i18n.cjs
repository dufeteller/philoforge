const assert=require('node:assert/strict');
const fs=require('node:fs');
require('../dist/assets/locales.js');
const {translate}=require('../dist/assets/i18n.js');
const {rules,derive}=require('../dist/assets/consequences.js');
for(const [en,fr]of Object.entries(globalThis.PhiloLocales.fr)){
 assert.equal(translate(en,'fr'),fr);assert.equal(translate(fr,'en'),en);
}
const check=text=>assert.ok(globalThis.PhiloLocales.fr[text],`Missing French translation: ${text}`);
for(const rule of [...rules,...derive(['agency@1','no-alternatives@1']).tensions]){
 check(rule.title);check(rule.statement);check(rule.method);rule.steps.forEach(check);
}
derive(['causality@1','determinism@1','agency@1','responsibility@1']).questions.forEach(check);
assert.equal(translate('3 consequences · 1 explicit conflicts','fr'),'3 conséquences · 1 conflits explicites');
assert.equal(translate('3 conséquences · 1 conflits explicites','en'),'3 consequences · 1 explicit conflicts');
assert.equal(translate('Depends on: Universal causality + At least one event exists','fr'),'Dépend de : Causalité universelle + Au moins un événement existe');
assert.equal(translate('Dépend de : Causalité universelle + Au moins un événement existe','en'),'Depends on: Universal causality + At least one event exists');
assert.equal(translate('My custom universe','fr'),'My custom universe');
const unchanged=new Set(['EN','FR','Romain Dufetelle','Romain Dufetelle — Journal','PhiloForge — Romain Dufetelle','Journal','PhiloForge','GitHub','↓','↗','∴','01','02','03','A₁','A₂','A₃','T = { A₁, A₂, A₃ }','0']);
for(const file of ['index.html','philoforge/index.html','404.html']){
 const html=fs.readFileSync(`${__dirname}/../dist/${file}`,'utf8').replace(/<script[\s\S]*?<\/script>/g,'');
 for(const match of html.matchAll(/>([^<>]+)</g)){
  const text=match[1].trim();if(text&&!unchanged.has(text))check(text);
 }
}
console.log('French translations, round trips, rule coverage and page coverage passed.');
