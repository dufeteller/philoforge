const assert=require('node:assert/strict');
const fs=require('node:fs');
require('../dist/assets/locales.js');
const {translate,canDisplay}=require('../dist/assets/i18n.js');
const {rules,derive}=require('../dist/assets/consequences.js');
for(const [en,fr]of Object.entries(globalThis.PhiloLocales.fr)){
 assert.equal(translate(en,'fr'),fr);assert.equal(translate(fr,'en'),en);
}
assert.equal(translate('3 consequences · 1 explicit conflicts','fr'),'3 conséquences · 1 conflits explicites');
assert.equal(translate('3 conséquences · 1 conflits explicites','en'),'3 consequences · 1 explicit conflicts');
assert.equal(translate('Depends on: Universal causality + At least one event exists','fr'),'Dépend de : Causalité universelle + Au moins un événement existe');
assert.equal(translate('Dépend de : Causalité universelle + Au moins un événement existe','en'),'Depends on: Universal causality + At least one event exists');
assert.equal(canDisplay('An untranslated new post','en'),true);
assert.equal(canDisplay('An untranslated new post','fr'),false);
assert.equal(translate('An untranslated new post','fr'),'');
assert.equal(canDisplay('Romain Dufetelle','fr'),true);
assert.equal(canDisplay('CAUSALITY@1','fr'),true);
assert.equal(canDisplay('Depends on: Universal causality + Missing axiom','fr'),false);
const original=globalThis.PhiloLocales.fr['Universal causality'];
delete globalThis.PhiloLocales.fr['Universal causality'];
assert.equal(canDisplay('Universal causality','fr'),false);
assert.equal(canDisplay('Universal causality','en'),true);
assert.equal(translate('Universal causality','en'),'Universal causality');
globalThis.PhiloLocales.fr['Universal causality']='';
assert.equal(canDisplay('Universal causality','fr'),false);
globalThis.PhiloLocales.fr['Universal causality']=original;
console.log('Available translations and optional French fallback rules passed.');
