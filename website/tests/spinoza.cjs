const assert=require('node:assert/strict');
const {entries,results,derive}=require('../dist/assets/spinoza.js');
const ids=[...entries.map(e=>e.id),'test-counterexample'];
for(let mask=0;mask<16;mask++){const selected=ids.filter((_,i)=>mask&(1<<i));const data=derive(selected);for(const r of data.results)assert.ok(r.requires.every(id=>selected.includes(id)));assert.equal(data.conflict,['E1-A4','E1-A5','test-counterexample'].every(id=>selected.includes(id)));}
assert.equal(derive(['E1-A4']).results.length,0);
assert.equal(derive(['E1-A5']).results[0].id,'conceptual-separation');
assert.equal(derive(['E1-D3','E1-A4']).results[0].id,'E1-P6-C');
for(const e of [...entries,...results])assert.ok(e.reference&&e.text);
for(const r of results)for(const p of r.parents)assert.ok([...entries,...results].some(n=>n.id===p));
console.log('All 16 source selections, proof dependencies and counterexample checks passed.');
