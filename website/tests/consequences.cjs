const assert=require('node:assert/strict');
const {derive}=require('../dist/assets/consequences.js');
const has=(ids,id)=>derive(ids).consequences.some(r=>r.id===id);
assert.equal(has(['causality@1'],'causes-exist'),false);
assert.equal(has(['events@1'],'causes-exist'),false);
assert.equal(has(['causality@1','events@1'],'causes-exist'),true);
assert.equal(derive(['determinism@1','agency@1']).tensions.length,0);
assert.equal(derive(['agency@1','no-alternatives@1']).tensions.length,1);
assert.equal(has(['causality@1','agency@1'],'causal-agent'),false);
assert.equal(has(['causality@1','agency@1','actions-events@1'],'causal-agent'),true);
const ids=['causality@1','determinism@1','agency@1','responsibility@1','events@1','actions-events@1','no-alternatives@1'];
for(let mask=0;mask<128;mask++){
 const selection=ids.filter((_,i)=>mask&(1<<i));const result=derive(selection);
 for(const item of [...result.consequences,...result.tensions]) assert.ok(item.requires.every(id=>selection.includes(id)));
 assert.equal(result.tensions.length,selection.includes('agency@1')&&selection.includes('no-alternatives@1')?1:0);
}
console.log('Logical dependency and conflict checks passed for all 128 selections.');
