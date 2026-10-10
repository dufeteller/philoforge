const assert=require('node:assert/strict');
const {entries,results,derive}=require('../dist/assets/spinoza.js');
const ids=[...entries.map(e=>e.id),'test-counterexample'];
const known=new Map([...entries,...results].map(n=>[n.id,n]));
assert.equal(known.size,entries.length+results.length);
for(const e of known.values())assert.ok(e.reference&&e.text);
for(const r of results){
 assert.ok(r.requires.length&&r.parents.length);
 for(const id of r.requires)assert.ok(entries.some(e=>e.id===id));
 assert.equal(r.level,1+Math.max(...r.parents.map(id=>{assert.ok(known.has(id));return known.get(id).level||0;})));
 // Every required premise is visible in the ancestry, and vice versa.
 const leaves=new Set();const visit=id=>{const parent=known.get(id);if(parent.parents)parent.parents.forEach(visit);else leaves.add(id);};
 r.parents.forEach(visit);
 assert.deepEqual([...leaves].sort(),[...r.requires].sort(),r.id+' hidden or extraneous graph premise');
}
let checks=0;
function checkSelection(selected){
 const data=derive(selected);checks++;
 assert.deepEqual(data.results.map(r=>r.id),results.filter(r=>r.requires.every(id=>selected.includes(id))).map(r=>r.id));
 assert.equal(data.conflict,['E1-A4','E1-A5','test-counterexample'].every(id=>selected.includes(id)));
 assert.deepEqual(data.roots.map(r=>r.id),entries.filter(e=>selected.includes(e.id)).map(e=>e.id));
}
// Exhaust every theorem's own dependency set, without an exponential pass over
// unrelated global inputs. Also test interactions in broad mixed selections.
for(const r of results){
 const subsets=[[]];for(const id of r.requires){const n=subsets.length;for(let i=0;i<n;i++)subsets.push([...subsets[i],id]);}
 for(const subset of subsets)checkSelection(subset);
 assert.ok(derive(r.requires).results.some(n=>n.id===r.id));
 for(const id of r.requires)assert.ok(!derive(r.requires.filter(p=>p!==id)).results.some(n=>n.id===r.id));
}
checkSelection([]);checkSelection(ids);
for(const id of ids){checkSelection([id]);checkSelection(ids.filter(p=>p!==id));}
for(let mask=0;mask<8;mask++)checkSelection(['E1-A4','E1-A5','test-counterexample'].filter((_,i)=>mask&(1<<i)));
let seed=20261010;
for(let i=0;i<1000;i++)checkSelection(ids.filter(()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed<0x80000000;}));
assert.equal(derive(['E1-A4']).results.length,0);
assert.equal(derive(['E1-A5']).results[0].id,'conceptual-separation');
assert.equal(derive(['E1-D3','E1-A4']).results[0].id,'E1-P6-C');
assert.equal(derive(['E3-D1','E3-D2']).results.length,2);
assert.equal(derive(['E3-D2']).results.length,0);
assert.deepEqual(derive(['E1-D3','E1-D4','E1-D4-representation']).results.map(r=>r.id),['attribute-inclusion']);
assert.ok(!derive(['E1-D3','E1-D4']).results.length);
assert.deepEqual(derive(['E1-D3','E1-D4','E1-D4-conception']).results.map(r=>r.id),['E1-P10']);
// P5's attribute route cannot reuse the older same-nature result implicitly.
const shared=results.find(r=>r.id==='E1-P5-attributes');
assert.ok(!shared.requires.includes('E1-P8-S2-multiplicity'));
assert.ok(!derive(['E1-D3','E1-D4']).results.some(r=>r.id==='E1-P5-attributes'));
assert.equal(results.find(r=>r.id==='everything-in-universal-substance').level,4);
console.log(`${checks} selections checked: exhaustive per-result subsets, missing premises, mixed selections and contradiction cases; graph ancestry matches all premises.`);
