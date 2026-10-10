const assert=require('node:assert/strict');
require('../dist/assets/locales.js');
const {translate,canDisplay}=require('../dist/assets/i18n.js');
for(const [en,fr]of Object.entries(PhiloLocales.fr)){assert.equal(translate(en,'fr'),fr);assert.equal(translate(fr,'en'),en);}
assert.equal(canDisplay('Untranslated content','fr'),false);
assert.equal(canDisplay('Untranslated content','en'),true);
assert.equal(translate('Untranslated content','fr'),'');
console.log('Available translations and optional French content checked.');
